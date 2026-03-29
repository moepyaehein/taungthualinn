import Link from 'next/link';

export const metadata = { title: 'တောင်သူအလင်း — ကုန်သည်ပင်မ' };

export default function MerchantHomePage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">မင်္ဂလာပါ၊ ဦးကျော်မင်း</h1>
      <p className="page-subtitle">ကုန်သည် ဒက်ရှ်ဘုတ် — 2026 မတ်လ 28 ရက်</p>

      <div className="alert-banner danger mb-lg"><div><strong>အရေးပေါ်:</strong> ရှမ်းမြောက် ရေကြီးမှုကြောင့် အရေးပေါ်ဝယ်ယူသူ လိုအပ်နေပါသည်။</div></div>

      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">ယနေ့ စျေးတင်သွင်းမှု</div><div className="stat-value">8/12</div><div className="stat-change up">67% ပြီးစီး</div></div>
        <div className="stat-card"><div className="stat-label">အတည်ပြု စောင့်မှု</div><div className="stat-value">5</div><div className="stat-change stable">စစ်ဆေးဆဲ</div></div>
        <div className="stat-card"><div className="stat-label">အတည်ပြုပြီး</div><div className="stat-value">23</div><div className="stat-change up">ယခုအပတ်</div></div>
        <div className="stat-card"><div className="stat-label">အရေးပေါ် တောင်းဆိုမှု</div><div className="stat-value">3</div><div className="stat-change down">အမြန်တုံ့ပြန်ရန်</div></div>
      </div>

      <h2 className="section-title mb-md">မြန်ဆန်လုပ်ဆောင်ချက်</h2>
      <div className="quick-actions-grid mb-lg">
        <Link href="/merchant/price" className="btn btn-primary">စျေးတင်ရန်</Link>
        <Link href="/merchant/recommendation" className="btn btn-merchant">AI အကြံပြု</Link>
        <Link href="/merchant/listings" className="btn btn-primary">ကမ်းလှမ်းချက်အသစ်</Link>
        <Link href="/merchant/verify" className="btn btn-primary">စျေးအတည်ပြုရန်</Link>
        <Link href="/merchant/emergency" className="btn btn-danger">အရေးပေါ်ဝယ်ရန်</Link>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-md">လုပ်ဆောင်မှုအကျဉ်း</div>
          <div style={{ fontSize: 'var(--font-sm)', lineHeight: 2.2 }}>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>စုစုပေါင်း ထုတ်ကုန်</span><span style={{ fontWeight: 700 }}>12 မျိုး</span></div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>တက်ကြွ ကမ်းလှမ်းချက်</span><span style={{ fontWeight: 700 }}>6 ခု</span></div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--gray-100)', padding: '4px 0' }}><span>ယခုလ စစ်ဆေးပြီး</span><span style={{ fontWeight: 700 }}>45 ခု</span></div>
            <div className="flex justify-between" style={{ padding: '4px 0' }}><span>ကုန်သည်အဆင့်</span><span style={{ fontWeight: 700, color: '#4f46e5' }}>ယုံကြည်ရ</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-title mb-md">မကြာသေးမီ အသိပေးချက်</div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>နှမ်း (မန္တလေး) စျေးအတည်ပြုရန် လိုပါသည်<br /><span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-xs)' }}>မိနစ် 30 ခန့်က</span></div>
            <div style={{ padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>ပဲတီစိမ်း စျေး Admin အတည်ပြုပြီး<br /><span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-xs)' }}>နာရီ 2 ခန့်က</span></div>
            <div style={{ padding: '8px 0' }}>အရေးပေါ် — ရှမ်းမြောက် သီးနှံဝယ်ယူသူ လိုအပ်<br /><span style={{ color: 'var(--gray-400)', fontSize: 'var(--font-xs)' }}>နာရီ 1 ခန့်က</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
