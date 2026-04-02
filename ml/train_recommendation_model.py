from __future__ import annotations

import argparse

from recommendation_pipeline import prepare_training_artifacts, save_artifacts, train_models


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train recommendation models")
    parser.add_argument(
        "--include-pending-demo",
        action="store_true",
        help="Include pending portal prices for local/demo retraining. Do not use in production.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    portal_statuses = ("peer_verified", "admin_verified", "pending") if args.include_pending_demo else (
        "peer_verified",
        "admin_verified",
    )

    artifacts = prepare_training_artifacts(portal_statuses=portal_statuses)
    model_7d, model_30d, metrics = train_models(artifacts)
    artifact_path = save_artifacts(model_7d, model_30d, artifacts, metrics)

    print("Training complete.")
    print(f"Saved artifact: {artifact_path}")
    print(f"Portal statuses used: {', '.join(portal_statuses)}")
    print("Data sources:")
    print(f"  Historical market rows: {artifacts.source_summary['historical_market_rows']}")
    print(f"  Live portal rows: {artifacts.source_summary['live_portal_rows']}")
    print(f"  Weather rows: {artifacts.source_summary['weather_rows']}")
    print(f"  Training frame rows: {artifacts.source_summary['training_frame_rows']}")
    print("Validation metrics:")
    for target, values in metrics["validation"].items():
        print(
            f"  {target}: RMSE={values['rmse']:.2f}, MAE={values['mae']:.2f}, R2={values['r2']:.4f}"
        )
    print("Test metrics:")
    for target, values in metrics["test"].items():
        print(
            f"  {target}: RMSE={values['rmse']:.2f}, MAE={values['mae']:.2f}, R2={values['r2']:.4f}"
        )


if __name__ == "__main__":
    main()
