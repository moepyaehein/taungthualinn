'use client';

import { useEffect, useMemo, useState } from "react";

import {
  farmerCropOptions,
  regionMarkets,
  supportedRegions,
  toMyanmarMarketName,
  toMyanmarRegionName,
} from "@/lib/recommendation/catalog";
import type { ForecastRecommendation } from "@/lib/recommendation/types";

type ApiState = {
  data: (ForecastRecommendation & { summary: string; reasons: string[] }) | null;
  error: string | null;
  loading: boolean;
};

const actionStyles: Record<string, { label: string; className: string; color: string }> = {
  sell: { label: "ယခုရောင်းရန်", className: "sell", color: "var(--primary-700)" },
  hold: { label: "ခေတ္တထိန်းထားရန်", className: "wait", color: "var(--earth-700)" },
  watch: { label: "ဈေးကွက်ကို စောင့်ကြည့်ရန်", className: "watch", color: "#1e40af" },
};

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function forecastDirection(value: number): "up" | "down" | "stable" {
  if (value > 0.4) return "up";
  if (value < -0.4) return "down";
  return "stable";
}

function directionLabel(direction: "up" | "down" | "stable") {
  if (direction === "up") return "တက်";
  if (direction === "down") return "ကျ";
  return "ငြိမ်";
}

