from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any
import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MARKET_DATASET = ROOT / "mock_market_prices_1y_myanmar.xlsx"
DEFAULT_WEATHER_DATASET = ROOT / "myanmar_weather_combined.csv"
ARTIFACT_DIR = ROOT / "ml" / "artifacts"
REPORT_DIR = ROOT / "ml" / "reports"
ENV_PATHS = [ROOT / ".env.local", ROOT / ".env"]


def get_env_value(key: str, default: str = "") -> str:
    direct = os.getenv(key)
    if direct:
        return direct.strip()

    for path in ENV_PATHS:
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith("#") or "=" not in stripped:
                continue
            env_key, env_value = stripped.split("=", 1)
            if env_key.strip() == key:
                return env_value.strip().strip('"').strip("'")
    return default


DEFAULT_SUPABASE_URL = get_env_value("NEXT_PUBLIC_SUPABASE_URL")
DEFAULT_SUPABASE_SERVICE_ROLE_KEY = get_env_value("SUPABASE_SERVICE_ROLE_KEY")

PORTAL_PRODUCT_TO_DATASET_CROP = {
    "နှမ်း": "Brown Sesame",
    "ရွှေဘိုပေါ်ဆန်း": "Paw San Hmwe",
}

PORTAL_REGION_TO_DATASET_REGION = {
    "မန္တလေးတိုင်းဒေသကြီး": "Mandalay Region",
    "စစ်ကိုင်းတိုင်းဒေသကြီး": "Sagaing Region",
    "မကွေးတိုင်းဒေသကြီး": "Magway Region",
    "ရှမ်းပြည်နယ်": "Shan State",
    "ရန်ကုန်တိုင်းဒေသကြီး": "Yangon Region",
    "ဧရာဝတီတိုင်းဒေသကြီး": "Ayeyarwady Region",
    "ပဲခူးတိုင်းဒေသကြီး": "Bago Region",
    "ကရင်ပြည်နယ်": "Kayin State",
    "မွန်ပြည်နယ်": "Mon State",
    "နေပြည်တော်": "Naypyidaw",
}

PORTAL_MARKET_TO_DATASET_MARKET = {
    "မန္တလေးပွဲရုံ": "Pyigyidagun Commodity Center",
    "မိတ္ထီလာပွဲရုံ": "Pyigyidagun Commodity Center",
    "မကွေးကုန်စည်ဒိုင်": "Pakokku Produce Market",
    "အောင်ပန်းဈေး": "Taunggyi Aye Thar Yar Market",
}

DEFAULT_MARKET_BY_REGION = {
    "Yangon Region": "Bayintnaung Wholesale Market",
    "Mandalay Region": "Pyigyidagun Commodity Center",
    "Sagaing Region": "Monywa Grain Market",
    "Magway Region": "Pakokku Produce Market",
    "Ayeyarwady Region": "Pathein Market Yard",
    "Bago Region": "Pyay Market Yard",
    "Shan State": "Taunggyi Aye Thar Yar Market",
    "Kayin State": "Hpa-An Market Yard",
    "Mon State": "Mawlamyine Central Market",
    "Naypyidaw": "Thapyaygone Commodity Depot",
}

PORTAL_CATEGORY_BY_CROP = {
    "Brown Sesame": ("Oil Crop", "Sesame"),
    "Paw San Hmwe": ("Rice", "Rice"),
}


def normalize_region_name(value: str) -> str:
    value = (value or "").strip()
    for suffix in (" Region", " State"):
        if value.endswith(suffix):
            return value[: -len(suffix)]
    return value


