'use client';

import { useState } from 'react';
import { useApi, apiPost } from '@/lib/useApi';

interface Product { id: number; name_mm: string; }
interface Record { id: number; sale_date: string | null; product?: { name_mm: string }; harvest_qty: number | null; sale_price: number | null; total_amount: number | null; }
interface RecordsResponse { data: Record[]; summary: { total_sold: number; total_revenue: number; avg_price: number; record_count: number } }

export default function RecordsPage() {
  const { data: raw, loading, refetch } = useApi<RecordsResponse>('/api/records');
  const { data: products } = useApi<Product[]>('/api/products');

  const [productId, setProductId] = useState('');
  const [harvestQty, setHarvestQty] = useState('');
  const [storageQty, setStorageQty] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const records = Array.isArray(raw) ? raw : (raw as RecordsResponse)?.data || [];
  const summary = (raw as RecordsResponse)?.summary;

  const effectiveProductId = productId || (products?.[0] ? String(products[0].id) : '');

  const handleSubmit = async () => {
    if (!effectiveProductId || !harvestQty) { setMsg('သီးနှံနှင့် ပမာဏ ထည့်ပါ'); return; }
    setSubmitting(true);
    setMsg('');
    const { error } = await apiPost('/api/records', {
      product_id: parseInt(effectiveProductId),
      harvest_qty: parseInt(harvestQty),
      storage_qty: storageQty ? parseInt(storageQty) : 0,
      sale_date: saleDate || null,
      sale_price: salePrice ? parseInt(salePrice) : null,
    });
    if (error) { setMsg(`Error: ${error}`); }
    else {
      setMsg('မှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ ✓');
      setHarvestQty(''); setStorageQty(''); setSaleDate(''); setSalePrice('');
      refetch();
    }
    setSubmitting(false);
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">စမတ် တောင်သူမှတ်တမ်း</h1>
      <p className="page-subtitle">သင့်ရောင်းချမှတ်တမ်းများ ခွဲခြမ်းစိတ်ဖြာပါ</p>

      {/* Record Entry */}
      <div className="card mb-lg">
        <div className="card-title mb-md">မှတ်တမ်းအသစ် ထည့်သွင်းရန်</div>
        {msg && <div className={`alert-banner ${msg.includes('Error') ? 'danger' : 'success'} mb-md`}><div>{msg}</div></div>}
        <div className="record-form">
          <div className="form-group">
            <label className="form-label">သီးနှံအမျိုးအစား</label>
            <select className="form-select" value={effectiveProductId} onChange={(e) => setProductId(e.target.value)}>
              {products?.map((p) => <option key={p.id} value={p.id}>{p.name_mm}</option>)}
              {!products?.length && <option>ခဏစောင့်ပါ...</option>}
            </select>
          </div>
          <div className="form-group"><label className="form-label">ရိတ်သိမ်းပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၁၀၀" value={harvestQty} onChange={(e) => setHarvestQty(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">သိုလှောင်ပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၈၀" value={storageQty} onChange={(e) => setStorageQty(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">ရောင်းချရက်</label><input type="date" className="form-input" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">ရောင်းစျေး (ကျပ်/တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၀၀၀၀" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} /></div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'သိမ်းဆည်းနေသည်...' : 'သိမ်းဆည်းရန်'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း ရောင်းချ</div><div className="stat-value">{summary ? `${summary.total_sold} တင်း` : '—'}</div></div>
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း ဝင်ငွေ</div><div className="stat-value">{summary ? `${(summary.total_revenue / 100000).toFixed(1)} သိန်း` : '—'}</div></div>
        <div className="stat-card"><div className="stat-label">ပျမ်းမျှ ရောင်းစျေး</div><div className="stat-value">{summary ? `${summary.avg_price.toLocaleString()} Ks` : '—'}</div></div>
        <div className="stat-card"><div className="stat-label">မှတ်တမ်း အရေအတွက်</div><div className="stat-value">{summary?.record_count || 0}</div></div>
      </div>

      {/* Records Table */}
      <div className="card">
        <div className="card-title mb-md">ရောင်းချမှတ်တမ်း စာရင်း</div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ရက်စွဲ</th><th>သီးနှံ</th><th>ပမာဏ</th><th>စျေးနှုန်း</th><th>စုစုပေါင်း</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</td></tr> :
                records.length ? records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.sale_date || '—'}</td>
                    <td>{r.product?.name_mm || '—'}</td>
                    <td>{r.harvest_qty || 0} တင်း</td>
                    <td>{r.sale_price?.toLocaleString() || '—'}</td>
                    <td>{r.total_amount ? `${(r.total_amount / 100000).toFixed(1)} သိန်း` : '—'}</td>
                  </tr>
                )) : <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>မှတ်တမ်း မရှိသေးပါ</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
