export const metadata = { title: 'တောင်သူအလင်း — စျေးကွက် ခွဲခြမ်းစိတ်ဖြာမှု' };

export default function AnalyticsPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">ခွဲခြမ်းစိတ်ဖြာမှု</h1>
      <p className="page-subtitle">ဈေးကွက်လမ်းကြောင်းနှင့် ကုန်စည် စွမ်းဆောင်ရည်</p>

      <div className="grid-4 mb-lg">
        <div className="stat-card">
          <div className="stat-label">ဝယ်လိုအား အများဆုံး</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>နှမ်း</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">စျေးအတက်ဆုံး</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>ပဲတီစိမ်း ↑၅.၁%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">စျေးကွက် တင်သွင်းမှု</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>၄၅ ကြိမ်/လ</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">ခန့်မှန်းချက် တိကျမှုနှုန်း</div>
          <div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>၉၂%</div>
        </div>
      </div>

      <div className="grid-2 mb-lg" style={{ alignItems: 'flex-start' }}>
        <div className="card">
          <div className="card-title mb-md">အပြောင်းအလဲ အများဆုံး ထုတ်ကုန်များ</div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>ထုတ်ကုန်</th><th>ယခုစျေး</th><th>ပြောင်းလဲမှု</th><th>ဝယ်လိုအား</th></tr>
              </thead>
              <tbody>
                <tr><td>ပဲတီစိမ်း</td><td>၆၈,၀၀၀</td><td className="price-up">↑ ၅.၁%</td><td><span className="risk-badge low">အလွန်မြင့်</span></td></tr>
                <tr><td>နှမ်း</td><td>၅၂,၅၀၀</td><td className="price-up">↑ ၃.၂%</td><td><span className="risk-badge low">မြင့်</span></td></tr>
                <tr><td>မြေပဲ</td><td>၄၅,၀၀၀</td><td className="price-down">↓ ၁.၈%</td><td><span className="risk-badge high">နည်း</span></td></tr>
                <tr><td>ဆန်</td><td>၃၈,၀၀၀</td><td className="price-stable">→ ၀.၅%</td><td><span className="risk-badge moderate">သာမန်</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ borderTop: '3px solid #6366f1', background: 'linear-gradient(to bottom, #f8fafc, #fff)' }}>
          <div className="card-title mb-md" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span> စျေးကွက် သုံးသပ်ချက် အကျဉ်း
          </div>
          <div className="flex flex-col gap-sm">
            <div className="insight-card" style={{ borderLeftColor: 'var(--success)' }}>
              <div className="insight-text">
                <strong>ပဲတီစိမ်း:</strong> ပြည်တွင်းဝယ်လိုအား မြင့်တက်မှုကြောင့် ပြီးခဲ့သော ၇ ရက်အတွင်း စျေးနှုန်း ၅.၁% အထိ လျင်မြန်စွာ တက်လာပါသည်။
              </div>
            </div>
            <div className="insight-card" style={{ borderLeftColor: 'var(--warning)', marginTop: 8 }}>
              <div className="insight-text">
                <strong>မြေပဲ:</strong> ရိတ်သိမ်းရာသီဖြစ်၍ စျေးကွက်အတွင်း ပမာဏများပြားနေသဖြင့် ယခုအပတ်အတွင်း ၁.၈% ခန့် စျေးပြန်လည် ကျဆင်းနေပါသည်။
              </div>
            </div>
            <div className="insight-card" style={{ borderLeftColor: 'var(--info)', marginTop: 8 }}>
              <div className="insight-text">
                <strong>နှမ်း:</strong> ဧပြီလဆန်း ဝယ်လိုအားမြင့်တတ်သည့် ကာလဖြစ်၍ ပုံမှန်အတိုင်း ဆက်လက် တက်နိုင်ခြေရှိပါသည်။
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
