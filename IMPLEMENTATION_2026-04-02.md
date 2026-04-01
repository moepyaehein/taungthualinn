# Implementation Notes - 2026-04-02

This document records the recommendation-system work completed today for the Taung Thu project.

## Goal

Build a real ML-powered recommendation flow for:

- Farmer recommendation
- Merchant recommendation

The system should:

- train with Python
- use the provided market and weather datasets
- serve predictions through FastAPI
- integrate with the Next.js app
- show recommendation responses in Burmese

## Scope Completed Today

Today we completed five major areas:

1. Python ML training pipeline
2. FastAPI prediction service
3. Next.js integration for farmer and merchant recommendation pages
4. Burmese localization for recommendation responses
5. Burmese display mapping for crop, region, market, unit, quality, and trend labels

## Datasets Used

### 1. Market price dataset

File:

- [mock_market_prices_1y_myanmar.xlsx](/d:/climateAi/taung-thu-app/mock_market_prices_1y_myanmar.xlsx)

Used sheet:

- `market_prices`

Purpose:

- historical crop prices
- regional and market-level signals
- supply vs demand features
- target generation for 7-day and 30-day forecasting

### 2. Weather dataset

File:

- [myanmar_weather_combined.csv](/d:/climateAi/taung-thu-app/myanmar_weather_combined.csv)

Purpose:

- weather enrichment for price prediction
- rainfall and climate trend features
- region-level context

## Architecture Implemented

The current recommendation flow is:

1. User opens farmer or merchant recommendation page in Next.js
2. Frontend calls `GET /api/market?mode=recommendation...`
3. Next.js route forwards request to recommendation server helper
4. Recommendation helper calls FastAPI `POST /predict`
5. FastAPI loads the trained model artifact and builds the latest feature row
6. FastAPI predicts `forecast_7d` and `forecast_30d`
7. Recommendation logic converts forecasts into an action
8. Next.js localizes the response for Burmese display
9. Frontend renders recommendation cards and explanation text

## ML Implementation

### Training pipeline

Main file:

- [recommendation_pipeline.py](/d:/climateAi/taung-thu-app/ml/recommendation_pipeline.py)

This pipeline does the following:

- loads market Excel data
- converts Excel serial dates to real datetimes
- normalizes region names
- loads weather CSV data
- creates rolling weather features
- creates rolling price features
- creates spread and supply-demand gap features
- creates time-seasonality features
- creates future targets:
  - `target_price_7d`
  - `target_price_30d`
- splits data by time into train, validation, and test windows

### Model choice

Current model type:

- `GradientBoostingRegressor`

Why this was used:

- good first fit for tabular data
- simple and reliable for baseline forecasting
- easier to debug than deep sequence models

### Feature groups

Numeric features include:

- current supply price
- current demand price
- lowest and highest prices
- rolling 3/7/14/30 day averages
- spread price
- spread ratio
- supply-demand gap
- rolling volatility
- month and day seasonal features
- weather columns
- rolling weather summaries
- rainfall aggregates

Categorical features include:

- main category
- item category
- crop name
- quality
- unit
- main location
- market location
- normalized region

### Training outputs

Generated artifact directory:

- `ml/artifacts/`

Generated report directory:

- `ml/reports/`

Expected artifact:

- `recommendation_forecast.joblib`

Expected report:

- `recommendation_metrics.json`

## Training and Prediction Scripts

### Files added

- [train_recommendation_model.py](/d:/climateAi/taung-thu-app/ml/train_recommendation_model.py)
- [predict_recommendation.py](/d:/climateAi/taung-thu-app/ml/predict_recommendation.py)
- [api.py](/d:/climateAi/taung-thu-app/ml/api.py)
- [requirements.txt](/d:/climateAi/taung-thu-app/ml/requirements.txt)
- [__init__.py](/d:/climateAi/taung-thu-app/ml/__init__.py)

### NPM scripts added

In [package.json](/d:/climateAi/taung-thu-app/package.json):

