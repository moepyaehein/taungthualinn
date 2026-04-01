'use client';

import Link from 'next/link';
import { useApi } from '@/lib/useApi';

interface AdminDash {
  stats: { pending_verifications: number; flagged_prices: number; active_merchants: number; active_farmers: number };
  recent_activity: { id: number; action: string; details: string; created_at: string }[];
  active_emergencies: { id: number; title: string; risk_level: string; region?: { name_mm: string } }[];
}

export default function AdminHomePage() {
  const { data, loading } = useApi<AdminDash>('/api/dashboard/admin');

  const s = data?.stats;

  return (
    <div className="tab-panel">
      <h1 className="page-title">စီမံခန့်ခွဲမှု ဒက်ရှ်ဘုတ်</h1>
      <p className="page-subtitle">ပလက်ဖောင်း အခြေအနေ အကျဉ်းချုပ်</p>

      {data?.active_emergencies?.map((e) => (
        <div key={e.id} className="alert-banner danger mb-lg">
          <div><strong>အရေးပေါ်:</strong> {e.title} — {e.region?.name_mm}</div>
        </div>
      ))}

      <div className="grid-4 mb-lg">
        {loading ? [1,2,3,4].map(i => <div key={i} className="stat-card"><div className="stat-label">—</div><div className="stat-value" style={{ opacity: 0.3 }}>...</div></div>) : (<>
          <div className="stat-card"><div className="stat-label">အတည်ပြုရန်</div><div className="stat-value">{s?.pending_verifications || 0}</div></div>
          <div className="stat-card"><div className="stat-label">သံသယ စျေးနှုန်း</div><div className="stat-value">{s?.flagged_prices || 0}</div></div>
          <div className="stat-card"><div className="stat-label">တက်ကြွ ကုန်သည်</div><div className="stat-value">{s?.active_merchants || 0}</div></div>
          <div className="stat-card"><div className="stat-label">တက်ကြွ တောင်သူ</div><div className="stat-value">{s?.active_farmers || 0}</div></div>
        </>)}
      </div>

      <div className="grid-2 mb-lg">
        <div className="card">
          <div className="card-title mb-md">မြန်ဆန်လုပ်ဆောင်ချက်</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link href="/admin/verify" className="btn btn-primary">စျေးစစ်ဆေးရန်</Link>
            <Link href="/admin/users" className="btn btn-primary">အသုံးပြုသူစီမံ</Link>
            <Link href="/admin/emergency" className="btn btn-danger">အရေးပေါ်</Link>
            <Link href="/admin/settings" className="btn btn-primary">ဆက်တင်များ</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-title mb-md">မကြာသေးမီ လုပ်ဆောင်မှု</div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            {data?.recent_activity?.length ? data.recent_activity.slice(0, 5).map((a) => (
              <div key={a.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>
                {a.details || a.action}
                <span style={{ color: 'var(--gray-400)', marginLeft: 8 }}>{new Date(a.created_at).toLocaleString('my-MM', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )) : <p style={{ color: 'var(--gray-400)' }}>လုပ်ဆောင်မှု မရှိသေးပါ</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
