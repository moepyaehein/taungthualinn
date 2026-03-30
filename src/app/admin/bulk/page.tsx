export const metadata = { title: 'တောင်သူအလင်း — Bulk Upload စစ်ဆေး' };
export default function AdminBulkPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">Bulk Upload စစ်ဆေးခြင်း</h1>
      <p className="page-subtitle">ကုန်သည်များ၏ အစုလိုက်တင်သွင်းမှုများကို စစ်ဆေးရန်</p>
      <div className="card"><div className="table-wrapper"><table className="data-table">
        <thead><tr><th>ကုန်သည်</th><th>ဖိုင်</th><th>အရေအတွက်</th><th>အမှား</th><th>ရက်စွဲ</th><th>လုပ်ဆောင်</th></tr></thead>
        <tbody>
          <tr><td>ဦးကျော်မင်း</td><td>prices_mar၂၈.csv</td><td>၁၅ ခု</td><td style={{ color: 'var(--success)' }}>၀</td><td>မတ် ၂၈</td><td><button className="btn btn-sm btn-primary">ခွင့်ပြု</button> <button className="btn btn-sm btn-outline">ပယ်</button></td></tr>
          <tr><td>ဒေါ်ခင်လှိုင်</td><td>weekly_prices.xlsx</td><td>၈ ခု</td><td style={{ color: 'var(--warning)' }}>၂</td><td>မတ် ၂၇</td><td><button className="btn btn-sm btn-primary">အတည်ပြု</button> <button className="btn btn-sm btn-outline">ကြည့်</button></td></tr>
          <tr><td>ကုမ္ပဏီ ABC</td><td>bulk_data.csv</td><td>၃၅ ခု</td><td style={{ color: 'var(--danger)' }}>၅</td><td>မတ် ၂၆</td><td><button className="btn btn-sm btn-outline">ကြည့်</button> <button className="btn btn-sm btn-danger">ပယ် ငြင်း</button></td></tr>
        </tbody>
      </table></div></div>
    </div>
  );
}
