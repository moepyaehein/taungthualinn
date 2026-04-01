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

export async function runRecommendationPrediction(args: PredictArgs) {
  const baseUrl = process.env.FASTAPI_BASE_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${baseUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  const payload = (await response.json()) as ForecastRecommendation | { detail?: string };

  if (!response.ok) {
    const detail = "detail" in payload ? payload.detail : "Prediction failed";
    throw new Error(detail || "Prediction failed");
  }

  const prediction = payload as ForecastRecommendation;
  const localizedPrediction: ForecastRecommendation = {
    ...prediction,
    crop: toMyanmarCropName(prediction.crop),
    region: toMyanmarRegionName(prediction.region),
    market: toMyanmarMarketName(prediction.market),
    quality: toMyanmarQualityName(prediction.quality),
    unit: toMyanmarUnitName(prediction.unit),
  };

  return {
    ...localizedPrediction,
    summary: buildSummary(localizedPrediction),
    reasons: buildReasonLines(localizedPrediction),
  };
}
