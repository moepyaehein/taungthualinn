import Link from 'next/link';

export const metadata = { title: 'တောင်သူအလင်း — စီမံခန့်ခွဲမှု' };

export default function AdminHomePage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">စီမံခန့်ခွဲမှု ဒက်ရှ်ဘုတ်</h1>
      <p className="page-subtitle">ပလက်ဖောင်း အခြေအနေ အကျဉ်းချုပ် — ၂၀၂၆ မတ်လ ၂၈</p>
      <div className="alert-banner danger mb-lg"><div><strong>အရေးပေါ်:</strong> ရှမ်းမြောက် ရေကြီးမှု — ဒေသ ၃ ခုတွင် စျေးနှုန်းပြောင်းလဲမှု ကြီးမားနေပါသည်</div></div>

      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">အတည်ပြုရန်</div><div className="stat-value">၁၂</div><div className="stat-change down">အမြန်ကြည့်ရန်</div></div>
        <div className="stat-card"><div className="stat-label">သံသယ စျေးနှုန်း</div><div className="stat-value">၃</div><div className="stat-change down">စစ်ဆေးရန်</div></div>
        <div className="stat-card"><div className="stat-label">တက်ကြွ ကုန်သည်</div><div className="stat-value">၄၅</div><div className="stat-change up">↑ ၅ ယခုလ</div></div>
        <div className="stat-card"><div className="stat-label">တက်ကြွ တောင်သူ</div><div className="stat-value">၃၈၀</div><div className="stat-change up">↑ ၂၈ ယခုလ</div></div>
      </div>

      <div className="grid-2 mb-lg">
        <div className="card">
          <div className="card-title mb-md">မြန်ဆန်လုပ်ဆောင်ချက်</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link href="/admin/bulk" className="btn btn-primary">Upload စစ်ရန်</Link>
            <Link href="/admin/categories" className="btn btn-primary">အမျိုးအစားစီမံ</Link>
            <Link href="/admin/emergency" className="btn btn-danger" style={{ gridColumn: '1 / -1' }}>အရေးပေါ်</Link>
          </div>
        </div>
        <div className="card">
          <div className="card-title mb-md">မကြာသေးမီ လုပ်ဆောင်မှု</div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            <div style={{ padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>Admin က နှမ်း (မန္တလေး) စျေး အတည်ပြုခဲ့ — <span style={{ color: 'var(--gray-400)' }}>မိနစ် ၃၀ က</span></div>
            <div style={{ padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>ဆန် (စစ်ကိုင်း) စျေး သံသယမှတ်ခဲ့ — <span style={{ color: 'var(--gray-400)' }}>နာရီ ၁ က</span></div>
            <div style={{ padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>ကုန်သည် ၃ ဦး Bulk Upload တင်ခဲ့ — <span style={{ color: 'var(--gray-400)' }}>နာရီ ၂ က</span></div>
            <div style={{ padding: '6px 0' }}>အရေးပေါ် ထုတ်ပြန်ချက် ရှမ်းမြောက် — <span style={{ color: 'var(--gray-400)' }}>နာရီ ၃ က</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
