'use client';

export default function PricePage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးနှုန်းတင်သွင်းခြင်း</h1>
      <p className="page-subtitle">ယနေ့/အပတ်စဉ် စျေးနှုန်းများ ထည့်သွင်းရန်</p>

      <div className="card mb-lg">
        <div className="card-title mb-md">စျေးနှုန်း ထည့်သွင်းရန်</div>
        <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
          <div className="form-group"><label className="form-label">အမျိုးအစား</label><select className="form-select"><option>ဆီထွက်သီးနှံ</option><option>စပါး</option><option>ပဲအမျိုးမျိုး</option><option>ဟင်းသီးဟင်းရွက်</option><option>သစ်သီးများ</option></select></div>
          <div className="form-group"><label className="form-label">ထုတ်ကုန်</label><select className="form-select"><option>နှမ်း</option><option>မြေပဲ</option><option>နေကြာ</option><option>မုန်ညင်း</option></select></div>
          <div className="form-group"><label className="form-label">ပြည်နယ်/တိုင်း</label><select className="form-select"><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option><option>မကွေးတိုင်း</option></select></div>
          <div className="form-group"><label className="form-label">စျေးကွက်</label><select className="form-select"><option>မန္တလေး</option><option>မိတ္ထီလာ</option><option>ပြင်ဦးလွင်</option></select></div>
          <div className="form-group"><label className="form-label">ယူနစ်</label><select className="form-select"><option>တစ်တင်း</option><option>တစ်ပိဿာ</option><option>တစ်တန်</option></select></div>
          <div className="form-group"><label className="form-label">မွမ်းမံနှုန်း</label><select className="form-select"><option>နေ့စဉ်</option><option>အပတ်စဉ်</option></select></div>
          <div className="form-group"><label className="form-label">ဝယ်စျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - 50,000" /></div>
          <div className="form-group"><label className="form-label">ရောင်းစျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - 52,500" /></div>
          <div className="form-group"><label className="form-label">အရည်အသွေး</label><select className="form-select"><option>ပုံမှန်</option><option>အရည်အသွေးမြင့်</option><option>အရည်အသွေးနိမ့်</option></select></div>
        </div>
        <div className="form-group"><label className="form-label">မှတ်ချက်</label><textarea className="form-input" rows={2} placeholder="ဥပမာ — ဝယ်လိုအားကောင်း၊ ပမာဏများ"></textarea></div>
        <div className="flex gap-md">
          <button className="btn btn-outline" onClick={() => alert('မူကြမ်းသိမ်းပြီး')}>မူကြမ်းသိမ်းရန်</button>
          <button className="btn btn-primary" onClick={() => alert('တင်သွင်းပြီး')}>တင်သွင်းရန်</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title mb-md">မကြာသေးမီ တင်သွင်းမှုများ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ရက်စွဲ</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်းစျေး</th><th>အခြေအနေ</th></tr></thead>
          <tbody>
            <tr><td>မတ် 28</td><td>နှမ်း</td><td>မန္တလေး</td><td>51,000 / 52,500</td><td><span className="verify-badge verified">အတည်ပြုပြီး</span></td></tr>
            <tr><td>မတ် 28</td><td>ပဲတီစိမ်း</td><td>မန္တလေး</td><td>38,000 / 39,500</td><td><span className="verify-badge pending">စောင့်ဆဲ</span></td></tr>
            <tr><td>မတ် 27</td><td>မြေပဲ</td><td>မိတ္ထီလာ</td><td>42,000 / 43,000</td><td><span className="verify-badge verified">အတည်ပြုပြီး</span></td></tr>
            <tr><td>မတ် 27</td><td>နှမ်း</td><td>မန္တလေး</td><td>50,500 / 52,000</td><td><span className="verify-badge peer">ကုန်သည်စစ်ပြီး</span></td></tr>
            <tr><td>မတ် 26</td><td>ဆန်</td><td>မန္တလေး</td><td>28,000 / 29,500</td><td><span className="verify-badge flagged">သံသယ</span></td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
