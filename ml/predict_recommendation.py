from __future__ import annotations

import argparse
import json

from recommendation_pipeline import (
    build_latest_feature_row,
    derive_recommendation,
    load_artifact,
    prepare_training_artifacts,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Predict farmer or merchant recommendations.")
    parser.add_argument("--role", choices=["farmer", "merchant"], required=True)
    parser.add_argument("--crop", required=True, help="Crop variant name, e.g. 'Brown Sesame'")
    parser.add_argument("--region", required=True, help="Region or state name, e.g. 'Magway Region'")
    parser.add_argument("--market", help="Optional market name")
    parser.add_argument("--quality", help="Optional quality")
    parser.add_argument("--unit", help="Optional unit")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    artifact = load_artifact()
    artifacts = prepare_training_artifacts()
    feature_row = build_latest_feature_row(
        artifacts=artifacts,
        crop_name=args.crop,
        region=args.region,
        market=args.market,
        quality=args.quality,
        unit=args.unit,
    )

    forecast_7d = float(artifact["model_7d"].predict(feature_row)[0])
    forecast_30d = float(artifact["model_30d"].predict(feature_row)[0])
    current_price = float(feature_row.iloc[0]["demand_price"])
    recommendation = derive_recommendation(
        role=args.role,
        current_price=current_price,
        forecast_7d=forecast_7d,
        forecast_30d=forecast_30d,
        metrics=artifact["metrics"],
    )

    payload = {
        "role": args.role,
        "crop": args.crop,
        "region": args.region,
        "market": args.market or feature_row.iloc[0]["location"],
        "quality": args.quality or feature_row.iloc[0]["quality"],
        "unit": args.unit or feature_row.iloc[0]["unit"],
        "current_price": round(current_price, 2),
        "forecast_7d": round(forecast_7d, 2),
        "forecast_30d": round(forecast_30d, 2),
        "recommendation": recommendation,
        "model_metrics": artifact["metrics"]["validation"],
    }
    print(json.dumps(payload, indent=2, default=str))


if __name__ == "__main__":
    main()
