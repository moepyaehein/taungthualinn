'use client';

import { useState, useEffect } from 'react';
import { useApi, apiPost } from '@/lib/useApi';

interface Category { id: number; name_mm: string; }
interface Product { id: number; name_mm: string; category_id: number; }
interface Region { id: number; name_mm: string; }
interface PriceSub { id: number; buy_price: number; sell_price: number; status: string; created_at: string; product?: { name_mm: string }; market?: { name_mm: string }; }

export default function PricePage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const { data: categories } = useApi<Category[]>('/api/categories');
  const { data: allProducts } = useApi<Product[]>('/api/products');
  const { data: regions } = useApi<Region[]>('/api/regions');
  const { data: recentPrices, refetch } = useApi<PriceSub[]>('/api/prices');

  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [marketId, setMarketId] = useState('1'); // default
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quality, setQuality] = useState('standard');
  const [unit, setUnit] = useState('basket');
  const [frequency, setFrequency] = useState('daily');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const filteredProducts = allProducts?.filter(p => !categoryId || p.category_id === parseInt(categoryId)) || [];

  useEffect(() => {
    if (categories?.length && !categoryId) setCategoryId(String(categories[0].id));
  }, [categories, categoryId]);

  useEffect(() => {
    if (filteredProducts.length && !productId) setProductId(String(filteredProducts[0].id));
  }, [filteredProducts, productId]);

  useEffect(() => {
    if (regions?.length && !regionId) setRegionId(String(regions[0].id));
  }, [regions, regionId]);

  const handleSubmit = async () => {
    if (!productId || !buyPrice || !sellPrice) { setMsg('ထုတ်ကုန်နှင့် စျေးနှုန်း ထည့်ပါ'); return; }
    setSubmitting(true);
    setMsg('');
    const { error } = await apiPost('/api/prices', {
      product_id: parseInt(productId),
      market_id: parseInt(marketId),
      buy_price: parseInt(buyPrice),
      sell_price: parseInt(sellPrice),
      quality,
      unit,
      frequency,
      notes: notes || null,
    });
    if (error) { setMsg(`Error: ${error}`); }
    else {
      setMsg('စျေးနှုန်း တင်သွင်းပြီးပါပြီ ✓');
      setBuyPrice(''); setSellPrice(''); setNotes('');
      refetch();
    }
    setSubmitting(false);
  };

  const statusLabels: Record<string, string> = { pending: 'စောင့်ဆဲ', peer_verified: 'ကုန်သည်စစ်ပြီး', admin_verified: 'အတည်ပြုပြီး', flagged: 'သံသယ', rejected: 'ပယ်ပြီး' };
  const statusClass: Record<string, string> = { pending: 'pending', peer_verified: 'peer', admin_verified: 'verified', flagged: 'flagged', rejected: 'flagged' };

  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးနှုန်းတင်သွင်းခြင်း</h1>
      <p className="page-subtitle">တစ်ခုချင်း သို့မဟုတ် CSV ဖိုင်ဖြင့် အစုလိုက် တင်သွင်းနိုင်ပါသည်</p>

      {/* Mode Toggle */}
      <div className="card mb-lg" style={{ padding: '6px', display: 'inline-flex', gap: '4px', borderRadius: 'var(--radius-full)' }}>
        <button onClick={() => setMode('single')} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: 'var(--font-sm)', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', background: mode === 'single' ? 'var(--primary-600)' : 'transparent', color: mode === 'single' ? '#fff' : 'var(--gray-500)' }}>📝 တစ်ခုချင်းတင်</button>
        <button onClick={() => setMode('bulk')} style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: 'var(--font-sm)', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', background: mode === 'bulk' ? '#4f46e5' : 'transparent', color: mode === 'bulk' ? '#fff' : 'var(--gray-500)' }}>📁 အစုလိုက်တင်</button>
      </div>

      {msg && <div className={`alert-banner ${msg.includes('Error') ? 'danger' : 'success'} mb-lg`}><div>{msg}</div></div>}

      {/* Single Price Upload */}
      {mode === 'single' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card mb-lg">
            <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)', fontWeight: 700, color: '#fff', background: 'var(--primary-600)' }}>၁</span>
              ထုတ်ကုန်နှင့် စျေးကွက် ရွေးချယ်ပါ
            </div>
            <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
              <div className="form-group"><label className="form-label">အမျိုးအစား</label>
                <select className="form-select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setProductId(''); }}>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name_mm}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">ထုတ်ကုန်</label>
                <select className="form-select" value={productId} onChange={(e) => setProductId(e.target.value)}>
                  {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name_mm}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">ပြည်နယ်/တိုင်း</label>
                <select className="form-select" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
                  {regions?.map(r => <option key={r.id} value={r.id}>{r.name_mm}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">ယူနစ်</label>
                <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="basket">တစ်တင်း</option><option value="viss">တစ်ပိဿာ</option><option value="ton">တစ်တန်</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">မွမ်းမံနှုန်း</label>
                <select className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="daily">နေ့စဉ်</option><option value="weekly">အပတ်စဉ်</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--gray-100)' }}>
              <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)', fontWeight: 700, color: '#fff', background: 'var(--primary-600)' }}>၂</span>
                စျေးနှုန်း ထည့်သွင်းပါ
              </div>
              <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
                <div className="form-group"><label className="form-label">ဝယ်စျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၀,၀၀၀" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">ရောင်းစျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၂,၅၀၀" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} /></div>
                <div className="form-group"><label className="form-label">အရည်အသွေး</label>
                  <select className="form-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
                    <option value="standard">ပုံမှန်</option><option value="high">အရည်အသွေးမြင့်</option><option value="low">အရည်အသွေးနိမ့်</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">မှတ်ချက်</label><textarea className="form-input" rows={2} placeholder="ဥပမာ — ဝယ်လိုအားကောင်း၊ ပမာဏများ" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'တင်သွင်းနေသည်...' : 'တင်သွင်းရန်'}
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'bulk' && (
        <div className="card mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-title mb-md">📁 CSV / Excel ဖိုင်ဖြင့် တင်သွင်းရန်</div>
          <div className="upload-zone" style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>📤</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', marginBottom: 8, color: 'var(--gray-700)' }}>ဖိုင်ရွေးရန် နှိပ်ပါ သို့ ဒီနေရာသို့ ဆွဲချပါ</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>CSV, Excel (.xlsx, .xls) ဖိုင်များ ထောက်ပံ့ပါသည်</div>
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card-title mb-md">မကြာသေးမီ တင်သွင်းမှုများ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ရက်စွဲ</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်းစျေး</th><th>အခြေအနေ</th></tr></thead>
          <tbody>
            {recentPrices?.length ? recentPrices.slice(0, 10).map((p) => (
              <tr key={p.id}>
                <td>{new Date(p.created_at).toLocaleDateString('my-MM')}</td>
                <td>{p.product?.name_mm || '—'}</td>
                <td>{p.market?.name_mm || '—'}</td>
                <td>{p.buy_price.toLocaleString()} / {p.sell_price.toLocaleString()}</td>
                <td><span className={`verify-badge ${statusClass[p.status] || 'pending'}`}>{statusLabels[p.status] || p.status}</span></td>
              </tr>
            )) : <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>တင်သွင်းမှု မရှိသေးပါ</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
