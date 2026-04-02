'use client';

import { useMemo, useState } from 'react';

import { apiPost, useApi } from '@/lib/useApi';

interface Category {
  id: number;
  name_mm: string;
}

interface Product {
  id: number;
  name_mm: string;
  category_id: number;
}

interface Market {
  id: number;
  name_mm: string;
  region_id: number;
}

interface Region {
  id: number;
  name_mm: string;
  markets?: Market[];
}

interface PriceSub {
  id: number;
  buy_price: number;
  sell_price: number;
  status: string;
  created_at: string;
  product?: { name_mm: string };
  market?: { name_mm: string };
}

export default function PricePage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const { data: categories } = useApi<Category[]>('/api/categories');
  const { data: allProducts } = useApi<Product[]>('/api/products');
  const { data: regions } = useApi<Region[]>('/api/regions');
  const { data: recentPrices, refetch } = useApi<PriceSub[]>('/api/prices');

  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [marketId, setMarketId] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quality, setQuality] = useState('standard');
  const [unit, setUnit] = useState('basket');
  const [frequency, setFrequency] = useState('daily');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const effectiveCategoryId = categoryId || (categories?.[0] ? String(categories[0].id) : '');
  const filteredProducts = useMemo(
    () => allProducts?.filter((product) => !effectiveCategoryId || product.category_id === parseInt(effectiveCategoryId, 10)) || [],
    [allProducts, effectiveCategoryId],
  );

  const effectiveProductId =
    productId && filteredProducts.find((product) => String(product.id) === productId)
      ? productId
      : filteredProducts[0]
        ? String(filteredProducts[0].id)
        : '';

  const effectiveRegionId = regionId || (regions?.[0] ? String(regions[0].id) : '');
  const regionMarkets = useMemo(
    () => regions?.find((region) => String(region.id) === effectiveRegionId)?.markets || [],
    [effectiveRegionId, regions],
  );

  const effectiveMarketId =
    marketId && regionMarkets.find((market) => String(market.id) === marketId)
      ? marketId
      : regionMarkets[0]
        ? String(regionMarkets[0].id)
        : '';

  const pendingCount = recentPrices?.filter((price) => price.status === 'pending').length || 0;
  const approvedCount =
    recentPrices?.filter((price) => ['peer_verified', 'admin_verified'].includes(price.status)).length || 0;

  async function handleSubmit() {
    if (!effectiveProductId || !effectiveMarketId || !buyPrice || !sellPrice) {
      setMsg('ထုတ်ကုန်၊ ဈေးကွက် နှင့် ဈေးနှုန်းများကို ဖြည့်ပေးပါ');
      return;
    }

    setSubmitting(true);
    setMsg('');

    const { error } = await apiPost('/api/prices', {
      product_id: parseInt(effectiveProductId, 10),
      market_id: parseInt(effectiveMarketId, 10),
      buy_price: parseInt(buyPrice, 10),
      sell_price: parseInt(sellPrice, 10),
      quality,
      unit,
      frequency,
      notes: notes || null,
    });

    if (error) {
      setMsg(`Error: ${error}`);
    } else {
      setMsg('စျေးနှုန်း တင်သွင်းပြီးပါပြီ ✓');
      setBuyPrice('');
      setSellPrice('');
      setNotes('');
      refetch();
    }

    setSubmitting(false);
  }

  const statusLabels: Record<string, string> = {
    pending: 'စောင့်ဆိုင်း',
    peer_verified: 'ကုန်သည်စစ်ပြီး',
    admin_verified: 'အတည်ပြုပြီး',
    flagged: 'သံသယ',
    rejected: 'ပယ်ပြီး',
  };

  const statusClass: Record<string, string> = {
    pending: 'pending',
    peer_verified: 'peer',
    admin_verified: 'verified',
    flagged: 'flagged',
    rejected: 'flagged',
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးနှုန်းတင်သွင်းခြင်း</h1>
      <p className="page-subtitle">တစ်ခုချင်း တင်နိုင်သလို စမ်းသပ်မှုအတွက် portal data flow ကိုလည်း ဒီနေရာကနေ စနိုင်ပါတယ်။</p>

      <div
        className="card mb-lg"
        style={{
          border: '1px solid rgba(5, 150, 105, 0.18)',
          background: 'linear-gradient(135deg, rgba(5,150,105,0.06), rgba(14,165,233,0.04))',
        }}
      >
        <div className="card-title mb-md">Live retraining test flow</div>
        <div style={{ display: 'grid', gap: '10px', fontSize: 'var(--font-sm)', color: 'var(--gray-600)' }}>
          <div>1. အောက်က form နဲ့ merchant price တင်ပါ။</div>
          <div>2. Admin က verify လုပ်နိုင်သလို demo retrain အတွက် pending row ကိုပါ သုံးနိုင်ပါတယ်။</div>
          <div>3. Admin dashboard ထဲက ML panel ကနေ retraining စပါ။</div>
          <div>4. နောက် train မော်ဒယ်ထဲမှာ live portal row တွေ ပါလာမယ်။</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'var(--space-md)' }}>
          <span className="verify-badge pending">Pending submissions: {pendingCount}</span>
          <span className="verify-badge verified">Approved submissions: {approvedCount}</span>
        </div>
      </div>

      <div className="card mb-lg" style={{ padding: '6px', display: 'inline-flex', gap: '4px', borderRadius: 'var(--radius-full)' }}>
        <button
          onClick={() => setMode('single')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: 'var(--font-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: mode === 'single' ? 'var(--primary-600)' : 'transparent',
            color: mode === 'single' ? '#fff' : 'var(--gray-500)',
          }}
        >
          Single submit
        </button>
        <button
          onClick={() => setMode('bulk')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: 'var(--font-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: mode === 'bulk' ? '#4f46e5' : 'transparent',
            color: mode === 'bulk' ? '#fff' : 'var(--gray-500)',
          }}
        >
          Bulk upload
        </button>
      </div>

      {msg && (
        <div className={`alert-banner ${msg.includes('Error') ? 'danger' : 'success'} mb-lg`}>
          <div>{msg}</div>
        </div>
      )}

      {mode === 'single' && (
        <div className="card mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-title mb-md">ထုတ်ကုန်နှင့် ဈေးကွက် ရွေးချယ်ပါ</div>

          <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
            <div className="form-group">
              <label className="form-label">အမျိုးအစား</label>
              <select
                className="form-select"
                value={effectiveCategoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setProductId('');
                }}
              >
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_mm}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ထုတ်ကုန်</label>
              <select className="form-select" value={effectiveProductId} onChange={(e) => setProductId(e.target.value)}>
                {filteredProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name_mm}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ပြည်နယ်/တိုင်း</label>
              <select
                className="form-select"
                value={effectiveRegionId}
                onChange={(e) => {
                  setRegionId(e.target.value);
                  setMarketId('');
                }}
              >
                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name_mm}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ဈေးကွက်</label>
              <select
                className="form-select"
                value={effectiveMarketId}
                onChange={(e) => setMarketId(e.target.value)}
                disabled={!regionMarkets.length}
              >
                {regionMarkets.length ? (
                  regionMarkets.map((market) => (
                    <option key={market.id} value={market.id}>
                      {market.name_mm}
                    </option>
                  ))
                ) : (
                  <option value="">ဈေးကွက် မရှိသေးပါ</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ယူနစ်</label>
              <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="basket">တစ်တင်း</option>
                <option value="viss">တစ်ပိဿာ</option>
                <option value="ton">တစ်တန်</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">မွမ်းမံနှုန်း</label>
              <select className="form-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="daily">နေ့စဉ်</option>
                <option value="weekly">အပတ်စဉ်</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--gray-100)' }}>
            <div className="card-title mb-md">စျေးနှုန်း ထည့်သွင်းပါ</div>
            <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
              <div className="form-group">
                <label className="form-label">ဝယ်ဈေး (Ks)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="ဥပမာ - 7800"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ရောင်းဈေး (Ks)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="ဥပမာ - 8050"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">အရည်အသွေး</label>
                <select className="form-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
                  <option value="standard">ပုံမှန်</option>
                  <option value="high">အရည်အသွေးမြင့်</option>
                  <option value="low">အရည်အသွေးနိမ့်</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">မှတ်ချက်</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="ဥပမာ - စမ်းသပ်တင်သွင်းခြင်းအတွက် မှတ်ချက်"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'တင်သွင်းနေသည်...' : 'တင်သွင်းရန်'}
            </button>
          </div>
        </div>
      )}

      {mode === 'bulk' && (
        <div className="card mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card-title mb-md">Bulk upload</div>
          <div className="upload-zone" style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>Upload</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', marginBottom: 8, color: 'var(--gray-700)' }}>
              CSV / Excel flow is ready for later
            </div>
            <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>
              Start with single submissions first so we can verify live retraining end-to-end.
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card-title mb-md">Recent submissions</div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Market</th>
                <th>Buy / Sell</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPrices?.length ? (
                recentPrices.slice(0, 10).map((price) => (
                  <tr key={price.id}>
                    <td>{new Date(price.created_at).toLocaleDateString('en-US')}</td>
                    <td>{price.product?.name_mm || '-'}</td>
                    <td>{price.market?.name_mm || '-'}</td>
                    <td>
                      {price.buy_price.toLocaleString()} / {price.sell_price.toLocaleString()}
                    </td>
                    <td>
                      <span className={`verify-badge ${statusClass[price.status] || 'pending'}`}>
                        {statusLabels[price.status] || price.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
