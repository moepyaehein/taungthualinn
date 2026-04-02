'use client';

import { useEffect, useMemo, useState } from "react";

import {
  merchantCropOptions,
  regionMarkets,
  supportedRegions,
  toMyanmarMarketName,
  toMyanmarRegionName,
} from "@/lib/recommendation/catalog";
import type { ForecastRecommendation } from "@/lib/recommendation/types";

type MerchantApiState = {
  data: (ForecastRecommendation & { summary: string; reasons: string[] }) | null;
  error: string | null;
  loading: boolean;
};

const actionConfig: Record<string, { label: string; className: string; icon: string; color: string }> = {
  buy: { label: "ယခုဝယ်ရန်", className: "sell", icon: "ဝယ်", color: "var(--primary-700)" },
  wait: { label: "စောင့်ရန်", className: "wait", icon: "စောင့်", color: "var(--earth-700)" },
  watch: { label: "စောင့်ကြည့်ရန်", className: "watch", icon: "ကြည့်", color: "#1e40af" },
};

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function toDirection(delta: number): "up" | "down" | "stable" {
  if (delta > 0.4) return "up";
  if (delta < -0.4) return "down";
  return "stable";
}

function directionLabel(direction: "up" | "down" | "stable") {
  if (direction === "up") return "တက်";
  if (direction === "down") return "ကျ";
  return "ငြိမ်";
}

