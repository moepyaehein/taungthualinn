'use client';

import Link from 'next/link';
import { useApi } from '@/lib/useApi';

interface MerchantDash {
  stats: { today_submissions: number; pending_peer_review: number; verified_this_week: number; emergency_requests: number };
  my_listings: { id: number; product?: { name_mm: string }; region?: { name_mm: string }; target_price: number; quantity: number; status: string }[];
  unread_notifications: { id: number; title: string; body: string; created_at: string }[];
}

export default function MerchantHomePage() {
  const { data, loading } = useApi<MerchantDash>('/api/dashboard/merchant');

  const s = data?.stats;

  return (
    <div className="tab-panel">
      <h1 className="page-title">ကုန်သည် ဒက်ရှ်ဘုတ်</h1>
      <p className="page-subtitle">ယနေ့ အခြေအနေ အကျဉ်းချုပ်</p>

      {(s?.emergency_requests || 0) > 0 && (
        <div className="alert-banner danger mb-lg"><div><strong>အရေးပေါ်:</strong> အရေးပေါ်ဝယ်ယူသူ {s?.emergency_requests} ဦး လိုအပ်နေပါသည်။</div></div>
      )}

      <div className="grid-4 mb-lg">
        {loading ? [1,2,3,4].map(i => <div key={i} className="stat-card"><div className="stat-label">—</div><div className="stat-value" style={{ opacity: 0.3 }}>...</div></div>) : (<>
          <div className="stat-card"><div className="stat-label">ယနေ့ စျေးတင်သွင်းမှု</div><div className="stat-value">{s?.today_submissions || 0}</div></div>
          <div className="stat-card"><div className="stat-label">စစ်ဆေးရန် စောင့်မှု</div><div className="stat-value">{s?.pending_peer_review || 0}</div></div>
          <div className="stat-card"><div className="stat-label">ယခုအပတ် အတည်ပြုပြီး</div><div className="stat-value">{s?.verified_this_week || 0}</div></div>
          <div className="stat-card"><div className="stat-label">အရေးပေါ် တောင်းဆိုမှု</div><div className="stat-value">{s?.emergency_requests || 0}</div></div>
        </>)}
      </div>

      <h2 className="section-title mb-md">မြန်ဆန်လုပ်ဆောင်ချက်</h2>
      <div className="quick-actions-grid mb-lg">
        <Link href="/merchant/price" className="btn btn-primary">စျေးတင်ရန်</Link>
        <Link href="/merchant/recommendation" className="btn btn-merchant">AI အကြံပြု</Link>
        <Link href="/merchant/listings" className="btn btn-primary">ကမ်းလှမ်းချက်အသစ်</Link>
        <Link href="/merchant/verify" className="btn btn-primary">စျေးအတည်ပြုရန်</Link>
        <Link href="/merchant/emergency" className="btn btn-danger">အရေးပေါ်ဝယ်ရန်</Link>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-md">တက်ကြွ ကမ်းလှမ်းချက်များ</div>
          {data?.my_listings?.length ? data.my_listings.map((l) => (
            <div key={l.id} className="buyer-card">
              <div className="buyer-info">
                <div className="buyer-name">{l.product?.name_mm} — {l.quantity} တင်း</div>
                <div className="buyer-detail">{l.region?.name_mm} • {l.target_price.toLocaleString()} Ks/တင်း</div>
              </div>
              <span className="verify-badge verified">{l.status === 'active' ? 'တက်ကြွ' : l.status}</span>
            </div>
          )) : <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-400)' }}>ကမ်းလှမ်းချက် မရှိသေးပါ</p>}
        </div>
        <div className="card">
          <div className="card-title mb-md">မကြာသေးမီ အသိပေးချက်</div>
          {data?.unread_notifications?.length ? data.unread_notifications.map((n) => (
            <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 'var(--font-sm)' }}>
              {n.title}<br /><span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-xs)' }}>{new Date(n.created_at).toLocaleDateString('my-MM')}</span>
            </div>
          )) : <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-400)' }}>အသိပေးချက် မရှိသေးပါ</p>}
        </div>
      </div>
    </div>
  );
}
