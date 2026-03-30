export const metadata = { title: 'တောင်သူအလင်း — မှတ်တမ်းများ' };

export default function RecordsPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">စမတ် တောင်သူမှတ်တမ်း</h1>
      <p className="page-subtitle">သင့်ရောင်းချမှတ်တမ်းများ ခွဲခြမ်းစိတ်ဖြာပါ</p>

      {/* Record Entry */}
      <div className="card mb-lg">
        <div className="card-title mb-md">မှတ်တမ်းအသစ် ထည့်သွင်းရန်</div>
        <div className="record-form">
          <div className="form-group"><label className="form-label">သီးနှံအမျိုးအစား</label><select className="form-select"><option>နှမ်း</option><option>ပဲ</option><option>စပါး</option><option>မြေပဲ</option></select></div>
          <div className="form-group"><label className="form-label">ရိတ်သိမ်းပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၁၀၀" /></div>
          <div className="form-group"><label className="form-label">သိုလှောင်ပမာဏ (တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၈၀" /></div>
          <div className="form-group"><label className="form-label">ရောင်းချရက်</label><input type="date" className="form-input" /></div>
          <div className="form-group"><label className="form-label">ရောင်းစျေး (ကျပ်/တင်း)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၀၀၀၀" /></div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn btn-primary" style={{ width: '100%' }}>သိမ်းဆည်းရန်</button></div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း ရောင်းချ</div><div className="stat-value">၃၅၀ တင်း</div></div>
        <div className="stat-card"><div className="stat-label">စုစုပေါင်း ဝင်ငွေ</div><div className="stat-value">၁၇.၅ သန်း</div></div>
        <div className="stat-card"><div className="stat-label">ပျမ်းမျှ ရောင်းစျေး</div><div className="stat-value">၅၀,၀၀၀ Ks</div></div>
        <div className="stat-card"><div className="stat-label">အကောင်းဆုံးကာလ</div><div className="stat-value" style={{ fontSize: 'var(--font-lg)' }}>ဩဂုတ်လ နှောင်း</div></div>
      </div>

      {/* AI Insights */}
      <div className="card mb-lg">
        <div className="card-title mb-md">AI ခွဲခြမ်းစိတ်ဖြာချက်</div>
        <div className="flex flex-col gap-md">
          <div className="insight-card" style={{ borderLeftColor: 'var(--warning)' }}>
            <div className="insight-text"><strong>လွတ်သွားသော အခွင့်အလမ်း:</strong> သင်သည် စျေးနှုန်း လစဉ်ပျမ်းမျှအောက် ကျဆင်းချိန်တွင် အများဆုံး ရောင်းချခဲ့ပါသည်။ စောင့်ဆိုင်းခြင်းဖြင့် ဝင်ငွေ ၁၂% ပိုတိုးနိုင်ခဲ့ပါသည်။</div>
          </div>
          <div className="insight-card" style={{ borderLeftColor: 'var(--success)' }}>
            <div className="insight-text"><strong>အကောင်းဆုံးကာလ:</strong> ဩဂုတ်လ နှောင်းပိုင်းတွင် ရောင်းချခဲ့သည့်အကြိမ်များ အမြတ်အစွန်း အကောင်းဆုံး ရရှိခဲ့ပါသည်။</div>
          </div>
          <div className="insight-card" style={{ borderLeftColor: 'var(--info)' }}>
            <div className="insight-text"><strong>အကြံပြုချက်:</strong> နောက်လာမည့်ရာသီတွင် သီးနှံကို ၅ ရက်ပိုမိုသိုလှောင်ထားပါက ယခင်ကာလများအရ ဝင်ငွေ ပိုမိုတိုးတက်နိုင်ပါသည်။</div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card">
        <div className="card-title mb-md">ရောင်းချမှတ်တမ်း စာရင်း</div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>ရက်စွဲ</th><th>သီးနှံ</th><th>ပမာဏ</th><th>စျေးနှုန်း</th><th>စုစုပေါင်း</th></tr></thead>
            <tbody>
              <tr><td>၂၀၂၆-၀၃-၂၀</td><td>နှမ်း</td><td>၅၀ တင်း</td><td>၅၁,၀၀၀</td><td>၂၅.၅ သိန်း</td></tr>
              <tr><td>၂၀၂၆-၀၂-၁၅</td><td>နှမ်း</td><td>၈၀ တင်း</td><td>၄၈,၅၀၀</td><td>၃၈.၈ သိန်း</td></tr>
              <tr><td>၂၀၂၆-၀၁-၁၀</td><td>ပဲ</td><td>၁၀၀ တင်း</td><td>၄၅,၀၀၀</td><td>၄၅.၀ သိန်း</td></tr>
              <tr><td>၂၀၂၅-၁၂-၀၅</td><td>နှမ်း</td><td>၆၀ တင်း</td><td>၅၃,၀၀၀</td><td>၃၁.၈ သိန်း</td></tr>
              <tr><td>၂၀၂၅-၁၁-၂၀</td><td>မြေပဲ</td><td>၆၀ တင်း</td><td>၄၂,၀၀၀</td><td>၂၅.၂ သိန်း</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
