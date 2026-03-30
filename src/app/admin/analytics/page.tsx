export const metadata = { title: 'တောင်သူအလင်း — ပလက်ဖောင်းခွဲခြမ်း' };
export default function AdminAnalyticsPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">ခွဲခြမ်းစိတ်ဖြာမှု</h1>
      <p className="page-subtitle">ပလက်ဖောင်း စွမ်းဆောင်ရည်နှင့် အသုံးပြုမှု</p>
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း တောင်သူ</div><div className="stat-value">၃၈၀</div><div className="stat-change up">↑ ၂၈ ယခုလ</div></div>
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း ကုန်သည်</div><div className="stat-value">၄၅</div><div className="stat-change up">↑ ၅ ယခုလ</div></div>
        <div className="stat-card"><div className="stat-label">စျေးတင်သွင်းမှု/လ</div><div className="stat-value">၃၂၀</div></div>
        <div className="stat-card"><div className="stat-label">ပျမ်းမျှ စစ်ဆေးချိန်</div><div className="stat-value">၂ နာရီ</div></div>
      </div>
    </div>
  );
}
