export const metadata = { title: 'တောင်သူအလင်း — စျေးနှုန်းကြီးကြပ်' };
export default function FairPricePage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးနှုန်း မျှတမှု ကြီးကြပ်ခြင်း</h1>
      <p className="page-subtitle">စျေးနှုန်းပြောင်းလဲမှုနှင့် တရားမျှတ ကိုးကားစျေး ကြီးကြပ်ရန်</p>
      <div className="alert-banner warning mb-lg"><span>ရှမ်းပြည်နယ်တွင် နှမ်းစျေး 15% ကျဆင်းနေပါသည် — ဘေးအန္တရာယ်ကြောင့် ဖြစ်နိုင်ပါသည်</span></div>
      <div className="card mb-lg">
        <div className="card-title mb-md">စျေးနှုန်း ပြောင်းလဲမှု မြင့်မားသော ဒေသများ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ဒေသ</th><th>ထုတ်ကုန်</th><th>ဒေသတွင်းစျေး</th><th>ပုံမှန်စျေး</th><th>ကိုးကားစျေး</th><th>ကွာဟမှု</th><th>အကြောင်းပြ</th></tr></thead>
          <tbody>
            <tr style={{ background: 'var(--danger-bg)' }}><td>ရှမ်းမြောက်</td><td>နှမ်း</td><td style={{ color: 'var(--danger)', fontWeight: 700 }}>45,000</td><td>52,000</td><td style={{ color: 'var(--info)', fontWeight: 700 }}>51,000</td><td className="price-down">-15%</td><td>ရေကြီးမှု</td></tr>
            <tr style={{ background: 'var(--warning-bg)' }}><td>ရှမ်းမြောက်</td><td>ပဲ</td><td style={{ color: 'var(--danger)', fontWeight: 700 }}>35,000</td><td>39,500</td><td style={{ color: 'var(--info)', fontWeight: 700 }}>38,000</td><td className="price-down">-11%</td><td>ရေကြီးမှု</td></tr>
            <tr><td>မကွေး</td><td>မြေပဲ</td><td>43,500</td><td>43,000</td><td>43,000</td><td className="price-stable">+1%</td><td>ပုံမှန်</td></tr>
          </tbody>
        </table></div>
      </div>
      <div className="insight-card"><div className="insight-text"><strong>AI ခွဲခြမ်းချက်:</strong> ရှမ်းမြောက်တွင် စျေးနှုန်းကျဆင်းခြင်းသည် ရေကြီးမှုကြောင့် ယာယီဖြစ်နိုင်ပါသည်။ တောင်သူများအား ယာယီစျေးကျခြင်းအတွက် ထိတ်လန့်၍ မရောင်းရန် အသိပေးထားပါသည်။</div></div>
    </div>
  );
}
