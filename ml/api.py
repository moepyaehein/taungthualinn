from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ml.recommendation_pipeline import (
    build_latest_feature_row,
    derive_recommendation,
    load_artifact,
    prepare_training_artifacts,
)


app = FastAPI(title="Taung Thu Recommendation API", version="0.1.0")

ARTIFACT = load_artifact()
TRAINING_ARTIFACTS = prepare_training_artifacts()


class PredictionRequest(BaseModel):
    role: str
    crop: str
    region: str
    market: str | None = None
    quality: str | None = None
    unit: str | None = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict")
def predict(request: PredictionRequest) -> dict:
    if request.role not in {"farmer", "merchant"}:
        raise HTTPException(status_code=400, detail="role must be farmer or merchant")

    try:
        feature_row = build_latest_feature_row(
            artifacts=TRAINING_ARTIFACTS,
            crop_name=request.crop,
            region=request.region,
            market=request.market,
            quality=request.quality,
            unit=request.unit,
        )
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error

    forecast_7d = float(ARTIFACT["model_7d"].predict(feature_row)[0])
    forecast_30d = float(ARTIFACT["model_30d"].predict(feature_row)[0])
    current_price = float(feature_row.iloc[0]["demand_price"])
    recommendation = derive_recommendation(
        role=request.role,
        current_price=current_price,
        forecast_7d=forecast_7d,
        forecast_30d=forecast_30d,
        metrics=ARTIFACT["metrics"],
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
        "model_metrics": ARTIFACT["metrics"]["validation"],
    }