def normalize_market_prices(market_path: Path) -> pd.DataFrame:
    market_df = pd.read_excel(market_path, sheet_name="market_prices")
    if pd.api.types.is_numeric_dtype(market_df["date"]):
        market_df["date"] = pd.to_datetime(market_df["date"], origin="1899-12-30", unit="D")
    else:
        market_df["date"] = pd.to_datetime(market_df["date"])
    market_df["normalized_region"] = market_df["location_main"].map(normalize_region_name)
    market_df["series_key"] = (
        market_df["crop_name"].astype(str)
        + " | "
        + market_df["quality"].astype(str)
        + " | "
        + market_df["unit"].astype(str)
        + " | "
        + market_df["location_main"].astype(str)
        + " | "
        + market_df["location"].astype(str)
    )
    numeric_columns = ["supply_price", "demand_price", "lowest_price", "highest_price"]
    market_df[numeric_columns] = market_df[numeric_columns].apply(pd.to_numeric, errors="coerce")
    market_df = market_df.sort_values(["series_key", "date"]).reset_index(drop=True)
    return market_df


def fetch_live_portal_prices(
    supabase_url: str = DEFAULT_SUPABASE_URL,
    service_role_key: str = DEFAULT_SUPABASE_SERVICE_ROLE_KEY,
    limit: int = 5000,
    statuses: tuple[str, ...] = ("peer_verified", "admin_verified"),
) -> pd.DataFrame:
    if not supabase_url or not service_role_key:
        return pd.DataFrame()

    status_filter = ",".join(statuses)
    query = urlencode(
        {
            "select": (
                "created_at,buy_price,sell_price,quality,unit,status,"
                "product:products!product_id(name_mm),"
                "market:markets!market_id(name_mm,region:regions!region_id(name_mm))"
            ),
            "status": f"in.({status_filter})",
            "order": "created_at.asc",
            "limit": str(limit),
        },
        safe="(),:!",
    )

    request = Request(
        f"{supabase_url.rstrip('/')}/rest/v1/price_submissions?{query}",
        headers={
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
        },
    )

    try:
        with urlopen(request, timeout=30) as response:  # noqa: S310
            records = json.loads(response.read().decode("utf-8"))
    except Exception:
        return pd.DataFrame()

    normalized_rows: list[dict[str, Any]] = []
    for record in records:
        product = record.get("product") or {}
        market = record.get("market") or {}
        region = market.get("region") or {}

        product_name_mm = str(product.get("name_mm") or "").strip()
        region_name_mm = str(region.get("name_mm") or "").strip()
        market_name_mm = str(market.get("name_mm") or "").strip()

        crop_name = PORTAL_PRODUCT_TO_DATASET_CROP.get(product_name_mm)
        location_main = PORTAL_REGION_TO_DATASET_REGION.get(region_name_mm)
        if not crop_name or not location_main:
            continue

        location = PORTAL_MARKET_TO_DATASET_MARKET.get(
            market_name_mm, DEFAULT_MARKET_BY_REGION.get(location_main)
        )
        if not location:
            continue

        main_category, item_category = PORTAL_CATEGORY_BY_CROP.get(
            crop_name, ("Portal Submission", product_name_mm or crop_name)
        )

        buy_price = pd.to_numeric(record.get("buy_price"), errors="coerce")
        sell_price = pd.to_numeric(record.get("sell_price"), errors="coerce")
        if pd.isna(buy_price) or pd.isna(sell_price):
            continue

        quality = str(record.get("quality") or "standard").strip() or "standard"
        unit = str(record.get("unit") or "basket").strip() or "basket"
        # Supabase returns timezone-aware timestamps. Convert them to naive
        # datetimes so they can be combined and sorted with the historical data.
        created_at = pd.to_datetime(record.get("created_at"), errors="coerce", utc=True)
        if pd.isna(created_at):
            continue
        created_at = created_at.tz_convert(None)

        normalized_rows.append(
            {
                "date": created_at.normalize(),
                "supply_price": float(buy_price),
                "demand_price": float(sell_price),
                "lowest_price": float(min(buy_price, sell_price)),
                "highest_price": float(max(buy_price, sell_price)),
                "main_category": main_category,
                "item_category": item_category,
                "crop_name": crop_name,
                "quality": quality,
                "unit": unit,
                "location_main": location_main,
                "location": location,
                "normalized_region": normalize_region_name(location_main),
            }
        )

    if not normalized_rows:
        return pd.DataFrame()

    live_df = pd.DataFrame(normalized_rows)
    live_df["series_key"] = (
        live_df["crop_name"].astype(str)
        + " | "
        + live_df["quality"].astype(str)
        + " | "
        + live_df["unit"].astype(str)
        + " | "
        + live_df["location_main"].astype(str)
        + " | "
        + live_df["location"].astype(str)
    )

    aggregate_keys = [
        "date",
        "main_category",
        "item_category",
        "crop_name",
        "quality",
        "unit",
        "location_main",
        "location",
        "normalized_region",
        "series_key",
    ]
    live_df = (
        live_df.groupby(aggregate_keys, as_index=False)[
            ["supply_price", "demand_price", "lowest_price", "highest_price"]
        ]
        .mean()
        .sort_values(["series_key", "date"])
        .reset_index(drop=True)
    )
    return live_df


