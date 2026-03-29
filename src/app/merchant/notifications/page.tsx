export const metadata = { title: 'တောင်သူအလင်း — အသိပေးချက်' };

export default function NotificationsPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အသိပေးချက်များ</h1>
      <p className="page-subtitle">သတိပေးချက်နှင့် အချက်အလက်များ</p>
      <div className="card">
        <div className="buyer-card" style={{ background: 'var(--danger-bg)' }}><div className="buyer-info"><div className="buyer-name">အရေးပေါ်: ရှမ်းမြောက် သီးနှံဝယ်ယူသူ လိုအပ်</div><div className="buyer-detail">နာရီ 1 ခန့်က • အရေးပေါ်</div></div></div>
        <div className="buyer-card" style={{ background: 'var(--warning-bg)' }}><div className="buyer-info"><div className="buyer-name">နှမ်း (မန္တလေး) ယနေ့စျေး မတင်ရသေးပါ</div><div className="buyer-detail">နာရီ 3 ခန့်က • စျေးတင်ရန်</div></div></div>
        <div className="buyer-card"><div className="buyer-info"><div className="buyer-name">ပဲတီစိမ်း စျေး Admin အတည်ပြုပြီး</div><div className="buyer-detail">နာရီ 5 ခန့်က</div></div></div>
        <div className="buyer-card"><div className="buyer-info"><div className="buyer-name">ဦးမင်းထွေး၏ နှမ်းစျေး စစ်ဆေးကူညီရန်</div><div className="buyer-detail">ယမန်နေ့</div></div></div>
        <div className="buyer-card"><div className="buyer-info"><div className="buyer-name">စနစ်မွမ်းမံမှု — ဧပြီ 1 ရက်တွင် ပြုပြင်မွမ်းမံမည်</div><div className="buyer-detail">ရက် 2 ခန့်က</div></div></div>
      </div>
    </div>
  );
}
