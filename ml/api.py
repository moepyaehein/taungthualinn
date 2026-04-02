from __future__ import annotations

from threading import Lock, Thread
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ml.recommendation_pipeline import (
    build_latest_feature_row,
    derive_recommendation,
    ensure_runtime_artifacts,
)


app = FastAPI(title="Taung Thu Recommendation API", version="0.1.0")


class PredictionRequest(BaseModel):
    role: str
    crop: str
    region: str
    market: str | None = None
    quality: str | None = None
    unit: str | None = None


MODEL_STATE: dict[str, Any] = {
    "ready": False,
    "loading": False,
    "bootstrapped_artifact": False,
    "artifact": None,
    "training_artifacts": None,
    "error": None,
}
MODEL_LOCK = Lock()


def _load_model_state() -> None:
    with MODEL_LOCK:
        if MODEL_STATE["ready"] or MODEL_STATE["loading"]:
            return
        MODEL_STATE["loading"] = True
        MODEL_STATE["error"] = None

    try:
        artifact, training_artifacts, bootstrapped_artifact = ensure_runtime_artifacts()
        with MODEL_LOCK:
            MODEL_STATE["artifact"] = artifact
            MODEL_STATE["training_artifacts"] = training_artifacts
            MODEL_STATE["bootstrapped_artifact"] = bootstrapped_artifact
            MODEL_STATE["ready"] = True
    except Exception as error:  # noqa: BLE001
        with MODEL_LOCK:
            MODEL_STATE["error"] = str(error)
    finally:
        with MODEL_LOCK:
            MODEL_STATE["loading"] = False


@app.on_event("startup")
def startup_event() -> None:
    Thread(target=_load_model_state, daemon=True).start()


@app.get("/health")
def health() -> dict[str, str | bool | None]:
    return {
        "status": "ok",
        "artifact_ready": bool(MODEL_STATE["ready"]),
        "loading": bool(MODEL_STATE["loading"]),
        "bootstrapped_artifact": bool(MODEL_STATE["bootstrapped_artifact"]),
        "error": MODEL_STATE["error"],
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