def normalize_weather(weather_path: Path) -> pd.DataFrame:
    weather_df = pd.read_csv(weather_path)
    weather_df["date"] = pd.to_datetime(weather_df["date"])
    weather_df["normalized_region"] = weather_df["region"].map(normalize_region_name)

    numeric_columns = [
        "temp_avg",
        "temp_max",
        "temp_min",
        "humidity",
        "rainfall",
        "solar_radiation",
        "wind_speed",
    ]
    weather_df[numeric_columns] = weather_df[numeric_columns].apply(pd.to_numeric, errors="coerce")
    weather_df = weather_df.sort_values(["normalized_region", "date"]).reset_index(drop=True)

    grouped = weather_df.groupby("normalized_region", group_keys=False)
    for column in numeric_columns:
        weather_df[f"{column}_7d_avg"] = grouped[column].transform(
            lambda series: series.rolling(window=7, min_periods=1).mean()
        )
    weather_df["rainfall_7d_sum"] = grouped["rainfall"].transform(
        lambda series: series.rolling(window=7, min_periods=1).sum()
    )
    weather_df["rainfall_30d_sum"] = grouped["rainfall"].transform(
        lambda series: series.rolling(window=30, min_periods=1).sum()
    )
    return weather_df


def _future_window_mean(values: pd.Series, window: int) -> pd.Series:
    arr = values.to_numpy(dtype=float)
    result = np.full(arr.shape[0], np.nan)
    if arr.shape[0] <= window:
        return pd.Series(result, index=values.index)

    cumsum = np.cumsum(np.insert(arr, 0, 0.0))
    for idx in range(arr.shape[0] - window):
        start = idx + 1
        end = start + window
        result[idx] = (cumsum[end] - cumsum[start]) / window
    return pd.Series(result, index=values.index)


