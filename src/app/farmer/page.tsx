'use client';

import Link from 'next/link';
import { useApi } from '@/lib/useApi';

interface DashboardData {
  profile: { full_name: string; region?: { name_mm: string } };
  latest_prices: { sell_price: number; product?: { name_mm: string }; market?: { name_mm: string } }[];
  emergencies: { title: string; risk_level: string; region?: { name_mm: string } }[];
  unread_notifications: { title: string; created_at: string }[];
}

export default function FarmerHomePage() {
  const { data, loading } = useApi<DashboardData>('/api/dashboard/farmer');

  const userName = data?.profile?.full_name || 'တောင်သူ';
  const regionName = data?.profile?.region?.name_mm || '';
  const topPrice = data?.latest_prices?.[0];
  const emergency = data?.emergencies?.[0];

  const today = new Date();
  const dateStr = `${today.getFullYear()} ${['ဇန်နဝါရီ','ဖေဖော်ဝါရီ','မတ်','ဧပြီ','မေ','ဇွန်','ဇူလိုင်','ဩဂုတ်','စက်တင်ဘာ','အောက်တိုဘာ','နိုဝင်ဘာ','ဒီဇင်ဘာ'][today.getMonth()]}လ ${today.getDate()} ရက်`;

  return (
    <div className="tab-panel">
      <h1 className="page-title">မင်္ဂလာပါ၊ {userName}</h1>
      <p className="page-subtitle">ယနေ့ {dateStr} — {regionName}</p>

      {emergency && (
        <div className="alert-banner warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <div><strong>သတိပေးချက်:</strong> {emergency.title} — {emergency.region?.name_mm}</div>
        </div>
      )}

      {loading ? (
        <div className="grid-3 mb-lg">
          {[1,2,3].map(i => <div key={i} className="stat-card"><div className="stat-label">ခဏစောင့်ပါ...</div><div className="stat-value" style={{ opacity: 0.3 }}>—</div></div>)}
        </div>
      ) : (
        <div className="grid-3 mb-lg">
          <div className="stat-card">
            <div className="stat-label">{topPrice?.product?.name_mm || 'စျေးနှုန်း'} (တစ်တင်း)</div>
            <div className="stat-value">{topPrice ? `${topPrice.sell_price.toLocaleString()} Ks` : '—'}</div>
            <div className="stat-change up">{topPrice?.market?.name_mm || ''}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">မဖတ်ရသေးသော အသိပေးချက်</div>
            <div className="stat-value">{data?.unread_notifications?.length || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">အရေးပေါ် သတိပေးချက်</div>
            <div className="stat-value" style={{ color: (data?.emergencies?.length || 0) > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {data?.emergencies?.length || 0}
            </div>
          </div>
        </div>
      )}

      <h2 className="section-title mb-md">မြန်ဆန်သောလမ်းညွှန်</h2>
      <div className="grid-4">
        <Link href="/farmer/market" className="quick-link">
          <div><div className="quick-link-text">စျေးနှုန်းများ</div><div className="quick-link-desc">ယနေ့စျေးကွက်ကြည့်ရန်</div></div>
        </Link>
        <Link href="/farmer/recommendation" className="quick-link">
          <div><div className="quick-link-text">AI အကြံပြု</div><div className="quick-link-desc">ရောင်းရမလား စောင့်ရမလား</div></div>
        </Link>
        <Link href="/farmer/emergency" className="quick-link">
          <div><div className="quick-link-text">အရေးပေါ်</div><div className="quick-link-desc">ဘေးအန္တရာယ်သတိပေးချက်</div></div>
        </Link>
        <Link href="/farmer/records" className="quick-link">
          <div><div className="quick-link-text">မှတ်တမ်းများ</div><div className="quick-link-desc">ကိုယ်ပိုင်ရောင်းချမှတ်တမ်း</div></div>
        </Link>
      </div>
    </div>
  );
}
