export const metadata = { title: 'တောင်သူအလင်း — အသုံးပြုသူစီမံ' };
export default function UsersPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အသုံးပြုသူ စီမံခန့်ခွဲ</h1>
      <p className="page-subtitle">တောင်သူနှင့် ကုန်သည်အကောင့်များ စီမံရန်</p>
      <div className="flex gap-md mb-lg flex-wrap">
        <select className="form-select" style={{ width: 'auto' }}><option>အားလုံး</option><option>တောင်သူ</option><option>ကုန်သည်</option></select>
        <select className="form-select" style={{ width: 'auto' }}><option>အခြေအနေ အားလုံး</option><option>တက်ကြွ</option><option>ဆိုင်းငံ့</option></select>
        <input className="form-input" style={{ width: 'auto', flex: 1, minWidth: 200 }} placeholder="အမည်/ဖုန်းဖြင့် ရှာရန်..." />
      </div>
      <div className="card"><div className="table-wrapper"><table className="data-table">
        <thead><tr><th>အမည်</th><th>အခန်းကဏ္ဍ</th><th>ဒေသ</th><th>အခြေအနေ</th><th>နောက်ဆုံးဝင်</th><th>လုပ်ဆောင်</th></tr></thead>
        <tbody>
          <tr><td>ဦးအောင်မြင့်</td><td>တောင်သူ</td><td>မန္တလေး</td><td><span className="verify-badge verified">တက်ကြွ</span></td><td>ယနေ့</td><td><button className="btn btn-sm btn-outline">ကြည့်</button></td></tr>
          <tr><td>ဦးကျော်မင်း</td><td>ကုန်သည်</td><td>မန္တလေး</td><td><span className="verify-badge verified">တက်ကြွ</span></td><td>ယနေ့</td><td><button className="btn btn-sm btn-outline">ကြည့်</button></td></tr>
          <tr><td>ဒေါ်ခင်လှိုင်</td><td>ကုန်သည်</td><td>မိတ္ထီလာ</td><td><span className="verify-badge verified">တက်ကြွ</span></td><td>ယမန်နေ့</td><td><button className="btn btn-sm btn-outline">ကြည့်</button></td></tr>
          <tr><td>ဦးသန်းဝင်း</td><td>ကုန်သည်</td><td>စစ်ကိုင်း</td><td><span className="verify-badge flagged">သတိပေး</span></td><td>ရက် ၃ က</td><td><button className="btn btn-sm btn-outline">ကြည့်</button> <button className="btn btn-sm btn-danger">ပယ်</button></td></tr>
        </tbody>
      </table></div></div>
    </div>
  );
}
