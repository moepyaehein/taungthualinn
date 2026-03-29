import Link from 'next/link';

export const metadata = {
  title: 'တောင်သူအလင်း — တောင်သူပင်မ',
  description: 'တောင်သူအလင်း — မြန်မာတောင်သူများအတွက် AI စျေးကွက်ဆုံးဖြတ်ချက် ဒက်ရှ်ဘုတ်',
};

export default function FarmerHomePage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">မင်္ဂလာပါ၊ ဦးအောင်မြင့်</h1>
      <p className="page-subtitle">ယနေ့ 2026 မတ်လ 28 ရက် — မန္တလေးတိုင်း</p>

      {/* Weather Forecast */}
      <div className="card mb-lg" style={{ padding: 'var(--space-lg)' }}>
        <div className="flex justify-between items-center mb-md">
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ယနေ့ ရာသီဥတု</div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        </div>
        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--gray-800)', lineHeight: 1 }}>32°<span style={{ fontSize: 'var(--font-lg)', fontWeight: 400, color: 'var(--gray-500)' }}> C</span></div>
        </div>
        <div style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)', marginBottom: 'var(--space-md)' }}>H: 34° L: 26° • တစ်စိတ်တစ်ပိုင်း တိမ်ထူ</div>
        <div style={{ background: 'var(--gray-50)', borderLeft: '3px solid var(--primary-500)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--font-sm)', color: 'var(--gray-600)' }}>
          ယနေ့ သင်၏လယ်ကွင်းတွင် ဓာတ်မြေသြဇာ ထည့်ရန် အကောင်းဆုံးအချိန် ဖြစ်ပါသည်။ သောကြာနေ့အထိ မိုးရွာနိုင်ခြေ နည်းပါသည်။
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="alert-banner warning">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <div><strong>မိုးသတိပေးချက်:</strong> ရှမ်းပြည်နယ်မြောက်ပိုင်းတွင် လာမည့် 5 ရက်အတွင်း မိုးသည်းထန်နိုင်ပါသည်။</div>
      </div>

      {/* Summary Stats */}
      <div className="grid-3 mb-lg">
        <div className="stat-card">
          <div className="stat-label">နှမ်း (တစ်တင်း)</div>
          <div className="stat-value">52,500 Ks</div>
          <div className="stat-change up">↑ 3.2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">စျေးကွက်လမ်းကြောင်း</div>
          <div className="stat-value" style={{ color: 'var(--trend-up)' }}>↑ တက်နေ</div>
          <div className="stat-change up">ယခင်အပတ်ထက် ↑</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AI အကြံပြုချက်</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-xl)', color: 'var(--primary-700)' }}>စောင့်ပါ</div>
          <div className="stat-change stable">→ 7 ရက်အတွင်း တက်နိုင်</div>
        </div>
      </div>

      {/* Quick Navigation */}
      <h2 className="section-title mb-md">မြန်ဆန်သောလမ်းညွှန်</h2>
      <div className="grid-4">
        <Link href="/farmer/market" className="quick-link">
          <div><div className="quick-link-text">စျေးနှုန်းများ</div><div className="quick-link-desc">ယနေ့စျေးကွက်ကြည့်ရန်</div></div>
        </Link>
        <Link href="/farmer/recommendation" className="quick-link">
          <div><div className="quick-link-text">AI အကြံပြု</div><div className="quick-link-desc">ရောင်းရမလား စောင့်ရမလား</div></div>
        </Link>
        <Link href="/farmer/emergency" className="quick-link">
          <div><div className="quick-link-text">အရေးပေါ်</div><div className="quick-link-desc">ဘေးအန္တရာယ်သတိပေးချက်</div></div>
        </Link>
        <Link href="/farmer/records" className="quick-link">
          <div><div className="quick-link-text">မှတ်တမ်းများ</div><div className="quick-link-desc">ကိုယ်ပိုင်ရောင်းချမှတ်တမ်း</div></div>
        </Link>
      </div>
    </div>
  );
}
