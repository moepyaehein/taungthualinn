from __future__ import annotations

from datetime import datetime, timezone
import os
from threading import Lock, Thread
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ml.recommendation_pipeline import (
    build_latest_feature_row,
    derive_recommendation,
    load_artifact,
    prepare_training_artifacts,
    save_artifacts,
    train_models,
)


app = FastAPI(title="Taung Thu Recommendation API", version="0.1.0")


class PredictionRequest(BaseModel):
    role: str
    crop: str
    region: str
    market: str | None = None
    quality: str | None = None
    unit: str | None = None


class RetrainRequest(BaseModel):
    include_pending_demo: bool = False


MODEL_STATE: dict[str, Any] = {
    "ready": False,
    "loading": False,
    "training": False,
    "bootstrapped_artifact": False,
    "artifact": None,
    "training_artifacts": None,
    "error": None,
    "training_error": None,
    "last_retrained_at": None,
    "last_training_mode": None,
    "source_summary": None,
}
MODEL_LOCK = Lock()
ADMIN_KEY = os.getenv("ML_ADMIN_KEY", "").strip()


def _load_model_state() -> None:
    with MODEL_LOCK:
        if MODEL_STATE["ready"] or MODEL_STATE["loading"]:
            return
        MODEL_STATE["loading"] = True
        MODEL_STATE["error"] = None

    try:
        artifact = load_artifact()
        training_artifacts = prepare_training_artifacts()
        with MODEL_LOCK:
            MODEL_STATE["artifact"] = artifact
            MODEL_STATE["training_artifacts"] = training_artifacts
            MODEL_STATE["bootstrapped_artifact"] = False
            MODEL_STATE["ready"] = True
            MODEL_STATE["source_summary"] = training_artifacts.source_summary
            MODEL_STATE["last_training_mode"] = "approved_only"
    except Exception as error:  # noqa: BLE001
        with MODEL_LOCK:
            MODEL_STATE["error"] = str(error)
    finally:
        with MODEL_LOCK:
            MODEL_STATE["loading"] = False


def _retrain_model_state(include_pending_demo: bool = False) -> None:
    with MODEL_LOCK:
        if MODEL_STATE["training"]:
            return
        MODEL_STATE["training"] = True
        MODEL_STATE["training_error"] = None

    try:
        statuses = (
            ("peer_verified", "admin_verified", "pending")
            if include_pending_demo
            else ("peer_verified", "admin_verified")
        )
        training_artifacts = prepare_training_artifacts(portal_statuses=statuses)
        model_7d, model_30d, metrics = train_models(training_artifacts)
        save_artifacts(model_7d, model_30d, training_artifacts, metrics)
        artifact = load_artifact()

        with MODEL_LOCK:
            MODEL_STATE["artifact"] = artifact
            MODEL_STATE["training_artifacts"] = training_artifacts
            MODEL_STATE["ready"] = True
            MODEL_STATE["error"] = None
            MODEL_STATE["source_summary"] = training_artifacts.source_summary
            MODEL_STATE["last_retrained_at"] = datetime.now(timezone.utc).isoformat()
            MODEL_STATE["last_training_mode"] = (
                "include_pending_demo" if include_pending_demo else "approved_only"
            )
    except Exception as error:  # noqa: BLE001
        with MODEL_LOCK:
            MODEL_STATE["training_error"] = str(error)
    finally:
        with MODEL_LOCK:
            MODEL_STATE["training"] = False


def require_admin_key(admin_key: str | None) -> None:
    if not ADMIN_KEY:
        raise HTTPException(status_code=503, detail="ML admin key is not configured.")
    if admin_key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key.")


@app.on_event("startup")
def startup_event() -> None:
    Thread(target=_load_model_state, daemon=True).start()


@app.get("/health")
def health() -> dict[str, str | bool | None]:
    return {
        "status": "ok",
        "artifact_ready": bool(MODEL_STATE["ready"]),
        "loading": bool(MODEL_STATE["loading"]),
        "training": bool(MODEL_STATE["training"]),
        "bootstrapped_artifact": bool(MODEL_STATE["bootstrapped_artifact"]),
        "error": MODEL_STATE["error"],
        "training_error": MODEL_STATE["training_error"],
        "last_retrained_at": MODEL_STATE["last_retrained_at"],
        "last_training_mode": MODEL_STATE["last_training_mode"],
        "source_summary": MODEL_STATE["source_summary"],
    }


@app.get("/training/status")
def training_status(admin_key: str | None = None) -> dict[str, Any]:
    require_admin_key(admin_key)
    return health()


@app.post("/retrain")
def retrain(request: RetrainRequest, admin_key: str | None = None) -> dict[str, Any]:
    require_admin_key(admin_key)

    if MODEL_STATE["training"]:
        return {
            "status": "already_running",
            "detail": "A retraining job is already in progress.",
        }

    Thread(target=_retrain_model_state, args=(request.include_pending_demo,), daemon=True).start()
    return {
        "status": "started",
        "include_pending_demo": request.include_pending_demo,
    }


@app.post("/predict")
def predict(request: PredictionRequest) -> dict:
    if request.role not in {"farmer", "merchant"}:
        raise HTTPException(status_code=400, detail="role must be farmer or merchant")

    if not MODEL_STATE["ready"]:
        if not MODEL_STATE["loading"]:
            Thread(target=_load_model_state, daemon=True).start()
        raise HTTPException(
            status_code=503,
            detail="Recommendation model is warming up. Please try again shortly.",
        )

    try:
        feature_row = build_latest_feature_row(
            artifacts=MODEL_STATE["training_artifacts"],
            crop_name=request.crop,
            region=request.region,
            market=request.market,
            quality=request.quality,
            unit=request.unit,
        )
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

    artifact = MODEL_STATE["artifact"]
    forecast_7d = float(artifact["model_7d"].predict(feature_row)[0])
    forecast_30d = float(artifact["model_30d"].predict(feature_row)[0])
    current_price = float(feature_row.iloc[0]["demand_price"])
    recommendation = derive_recommendation(
        role=request.role,
        current_price=current_price,
        forecast_7d=forecast_7d,
        forecast_30d=forecast_30d,
        metrics=artifact["metrics"],
    )

    return {
        "role": request.role,
        "crop": request.crop,
        "region": request.region,
        "market": request.market or feature_row.iloc[0]["location"],
        "quality": request.quality or feature_row.iloc[0]["quality"],
        "unit": request.unit or feature_row.iloc[0]["unit"],
        "current_price": round(current_price, 2),
        "forecast_7d": round(forecast_7d, 2),
        "forecast_30d": round(forecast_30d, 2),
        "recommendation": recommendation,
        "model_metrics": artifact["metrics"]["validation"],
    }
