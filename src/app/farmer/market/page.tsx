'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useApi } from '@/lib/useApi';

const toBurmese = (str: string) => str.replace(/[0-9]/g, d => '၀၁၂၃၄၅၆၇၈၉'[parseInt(d)]);

interface ChartDataPoint { date: string; sell_price: number; buy_price: number; }

function PriceChart({ data, loading }: { data: ChartDataPoint[]; loading: boolean }) {
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

    ctx.clearRect(0, 0, W, H);

    if (loading) {
      ctx.fillStyle = '#9ca3af'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('ခဏစောင့်ပါ...', W/2, H/2);
      return;
    }

    if (!data || data.length === 0) {
      ctx.fillStyle = '#9ca3af'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('အချက်အလက် မရှိသေးပါ', W/2, H/2);
      return;
    }

    const prices = data.map(d => d.sell_price);
    const labels = data.map(d => d.date.substring(5, 10).replace('-', '/'));
    const pad = { t: 20, r: 20, b: 40, l: 60 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const max = Math.max(...prices) * 1.05 || 100;
    const min = Math.min(...prices) * 0.95 || 0;

    ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.t + (cH / 5) * i;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - ((max - min) / 5) * i).toLocaleString(), pad.l - 8, y + 4);
    }

    if (prices.length === 1) {
      // Draw single point centered
      const x = pad.l + cW / 2;
      const y = pad.t + cH - ((prices[0] - min) / (max - min)) * cH;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#059669'; ctx.fill();
      ctx.fillStyle = '#9ca3af'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(labels[0], x, H - 10);
      return;
    }

    const pts = prices.map((v, i) => ({
      x: pad.l + (cW / (prices.length - 1)) * i,
      y: pad.t + cH - ((v - min) / (max - min)) * cH
    }));

    // Gradient fill
    ctx.beginPath(); ctx.moveTo(pts[0].x, pad.t + cH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, pad.t + cH); ctx.closePath();
    ctx.fillStyle = 'rgba(16,185,129,0.1)'; ctx.fill();

    // Line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#059669'; ctx.lineWidth = 2.5; ctx.stroke();

    // Points
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#059669'; ctx.lineWidth = 2; ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#9ca3af'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
    
    // Only show max 7 labels
    const step = Math.ceil(labels.length / 7);
    labels.forEach((l, i) => {
      if (i % step === 0 || i === labels.length - 1) {
        ctx.fillText(l, pad.l + (cW / (labels.length - 1)) * i, H - 10);
      }
    });

  }, [data, loading]);

  useEffect(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [drawChart]);

  return <div className="chart-container"><canvas ref={canvasRef}></canvas></div>;
}

interface Product { id: number; name_mm: string; category_id: number; }
interface Category { id: number; name_mm: string; }
interface Region { id: number; name_mm: string; }
interface Market { id: number; name_mm: string; }