- `npm run ml:train`
- `npm run ml:predict:farmer`
- `npm run ml:predict:merchant`
- `npm run ml:api`

## FastAPI Service

Main file:

- [api.py](/d:/climateAi/taung-thu-app/ml/api.py)

Endpoints implemented:

- `GET /health`
- `POST /predict`

### `/predict` request

Inputs:

- `role`
- `crop`
- `region`
- `market`
- `quality`
- `unit`

### `/predict` response

Returns:

- `role`
- `crop`
- `region`
- `market`
- `quality`
- `unit`
- `current_price`
- `forecast_7d`
- `forecast_30d`
- `recommendation`
- `model_metrics`

## Recommendation Logic

Typed response is defined in:

- [types.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/types.ts)

Supported actions:

- farmer:
  - `sell`
  - `hold`
  - `watch`
- merchant:
  - `buy`
  - `wait`
  - `watch`

The recommendation layer currently uses predicted price deltas and model metrics to derive:

- action
- confidence
- 7-day percentage delta
- 30-day percentage delta

## Next.js Integration

### API route update

Updated file:

- [route.ts](/d:/climateAi/taung-thu-app/src/app/api/market/route.ts)

Added support for:

- `mode=recommendation`

This route now:

- validates query params
- calls recommendation server helper
- returns recommendation JSON to frontend

### Recommendation server helper

Updated file:

- [server.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/server.ts)

Responsibilities:

- call FastAPI
- map prediction payload to app shape
- localize response fields into Burmese
- generate localized summary text
- generate localized reason lines

## Frontend Pages Updated

### Farmer page

Updated file:

- [page.tsx](/d:/climateAi/taung-thu-app/src/app/farmer/recommendation/page.tsx)

What changed:

- replaced static mock recommendation content
- added live API fetch
- added crop, region, market selectors
- renders real forecast values
- renders Burmese summary and reasons
- shows localized trend direction

### Merchant page

Updated file:

- [page.tsx](/d:/climateAi/taung-thu-app/src/app/merchant/recommendation/page.tsx)

What changed:

- replaced timeout-based mock analysis
- added supported crop selection
- added market context selectors
- fetches real prediction data
- renders merchant recommendation cards
- renders Burmese summary and reasons

## Localization Work Completed

### Why localization was split from ML

The ML model still needs the original English dataset values such as:

- `Brown Sesame`
- `Magway Region`
- `Pakokku Produce Market`

These are still used internally for:

- feature lookup
- model inference
- matching against training data

To avoid breaking inference, localization was implemented only in the display layer.

### Display mapping file

Updated file:

- [catalog.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/catalog.ts)

Mappings added for:

- crop names
- region names
- market names
- unit names
- quality names

Examples:

- `Brown Sesame` -> `နှမ်းညို`
- `Magway Region` -> `မကွေးတိုင်းဒေသကြီး`
- `Pakokku Produce Market` -> `ပခုက္ကူ ပွဲရုံဈေး`
- `viss` -> `ပိဿာ`

### Expanded crop coverage

Additional localized crop mappings were added for:

- `Black Sesame`
- `Sin Thwe Latt`
- `Paw San Hmwe`
- `Hard Milling Wheat`
- `Feed Wheat`
- `Local Yellow Corn`
- `Feed Corn`
- `Shwebo Soft Wheat`

### Response localization

Localized in [server.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/server.ts):

- summary text
- reason lines
- crop display
- region display
- market display
- unit display
- quality display

### UI localization

Localized in both recommendation pages:

- section headings
- field labels
- action labels
- recommendation explanation text
- trend labels

Trend labels now use Burmese:

- `တက်`
- `ကျ`
- `ငြိမ်`

## UI Bug Fixed Today

Issue:

- forecast cards were showing `?` instead of directional icons

Cause:

- placeholder icon text had been written incorrectly in the page code

Fix:

- replaced unstable symbols with reliable text direction labels

Affected files:

- [page.tsx](/d:/climateAi/taung-thu-app/src/app/farmer/recommendation/page.tsx)
- [page.tsx](/d:/climateAi/taung-thu-app/src/app/merchant/recommendation/page.tsx)

