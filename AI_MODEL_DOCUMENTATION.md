# AI Model Documentation

## Overview

This document describes the current AI/ML recommendation system used in the Taung Thu project.

The system is a **Python tabular machine learning pipeline** that:

1. trains on historical market-price and weather data
2. optionally merges live merchant portal prices from Supabase
3. predicts future prices for 7-day and 30-day horizons
4. converts those forecasts into actionable recommendations for:
   - farmers
   - merchants

This is **not** an LLM model and **not** a fine-tuned chatbot model.  
It is a **supervised regression system** built on structured market and weather data.

---

## Model Summary

### System name

Recommended internal name:

- `Taung Thu Recommendation Forecast Model v1`

### Model purpose

Predict:

- `target_price_7d`
- `target_price_30d`

Then derive recommendation actions:

- Farmer:
  - `sell`
  - `hold`
  - `watch`
- Merchant:
  - `buy`
  - `wait`
  - `watch`

### Model type

The core predictive model is:

- `GradientBoostingRegressor` from `scikit-learn`

There are **two separate regression models**:

1. `model_7d`
2. `model_30d`

Both are wrapped in a preprocessing pipeline with:

- numeric imputation
- categorical imputation
- one-hot encoding

### ML framework and libraries

Main Python libraries:

- `scikit-learn`
- `pandas`
- `numpy`
- `joblib`
- `openpyxl`
- `fastapi`
- `uvicorn`

---

## Important Files

### Training and feature engineering

- [ml/recommendation_pipeline.py](D:\climateAi\taung-thu-app\ml\recommendation_pipeline.py)
  - core training pipeline
  - dataset normalization
  - feature engineering
  - portal-data merge
  - model training
  - evaluation
  - artifact save/load

- [ml/train_recommendation_model.py](D:\climateAi\taung-thu-app\ml\train_recommendation_model.py)
  - CLI training entry point

- [ml/inspect_portal_training_data.py](D:\climateAi\taung-thu-app\ml\inspect_portal_training_data.py)
  - checks live Supabase portal data readiness for retraining

### Model serving

- [ml/api.py](D:\climateAi\taung-thu-app\ml\api.py)
  - FastAPI service
  - `/health`
  - `/predict`
  - `/training/status`
  - `/retrain`

### Artifact and metrics

- [ml/artifacts/recommendation_forecast.joblib](D:\climateAi\taung-thu-app\ml\artifacts\recommendation_forecast.joblib)
  - serialized trained artifact

- [ml/reports/recommendation_metrics.json](D:\climateAi\taung-thu-app\ml\reports\recommendation_metrics.json)
  - saved evaluation metrics

### App integration

- [src/app/api/ml/status/route.ts](D:\climateAi\taung-thu-app\src\app\api\ml\status\route.ts)
  - Next.js admin proxy for ML status

- [src/app/api/ml/retrain/route.ts](D:\climateAi\taung-thu-app\src\app\api\ml\retrain\route.ts)
  - Next.js admin proxy for ML retraining

- [src/app/admin/page.tsx](D:\climateAi\taung-thu-app\src\app\admin\page.tsx)
  - admin UI panel for model status and retraining

- [src/app/merchant/price/page.tsx](D:\climateAi\taung-thu-app\src\app\merchant\price\page.tsx)
  - merchant submission page used to generate live portal price data

---

## Source Datasets

### Historical market dataset

- [mock_market_prices_1y_myanmar.xlsx](D:\climateAi\taung-thu-app\mock_market_prices_1y_myanmar.xlsx)

Used sheet:

- `market_prices`

### Weather dataset

- [myanmar_weather_combined.csv](D:\climateAi\taung-thu-app\myanmar_weather_combined.csv)

### Live portal dataset

Source:

- Supabase `price_submissions`

Related reference tables:

- `products`
- `markets`
- `regions`

Used statuses for production retraining:

- `peer_verified`
- `admin_verified`

