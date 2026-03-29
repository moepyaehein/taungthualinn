export const metadata = { title: 'တောင်သူအလင်း — Audit မှတ်တမ်း' };
export default function AuditPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">Audit မှတ်တမ်း</h1>
      <p className="page-subtitle">ပလက်ဖောင်း လုပ်ဆောင်မှုမှတ်တမ်းများ</p>
      <div className="flex gap-md mb-lg flex-wrap">
        <select className="form-select" style={{ width: 'auto' }}><option>အားလုံး</option><option>အတည်ပြု</option><option>ပယ် ငြင်းပယ်</option><option>သံသယ</option><option>ထုတ်ပြန်</option></select>
        <select className="form-select" style={{ width: 'auto' }}><option>Admin အားလုံး</option></select>
        <input type="date" className="form-input" style={{ width: 'auto' }} />
      </div>
      <div className="card">
        {[
          { text: 'Admin — နှမ်း (မန္တလေး) 52,500 Ks အတည်ပြုခဲ့', time: 'မတ် 28, နံနက် 10:30' },
          { text: 'Admin — ဆန် (စစ်ကိုင်း) 25,000 Ks သံသယမှတ်ခဲ့ — ပုံမှန်ထက် နည်းလွန်း', time: 'မတ် 28, နံနက် 9:00' },
          { text: 'Admin — ရှမ်းမြောက် အရေးပေါ်ထုတ်ပြန်ချက် ပို့ခဲ့', time: 'မတ် 28, နံနက် 8:00' },
          { text: 'Admin — ဦးကျော်မင်း Bulk Upload 15 ခု ခွင့်ပြုခဲ့', time: 'မတ် 27, ညနေ 4:00' },
          { text: 'Admin — ကုန်သည်အသစ် "ကုမ္ပဏီ ABC" အကောင့်ခွင့်ပြုခဲ့', time: 'မတ် 26, နံနက် 11:00' },
        ].map((item, i) => (
          <div key={i} className="audit-row">
            <div><strong>{item.text.split(' — ')[0]}</strong> — {item.text.split(' — ')[1]}<br /><span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-xs)' }}>{item.time}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
