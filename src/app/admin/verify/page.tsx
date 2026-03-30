export const metadata = { title: 'တောင်သူအလင်း — စျေးအတည်ပြု' };

export default function AdminVerifyPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးနှုန်းအတည်ပြုခြင်း</h1>
      <p className="page-subtitle">ကုန်သည်များ တင်သွင်းသော စျေးနှုန်းများကို နောက်ဆုံးအတည်ပြုရန်</p>
      <div className="grid-4 mb-lg">
        <div className="stat-card"><div className="stat-label">စောင့်ဆဲ</div><div className="stat-value">၁၂</div></div>
        <div className="stat-card"><div className="stat-label">ကုန်သည်စစ်ပြီး</div><div className="stat-value">၅</div></div>
        <div className="stat-card"><div className="stat-label">Admin အတည်ပြုပြီး</div><div className="stat-value">၄၅</div></div>
        <div className="stat-card"><div className="stat-label">သံသယ</div><div className="stat-value">၃</div></div>
      </div>
      <div className="card">
        <div className="flex gap-md mb-md flex-wrap">
          <select className="form-select" style={{ width: 'auto' }}><option>ပြည်နယ်/တိုင်း အားလုံး</option><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option></select>
          <select className="form-select" style={{ width: 'auto' }}><option>အမျိုးအစား အားလုံး</option><option>ဆီထွက်သီးနှံ</option><option>ပဲအမျိုးမျိုး</option></select>
          <select className="form-select" style={{ width: 'auto' }}><option>အခြေအနေ အားလုံး</option><option>စောင့်ဆဲ</option><option>သံသယ</option></select>
        </div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ကုန်သည်</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်း</th><th>နှိုင်းယှဉ်</th><th>ကုန်သည်စစ်</th><th>လုပ်ဆောင်</th></tr></thead>
          <tbody>
            <tr><td>ဦးကျော်မင်း</td><td>နှမ်း</td><td>မန္တလေး</td><td>၅၁,၀၀၀/၅၂,၅၀၀</td><td className="price-stable">ပုံမှန်</td><td><span className="verify-badge peer">စစ်ပြီး</span></td><td><button className="btn btn-sm btn-primary">ပြု</button> <button className="btn btn-sm btn-outline">ပယ်</button></td></tr>
            <tr><td>ဦးမင်းထွေး</td><td>နှမ်း</td><td>မန္တလေး</td><td>၅၂,၀၀၀/၅၃,၅၀၀</td><td className="price-up">+၁,၀၀၀ ↑</td><td><span className="verify-badge pending">စောင့်ဆဲ</span></td><td><button className="btn btn-sm btn-primary">ပြု</button> <button className="btn btn-sm btn-outline">ပယ်</button></td></tr>
            <tr style={{ background: 'var(--danger-bg)' }}><td>ဦးသန်းဝင်း</td><td>ဆန်</td><td>စစ်ကိုင်း</td><td>၂၅,၀၀၀/၂၆,၀၀၀</td><td className="price-down" style={{ color: 'var(--danger)' }}>-၃,၅၀၀ ↓ outlier</td><td><span className="verify-badge flagged">သံသယ</span></td><td><button className="btn btn-sm btn-primary">အတည်ပြု</button> <button className="btn btn-sm btn-danger">ပယ် ငြင်း</button></td></tr>
            <tr><td>ဒေါ်ခင်လှိုင်</td><td>ပဲတီစိမ်း</td><td>မိတ္ထီလာ</td><td>၃၇,၅၀၀/၃၈,၀၀၀</td><td className="price-stable">ပုံမှန်</td><td><span className="verify-badge peer">စစ်ပြီး</span></td><td><button className="btn btn-sm btn-primary">ပြု</button> <button className="btn btn-sm btn-outline">ပယ်</button></td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