export default function MerchantRecommendationPage() {
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const selectedCrop = useMemo(
    () => merchantCropOptions.find((crop) => crop.id === selectedCropId) ?? null,
    [selectedCropId],
  );
  const [region, setRegion] = useState<string>(supportedRegions[0]);
  const [market, setMarket] = useState<string>(regionMarkets[supportedRegions[0]][0]);
  const [state, setState] = useState<MerchantApiState>({ data: null, error: null, loading: false });

  useEffect(() => {
    if (!selectedCrop) return;
    setRegion(selectedCrop.defaultRegion);
    setMarket(selectedCrop.defaultMarket ?? regionMarkets[selectedCrop.defaultRegion][0]);
  }, [selectedCrop]);

  useEffect(() => {
    if (!selectedCrop) return;
    let ignore = false;

    const params = new URLSearchParams({
      mode: "recommendation",
      role: "merchant",
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
          throw new Error(payload.error || "Unable to load merchant recommendation");
        }

        if (!ignore) {
          setState({ data: payload.data, error: null, loading: false });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : "Unable to load merchant recommendation",
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

  const rec = state.data;
  const action = rec ? actionConfig[rec.recommendation.action] : null;
  const shortTermDirection = rec ? toDirection(rec.recommendation.delta_7d_pct) : "stable";
  const longTermDirection = rec ? toDirection(rec.recommendation.delta_30d_pct) : "stable";

  return (
    <div className="tab-panel">
      <h1 className="page-title">AI ကုန်သည်အကြံပြုချက်</h1>
      <p className="page-subtitle">ပံ့ပိုးထားသော သီးနှံကို ရွေးပြီး လေ့ကျင့်ထားသော မော်ဒယ်၏ အချိန်ကာလအလိုက် အကြံပြုချက်ကို ကြည့်ရှုနိုင်ပါသည်။</p>

      <div className="card mb-lg">
        <div className="card-title mb-md">အဆင့် ၁: သီးနှံရွေးပါ</div>
        <div className="grid-4" style={{ gap: "12px" }}>
          {merchantCropOptions.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCropId(crop.id)}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: selectedCropId === crop.id ? "2px solid #4f46e5" : "1.5px solid var(--gray-200)",
                background: selectedCropId === crop.id ? "linear-gradient(135deg, #eef2ff, #e0e7ff)" : "#fff",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 700, color: selectedCropId === crop.id ? "#4338ca" : "var(--gray-800)" }}>
                {crop.label}
              </div>
              <div style={{ fontSize: "var(--font-xs)", color: "var(--gray-400)", marginTop: 4 }}>
                {toMyanmarRegionName(crop.defaultRegion)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCrop && (
        <div className="card mb-lg">
          <div className="card-title mb-md">အဆင့် ၂: ဈေးကွက်အခြေအနေရွေးပါ</div>
          <div className="grid-3" style={{ gap: "var(--space-md)" }}>
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
            <div className="form-group">
              <label className="form-label">ရွေးချယ်ထားသောသီးနှံ</label>
              <input className="form-input" value={selectedCrop.label} readOnly />
            </div>
          </div>
        </div>
      )}

      {state.loading && (
        <div className="card mb-lg">
          <div className="card-title mb-md">ခန့်မှန်းတွက်ချက်နေပါသည်</div>
          <div style={{ color: "var(--gray-500)" }}>
            ဈေးနှုန်းနှင့် ရာသီဥတုလမ်းကြောင်းများအပေါ် အခြေခံပြီး ကုန်သည်ဘက် အဝယ်အကြံပြုချက်ကို တွက်ချက်နေပါသည်...
          </div>
        </div>
      )}

      {state.error && (
        <div className="card mb-lg" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          <div className="card-title mb-md">ခန့်မှန်းမှုအမှား</div>
          <div>{state.error}</div>
        </div>
      )}

      {rec && action && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div className="card mb-lg" style={{ background: "linear-gradient(135deg, #eef2ff, #fff)", borderColor: "#c7d2fe" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "var(--font-lg)", color: "var(--gray-900)" }}>
                  {rec.crop} - {rec.market}
                </div>
                <div style={{ color: "var(--gray-500)", fontSize: "var(--font-sm)", marginTop: "4px" }}>
                  လက်ရှိဈေးနှုန်း: <strong style={{ color: "var(--gray-800)" }}>{rec.current_price.toFixed(2)}</strong> / {rec.unit}
                </div>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--font-xs)",
                  fontWeight: 600,
                  background: "#e0e7ff",
                  color: "#4338ca",
                }}
              >
                ယုံကြည်မှုအဆင့် {(rec.recommendation.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <div style={{ color: "var(--gray-600)", fontSize: "var(--font-sm)", marginTop: 10 }}>{rec.summary}</div>
          </div>

          <div className="grid-3 mb-lg">
            <div className="forecast-card">
              <div className="forecast-period">၇ ရက်ပြောင်းလဲမှု</div>
              <div className={`forecast-direction ${shortTermDirection}`}>{directionLabel(shortTermDirection)}</div>
              <div className="forecast-label">{formatPercent(rec.recommendation.delta_7d_pct)}</div>
              <div className="forecast-confidence">လက်ရှိဈေးနှုန်းနှင့် နှိုင်းယှဉ်ချက်</div>
            </div>
            <div className="forecast-card">
              <div className="forecast-period">၇ ရက်ခန့်မှန်းချက်</div>
              <div className={`forecast-direction ${shortTermDirection}`}>{directionLabel(shortTermDirection)}</div>
              <div className="forecast-label">{rec.forecast_7d.toFixed(2)}</div>
              <div className="forecast-confidence">မျှော်မှန်းပျမ်းမျှဈေးနှုန်း</div>
            </div>
            <div className="forecast-card">
              <div className="forecast-period">၃၀ ရက်ခန့်မှန်းချက်</div>
              <div className={`forecast-direction ${longTermDirection}`}>{directionLabel(longTermDirection)}</div>
              <div className="forecast-label">{rec.forecast_30d.toFixed(2)}</div>
              <div className="forecast-confidence">လက်ရှိနှင့် နှိုင်းယှဉ်လျှင် {formatPercent(rec.recommendation.delta_30d_pct)}</div>
            </div>
          </div>

          <div className={`recommendation-card ${action.className} mb-lg`}>
            <div className="recommendation-icon">{action.icon}</div>
            <div className="recommendation-action" style={{ color: action.color }}>
              {action.label}
            </div>
            <div className="recommendation-reason">
              လက်ရှိအခြေအနေအရ ကုန်သည်အတွက် <strong>{action.label}</strong> ဟု အကြံပြုထားပါသည်။
            </div>
          </div>

          <div className="card mb-lg">
            <div className="card-title mb-md">အကြံပြုရသည့်အကြောင်းရင်း</div>
            <div className="flex flex-col gap-md">
              {rec.reasons.map((reason) => (
                <div key={reason} className="insight-card" style={{ borderLeftColor: "var(--primary-500)" }}>
                  <div className="insight-text">{reason}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2 mb-lg">
            <div className="card" style={{ borderTop: "3px solid #4f46e5" }}>
              <div className="card-title mb-md">အဝယ်မဟာဗျူဟာ</div>
              <div style={{ fontSize: "var(--font-sm)", lineHeight: 2 }}>
                <div style={{ borderBottom: "1px solid var(--gray-100)", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>လက်ရှိဈေးနှုန်း</span>
                  <span style={{ fontWeight: 700 }}>{rec.current_price.toFixed(2)}</span>
                </div>
                <div style={{ borderBottom: "1px solid var(--gray-100)", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>၇ ရက်ခန့်မှန်းချက်</span>
                  <span style={{ fontWeight: 700, color: "#4f46e5" }}>{rec.forecast_7d.toFixed(2)}</span>
                </div>
                <div style={{ padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>၃၀ ရက်ခန့်မှန်းချက်</span>
                  <span style={{ fontWeight: 700 }}>{rec.forecast_30d.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="card" style={{ borderTop: "3px solid var(--primary-500)" }}>
              <div className="card-title mb-md">မော်ဒယ်အကျဉ်းချုပ်</div>
              <div style={{ fontSize: "var(--font-sm)", lineHeight: 2 }}>
                <div style={{ borderBottom: "1px solid var(--gray-100)", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Validation R2 (၇ ရက်)</span>
                  <span style={{ fontWeight: 700 }}>{rec.model_metrics.target_price_7d.r2.toFixed(4)}</span>
                </div>
                <div style={{ borderBottom: "1px solid var(--gray-100)", padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Validation R2 (၃၀ ရက်)</span>
                  <span style={{ fontWeight: 700 }}>{rec.model_metrics.target_price_30d.r2.toFixed(4)}</span>
                </div>
                <div style={{ padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>မော်ဒယ်ယုံကြည်မှုအဆင့်</span>
                  <span style={{ fontWeight: 700, color: "var(--primary-600)" }}>
                    {(rec.recommendation.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedCrop && (
        <div className="card" style={{ textAlign: "center", padding: "var(--space-2xl) var(--space-lg)", background: "linear-gradient(135deg, var(--gray-50), #fff)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #eef2ff, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-lg)", fontSize: "2rem" }}>
            ML
          </div>
          <div style={{ fontWeight: 700, fontSize: "var(--font-xl)", color: "var(--gray-800)", marginBottom: "8px" }}>
            ကုန်သည်အကြံပြုစနစ်
          </div>
          <div style={{ color: "var(--gray-500)", fontSize: "var(--font-sm)", maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>
            ပံ့ပိုးထားသော သီးနှံတစ်ခုကို ရွေးပြီး လေ့ကျင့်ထားသော မော်ဒယ်မှ တိုက်ရိုက်ခန့်မှန်းချက်ကို ရယူနိုင်ပါသည်။
          </div>
        </div>
      )}
    </div>
  );
}
