'use client';

import { useApi, apiPatch } from '@/lib/useApi';

interface PriceSub {
  id: number; buy_price: number; sell_price: number; status: string; created_at: string;
  merchant?: { full_name: string }; product?: { name_mm: string }; market?: { name_mm: string };
}

export default function VerifyPage() {
  const { data: prices, loading, refetch } = useApi<PriceSub[]>('/api/prices?status=pending');

  const handleVerify = async (id: number) => {
    await apiPatch(`/api/prices/${id}/verify`, { is_verified: true });
    refetch();
  };

  const handleFlag = async (id: number) => {
    await apiPatch(`/api/prices/${id}/verify`, { is_verified: false });
    refetch();
  };

  const pendingCount = prices?.length || 0;

  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးအတည်ပြုခြင်း</h1>
      <p className="page-subtitle">အခြားကုန်သည်များ၏ စျေးနှုန်းများကို စစ်ဆေးကူညီရန်</p>

      <div className="grid-3 mb-lg">
        <div className="stat-card"><div className="stat-label">စစ်ဆေးရန်</div><div className="stat-value">{pendingCount}</div></div>
      </div>

      <div className="card">
        <div className="card-title mb-md">စစ်ဆေးရန် စျေးနှုန်းများ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ကုန်သည်</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်း</th><th>ရက်စွဲ</th><th>လုပ်ဆောင်</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</td></tr> :
              prices?.length ? prices.map((p) => (
                <tr key={p.id}>
                  <td>{p.merchant?.full_name || '—'}</td>
                  <td>{p.product?.name_mm || '—'}</td>
                  <td>{p.market?.name_mm || '—'}</td>
                  <td>{p.buy_price.toLocaleString()} / {p.sell_price.toLocaleString()}</td>
                  <td style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>{new Date(p.created_at).toLocaleDateString('my-MM')}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" style={{ marginRight: 4 }} onClick={() => handleVerify(p.id)}>အတည်ပြု</button>
                    <button className="btn btn-sm btn-outline" onClick={() => handleFlag(p.id)}>သံသယ</button>
                  </td>
                </tr>
              )) : <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>စစ်ဆေးရန် စျေးနှုန်း မရှိပါ</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
