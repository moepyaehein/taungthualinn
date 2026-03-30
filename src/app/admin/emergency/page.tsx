export const metadata = { title: 'တောင်သူအလင်း — အရေးပေါ်ထိန်းချုပ်' };
export default function AdminEmergencyPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အရေးပေါ် ထိန်းချုပ်ရေး</h1>
      <p className="page-subtitle">ဘေးအန္တရာယ် ကြီးကြပ်ခြင်းနှင့် ထုတ်ပြန်ချက်များ</p>
      <div className="emergency-header mb-lg">
        <div className="flex items-center gap-md"><div><div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', color: '#991b1b' }}>ရှမ်းမြောက် ရေကြီးမှု — ဒေသ ၃ ခု ထိခိုက်</div><div style={{ color: '#991b1b', fontSize: 'var(--font-sm)' }}>ဧပြီ ၁-၅ ရက် မိုးသည်းထန်မှု ခန့်မှန်း</div></div><span className="risk-badge high" style={{ marginLeft: 'auto' }}>အန္တရာယ်မြင့်</span></div>
      </div>
      <div className="grid-2 mb-lg">
        <div className="card">
          <div className="card-title mb-md">ထိခိုက်ဒေသများ</div>
          <div className="timeline-item"><div className="timeline-dot red"></div><div><strong>လားရှိုး</strong> — ရေကြီးမှု ပြင်းထန်<br /><span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>တောင်သူ ၄၅ ဦး ထိခိုက်</span></div></div>
          <div className="timeline-item"><div className="timeline-dot red"></div><div><strong>ကျောက်မဲ</strong> — လမ်းများပိတ်<br /><span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>ကုန်သည် ၈ ဦး ထိခိုက်</span></div></div>
          <div className="timeline-item"><div className="timeline-dot yellow"></div><div><strong>သီပေါ</strong> — သတိပေး<br /><span style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)' }}>စောင့်ကြည့်ဆဲ</span></div></div>
        </div>
        <div className="card">
          <div className="card-title mb-md">အရေးပေါ် အခြေအနေ</div>
          <div style={{ fontSize: 'var(--font-sm)', lineHeight: 2.2 }}>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>ထိခိုက်တောင်သူ</span><span style={{ fontWeight: 700, color: 'var(--danger)' }}>၄၅ ဦး</span></div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>သီးနှံ ပျက်စီးနိုင်</span><span style={{ fontWeight: 700, color: 'var(--warning)' }}>၅၀၀ တင်းခန့်</span></div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>အရေးပေါ်ဝယ်ယူသူ</span><span style={{ fontWeight: 700, color: 'var(--success)' }}>၃ ဦး</span></div>
            <div className="flex justify-between" style={{ padding: '4px 0' }}><span>matching ပြီး</span><span style={{ fontWeight: 700 }}>၁/၃</span></div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title mb-md">အရေးပေါ် ထုတ်ပြန်ချက် ပို့ရန်</div>
        <div className="form-group"><label className="form-label">ဒေသ</label><select className="form-select"><option>ရှမ်းပြည်နယ်မြောက်ပိုင်း</option><option>မန္တလေးတိုင်း</option><option>တစ်နိုင်ငံလုံး</option></select></div>
        <div className="form-group"><label className="form-label">သတိပေးမှု</label><textarea className="form-input" rows={3} defaultValue="ရှမ်းမြောက် ရေကြီးမှုကြောင့် သီးနှံများ လုံခြုံအောင်ထားပါ။ လမ်းပန်းသယ်ယူရေး ပြတ်တောက်နိုင်ပါသည်။"></textarea></div>
        <button className="btn btn-danger">အရေးပေါ် ထုတ်ပြန်ရန်</button>
      </div>
    </div>
  );
}
