export const metadata = { title: 'တောင်သူအလင်း — အရေးပေါ်ဝယ်ယူ' };

export default function MerchantEmergencyPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အရေးပေါ် ဝယ်ယူသူ</h1>
      <p className="page-subtitle">ဘေးအန္တရာယ်အခါ အရေးပေါ်ဝယ်ယူမှုများ စီမံရန်</p>

      <div className="emergency-header mb-lg">
        <div className="flex items-center gap-md mb-md"><div><div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', color: '#991b1b' }}>ရှမ်းမြောက် ရေကြီးမှု — အရေးပေါ်ဝယ်ယူသူ လိုအပ်</div><div style={{ color: '#991b1b', fontSize: 'var(--font-sm)' }}>နှမ်း/ပဲ သီးနှံများ ပျက်စီးနိုင်ခြေ မြင့်</div></div><span className="risk-badge high" style={{ marginLeft: 'auto' }}>အရေးပေါ်</span></div>
      </div>

      <div className="card mb-lg" style={{ border: '2px solid var(--danger)' }}>
        <div className="card-title mb-md">သင့်အနေဖြင့် အရေးပေါ်ဝယ်ယူနိုင်ပါသလား?</div>
        <div className="grid-2" style={{ gap: 'var(--space-sm)' }}>
          <div className="form-group"><label className="form-label">ဝယ်ယူနိုင်သော ထုတ်ကုန်</label><select className="form-select"><option>နှမ်း</option><option>ပဲတီစိမ်း</option><option>မြေပဲ</option></select></div>
          <div className="form-group"><label className="form-label">ဝယ်ယူနိုင်သော ပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၂၀၀" /></div>
          <div className="form-group"><label className="form-label">ဝယ်ယူမည့် စျေးနှုန်း (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၄၈,၀၀၀" /></div>
          <div className="form-group"><label className="form-label">တည်နေရာ</label><select className="form-select"><option>မန္တလေး</option><option>မိတ္ထီလာ</option><option>ပြင်ဦးလွင်</option></select></div>
        </div>
        <div className="flex gap-md items-center mb-md">
          <label className="form-label" style={{ margin: 0 }}>လာရောက်ယူရန် ရနိုင်:</label>
          <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
        </div>
        <button className="btn btn-danger" style={{ width: '100%' }}>အရေးပေါ် ဝယ်ယူကမ်းလှမ်းချက် တင်ရန်</button>
      </div>

      <div className="card mb-lg">
        <div className="card-title mb-md">ပျက်စီးနိုင်သော သီးနှံတောင်းဆိုမှုများ</div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: 'var(--danger)' }}>ရ</div><div className="buyer-info"><div className="buyer-name">ရှမ်းမြောက် — နှမ်း ၃၀၀ တင်း</div><div className="buyer-detail">မိုးကြောင့် သယ်ယူမရ • ၃ ရက်အတွင်း ရောင်းရန်လို</div></div><button className="btn btn-danger btn-sm">လက်ခံရန်</button></div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: 'var(--warning)' }}>ရ</div><div className="buyer-info"><div className="buyer-name">ရှမ်းမြောက် — ပဲ ၂၀၀ တင်း</div><div className="buyer-detail">စိုထိုင်းနိုင်ခြေရှိ • ၅ ရက်အတွင်း</div></div><button className="btn btn-danger btn-sm">လက်ခံရန်</button></div>
      </div>

      <div className="card">
        <div className="card-title mb-md">အရေးပေါ် ဆက်တင်များ</div>
        <div className="flex justify-between items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}><span style={{ fontWeight: 500 }}>အရေးပေါ်ဝယ်ယူသူ ပါဝင်ရန်</span><label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
        <div className="flex justify-between items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}><span style={{ fontWeight: 500 }}>လာရောက်ယူနိုင်ရန် ဖွင့်ထားရန်</span><label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
        <div className="flex justify-between items-center" style={{ padding: '12px 0' }}><span style={{ fontWeight: 500 }}>အရေးပေါ် အသိပေးချက်ရယူရန်</span><label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
      </div>
    </div>
  );
}
