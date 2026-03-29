export const metadata = { title: 'တောင်သူအလင်း — အစုလိုက်တင်သွင်း' };

export default function BulkPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အစုလိုက် စျေးတင်သွင်းခြင်း</h1>
      <p className="page-subtitle">CSV ဖိုင်ဖြင့် စျေးနှုန်းအများအပြား တစ်ပြိုင်နက်တင်ရန်</p>

      <div className="card mb-lg">
        <div className="upload-zone">
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-400)', marginBottom: 'var(--space-md)' }}>ဖိုင်တင်ရန်</div>
          <div style={{ fontWeight: 600, fontSize: 'var(--font-lg)', marginBottom: 8 }}>ဖိုင်ရွေးရန် နှိပ်ပါ</div>
          <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>CSV, Excel ဖိုင်များ ထောက်ပံ့ပါသည်</div>
        </div>
      </div>

      <div className="card mb-lg">
        <div className="card-title mb-md">ဖိုင်ပုံစံ လမ်းညွှန်</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ကော်လံ</th><th>ဖော်ပြချက်</th><th>ဥပမာ</th></tr></thead>
          <tbody>
            <tr><td>အမျိုးအစား</td><td>ထုတ်ကုန်အမျိုးအစား</td><td>ဆီထွက်သီးနှံ</td></tr>
            <tr><td>ထုတ်ကုန်</td><td>ထုတ်ကုန်အမည်</td><td>နှမ်း</td></tr>
            <tr><td>စျေးကွက်</td><td>စျေးကွက်အမည်</td><td>မန္တလေး</td></tr>
            <tr><td>ဝယ်စျေး</td><td>ဝယ်ယူစျေးနှုန်း</td><td>51000</td></tr>
            <tr><td>ရောင်းစျေး</td><td>ရောင်းချစျေးနှုန်း</td><td>52500</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
