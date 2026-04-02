# Recommendation ML Pipeline

This repo now includes a Python-based forecast pipeline for farmer and merchant recommendations.

The app now expects a FastAPI prediction service instead of spawning Python for every request.

## Data Sources

- `mock_market_prices_1y_myanmar.xlsx`
- `myanmar_weather_combined.csv`

## What the model predicts

- `target_price_7d`: average future demand price over the next 7 days
- `target_price_30d`: average future demand price over the next 30 days

The app can then convert those forecasts into:

- Farmer: `sell`, `hold`, `watch`
- Merchant: `buy`, `wait`, `watch`

## Training

Use the local virtual environment:

```powershell
.\.venv\Scripts\python.exe .\ml\train_recommendation_model.py
```

Artifacts are written to:

- `ml/artifacts/recommendation_forecast.joblib`
- `ml/reports/recommendation_metrics.json`

## FastAPI Serving

Start the prediction API:

```powershell
npm run ml:api
```

Health check:

```powershell
curl http://127.0.0.1:8000/health
```

The production deployment now expects the trained artifact to be present in the repo:

- `ml/artifacts/recommendation_forecast.joblib`
- `ml/reports/recommendation_metrics.json`

FastAPI loads that artifact at startup and does not retrain in production.

The Next.js app calls the FastAPI server through:

- `FASTAPI_BASE_URL`
- default: `http://127.0.0.1:8000`

## Prediction

Example:

```powershell
.\.venv\Scripts\python.exe .\ml\predict_recommendation.py --role farmer --crop "Brown Sesame" --region "Magway Region"
```

Example:

```powershell
.\.venv\Scripts\python.exe .\ml\predict_recommendation.py --role merchant --crop "Emata" --region "Yangon Region" --market "Bayintnaung Wholesale Market"
```

FastAPI example:

```powershell
curl -Method POST http://127.0.0.1:8000/predict `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"role":"farmer","crop":"Brown Sesame","region":"Magway Region","market":"Pakokku Produce Market"}'
```

## Live merchant portal data

For production retraining, the next step is to export verified merchant portal prices and merge them into the market training frame before feature generation.

Recommended rule:

- train only on `peer_verified` or `admin_verified`
- prefer `admin_verified`
- normalize portal rows into the same fields used by the workbook:
  - `date`
  - `supply_price`
  - `demand_price`
  - `lowest_price`
  - `highest_price`
  - `main_category`
  - `item_category`
  - `crop_name`
  - `quality`
  - `unit`
  - `location_main`
  - `location`

Once that export shape is fixed, the training script can ingest both historical and live merchant data in the same pipeline.