def build_training_frame(
    market_df: pd.DataFrame,
    weather_df: pd.DataFrame,
) -> pd.DataFrame:
    df = market_df.copy()
    grouped = df.groupby("series_key", group_keys=False)

    for column in ["supply_price", "demand_price", "lowest_price", "highest_price"]:
        for window in (3, 7, 14, 30):
            df[f"{column}_{window}d_avg"] = grouped[column].transform(
                lambda series, w=window: series.rolling(window=w, min_periods=1).mean()
            )

    df["demand_price_7d_std"] = grouped["demand_price"].transform(
        lambda series: series.rolling(window=7, min_periods=2).std().fillna(0.0)
    )
    df["spread_price"] = df["highest_price"] - df["lowest_price"]
    df["spread_ratio"] = np.where(
        df["demand_price"].abs() > 0,
        df["spread_price"] / df["demand_price"],
        0.0,
    )
    df["supply_demand_gap"] = df["demand_price"] - df["supply_price"]

    df["target_price_7d"] = grouped["demand_price"].transform(
        lambda series: _future_window_mean(series, 7)
    )
    df["target_price_30d"] = grouped["demand_price"].transform(
        lambda series: _future_window_mean(series, 30)
    )

    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12.0)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12.0)
    df["day_sin"] = np.sin(2 * np.pi * df["day_of_year"] / 365.0)
    df["day_cos"] = np.cos(2 * np.pi * df["day_of_year"] / 365.0)

    weather_columns = [
        "temp_avg",
        "temp_max",
        "temp_min",
        "humidity",
        "rainfall",
        "solar_radiation",
        "wind_speed",
        "temp_avg_7d_avg",
        "temp_max_7d_avg",
        "temp_min_7d_avg",
        "humidity_7d_avg",
        "rainfall_7d_avg",
        "solar_radiation_7d_avg",
        "wind_speed_7d_avg",
        "rainfall_7d_sum",
        "rainfall_30d_sum",
    ]
    weather_features = weather_df[["date", "normalized_region", *weather_columns]]
    df = df.merge(weather_features, on=["date", "normalized_region"], how="left")

    df = df.dropna(subset=["target_price_7d", "target_price_30d"]).reset_index(drop=True)
    return df


NUMERIC_FEATURES = [
    "supply_price",
    "demand_price",
    "lowest_price",
    "highest_price",
    "spread_price",
    "spread_ratio",
    "supply_demand_gap",
    "supply_price_3d_avg",
    "supply_price_7d_avg",
    "supply_price_14d_avg",
    "supply_price_30d_avg",
    "demand_price_3d_avg",
    "demand_price_7d_avg",
    "demand_price_14d_avg",
    "demand_price_30d_avg",
    "lowest_price_3d_avg",
    "lowest_price_7d_avg",
    "lowest_price_14d_avg",
    "lowest_price_30d_avg",
    "highest_price_3d_avg",
    "highest_price_7d_avg",
    "highest_price_14d_avg",
    "highest_price_30d_avg",
    "demand_price_7d_std",
    "month",
    "day_of_year",
    "month_sin",
    "month_cos",
    "day_sin",
    "day_cos",
    "temp_avg",
    "temp_max",
    "temp_min",
    "humidity",
    "rainfall",
    "solar_radiation",
    "wind_speed",
    "temp_avg_7d_avg",
    "temp_max_7d_avg",
    "temp_min_7d_avg",
    "humidity_7d_avg",
    "rainfall_7d_avg",
    "solar_radiation_7d_avg",
    "wind_speed_7d_avg",
    "rainfall_7d_sum",
    "rainfall_30d_sum",
]

CATEGORICAL_FEATURES = [
    "main_category",
    "item_category",
    "crop_name",
    "quality",
    "unit",
    "location_main",
    "location",
    "normalized_region",
]


def build_model_pipeline(random_state: int = 42) -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numeric",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="median")),
                    ]
                ),
                NUMERIC_FEATURES,
            ),
            (
                "categorical",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        (
                            "onehot",
                            OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                        ),
                    ]
                ),
                CATEGORICAL_FEATURES,
            ),
        ]
    )

    regressor = GradientBoostingRegressor(
        learning_rate=0.05,
        max_depth=5,
        n_estimators=250,
        min_samples_leaf=20,
        subsample=0.9,
        random_state=random_state,
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", regressor),
        ]
    )


def time_split_frame(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    unique_dates = np.array(sorted(df["date"].dt.normalize().unique()))
    train_cut = int(len(unique_dates) * 0.7)
    valid_cut = int(len(unique_dates) * 0.85)
    train_dates = unique_dates[:train_cut]
    valid_dates = unique_dates[train_cut:valid_cut]
    test_dates = unique_dates[valid_cut:]

    train_df = df[df["date"].dt.normalize().isin(train_dates)].copy()
    valid_df = df[df["date"].dt.normalize().isin(valid_dates)].copy()
    test_df = df[df["date"].dt.normalize().isin(test_dates)].copy()
    return train_df, valid_df, test_df


def evaluate_predictions(y_true: pd.Series, y_pred: np.ndarray) -> dict[str, float]:
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    mae = float(mean_absolute_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))
    return {"rmse": rmse, "mae": mae, "r2": r2}


