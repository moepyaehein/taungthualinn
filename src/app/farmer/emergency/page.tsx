export const metadata = { title: 'တောင်သူအလင်း — အရေးပေါ်' };

export default function EmergencyPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အရေးပေါ် တုံ့ပြန်မှု</h1>
      <p className="page-subtitle">ဘေးအန္တရာယ်သတိပေးချက်များနှင့် အရေးပေါ်ကူညီမှု</p>

      {/* Alert Banner */}
      <div className="emergency-header">
        <div className="flex items-center gap-md mb-md">
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', color: '#991b1b' }}>မိုးသည်းထန်မှု သတိပေးချက်</div>
            <div style={{ color: '#991b1b', fontSize: 'var(--font-sm)' }}>ရှမ်းပြည်နယ်မြောက်ပိုင်း — ဧပြီ 1-5 ရက်</div>
          </div>
          <span className="risk-badge high" style={{ marginLeft: 'auto' }}>အန္တရာယ်မြင့်</span>
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-700)', lineHeight: 1.8 }}>
          မိုးလေဝသဌာနခန့်မှန်းချက်အရ ရှမ်းပြည်နယ်မြောက်ပိုင်းတွင် လာမည့် 5 ရက်အတွင်း မိုးသည်းထန်စွာ ရွာသွန်းနိုင်ပါသည်။ သီးနှံများ လုံခြုံအောင် သိုလှောင်ထားပါ။
        </div>
      </div>

      <div className="grid-2 mb-lg">
        {/* Risk Timeline */}
        <div className="card">
          <div className="card-title mb-md">အန္တရာယ်ကာလ</div>
          <div className="timeline-item"><div className="timeline-dot red"></div><div><div style={{ fontWeight: 600 }}>ဧပြီ 1-3 ရက်</div><div style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>မိုးသည်းထန်နိုင် — ရှမ်းမြောက်</div></div></div>
          <div className="timeline-item"><div className="timeline-dot yellow"></div><div><div style={{ fontWeight: 600 }}>ဧပြီ 4-5 ရက်</div><div style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>မိုးတိမ်များ — မန္တလေး</div></div></div>
          <div className="timeline-item"><div className="timeline-dot green"></div><div><div style={{ fontWeight: 600 }}>ဧပြီ 6 ရက်နောက်ပိုင်း</div><div style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>ရာသီဥတု ပြန်ကောင်းလာနိုင်</div></div></div>
        </div>

        {/* Price Shock */}
        <div className="card">
          <div className="card-title mb-md">စျေးနှုန်းခုန်ချမှု ကာကွယ်ရေး</div>
          <div className="alert-banner warning mb-md"><span>ရှမ်းပြည်နယ်တွင် နှမ်းစျေး 8% ကျဆင်းနေပါသည်</span></div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            <div className="flex justify-between mb-md" style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}><span>ဒေသတွင်း စျေး (ရှမ်း)</span><span style={{ fontWeight: 700, color: 'var(--danger)' }}>45,000 Ks</span></div>
            <div className="flex justify-between mb-md" style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}><span>မထိခိုက်သောဒေသ ပျမ်းမျှ</span><span style={{ fontWeight: 700, color: 'var(--success)' }}>52,000 Ks</span></div>
            <div className="flex justify-between" style={{ padding: '8px 0' }}><span>တရားမျှတ ကိုးကားစျေး</span><span style={{ fontWeight: 700, color: 'var(--info)' }}>51,000 Ks</span></div>
          </div>
          <div className="insight-card"><div className="insight-text">ဒေသတွင်းစျေး ကျဆင်းခြင်းသည် ယာယီဖြစ်ပြီး မိုးရွာချိန်ကုန်ဆုံးပါက ပြန်တက်နိုင်ပါသည်။</div></div>
        </div>
      </div>

      {/* Emergency Buyers */}
      <div className="card mb-lg">
        <div className="card-title mb-md">အရေးပေါ်ဝယ်ယူသူများ</div>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)', marginBottom: 'var(--space-md)' }}>သင့်သီးနှံ အမြန်ရောင်းချလိုပါက ဆက်သွယ်နိုင်ပါသည်</p>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: 'var(--primary-600)' }}>မ</div><div className="buyer-info"><div className="buyer-name">မြန်မာ အဂရီဘစ်</div><div className="buyer-detail">မန္တလေး • နှမ်း/ပဲ ဝယ်ယူသည် • 4.8</div></div><button className="btn btn-primary btn-sm">ဆက်သွယ်ရန်</button></div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: 'var(--earth-600)' }}>ရ</div><div className="buyer-info"><div className="buyer-name">ရွှေဥဒေါင်း ကုမ္ပဏီ</div><div className="buyer-detail">မိတ္ထီလာ • ဆီထွက်သီးနှံ • 4.5</div></div><button className="btn btn-primary btn-sm">ဆက်သွယ်ရန်</button></div>
        <div className="buyer-card"><div className="buyer-avatar" style={{ background: 'var(--info)' }}>N</div><div className="buyer-info"><div className="buyer-name">NGO — စိုက်ပျိုးရေးကူညီမှု</div><div className="buyer-detail">တစ်နိုင်ငံလုံး • ဘေးသင့်တောင်သူများ ဦးစားပေး</div></div><button className="btn btn-outline btn-sm">အသေးစိတ်ကြည့်ရန်</button></div>
      </div>

      {/* Actions */}
      <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
        <div className="card-title mb-md">လုပ်ဆောင်သင့်သည်များ</div>
        <ul style={{ fontSize: 'var(--font-sm)', lineHeight: 2.2, color: 'var(--gray-700)', paddingLeft: 'var(--space-md)', listStyle: 'disc' }}>
          <li>သီးနှံများကို လုံခြုံခြောက်သွေ့သောနေရာတွင် သိမ်းထားပါ</li>
          <li>လမ်းပန်းဆက်သွယ်ရေး ပြတ်တောက်နိုင်သဖြင့် ကြိုတင်ပြင်ဆင်ပါ</li>
          <li>ဒေသတွင်း ယာယီစျေးကျခြင်းကို ထိတ်လန့်၍ မရောင်းပါနှင့်</li>
          <li>အရေးပေါ်ဝယ်ယူသူများနှင့် ကြိုတင်ဆက်သွယ်ထားပါ</li>
        </ul>
      </div>
    </div>
  );
}
