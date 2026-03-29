export const metadata = { title: 'တောင်သူအလင်း — ခွဲခြမ်းစိတ်ဖြာ' };

export default function AnalyticsPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">ခွဲခြမ်းစိတ်ဖြာမှု</h1>
      <p className="page-subtitle">စျေးကွက်လမ်းကြောင်းနှင့် စွမ်းဆောင်ရည်</p>
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">ပမာဏအများဆုံး</div><div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>နှမ်း</div></div>
        <div className="stat-card"><div className="stat-label">စျေးအတက်ဆုံး</div><div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>မြေပဲ ↑5%</div></div>
        <div className="stat-card"><div className="stat-label">တင်သွင်းမှု</div><div className="stat-value">45 ခု/လ</div></div>
        <div className="stat-card"><div className="stat-label">တိကျမှုနှုန်း</div><div className="stat-value">92%</div></div>
      </div>
      <div className="card">
        <div className="card-title mb-md">အမြောင်းအပြောင်း အများဆုံး ထုတ်ကုန်များ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ထုတ်ကုန်</th><th>ယခုစျေး</th><th>ပြောင်းလဲမှု</th><th>ဝယ်လိုအား</th></tr></thead>
          <tbody>
            <tr><td>နှမ်း</td><td>52,500</td><td className="price-up">↑ 3.2%</td><td><span className="risk-badge low">မြင့်</span></td></tr>
            <tr><td>မြေပဲ</td><td>43,000</td><td className="price-up">↑ 5.1%</td><td><span className="risk-badge low">မြင့်</span></td></tr>
            <tr><td>ပဲတီစိမ်း</td><td>39,500</td><td className="price-stable">→ 0.5%</td><td><span className="risk-badge moderate">သာမန်</span></td></tr>
            <tr><td>ဆန်</td><td>29,500</td><td className="price-down">↓ 2.1%</td><td><span className="risk-badge moderate">သာမန်</span></td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
