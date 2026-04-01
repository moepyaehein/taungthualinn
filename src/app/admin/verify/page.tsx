'use client';

import { useState } from 'react';
import { useApi, apiPatch } from '@/lib/useApi';

interface PriceSub {
  id: number; buy_price: number; sell_price: number; status: string; created_at: string;
  merchant?: { full_name: string; trust_level: string };
  product?: { name_mm: string };
  market?: { name_mm: string; region_id: number };
}

const statusLabels: Record<string, string> = { pending: 'စောင့်ဆဲ', peer_verified: 'ကုန်သည်စစ်ပြီး', admin_verified: 'အတည်ပြုပြီး', flagged: 'သံသယ', rejected: 'ပယ်ပြီး' };
const statusColors: Record<string, string> = { pending: 'var(--warning)', peer_verified: 'var(--info, #3b82f6)', admin_verified: 'var(--success)', flagged: 'var(--danger)', rejected: 'var(--gray-500)' };

export default function AdminVerifyPage() {
  const [filter, setFilter] = useState('all');
  const { data: allPrices, loading, refetch } = useApi<PriceSub[]>('/api/prices');

  const prices = allPrices || [];
  const filtered = filter === 'all' ? prices : prices.filter(p => p.status === filter);

  const counts = {
    all: prices.length,
    pending: prices.filter(p => p.status === 'pending').length,
    peer_verified: prices.filter(p => p.status === 'peer_verified').length,
    admin_verified: prices.filter(p => p.status === 'admin_verified').length,
    flagged: prices.filter(p => p.status === 'flagged').length,
  };

  const handleApprove = async (id: number) => {
    await apiPatch(`/api/prices/${id}/approve`, { action: 'approve' });
    refetch();
  };

  const handleReject = async (id: number) => {
    await apiPatch(`/api/prices/${id}/approve`, { action: 'reject' });
    refetch();
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">ဈေးနှုန်းစစ်ဆေးခြင်း</h1>
      <p className="page-subtitle">ကုန်သည်များ တင်သွင်းထားသော စျေးနှုန်းများကို စစ်ဆေးအတည်ပြုရန်</p>

      {/* Stats */}
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း</div><div className="stat-value">{counts.all}</div></div>
        <div className="stat-card"><div className="stat-label">စစ်ဆေးရန် စောင့်ဆဲ</div><div className="stat-value" style={{ color: 'var(--warning)' }}>{counts.pending + counts.peer_verified}</div></div>
        <div className="stat-card"><div className="stat-label">အတည်ပြုပြီး</div><div className="stat-value" style={{ color: 'var(--success)' }}>{counts.admin_verified}</div></div>
        <div className="stat-card"><div className="stat-label">သံသယ</div><div className="stat-value" style={{ color: 'var(--danger)' }}>{counts.flagged}</div></div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-md mb-lg flex-wrap">
        {([['all', 'အားလုံး'], ['pending', 'စောင့်ဆဲ'], ['peer_verified', 'ကုန်သည်စစ်ပြီး'], ['admin_verified', 'အတည်ပြုပြီး'], ['flagged', 'သံသယ']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '20px', padding: '6px 16px', fontSize: 'var(--font-sm)' }}
          >
            {label} ({counts[key as keyof typeof counts] || 0})
          </button>
        ))}
      </div>

      {/* Price List */}
      <div className="card">
        <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>တင်သွင်းထားသော စျေးနှုန်းများ</span>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', fontWeight: 400 }}>{filtered.length} ခု</span>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ကုန်သည်</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်း</th><th>ရက်စွဲ</th><th>အခြေအနေ</th><th>လုပ်ဆောင်</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</td></tr> :
                filtered.length ? filtered.map((p) => (
                  <tr key={p.id} style={{ background: p.status === 'flagged' ? 'var(--danger-bg, rgba(239,68,68,0.06))' : undefined }}>
                    <td style={{ fontWeight: 600 }}>{p.merchant?.full_name || '—'}</td>
                    <td>{p.product?.name_mm || '—'}</td>
                    <td>{p.market?.name_mm || '—'}</td>
                    <td>{p.buy_price.toLocaleString()} / {p.sell_price.toLocaleString()}</td>
                    <td style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{new Date(p.created_at).toLocaleDateString('my-MM')}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: 'var(--font-xs)', fontWeight: 700,
                        background: `${statusColors[p.status] || 'var(--gray-300)'}18`,
                        color: statusColors[p.status] || 'var(--gray-600)',
                        border: `1px solid ${statusColors[p.status] || 'var(--gray-300)'}33`,
                      }}>
                        {statusLabels[p.status] || p.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {(p.status === 'pending' || p.status === 'peer_verified') && (
                        <>
                          <button className="btn btn-sm btn-primary" style={{ marginRight: 4 }} onClick={() => handleApprove(p.id)}>အတည်ပြု</button>
                          <button className="btn btn-sm btn-outline" onClick={() => handleReject(p.id)}>ပယ်</button>
                        </>
                      )}
                      {p.status === 'flagged' && (
                        <>
                          <button className="btn btn-sm btn-primary" style={{ marginRight: 4 }} onClick={() => handleApprove(p.id)}>ခွင့်ပြု</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(p.id)}>ပယ်ငြင်း</button>
                        </>
                      )}
                      {p.status === 'admin_verified' && <span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>✓ ပြီးပြီ</span>}
                    </td>
                  </tr>
                )) : <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>စျေးနှုန်း မရှိပါ</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
