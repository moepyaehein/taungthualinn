'use client';

import { useState } from 'react';
import { useApi } from '@/lib/useApi';

interface AuditEntry {
  id: number; action: string; details: string | null; created_at: string;
  user?: { full_name: string; role: string };
}

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [fromDate, setFromDate] = useState('');

  const url = `/api/audit?${actionFilter ? `action=${actionFilter}&` : ''}${fromDate ? `from_date=${fromDate}` : ''}`;
  const { data: logs, loading } = useApi<AuditEntry[]>(url);

  const actionLabels: Record<string, string> = {
    price_submitted: 'စျေးတင်သွင်း',
    price_approved: 'စျေးအတည်ပြု',
    price_rejected: 'စျေးပယ်',
    price_flagged: 'စျေးသံသယ',
    price_verified: 'ကုန်သည်စစ်ပြီး',
    listing_created: 'ကမ်းလှမ်းချက်',
    emergency_created: 'အရေးပေါ်ထုတ်ပြန်',
    user_updated: 'အသုံးပြုသူပြင်ဆင်',
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">Audit မှတ်တမ်း</h1>
      <p className="page-subtitle">ပလက်ဖောင်း လုပ်ဆောင်မှုမှတ်တမ်းများ</p>

      <div className="flex gap-md mb-lg flex-wrap">
        <select className="form-select" style={{ width: 'auto' }} value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="">အားလုံး</option>
          <option value="price_approved">အတည်ပြု</option>
          <option value="price_rejected">ပယ်ငြင်းပယ်</option>
          <option value="price_flagged">သံသယ</option>
          <option value="emergency_created">ထုတ်ပြန်</option>
          <option value="listing_created">ကမ်းလှမ်းချက်</option>
        </select>
        <input type="date" className="form-input" style={{ width: 'auto' }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>

      <div className="card">
        {loading ? <p style={{ padding: '20px', color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</p> :
          logs?.length ? logs.map((a) => (
            <div key={a.id} className="audit-row">
              <div>
                <strong>{a.user?.full_name || 'System'}</strong> — {a.details || actionLabels[a.action] || a.action}
                <br />
                <span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-xs)' }}>
                  {new Date(a.created_at).toLocaleString('my-MM', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )) : <p style={{ padding: '20px', color: 'var(--gray-400)' }}>မှတ်တမ်း မရှိသေးပါ</p>}
      </div>
    </div>
  );
}
