export type RecommendationAction =
  | "sell"
  | "hold"
  | "watch"
  | "buy"
  | "wait";

export interface ForecastRecommendation {
  role: "farmer" | "merchant";
  crop: string;
  region: string;
  market: string;
  quality: string;
  unit: string;
  current_price: number;
  forecast_7d: number;
  forecast_30d: number;
  recommendation: {
    action: RecommendationAction;
    confidence: number;
    delta_7d_pct: number;
    delta_30d_pct: number;
  };
  model_metrics: {
    target_price_7d: {
      rmse: number;
      mae: number;
      r2: number;
    };
    target_price_30d: {
      rmse: number;
      mae: number;
      r2: number;
    };
  };
}
