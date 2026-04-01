'use client';

import { useState, useEffect } from 'react';
import { useApi, apiPost, apiPatch, apiDelete } from '@/lib/useApi';

interface Product { id: number; name_mm: string; }
interface Region { id: number; name_mm: string; }
interface Listing {
  id: number; type: string; quantity: number; target_price: number; status: string;
  product?: { name_mm: string }; region?: { name_mm: string }; pickup_available: boolean;
}

export default function ListingsPage() {
  const { data: listings, loading, refetch } = useApi<Listing[]>('/api/listings');
  const { data: products } = useApi<Product[]>('/api/products');
  const { data: regions } = useApi<Region[]>('/api/regions');

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [regionId, setRegionId] = useState('');
  const [availability, setAvailability] = useState('immediate');
  const [pickup, setPickup] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (products?.length && !productId) setProductId(String(products[0].id)); }, [products, productId]);
  useEffect(() => { if (regions?.length && !regionId) setRegionId(String(regions[0].id)); }, [regions, regionId]);

  const handleCreate = async () => {
    if (!productId || !quantity || !targetPrice) { setMsg('အချက်အလက် အပြည့်အစုံ ထည့်ပါ'); return; }
    setSubmitting(true);
    const { error } = await apiPost('/api/listings', {
      type, product_id: parseInt(productId), quantity: parseInt(quantity),
      target_price: parseInt(targetPrice), region_id: parseInt(regionId),
      availability, pickup_available: pickup,
    });
    if (error) { setMsg(`Error: ${error}`); }
    else { setMsg('ကမ်းလှမ်းချက် ဖန်တီးပြီး ✓'); setShowForm(false); setQuantity(''); setTargetPrice(''); refetch(); }
    setSubmitting(false);
  };

  const handlePause = async (id: number) => {
    await apiPatch(`/api/listings/${id}`, { status: 'paused' });
    refetch();
  };

  const handleResume = async (id: number) => {
    await apiPatch(`/api/listings/${id}`, { status: 'active' });
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ဖျက်ရန် သေချာပါသလား?')) return;
    await apiDelete(`/api/listings/${id}`);
    refetch();
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">ကမ်းလှမ်းချက်စီမံခန့်ခွဲမှု</h1>
      <p className="page-subtitle">ဝယ်ယူ/ရောင်းချ ကမ်းလှမ်းချက်များ စီမံရန်</p>

      <div className="flex justify-between items-center mb-lg"><div></div><button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>ကမ်းလှမ်းချက်အသစ်</button></div>

      {msg && <div className={`alert-banner ${msg.includes('Error') ? 'danger' : 'success'} mb-lg`}><div>{msg}</div></div>}

      {showForm && (
        <div className="card mb-lg" style={{ animation: 'fadeIn 0.25s ease' }}>
          <div className="card-title mb-md">ကမ်းလှမ်းချက်အသစ် ဖန်တီးရန်</div>
          <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
            <div className="form-group"><label className="form-label">အမျိုးအစား</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value as 'buy' | 'sell')}>
                <option value="buy">ဝယ်ယူလိုသည်</option><option value="sell">ရောင်းလိုသည်</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">ထုတ်ကုန်</label>
              <select className="form-select" value={productId} onChange={(e) => setProductId(e.target.value)}>
                {products?.map(p => <option key={p.id} value={p.id}>{p.name_mm}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">ပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၀၀" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">ပစ်မှတ်စျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၂,၀၀၀" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">ဒေသ</label>
              <select className="form-select" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
                {regions?.map(r => <option key={r.id} value={r.id}>{r.name_mm}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">ရယူနိုင်မှု</label>
              <select className="form-select" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                <option value="immediate">ယခုချက်ချင်း</option><option value="1_week">၁ ပတ်အတွင်း</option><option value="2_weeks">၂ ပတ်အတွင်း</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label"><input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} /> လာရောက်ယူရန် ရနိုင်ပါသည်</label></div>
          <button className="btn btn-primary" onClick={handleCreate} disabled={submitting}>{submitting ? 'ဖန်တီးနေသည်...' : 'ဖန်တီးရန်'}</button>
        </div>
      )}

      <div className="card">
        <div className="card-title mb-md">ကမ်းလှမ်းချက်များ</div>
        {loading ? <p style={{ color: 'var(--gray-400)', padding: '20px' }}>ခဏစောင့်ပါ...</p> :
          listings?.length ? listings.map((l) => (
            <div key={l.id} className="buyer-card">
              <div className="buyer-avatar" style={{ background: l.type === 'buy' ? '#4f46e5' : '#059669' }}>{l.type === 'buy' ? 'ဝ' : 'ရ'}</div>
              <div className="buyer-info">
                <div className="buyer-name">{l.product?.name_mm} {l.quantity} တင်း {l.type === 'buy' ? 'ဝယ်လိုသည်' : 'ရောင်းလိုသည်'}</div>
                <div className="buyer-detail">{l.region?.name_mm} • {l.target_price.toLocaleString()} Ks/တင်း {l.pickup_available ? '• လာယူရန်ရနိုင်' : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className={`verify-badge ${l.status === 'active' ? 'verified' : 'pending'}`}>{l.status === 'active' ? 'တက်ကြွ' : l.status === 'paused' ? 'ခေတ္တရပ်' : l.status}</span>
                {l.status === 'active' && <button className="btn btn-sm btn-outline" onClick={() => handlePause(l.id)}>ရပ်</button>}
                {l.status === 'paused' && <button className="btn btn-sm btn-primary" onClick={() => handleResume(l.id)}>ပြန်ဖွင့်</button>}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(l.id)}>ဖျက်</button>
              </div>
            </div>
          )) : <p style={{ color: 'var(--gray-400)', padding: '20px' }}>ကမ်းလှမ်းချက် မရှိသေးပါ</p>}
      </div>
    </div>
  );
}
