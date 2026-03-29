export const metadata = { title: 'တောင်သူအလင်း — ကမ်းလှမ်းကြီးကြပ်' };
export default function AdminListingsPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">ကမ်းလှမ်းချက် ကြီးကြပ်ခြင်း</h1>
      <p className="page-subtitle">ကုန်သည်ကမ်းလှမ်းချက်များနှင့် အရေးပေါ်ဝယ်ယူမှုများ ကြီးကြပ်ရန်</p>
      <div className="grid-3 mb-lg">
        <div className="stat-card"><div className="stat-label">တက်ကြွ ကမ်းလှမ်း</div><div className="stat-value">18</div></div>
        <div className="stat-card"><div className="stat-label">အရေးပေါ် တောင်းဆို</div><div className="stat-value">3</div></div>
        <div className="stat-card"><div className="stat-label">ပျက်စီးနိုင်သော</div><div className="stat-value">2</div></div>
      </div>
      <div className="card"><div className="table-wrapper"><table className="data-table">
        <thead><tr><th>ကုန်သည်</th><th>အမျိုးအစား</th><th>ထုတ်ကုန်</th><th>ပမာဏ</th><th>ဒေသ</th><th>အခြေအနေ</th></tr></thead>
        <tbody>
          <tr style={{ background: 'var(--danger-bg)' }}><td>ဦးကျော်မင်း</td><td>အရေးပေါ်ဝယ်</td><td>နှမ်း</td><td>200 တင်း</td><td>မန္တလေး</td><td><span className="verify-badge flagged">အရေးပေါ်</span></td></tr>
          <tr><td>ဒေါ်ခင်လှိုင်</td><td>ဝယ်ယူလိုသည်</td><td>ပဲတီစိမ်း</td><td>150 တင်း</td><td>မိတ္ထီလာ</td><td><span className="verify-badge verified">တက်ကြွ</span></td></tr>
          <tr><td>ကုမ္ပဏီ ABC</td><td>ဝယ်ယူလိုသည်</td><td>မြေပဲ</td><td>500 တင်း</td><td>မကွေး</td><td><span className="verify-badge verified">တက်ကြွ</span></td></tr>
        </tbody>
      </table></div></div>
    </div>
  );
}
