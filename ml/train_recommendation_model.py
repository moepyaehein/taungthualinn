from __future__ import annotations

from recommendation_pipeline import prepare_training_artifacts, save_artifacts, train_models


def main() -> None:
    artifacts = prepare_training_artifacts()
    model_7d, model_30d, metrics = train_models(artifacts)
    artifact_path = save_artifacts(model_7d, model_30d, artifacts, metrics)

    print("Training complete.")
    print(f"Saved artifact: {artifact_path}")
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
