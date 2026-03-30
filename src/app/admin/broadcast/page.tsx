export const metadata = { title: 'တောင်သူအလင်း — ထုတ်ပြန်ချက်' };
export default function BroadcastPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">ထုတ်ပြန်ချက်နှင့် အသိပေးချက်</h1>
      <p className="page-subtitle">ပလက်ဖောင်းအတွင်း ထုတ်ပြန်ချက်များ ပို့ရန်</p>
      <div className="card mb-lg">
        <div className="card-title mb-md">ထုတ်ပြန်ချက်အသစ်</div>
        <div className="grid-2" style={{ gap: 'var(--space-sm)' }}>
          <div className="form-group"><label className="form-label">အမျိုးအစား</label><select className="form-select"><option>သာမန်ကြေညာ</option><option>သတိပေး</option><option>အရေးပေါ်</option><option>အကြံပြု</option></select></div>
          <div className="form-group"><label className="form-label">ပစ်မှတ်</label><select className="form-select"><option>အားလုံး</option><option>တောင်သူများသာ</option><option>ကုန်သည်များသာ</option></select></div>
        </div>
        <div className="form-group"><label className="form-label">ဒေသ</label><select className="form-select"><option>တစ်နိုင်ငံလုံး</option><option>မန္တလေးတိုင်း</option><option>ရှမ်းပြည်နယ်</option></select></div>
        <div className="form-group"><label className="form-label">အကြောင်းအရာ</label><textarea className="form-input" rows={4} placeholder="ထုတ်ပြန်ချက် ရေးပါ..."></textarea></div>
        <div className="flex gap-md"><button className="btn btn-outline">မူကြမ်းသိမ်း</button><button className="btn btn-primary">ထုတ်ပြန်ရန်</button></div>
      </div>
      <div className="card">
        <div className="card-title mb-md">ပို့ပြီးသား</div>
        <div style={{ fontSize: 'var(--font-sm)' }}>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}><strong>အရေးပေါ်:</strong> ရှမ်းမြောက် ရေကြီးမှု သတိပေး — <span style={{ color: 'var(--gray-400)' }}>နာရီ ၃ က</span></div>
          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}><strong>ကြေညာ:</strong> ဧပြီလ စနစ်မွမ်းမံမှု — <span style={{ color: 'var(--gray-400)' }}>ရက် ၂ က</span></div>
          <div style={{ padding: '8px 0' }}><strong>အကြံပြု:</strong> ကုန်သည်များ အပတ်စဉ်စျေး တင်ရန် — <span style={{ color: 'var(--gray-400)' }}>ရက် ၅ က</span></div>
        </div>
      </div>
    </div>
  );
}