@dataclass
class TrainingArtifacts:
    market_df: pd.DataFrame
    live_market_df: pd.DataFrame
    weather_df: pd.DataFrame
    frame: pd.DataFrame
    train_df: pd.DataFrame
    valid_df: pd.DataFrame
    test_df: pd.DataFrame
    source_summary: dict[str, int]


def prepare_training_artifacts(
    market_path: Path = DEFAULT_MARKET_DATASET,
    weather_path: Path = DEFAULT_WEATHER_DATASET,
    include_portal_data: bool = True,
    supabase_url: str = DEFAULT_SUPABASE_URL,
    service_role_key: str = DEFAULT_SUPABASE_SERVICE_ROLE_KEY,
    portal_statuses: tuple[str, ...] = ("peer_verified", "admin_verified"),
) -> TrainingArtifacts:
    market_df = normalize_market_prices(market_path)
    live_market_df = (
        fetch_live_portal_prices(
            supabase_url=supabase_url,
            service_role_key=service_role_key,
            statuses=portal_statuses,
        )
        if include_portal_data
        else pd.DataFrame()
    )
    if not live_market_df.empty:
        market_df = pd.concat([market_df, live_market_df], ignore_index=True, sort=False)
        market_df = market_df.sort_values(["series_key", "date"]).reset_index(drop=True)

    weather_df = normalize_weather(weather_path)
    frame = build_training_frame(market_df, weather_df)
    train_df, valid_df, test_df = time_split_frame(frame)
    return TrainingArtifacts(
        market_df=market_df,
        live_market_df=live_market_df,
        weather_df=weather_df,
        frame=frame,
        train_df=train_df,
        valid_df=valid_df,
        test_df=test_df,
        source_summary={
            "historical_market_rows": int(len(market_df) - len(live_market_df)),
            "live_portal_rows": int(len(live_market_df)),
            "weather_rows": int(len(weather_df)),
            "training_frame_rows": int(len(frame)),
        },
    )


def train_models(artifacts: TrainingArtifacts) -> tuple[Pipeline, Pipeline, dict[str, Any]]:
    x_train = artifacts.train_df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    x_valid = artifacts.valid_df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
    x_test = artifacts.test_df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]

    model_7d = build_model_pipeline()
    model_30d = build_model_pipeline(random_state=84)

    model_7d.fit(x_train, artifacts.train_df["target_price_7d"])
    model_30d.fit(x_train, artifacts.train_df["target_price_30d"])

    metrics = {
        "validation": {
            "target_price_7d": evaluate_predictions(
                artifacts.valid_df["target_price_7d"], model_7d.predict(x_valid)
            ),
            "target_price_30d": evaluate_predictions(
                artifacts.valid_df["target_price_30d"], model_30d.predict(x_valid)
            ),
        },
        "test": {
            "target_price_7d": evaluate_predictions(
                artifacts.test_df["target_price_7d"], model_7d.predict(x_test)
            ),
            "target_price_30d": evaluate_predictions(
                artifacts.test_df["target_price_30d"], model_30d.predict(x_test)
            ),
        },
        "training_rows": int(len(artifacts.train_df)),
        "validation_rows": int(len(artifacts.valid_df)),
        "test_rows": int(len(artifacts.test_df)),
        "source_summary": artifacts.source_summary,
    }
    return model_7d, model_30d, metrics


