'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

function PriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawChart = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const W = c.parentElement?.clientWidth || 300;
    const H = 280;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    c.width = W * dpr; c.height = H * dpr;
    c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const data = [48000, 49200, 50100, 51000, 50500, 51500, 52500];
    const labels = ['မတ် 22', '23', '24', '25', '26', '27', '28'];
    const pad = { t: 20, r: 20, b: 40, l: 70 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const max = Math.max(...data) * 1.02;
    const min = Math.min(...data) * 0.98;

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.t + (cH / 5) * i;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - ((max - min) / 5) * i).toLocaleString(), pad.l - 8, y + 4);
    }

    const pts = data.map((v, i) => ({
      x: pad.l + (cW / (data.length - 1)) * i,
      y: pad.t + cH - ((v - min) / (max - min)) * cH
    }));

    ctx.beginPath(); ctx.moveTo(pts[0].x, pad.t + cH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, pad.t + cH); ctx.closePath();
    ctx.fillStyle = 'rgba(16,185,129,0.1)'; ctx.fill();

    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#059669'; ctx.lineWidth = 2.5; ctx.stroke();

    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#059669'; ctx.lineWidth = 2; ctx.stroke();
    });

    ctx.fillStyle = '#9ca3af'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    labels.forEach((l, i) => ctx.fillText(l, pad.l + (cW / (labels.length - 1)) * i, H - 10));
  }, []);

  useEffect(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [drawChart]);

  return <div className="chart-container"><canvas ref={canvasRef}></canvas></div>;
}

export default function MarketPage() {
  const [activeSubcat, setActiveSubcat] = useState('sesame');
  const [activeRange, setActiveRange] = useState(7);

  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးကွက်စျေးနှုန်းများ</h1>
      <p className="page-subtitle">နောက်ဆုံးရ စျေးနှုန်းအချက်အလက်များ</p>
      <div className="last-updated mb-md">နောက်ဆုံးမွမ်းမံချိန်: 2026 မတ်လ 28 ရက်, နံနက် 9:30</div>

      {/* Filters */}
      <div className="card mb-lg">
        <div className="card-title mb-md">စျေးကွက်ရွေးချယ်ရန်</div>
        <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
          <div className="form-group"><label className="form-label">ပြည်နယ်/တိုင်း</label>
            <select className="form-select"><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option><option>မကွေးတိုင်း</option><option>ရှမ်းပြည်နယ်</option><option>ရန်ကုန်တိုင်း</option><option>ပဲခူးတိုင်း</option></select>
          </div>
          <div className="form-group"><label className="form-label">မြို့/စျေးကွက်</label>
            <select className="form-select"><option>မန္တလေး</option><option>မိတ္ထီလာ</option><option>ပြင်ဦးလွင်</option></select>
          </div>
          <div className="form-group"><label className="form-label">အမျိုးအစား</label>
            <select className="form-select"><option>ဆီထွက်သီးနှံ</option><option>စပါး</option><option>ပဲအမျိုးမျိုး</option><option>ဟင်းသီးဟင်းရွက်</option><option>သစ်သီးများ</option></select>
          </div>
        </div>
        <div className="filter-bar">
          {[{ id: 'sesame', label: 'နှမ်း' }, { id: 'groundnut', label: 'မြေပဲ' }, { id: 'sunflower', label: 'နေကြာ' }, { id: 'mustard', label: 'မုန်ညင်း' }].map(s => (
            <button key={s.id} className={`filter-chip${activeSubcat === s.id ? ' active' : ''}`} onClick={() => setActiveSubcat(s.id)}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="grid-3 mb-lg">
        <div className="stat-card">
          <div className="stat-label">ယနေ့စျေး (နှမ်း / တစ်တင်း)</div>
          <div className="stat-value">52,500 Ks</div>
          <div className="stat-change up">↑ 1,500 Ks (3.2%)</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">အမြင့်ဆုံးစျေး (ယခုလ)</div>
          <div className="stat-value" style={{ color: 'var(--trend-up)' }}>53,000 Ks</div>
          <div className="stat-change up">မတ်လ 25 ရက်</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">အနိမ့်ဆုံးစျေး (ယခုလ)</div>
          <div className="stat-value" style={{ color: 'var(--trend-down)' }}>48,000 Ks</div>
          <div className="stat-change down">မတ်လ 5 ရက်</div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card mb-lg">
        <div className="card-header">
          <div className="card-title">စျေးနှုန်းပြောင်းလဲမှု ဇယား</div>
          <div className="filter-bar" style={{ margin: 0 }}>
            {[{ d: 7, l: '7 ရက်' }, { d: 30, l: '30 ရက်' }, { d: 90, l: '3 လ' }].map(r => (
              <button key={r.d} className={`filter-chip${activeRange === r.d ? ' active' : ''}`} onClick={() => setActiveRange(r.d)}>{r.l}</button>
            ))}
          </div>
        </div>
        <PriceChart />
      </div>

      {/* Market Comparison */}
      <div className="card mb-lg">
        <div className="card-title mb-md">စျေးကွက်အလိုက် နှိုင်းယှဉ်ချက်</div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>စျေးကွက်</th><th>စျေးနှုန်း (Ks)</th><th>ပြောင်းလဲမှု</th><th>အခြေအနေ</th></tr></thead>
            <tbody>
              <tr><td>မန္တလေး</td><td>52,500</td><td className="price-up">↑ 3.2%</td><td><span className="risk-badge low">ကောင်း</span></td></tr>
              <tr><td>မိတ္ထီလာ</td><td>51,000</td><td className="price-up">↑ 2.0%</td><td><span className="risk-badge low">ကောင်း</span></td></tr>
              <tr><td>မကွေး</td><td>53,000</td><td className="price-up">↑ 4.1%</td><td><span className="risk-badge low">အကောင်းဆုံး</span></td></tr>
              <tr><td>မော်လမြိုင်</td><td>49,500</td><td className="price-down">↓ 1.5%</td><td><span className="risk-badge moderate">သာမန်</span></td></tr>
              <tr><td>ရန်ကုန်</td><td>51,800</td><td className="price-up">↑ 2.5%</td><td><span className="risk-badge low">ကောင်း</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight */}
      <div className="insight-card">
        <div className="insight-text"><strong>အကြံပြုချက်:</strong> မကွေးစျေးကွက်တွင် နှမ်းစျေးအမြင့်ဆုံးဖြစ်ပြီး သင့်ဒေသထက် 500 ကျပ် ပိုမြင့်ပါသည်။ သယ်ယူစရိတ်နှင့် တွက်ချက်ပြီး ဆုံးဖြတ်ပါ။</div>
      </div>
    </div>
  );
}