Optional demo retraining can also include:

- `pending`

---

## Training Pipeline

### Step 1: Load historical market data

Function:

- `normalize_market_prices()`

This step:

- reads the Excel sheet
- normalizes date format
- converts numeric columns
- creates `series_key`
- sorts rows by time

Core numeric market columns:

- `supply_price`
- `demand_price`
- `lowest_price`
- `highest_price`

### Step 2: Load and process weather data

Function:

- `normalize_weather()`

This step:

- parses weather dates
- normalizes region names
- computes rolling weather features

Generated weather features include:

- `temp_avg_7d_avg`
- `temp_max_7d_avg`
- `temp_min_7d_avg`
- `humidity_7d_avg`
- `rainfall_7d_avg`
- `solar_radiation_7d_avg`
- `wind_speed_7d_avg`
- `rainfall_7d_sum`
- `rainfall_30d_sum`

### Step 3: Merge live merchant portal data

Function:

- `fetch_live_portal_prices()`

This step:

- reads from Supabase REST API
- uses `SUPABASE_SERVICE_ROLE_KEY`
- filters by allowed statuses
- maps portal products/markets/regions into the historical dataset naming scheme

Current mapped product coverage:

- `နှမ်း` -> `Brown Sesame`
- `ရွှေဘိုပေါ်ဆန်း` -> `Paw San Hmwe`

Current mapped markets:

- `မန္တလေးပွဲရုံ` -> `Pyigyidagun Commodity Center`
- `မိတ္ထီလာပွဲရုံ` -> `Pyigyidagun Commodity Center`
- `မကွေးကုန်စည်ဒိုင်` -> `Pakokku Produce Market`
- `အောင်ပန်းဈေး` -> `Taunggyi Aye Thar Yar Market`

### Step 4: Build training frame

Function:

- `build_training_frame()`

This step creates:

- rolling averages
- volatility features
- spread features
- seasonality features
- weather join
- future targets

### Step 5: Create targets

Targets:

- `target_price_7d`
- `target_price_30d`

These are future-window means of demand price:

- next 7-day average
- next 30-day average

### Step 6: Time-based split

Function:

- `time_split_frame()`

Split strategy:

- train: first 70% of dates
- validation: next 15%
- test: final 15%

This is a proper time-series-style split rather than random row splitting.

### Step 7: Train models

Function:

- `train_models()`

Model objects:

- `model_7d`
- `model_30d`

Estimator configuration:

- `learning_rate=0.05`
- `max_depth=5`
- `n_estimators=250`
- `min_samples_leaf=20`
- `subsample=0.9`

Preprocessing:

- Numeric:
  - `SimpleImputer(strategy="median")`
- Categorical:
  - `SimpleImputer(strategy="most_frequent")`
  - `OneHotEncoder(handle_unknown="ignore", sparse_output=False)`

### Step 8: Save artifact

Function:

- `save_artifacts()`

Saved contents include:

- `model_7d`
- `model_30d`
- numeric feature list
- categorical feature list
- evaluation metrics
- latest training date
- dataset paths
- live portal row count

---

## Feature Set

### Numeric features

Examples:

- `supply_price`
- `demand_price`
- `lowest_price`
- `highest_price`
- `spread_price`
- `spread_ratio`
- `supply_demand_gap`
- rolling 3/7/14/30-day averages for supply/demand/lowest/highest prices
- `demand_price_7d_std`
- `month`
- `day_of_year`
- `month_sin`
- `month_cos`
- `day_sin`
- `day_cos`
- weather metrics and weather rolling features

### Categorical features

- `main_category`
- `item_category`
- `crop_name`
- `quality`
- `unit`
- `location_main`
- `location`
- `normalized_region`

---

## Recommendation Logic

Function:

- `derive_recommendation()`

### Farmer logic

- if 7-day delta >= 3% -> `hold`
- if 7-day delta <= -2% -> `sell`
- otherwise -> `watch`