export default function MarketPage() {
  const [activeProductId, setActiveProductId] = useState<string>('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [activeRegionId, setActiveRegionId] = useState<string>('');
  const [activeRange, setActiveRange] = useState(7);

  const { data: regions } = useApi<Region[]>('/api/regions');
  const { data: categories } = useApi<Category[]>('/api/categories');
  const { data: markets } = useApi<Market[]>('/api/markets');
  const { data: allProducts } = useApi<Product[]>('/api/products');

  useEffect(() => { if (regions?.length && !activeRegionId) setActiveRegionId(String(regions[0].id)); }, [regions, activeRegionId]);
  useEffect(() => { if (categories?.length && !activeCategoryId) setActiveCategoryId(String(categories[0].id)); }, [categories, activeCategoryId]);

  const filteredProducts = allProducts?.filter(p => !activeCategoryId || p.category_id === parseInt(activeCategoryId)) || [];
  
  useEffect(() => { 
    if (filteredProducts.length > 0 && (!activeProductId || !filteredProducts.find(p => String(p.id) === activeProductId))) {
      setActiveProductId(String(filteredProducts[0].id)); 
    }
  }, [filteredProducts, activeProductId]);

  const { data: marketData, loading: marketLoading } = useApi<any[]>(
    activeProductId ? `/api/market?product_id=${activeProductId}${activeRegionId ? `&region_id=${activeRegionId}` : ''}` : null
  );

  const referenceMarketId = marketData && marketData.length > 0 ? String(marketData[0].market.id) : '';

  interface ChartDataRes { data: ChartDataPoint[]; stats: { current: number; high: number; low: number; change: number } }
  
  const { data: chartRes, loading: chartLoading } = useApi<ChartDataRes>(
    activeProductId && referenceMarketId 
      ? `/api/market/chart?product_id=${activeProductId}&market_id=${referenceMarketId}&days=${activeRange}` 
      : null
  );

  const chartData = chartRes?.data || [];
  const stats = chartRes?.stats;

  const getDayDiff = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diff === 0) return 'ယနေ့ဆွဲချထားသည်';
    if (diff === 1) return 'ယမန်နေ့က';
    return `${diff} ရက်ခန့်က`;
  };

  const getInsight = () => {
    if (marketLoading) return 'ခဏစောင့်ပါ...';
    if (!marketData || marketData.length === 0) return 'ဤသီးနှံအတွက် စျေးကွက်အချက်အလက် မရှိသေးပါ။';
    if (marketData.length === 1) return `${marketData[0].market.name_mm} တွင် စျေးနှုန်းများရရှိနိုင်ပါသည်။`;
    
    // Find market with highest price
    const highest = [...marketData].sort((a,b) => b.sell_price - a.sell_price)[0];
    return `အကြံပြုချက်: ${highest.market.name_mm} စျေးကွက်တွင် စျေးအမြင့်ဆုံးဖြစ်ပြီး ${highest.sell_price.toLocaleString()} Ks ရရှိနိုင်ပါသည်။ သယ်ယူစရိတ်နှင့် တွက်ချက်ပြီး ဆုံးဖြတ်ပါ။`;
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးကွက်စျေးနှုန်းများ</h1>
      <p className="page-subtitle">နောက်ဆုံးရ စျေးနှုန်းအချက်အလက်များ</p>

      {/* Filters */}
      <div className="card mb-lg">
        <div className="card-title mb-md">စျေးကွက်ရွေးချယ်ရန်</div>
        <div className="grid-3 mb-md" style={{ gap: 'var(--space-sm)' }}>
          <div className="form-group"><label className="form-label">အမျိုးအစား</label>
            <select className="form-select" value={activeCategoryId} onChange={(e) => setActiveCategoryId(e.target.value)}>
              <option value="">အားလုံး</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name_mm}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">ပြည်နယ်/တိုင်း</label>
            <select className="form-select" value={activeRegionId} onChange={(e) => setActiveRegionId(e.target.value)}>
              <option value="">အားလုံး</option>
              {regions?.map(r => <option key={r.id} value={r.id}>{r.name_mm}</option>)}
            </select>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="filter-bar" style={{ marginTop: 0 }}>
          {filteredProducts.map(p => (
            <button key={p.id} className={`filter-chip ${activeProductId === String(p.id) ? 'active' : ''}`} onClick={() => setActiveProductId(String(p.id))}>
              {p.name_mm}
            </button>
          ))}
          {filteredProducts.length === 0 && <span style={{ color: 'var(--gray-400)', fontSize: 14 }}>သီးနှံ မရှိပါ</span>}
        </div>
      </div>

      {/* Price Summary */}
      <div className="grid-3 mb-lg">
        <div className="stat-card">
          <div className="stat-label">လက်ရှိစျေး ({filteredProducts.find(p=>String(p.id)===activeProductId)?.name_mm || '—'})</div>
          <div className="stat-value">{stats?.current ? `${stats.current.toLocaleString()} Ks` : '—'}</div>
          {stats?.change !== undefined && (
            <div className={`stat-change ${stats.change >= 0 ? 'up' : 'down'}`}>
              {stats.change >= 0 ? '↑' : '↓'} {Math.abs(stats.change).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">အမြင့်ဆုံးစျေး ({activeRange} ရက်)</div>
          <div className="stat-value" style={{ color: 'var(--trend-up)' }}>{stats?.high ? `${stats.high.toLocaleString()} Ks` : '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">အနိမ့်ဆုံးစျေး ({activeRange} ရက်)</div>
          <div className="stat-value" style={{ color: 'var(--trend-down)' }}>{stats?.low ? `${stats.low.toLocaleString()} Ks` : '—'}</div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card mb-lg">
        <div className="card-header">
          <div className="card-title">စျေးနှုန်းပြောင်းလဲမှု ဇယား ({marketData?.[0]?.market?.name_mm || '—'})</div>
          <div className="filter-bar" style={{ margin: 0 }}>
            {[{ d: 7, l: '၇ ရက်' }, { d: 30, l: '၁ လ' }, { d: 90, l: '၃ လ' }].map(r => (
              <button key={r.d} className={`filter-chip ${activeRange === r.d ? 'active' : ''}`} onClick={() => setActiveRange(r.d)}>{r.l}</button>
            ))}
          </div>
        </div>
        <PriceChart data={chartData} loading={chartLoading} />
      </div>

      {/* Market Comparison */}
      <div className="card mb-lg">
        <div className="card-title mb-md">စျေးကွက်အလိုက် နှိုင်းယှဉ်ချက်</div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>စျေးကွက်</th><th>ဒေသ</th><th>စျေးနှုန်း (Ks)</th><th>နောက်ဆုံးပြင်ဆင်ချိန်</th><th>အခြေအနေ</th></tr></thead>
            <tbody>
              {marketLoading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</td></tr> :
                marketData?.length ? marketData.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.market.name_mm}</td>
                    <td>{d.market.region?.name_mm || '—'}</td>
                    <td className="font-mono">{d.sell_price.toLocaleString()}</td>
                    <td style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{getDayDiff(d.created_at)}</td>
                    <td>
                      <span className={`risk-badge ${d.comparison_label === 'higher' ? 'low' : d.comparison_label === 'lower' ? 'high' : 'moderate'}`} style={{ whiteSpace: 'nowrap' }}>
                        {d.comparison_label === 'higher' ? 'မြင့်' : d.comparison_label === 'lower' ? 'နိမ့်' : 'သာမန်'}
                      </span>
                    </td>
                  </tr>
                )) : <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>စျေးနှုန်း အချက်အလက် မရှိသေးပါ</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insight */}
      <div className="insight-card">
        <div className="insight-text"><strong>{getInsight()}</strong></div>
      </div>
    </div>
  );
}
