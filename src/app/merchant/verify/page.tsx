export const metadata = { title: 'တောင်သူအလင်း — စျေးအတည်ပြု' };

export default function VerifyPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးအတည်ပြုခြင်း</h1>
      <p className="page-subtitle">အခြားကုန်သည်များ၏ စျေးနှုန်းများကို စစ်ဆေးကူညီရန်</p>

      <div className="grid-3 mb-lg">
        <div className="stat-card"><div className="stat-label">စစ်ဆေးရန်</div><div className="stat-value">၈</div></div>
        <div className="stat-card"><div className="stat-label">စစ်ဆေးပြီး</div><div className="stat-value">၂၃</div></div>
        <div className="stat-card"><div className="stat-label">သံသယမှတ်ပြီး</div><div className="stat-value">၂</div></div>
      </div>

      <div className="card">
        <div className="card-title mb-md">စစ်ဆေးရန် စျေးနှုန်းများ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ကုန်သည်</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်း</th><th>နှိုင်းယှဉ်</th><th>အခြေအနေ</th><th>လုပ်ဆောင်</th></tr></thead>
          <tbody>
            <tr><td>ဦးမင်းထွေး</td><td>နှမ်း</td><td>မန္တလေး</td><td>၅၂,၀၀၀ / ၅၃,၅၀၀</td><td className="price-up">+၁,၀၀၀ ↑</td><td><span className="verify-badge pending">စောင့်ဆဲ</span></td><td><button className="btn btn-sm btn-primary">အတည်ပြု</button> <button className="btn btn-sm btn-outline">သံသယ</button></td></tr>
            <tr><td>ဒေါ်ခင်လှိုင်</td><td>ပဲတီစိမ်း</td><td>မိတ္ထီလာ</td><td>၃၇,၅၀၀ / ၃၈,၀၀၀</td><td className="price-stable">ပုံမှန်</td><td><span className="verify-badge pending">စောင့်ဆဲ</span></td><td><button className="btn btn-sm btn-primary">အတည်ပြု</button> <button className="btn btn-sm btn-outline">သံသယ</button></td></tr>
            <tr><td>ဦးသန်းဝင်း</td><td>ဆန်</td><td>စစ်ကိုင်း</td><td>၂၅,၀၀၀ / ၂၆,၀၀၀</td><td className="price-down" style={{ color: 'var(--danger)' }}>-၃,၅၀၀ ↓ သံသယ</td><td><span className="verify-badge flagged">သံသယ</span></td><td><button className="btn btn-sm btn-primary">အတည်ပြု</button> <button className="btn btn-sm btn-outline">ကျော်</button></td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