### Merchant logic

- if 7-day delta >= 2.5% -> `buy`
- if 7-day delta <= -2% -> `wait`
- otherwise -> `watch`

### Confidence

Confidence is currently heuristic and derived from:

- validation `R²`
- magnitude of forecast delta

It is **not** a formal probabilistic confidence interval.

---

## Evaluation Metrics

Source:

- [ml/reports/recommendation_metrics.json](D:\climateAi\taung-thu-app\ml\reports\recommendation_metrics.json)

### Validation metrics

#### 7-day target

- RMSE: `271.6631`
- MAE: `92.1689`
- R²: `0.9926`

#### 30-day target

- RMSE: `459.5181`
- MAE: `206.4904`
- R²: `0.9809`

### Test metrics

#### 7-day target

- RMSE: `312.1084`
- MAE: `142.8337`
- R²: `0.9930`

#### 30-day target

- RMSE: `375.8527`
- MAE: `178.5391`
- R²: `0.9900`

### Dataset sizes used for the saved metrics

- Training rows: `28080`
- Validation rows: `6000`
- Test rows: `6120`

### Source summary from the saved metrics

- Historical market rows: `43800`
- Live portal rows: `0`
- Weather rows: `8288`
- Training frame rows: `40200`

Important:

At the time this artifact was saved, **no live portal rows were successfully included yet**.  
So the current stored artifact is still dominated by the historical dataset.

---

## Serving and Deployment

### FastAPI service

File:

- [ml/api.py](D:\climateAi\taung-thu-app\ml\api.py)

Routes:

- `GET /health`
- `POST /predict`
- `GET /training/status`
- `POST /retrain`

### Current deployed ML service

- `https://taungthualinn.onrender.com`

### App deployment

- Vercel app calls FastAPI through:
  - `FASTAPI_BASE_URL`

### Protected admin retraining

Requires:

- `ML_ADMIN_KEY`

Set in:

- Render
- Vercel
- local `.env.local`

---

## Commands

### Train locally

```powershell
npm run ml:train
```

### Train with live approved portal data

```powershell
npm run ml:train:portal
```

### Demo training with pending rows included

```powershell
npm run ml:train:portal:demo
```

### Inspect live portal training readiness

```powershell
npm run ml:inspect:portal
```

### Start local FastAPI service

```powershell
npm run ml:api
```

---

## Environment Variables

### Required for local/dev ML

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FASTAPI_BASE_URL`
- `ML_ADMIN_KEY`

### Files

- [.env.local](D:\climateAi\taung-thu-app\.env.local)
- [.env.example](D:\climateAi\taung-thu-app\.env.example)

---

## Current Limitations

1. Live portal mapping coverage is still limited.
- Only a small set of portal product/market names are currently mapped into the historical ML naming scheme.

2. Current saved artifact still shows `live_portal_rows = 0`.
- Live retraining code exists, but the current persisted artifact has not yet successfully incorporated live approved rows.

3. Confidence is heuristic.
- It is not a calibrated uncertainty score.

4. The historical market dataset is mock/synthetic.
- Good for prototype and workflow testing
- not equivalent to production real-world statistical truth

5. Render free tier causes wake-up delay.
- first ML request may be slow after inactivity

---

## Recommended Next Improvements

1. Expand portal product/market mapping coverage
2. Store retraining history in Supabase
3. Log predictions with model version
4. Add calibrated uncertainty / confidence bands
5. Add automatic scheduled retraining
6. Add admin retraining logs in the UI

---

## Current Model Status Summary

At this point in the project:

- the ML model architecture is implemented
- training and evaluation are implemented
- artifact persistence is implemented
- FastAPI inference is implemented
- admin retraining controls are implemented
- live portal retraining code is implemented
- deployment to Render and Vercel is implemented

The main remaining gap is:

- making sure approved live merchant portal rows are consistently merged into saved production retraining runs