## Environment and Runtime

### Python environment

Local virtual environment used:

- `.venv`

### FastAPI runtime

Local service:

- `http://127.0.0.1:8000`

Health endpoint:

- `http://127.0.0.1:8000/health`

### Next.js runtime

Local app:

- `http://localhost:3000`

## Commands Used for Operation

### Train model

```powershell
npm run ml:train
```

### Run FastAPI

```powershell
npm run ml:api
```

### Run Next.js app

```powershell
npm run dev
```

### Predict farmer example

```powershell
npm run ml:predict:farmer -- --crop "Brown Sesame" --region "Magway Region"
```

### Predict merchant example

```powershell
npm run ml:predict:merchant -- --crop "Emata" --region "Yangon Region" --market "Bayintnaung Wholesale Market"
```

## Validation Done Today

Completed checks:

- Python ML pipeline runs
- FastAPI `/health` works
- FastAPI `/predict` returns valid JSON
- Next.js recommendation route integrates with FastAPI
- Farmer page loads real prediction results
- Merchant page loads real prediction results
- Burmese text renders through the app flow
- `npm run lint` passes with one pre-existing warning

## Known Warning

Lint warning still exists in:

- [auth-helpers.ts](/d:/climateAi/taung-thu-app/src/lib/auth-helpers.ts)

Warning:

- unused eslint-disable directive

This warning is pre-existing and unrelated to the recommendation implementation.

## Current Limitations

The following are not yet implemented:

1. Live Supabase merchant submissions merged into training data
2. Scheduled retraining job
3. Precomputed prediction cache
4. App-wide language toggle
5. Localized backend error messages
6. Recommendation explanations generated from live merchant portal data

## Recommended Next Steps

### High priority

1. Merge approved merchant portal data into the Python training dataset
2. Retrain model with historical plus live data
3. Add admin-safe retraining workflow

### Medium priority

1. Localize error responses from the API
2. Expose quality in the UI where useful
3. Add more Burmese wording polish by user role

### Later improvements

1. Switch from on-demand prediction to cached forecast tables if needed
2. Evaluate stronger tabular models such as XGBoost or LightGBM
3. Add model monitoring and drift checks

## Files Added or Updated Today

### ML

- [recommendation_pipeline.py](/d:/climateAi/taung-thu-app/ml/recommendation_pipeline.py)
- [train_recommendation_model.py](/d:/climateAi/taung-thu-app/ml/train_recommendation_model.py)
- [predict_recommendation.py](/d:/climateAi/taung-thu-app/ml/predict_recommendation.py)
- [api.py](/d:/climateAi/taung-thu-app/ml/api.py)
- [requirements.txt](/d:/climateAi/taung-thu-app/ml/requirements.txt)
- [__init__.py](/d:/climateAi/taung-thu-app/ml/__init__.py)

### App integration

- [route.ts](/d:/climateAi/taung-thu-app/src/app/api/market/route.ts)
- [server.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/server.ts)
- [types.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/types.ts)
- [catalog.ts](/d:/climateAi/taung-thu-app/src/lib/recommendation/catalog.ts)
- [page.tsx](/d:/climateAi/taung-thu-app/src/app/farmer/recommendation/page.tsx)
- [page.tsx](/d:/climateAi/taung-thu-app/src/app/merchant/recommendation/page.tsx)

### Project config and docs

- [package.json](/d:/climateAi/taung-thu-app/package.json)
- [ML_RECOMMENDATIONS.md](/d:/climateAi/taung-thu-app/ML_RECOMMENDATIONS.md)
- [IMPLEMENTATION_2026-04-02.md](/d:/climateAi/taung-thu-app/IMPLEMENTATION_2026-04-02.md)

## Summary

As of today, the project now has a working end-to-end recommendation system:

- real Python ML training
- real FastAPI inference
- real Next.js integration
- farmer and merchant recommendation pages powered by model output
- Burmese-localized recommendation display

This is a working ML-backed product foundation, not just mock UI anymore.