def save_artifacts(
    model_7d: Pipeline,
    model_30d: Pipeline,
    artifacts: TrainingArtifacts,
    metrics: dict[str, Any],
) -> Path:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    payload = {
        "model_7d": model_7d,
        "model_30d": model_30d,
        "feature_columns": NUMERIC_FEATURES + CATEGORICAL_FEATURES,
        "numeric_features": NUMERIC_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "metrics": metrics,
        "latest_training_date": artifacts.frame["date"].max(),
        "market_dataset_path": str(DEFAULT_MARKET_DATASET),
        "weather_dataset_path": str(DEFAULT_WEATHER_DATASET),
        "live_portal_rows": int(len(artifacts.live_market_df)),
    }
    artifact_path = ARTIFACT_DIR / "recommendation_forecast.joblib"
    report_path = REPORT_DIR / "recommendation_metrics.json"
    joblib.dump(payload, artifact_path)
    report_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return artifact_path


def load_artifact(artifact_path: Path | None = None) -> dict[str, Any]:
    resolved_path = artifact_path or (ARTIFACT_DIR / "recommendation_forecast.joblib")
    return joblib.load(resolved_path)


def ensure_runtime_artifacts(
    artifact_path: Path | None = None,
    market_path: Path = DEFAULT_MARKET_DATASET,
    weather_path: Path = DEFAULT_WEATHER_DATASET,
) -> tuple[dict[str, Any], TrainingArtifacts, bool]:
    resolved_path = artifact_path or (ARTIFACT_DIR / "recommendation_forecast.joblib")

    if resolved_path.exists():
        training_artifacts = prepare_training_artifacts(
            market_path=market_path,
            weather_path=weather_path,
        )
        return load_artifact(resolved_path), training_artifacts, False

    training_artifacts = prepare_training_artifacts(
        market_path=market_path,
        weather_path=weather_path,
    )
    model_7d, model_30d, metrics = train_models(training_artifacts)
    save_artifacts(model_7d, model_30d, training_artifacts, metrics)
    return load_artifact(resolved_path), training_artifacts, True


def build_latest_feature_row(
    artifacts: TrainingArtifacts,
    crop_name: str,
    region: str,
    market: str | None = None,
    quality: str | None = None,
    unit: str | None = None,
) -> pd.DataFrame:
    normalized_region = normalize_region_name(region)
    frame = artifacts.frame.copy()
    subset = frame[
        (frame["crop_name"].str.lower() == crop_name.lower())
        & (frame["normalized_region"].str.lower() == normalized_region.lower())
    ]
    if market:
        subset = subset[subset["location"].str.lower() == market.lower()]
    if quality:
        subset = subset[subset["quality"].str.lower() == quality.lower()]
    if unit:
        subset = subset[subset["unit"].str.lower() == unit.lower()]

    if subset.empty:
        raise ValueError(
            f"No training row found for crop='{crop_name}', region='{region}', market='{market or '*'}'."
        )

    latest_row = subset.sort_values("date").iloc[-1]
    return latest_row[NUMERIC_FEATURES + CATEGORICAL_FEATURES].to_frame().T


def derive_recommendation(
    role: str,
    current_price: float,
    forecast_7d: float,
    forecast_30d: float,
    metrics: dict[str, Any],
) -> dict[str, Any]:
    delta_7d_pct = (forecast_7d - current_price) / current_price if current_price else 0.0
    delta_30d_pct = (forecast_30d - current_price) / current_price if current_price else 0.0
    validation_r2 = metrics["validation"]["target_price_7d"]["r2"]
    confidence = max(0.2, min(0.95, 0.5 + max(validation_r2, 0) * 0.4 + abs(delta_7d_pct) * 1.5))

    if role == "farmer":
        if delta_7d_pct >= 0.03:
            action = "hold"
        elif delta_7d_pct <= -0.02:
            action = "sell"
        else:
            action = "watch"
    else:
        if delta_7d_pct >= 0.025:
            action = "buy"
        elif delta_7d_pct <= -0.02:
            action = "wait"
        else:
            action = "watch"

    return {
        "action": action,
        "confidence": round(confidence, 3),
        "delta_7d_pct": round(delta_7d_pct * 100, 2),
        "delta_30d_pct": round(delta_30d_pct * 100, 2),
    }