export default function RecommendationPage() {
  const [cropId, setCropId] = useState(farmerCropOptions[0].id);
  const selectedCrop = useMemo(
    () => farmerCropOptions.find((crop) => crop.id === cropId) ?? farmerCropOptions[0],
    [cropId],
  );
  const [region, setRegion] = useState(selectedCrop.defaultRegion);
  const [market, setMarket] = useState(selectedCrop.defaultMarket ?? regionMarkets[selectedCrop.defaultRegion][0]);
  const [state, setState] = useState<ApiState>({ data: null, error: null, loading: true });

  useEffect(() => {
    setRegion(selectedCrop.defaultRegion);
    setMarket(selectedCrop.defaultMarket ?? regionMarkets[selectedCrop.defaultRegion][0]);
  }, [selectedCrop]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({
      mode: "recommendation",
      role: "farmer",
      crop: selectedCrop.datasetCrop,
      region,
      market,
      quality: selectedCrop.defaultQuality ?? "",
      unit: selectedCrop.unit ?? "",
    });

    async function loadRecommendation() {
      setState({ data: null, error: null, loading: true });
      try {
        const response = await fetch(`/api/market?${params.toString()}`);
        const payload = (await response.json()) as {
          data?: ForecastRecommendation & { summary: string; reasons: string[] };
          error?: string;
        };

        if (!response.ok || !payload.data) {
          throw new Error(payload.error || "Unable to load recommendation");
        }

        if (!ignore) {
          setState({ data: payload.data, error: null, loading: false });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : "Unable to load recommendation",
            loading: false,
          });
        }
      }
    }

    void loadRecommendation();
    return () => {
      ignore = true;
    };
  }, [market, region, selectedCrop]);

  const data = state.data;
  const actionStyle = data ? actionStyles[data.recommendation.action] : actionStyles.watch;
  const shortTermDirection = data ? forecastDirection(data.recommendation.delta_7d_pct) : "stable";
  const longTermDirection = data ? forecastDirection(data.recommendation.delta_30d_pct) : "stable";

  return (
    <div className="tab-panel">
      <h1 className="page-title">AI တောင်သူအကြံပြုချက်</h1>
      <p className="page-subtitle">လေ့ကျင့်ထားသော ဈေးနှုန်းခန့်မှန်းမော်ဒယ်မှ တိုက်ရိုက်အကြံပြုချက်ကို ပြသထားပါသည်။</p>

      <div className="card mb-lg">
        <div className="card-title mb-md">အကြံပြုချက်အတွက် ရွေးချယ်မှုများ</div>
        <div className="grid-3" style={{ gap: "var(--space-md)" }}>
          <div className="form-group">
            <label className="form-label">သီးနှံ</label>
            <select className="form-select" value={cropId} onChange={(e) => setCropId(e.target.value)}>
              {farmerCropOptions.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">တိုင်းဒေသကြီး / ပြည်နယ်</label>
            <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
              {supportedRegions.map((option) => (
                <option key={option} value={option}>
                  {toMyanmarRegionName(option)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">ဈေးကွက်</label>
            <select className="form-select" value={market} onChange={(e) => setMarket(e.target.value)}>
              {(regionMarkets[region] ?? []).map((option) => (
                <option key={option} value={option}>
                  {toMyanmarMarketName(option)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {state.loading && (
        <div className="card mb-lg">
          <div className="card-title mb-md">ခန့်မှန်းတွက်ချက်နေပါသည်</div>
          <div style={{ color: "var(--gray-500)" }}>
            ဈေးကွက်နှင့် ရာသီဥတုဒေတာများအပေါ် အခြေခံပြီး ၇ ရက်နှင့် ၃၀ ရက်ခန့်မှန်းချက်ကို တွက်ချက်နေပါသည်...
          </div>
        </div>
      )}

      {state.error && (
        <div className="card mb-lg" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          <div className="card-title mb-md">ခန့်မှန်းမှုအမှား</div>
          <div>{state.error}</div>
        </div>
      )}

      {data && (
        <>
          <div className="card mb-lg" style={{ background: "linear-gradient(135deg,var(--primary-50),#fff)" }}>
            <div style={{ fontWeight: 700, fontSize: "var(--font-lg)" }}>
              {data.crop} - {data.market}
            </div>
            <div style={{ color: "var(--gray-500)", fontSize: "var(--font-sm)", marginTop: 4 }}>
              လက်ရှိဈေးနှုန်း: {data.current_price.toFixed(2)} / {data.unit}
            </div>
            <div style={{ color: "var(--gray-600)", fontSize: "var(--font-sm)", marginTop: 8 }}>
              {data.summary}
            </div>
          </div>

          <div className="grid-3 mb-lg">
            <div className="forecast-card">
              <div className="forecast-period">လက်ရှိပြောင်းလဲမှု</div>
              <div className={`forecast-direction ${shortTermDirection}`}>{directionLabel(shortTermDirection)}</div>
              <div className="forecast-label">{formatPercent(data.recommendation.delta_7d_pct)}</div>
              <div className="forecast-confidence">လက်ရှိဈေးနှုန်းနှင့် ၇ ရက်နှိုင်းယှဉ်ချက်</div>
            </div>
            <div className="forecast-card">
              <div className="forecast-period">လာမည့် ၇ ရက်</div>
              <div className={`forecast-direction ${shortTermDirection}`}>{directionLabel(shortTermDirection)}</div>
              <div className="forecast-label">{data.forecast_7d.toFixed(2)}</div>
              <div className="forecast-confidence">
                ယုံကြည်မှုအဆင့်: {(data.recommendation.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <div className="forecast-card">
              <div className="forecast-period">လာမည့် ၃၀ ရက်</div>
              <div className={`forecast-direction ${longTermDirection}`}>{directionLabel(longTermDirection)}</div>
              <div className="forecast-label">{data.forecast_30d.toFixed(2)}</div>
              <div className="forecast-confidence">
                လက်ရှိနှင့် နှိုင်းယှဉ်လျှင် {formatPercent(data.recommendation.delta_30d_pct)}
              </div>
            </div>
          </div>

          <div className={`recommendation-card ${actionStyle.className} mb-lg`}>
            <div className="recommendation-action" style={{ color: actionStyle.color }}>
              {actionStyle.label}
            </div>
            <div className="recommendation-reason">
              {data.region} ရှိ {data.crop} အတွက် မော်ဒယ်က <strong>{actionStyle.label}</strong> ဟု အကြံပြုထားပါသည်။
            </div>
          </div>

          <div className="card mb-lg">
            <div className="card-title mb-md">အကြံပြုရသည့်အကြောင်းရင်း</div>
            <div className="flex flex-col gap-md">
              {data.reasons.map((reason) => (
                <div key={reason} className="insight-card" style={{ borderLeftColor: "var(--info)" }}>
                  <div className="insight-text">{reason}</div>
                </div>
              ))}
              <div className="insight-card" style={{ borderLeftColor: "var(--primary-500)" }}>
                <div className="insight-text">
                  မော်ဒယ်အကဲဖြတ်ရလဒ် R2 သည် ၇ ရက်ခန့်မှန်းချက်အတွက် {data.model_metrics.target_price_7d.r2.toFixed(4)}
                  {" "}နှင့် ၃၀ ရက်ခန့်မှန်းချက်အတွက် {data.model_metrics.target_price_30d.r2.toFixed(4)} ဖြစ်ပါသည်။
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
