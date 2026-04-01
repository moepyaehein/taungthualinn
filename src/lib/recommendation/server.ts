import {
  toMyanmarCropName,
  toMyanmarMarketName,
  toMyanmarQualityName,
  toMyanmarRegionName,
  toMyanmarUnitName,
} from "@/lib/recommendation/catalog";
import type { ForecastRecommendation } from "@/lib/recommendation/types";

interface PredictArgs {
  role: "farmer" | "merchant";
  crop: string;
  region: string;
  market?: string;
  quality?: string;
  unit?: string;
}

class RecommendationServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "RecommendationServiceError";
    this.status = status;
  }
}

function buildReasonLines(payload: ForecastRecommendation): string[] {
  const direction7d =
    payload.recommendation.delta_7d_pct > 0
      ? "အနီးစပ်ဆုံး ၇ ရက်အတွင်း ဈေးနှုန်းတက်နိုင်ချေ တွေ့ရပါသည်။"
      : payload.recommendation.delta_7d_pct < 0
        ? "အနီးစပ်ဆုံး ၇ ရက်အတွင်း ဈေးနှုန်းကျနိုင်ချေ တွေ့ရပါသည်။"
        : "အနီးစပ်ဆုံး ၇ ရက်အတွင်း ဈေးနှုန်းပြောင်းလဲမှု မများနိုင်ပါ။";

  const direction30d =
    payload.recommendation.delta_30d_pct > 0
      ? "၃၀ ရက်အလားအလာအရ လမ်းကြောင်းက အတက်ဘက်ကို ဦးတည်နေပါသည်။"
      : payload.recommendation.delta_30d_pct < 0
        ? "၃၀ ရက်အလားအလာအရ လမ်းကြောင်းက အကျဘက်သို့ ဦးတည်နေပါသည်။"
        : "၃၀ ရက်အလားအလာအရ ဈေးနှုန်းတည်ငြိမ်နိုင်ချေ ရှိပါသည်။";

  const confidence = `မော်ဒယ်ယုံကြည်မှုအဆင့်မှာ ${(payload.recommendation.confidence * 100).toFixed(1)}% ဖြစ်ပါသည်။`;

  return [direction7d, direction30d, confidence];
}

function buildSummary(payload: ForecastRecommendation): string {
  const actionLabels: Record<string, string> = {
    sell: "ယခုအချိန်တွင် ရောင်းချရန် အကြံပြုပါသည်",
    hold: "ယခုအချိန်တွင် ဆက်လက်ထိန်းထားရန် အကြံပြုပါသည်",
    watch: "ဈေးကွက်အခြေအနေကို ဆက်လက်စောင့်ကြည့်ရန် အကြံပြုပါသည်",
    buy: "ယခုအချိန်တွင် ဝယ်ယူရန် အကြံပြုပါသည်",
    wait: "လောလောဆယ် မဝယ်သေးဘဲ စောင့်ကြည့်ရန် အကြံပြုပါသည်",
  };

  return `${payload.region} ရှိ ${payload.crop} အတွက် ${actionLabels[payload.recommendation.action]}။ လက်ရှိဈေးနှုန်းမှာ ${payload.current_price.toFixed(2)} ဖြစ်ပြီး ၇ ရက်ခန့်မှန်းဈေးနှုန်း ${payload.forecast_7d.toFixed(2)} နှင့် ၃၀ ရက်ခန့်မှန်းဈေးနှုန်း ${payload.forecast_30d.toFixed(2)} ဟု တွက်ချက်ထားပါသည်။`;
}

function getFastApiBaseUrl() {
  const configured = process.env.FASTAPI_BASE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new RecommendationServiceError(
      "Recommendation service is not configured. Set FASTAPI_BASE_URL in the deployment environment.",
      503,
    );
  }

  return "http://127.0.0.1:8000";
}

function localizePrediction(prediction: ForecastRecommendation): ForecastRecommendation {
  return {
    ...prediction,
    crop: toMyanmarCropName(prediction.crop),
    region: toMyanmarRegionName(prediction.region),
    market: toMyanmarMarketName(prediction.market),
    quality: toMyanmarQualityName(prediction.quality),
    unit: toMyanmarUnitName(prediction.unit),
  };
}

export async function runRecommendationPrediction(args: PredictArgs) {
  const baseUrl = getFastApiBaseUrl();

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    throw new RecommendationServiceError(
      error instanceof Error
        ? `Recommendation service is unavailable: ${error.message}`
        : "Recommendation service is unavailable.",
      503,
    );
  }

  const payload = (await response.json()) as ForecastRecommendation | { detail?: string };

  if (!response.ok) {
    const detail = "detail" in payload ? payload.detail : "Prediction failed";
    throw new RecommendationServiceError(detail || "Prediction failed", response.status);
  }

  const prediction = localizePrediction(payload as ForecastRecommendation);

  return {
    ...prediction,
    summary: buildSummary(prediction),
    reasons: buildReasonLines(prediction),
  };
}

export { RecommendationServiceError };
