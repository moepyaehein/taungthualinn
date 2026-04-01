'use client';

import { useState } from 'react';
import { useApi, apiPost } from '@/lib/useApi';

interface Region { id: number; name_mm: string; }
interface Emergency {
  id: number; title: string; description: string; risk_level: string;
  affected_farmers: number; affected_merchants: number; is_active: boolean;
  region?: { name_mm: string };
}

export default function AdminEmergencyPage() {
  const { data: emergencies, loading, refetch } = useApi<Emergency[]>('/api/emergencies?is_active=true');
  const { data: regions } = useApi<Region[]>('/api/regions');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [regionId, setRegionId] = useState('');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [affectedFarmers, setAffectedFarmers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async () => {
    if (!title || !description || !regionId) { setMsg('အချက်အလက် အပြည့်အစုံ ထည့်ပါ'); return; }
    setSubmitting(true);
    setMsg('');
    const { error } = await apiPost('/api/emergencies', {
      title, description,
      region_id: parseInt(regionId),
      risk_level: riskLevel,
      affected_farmers: affectedFarmers ? parseInt(affectedFarmers) : 0,
    });
    if (error) { setMsg(`Error: ${error}`); }
    else { setMsg('အရေးပေါ် ထုတ်ပြန်ပြီး ✓'); setTitle(''); setDescription(''); setAffectedFarmers(''); refetch(); }
    setSubmitting(false);
  };

  return (
    <div className="tab-panel">
      <h1 className="page-title">အရေးပေါ် ထိန်းချုပ်ရေး</h1>
      <p className="page-subtitle">ဘေးအန္တရာယ် ကြီးကြပ်ခြင်းနှင့် ထုတ်ပြန်ချက်များ</p>

      {/* Active Emergencies */}
      {loading ? <p style={{ color: 'var(--gray-400)' }}>ခဏစောင့်ပါ...</p> :
        emergencies?.map((e) => (
          <div key={e.id} className="emergency-header mb-lg">
            <div className="flex items-center gap-md">
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', color: '#991b1b' }}>{e.title}</div>
                <div style={{ color: '#991b1b', fontSize: 'var(--font-sm)' }}>{e.region?.name_mm} — {e.description}</div>
              </div>
              <span className={`risk-badge ${e.risk_level}`} style={{ marginLeft: 'auto' }}>
                {e.risk_level === 'high' ? 'အန္တရာယ်မြင့်' : e.risk_level === 'medium' ? 'အလယ်အလတ်' : 'နိမ့်'}
              </span>
            </div>
          </div>
        ))}

      {emergencies?.length ? (
        <div className="grid-2 mb-lg">
          <div className="card">
            <div className="card-title mb-md">လက်ရှိ အရေးပေါ် အခြေအနေ</div>
            {emergencies.map((e) => (
              <div key={e.id} style={{ fontSize: 'var(--font-sm)', lineHeight: 2.2 }}>
                <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>ထိခိုက်တောင်သူ</span><span style={{ fontWeight: 700, color: 'var(--danger)' }}>{e.affected_farmers} ဦး</span></div>
                <div className="flex justify-between" style={{ padding: '4px 0' }}><span>ထိခိုက်ကုန်သည်</span><span style={{ fontWeight: 700, color: 'var(--warning)' }}>{e.affected_merchants} ဦး</span></div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {msg && <div className={`alert-banner ${msg.includes('Error') ? 'danger' : 'success'} mb-lg`}><div>{msg}</div></div>}

      {/* Create Emergency */}
      <div className="card">
        <div className="card-title mb-md">အရေးပေါ် ထုတ်ပြန်ချက် ပို့ရန်</div>
        <div className="grid-2" style={{ gap: 'var(--space-sm)' }}>
          <div className="form-group"><label className="form-label">ခေါင်းစဉ်</label><input className="form-input" placeholder="ဥပမာ - ရှမ်းမြောက် ရေကြီးမှု" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">ဒေသ</label>
            <select className="form-select" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
              <option value="">ရွေးချယ်ပါ</option>
              {regions?.map(r => <option key={r.id} value={r.id}>{r.name_mm}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">အန္တရာယ်အဆင့်</label>
            <select className="form-select" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
              <option value="low">နိမ့်</option><option value="medium">အလယ်အလတ်</option><option value="high">မြင့်</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">ထိခိုက်တောင်သူ (ခန့်မှန်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၄၅" value={affectedFarmers} onChange={(e) => setAffectedFarmers(e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="form-label">အသေးစိတ်</label><textarea className="form-input" rows={3} placeholder="အရေးပေါ် အသေးစိတ်..." value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <button className="btn btn-danger" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'ထုတ်ပြန်နေသည်...' : 'အရေးပေါ် ထုတ်ပြန်ရန်'}
        </button>
      </div>
    </div>
  );
}
