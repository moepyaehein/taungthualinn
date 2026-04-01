'use client';

import { useState } from 'react';
import { useApi, apiPatch } from '@/lib/useApi';

interface User {
  id: string; full_name: string; role: string; phone: string | null; is_active: boolean;
  trust_level: string; last_login: string | null; created_at: string;
  region?: { name_mm: string };
}

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const url = `/api/users?${roleFilter ? `role=${roleFilter}&` : ''}${statusFilter ? `status=${statusFilter}&` : ''}${searchTerm ? `search=${searchTerm}` : ''}`;
  const { data: users, loading, refetch } = useApi<User[]>(url);

  const handleSearch = () => setSearchTerm(search);

  const handleSuspend = async (id: string) => {
    if (!confirm('ဤအသုံးပြုသူကို ဆိုင်းငံ့ရန် သေချာပါသလား?')) return;
    await apiPatch(`/api/users/${id}`, { is_active: false, trust_level: 'suspended' });
    refetch();
  };

  const handleActivate = async (id: string) => {
    await apiPatch(`/api/users/${id}`, { is_active: true, trust_level: 'standard' });
    refetch();
  };

  const roleLabels: Record<string, string> = { farmer: 'တောင်သူ', merchant: 'ကုန်သည်', admin: 'Admin' };

  return (
    <div className="tab-panel">
      <h1 className="page-title">အသုံးပြုသူ စီမံခန့်ခွဲ</h1>
      <p className="page-subtitle">တောင်သူနှင့် ကုန်သည်အကောင့်များ စီမံရန်</p>

      <div className="flex gap-md mb-lg flex-wrap">
        <select className="form-select" style={{ width: 'auto' }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">အားလုံး</option><option value="farmer">တောင်သူ</option><option value="merchant">ကုန်သည်</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">အခြေအနေ အားလုံး</option><option value="active">တက်ကြွ</option><option value="suspended">ဆိုင်းငံ့</option><option value="flagged">သတိပေး</option>
        </select>
        <input className="form-input" style={{ width: 'auto', flex: 1, minWidth: 200 }} placeholder="အမည်/ဖုန်းဖြင့် ရှာရန်..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary btn-sm" onClick={handleSearch}>ရှာ</button>
      </div>

      <div className="card">
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>အမည်</th><th>အခန်းကဏ္ဍ</th><th>ဒေသ</th><th>အခြေအနေ</th><th>နောက်ဆုံးဝင်</th><th>လုပ်ဆောင်</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</td></tr> :
              users?.length ? users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                  <td>{roleLabels[u.role] || u.role}</td>
                  <td>{u.region?.name_mm || '—'}</td>
                  <td>
                    <span className={`verify-badge ${u.is_active ? 'verified' : u.trust_level === 'flagged' ? 'flagged' : 'pending'}`}>
                      {u.is_active ? 'တက်ကြွ' : u.trust_level === 'flagged' ? 'သတိပေး' : 'ဆိုင်းငံ့'}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>
                    {u.last_login ? new Date(u.last_login).toLocaleDateString('my-MM') : '—'}
                  </td>
                  <td>
                    {u.is_active ? (
                      <button className="btn btn-sm btn-danger" onClick={() => handleSuspend(u.id)}>ဆိုင်းငံ့</button>
                    ) : (
                      <button className="btn btn-sm btn-primary" onClick={() => handleActivate(u.id)}>ပြန်ဖွင့်</button>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)' }}>အသုံးပြုသူ မရှိပါ</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
