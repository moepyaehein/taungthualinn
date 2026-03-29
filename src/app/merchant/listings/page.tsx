'use client';
import { useState } from 'react';

export default function ListingsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="tab-panel">
      <h1 className="page-title">ကမ်းလှမ်းချက်စီမံခန့်ခွဲမှု</h1>
      <p className="page-subtitle">ဝယ်ယူ/ရောင်းချ ကမ်းလှမ်းချက်များ စီမံရန်</p>

      <div className="flex justify-between items-center mb-lg"><div></div><button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>ကမ်းလှမ်းချက်အသစ်</button></div>

      {showForm && (
        <div className="card mb-lg">
          <div className="card-title mb-md">ကမ်းလှမ်းချက်အသစ် ဖန်တီးရန်</div>
          <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
            <div className="form-group"><label className="form-label">အမျိုးအစား</label><select className="form-select"><option>ဝယ်ယူလိုသည်</option><option>ရောင်းလိုသည်</option></select></div>
            <div className="form-group"><label className="form-label">ထုတ်ကုန်</label><select className="form-select"><option>နှမ်း</option><option>ပဲ</option><option>မြေပဲ</option><option>စပါး</option></select></div>
            <div className="form-group"><label className="form-label">ပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - 500" /></div>
            <div className="form-group"><label className="form-label">ပစ်မှတ်စျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - 52,000" /></div>
            <div className="form-group"><label className="form-label">ဒေသ</label><select className="form-select"><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option></select></div>
            <div className="form-group"><label className="form-label">ရယူနိုင်မှု</label><select className="form-select"><option>ယခုချက်ချင်း</option><option>1 ပတ်အတွင်း</option><option>2 ပတ်အတွင်း</option></select></div>
          </div>
          <div className="form-group"><label className="form-label"><input type="checkbox" defaultChecked /> လာရောက်ယူရန် ရနိုင်ပါသည်</label></div>
          <button className="btn btn-primary" onClick={() => { alert('ကမ်းလှမ်းချက် ဖန်တီးပြီး'); setShowForm(false); }}>ဖန်တီးရန်</button>
        </div>
      )}

      <div className="card">
        <div className="card-title mb-md">တက်ကြွ ကမ်းလှမ်းချက်များ</div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: '#4f46e5' }}>ဝ</div><div className="buyer-info"><div className="buyer-name">နှမ်း 500 တင်း ဝယ်လိုသည်</div><div className="buyer-detail">မန္တလေး • 52,000 Ks/တင်း • လာယူရန်ရနိုင်</div></div><span className="verify-badge verified">တက်ကြွ</span></div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: '#059669' }}>ဝ</div><div className="buyer-info"><div className="buyer-name">ပဲတီစိမ်း 200 တင်း ဝယ်လိုသည်</div><div className="buyer-detail">စစ်ကိုင်း • 39,000 Ks/တင်း</div></div><span className="verify-badge verified">တက်ကြွ</span></div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: '#f59e0b' }}>ရ</div><div className="buyer-info"><div className="buyer-name">မြေပဲ 100 တင်း ရောင်းလိုသည်</div><div className="buyer-detail">မိတ္ထီလာ • 43,000 Ks/တင်း</div></div><span className="verify-badge pending">ခေတ္တရပ်</span></div>
      </div>
    </div>
  );
}
