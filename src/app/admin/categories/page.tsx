export const metadata = { title: 'တောင်သူအလင်း — အမျိုးအစားစီမံ' };
export default function CategoriesPage() {
  return (
    <div className="tab-panel">
      <h1 className="page-title">အမျိုးအစားစီမံခန့်ခွဲ</h1>
      <p className="page-subtitle">ထုတ်ကုန်အမျိုးအစား၊ စျေးကွက်နှင့် ယူနစ်များ စီမံရန်</p>
      <div className="grid-2 mb-lg">
        <div className="card">
          <div className="card-title mb-md">ထုတ်ကုန်အမျိုးအစား</div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            {[
              { cat: 'ဆီထွက်သီးနှံ', items: 'နှမ်း, မြေပဲ, နေကြာ, မုန်ညင်း' },
              { cat: 'ပဲအမျိုးမျိုး', items: 'ပဲတီစိမ်း, ပဲစင်းငုံ, မတ်ပဲ' },
              { cat: 'စပါး/ဆန်', items: 'ဆန်, ကောက်ပဲ' },
              { cat: 'ဟင်းသီးဟင်းရွက်', items: 'ခရမ်းချဉ်, ပဲငပိ' },
              { cat: 'သစ်သီးများ', items: 'သရက်, ငှက်ပျော' },
            ].map((c, i) => (
              <div key={i} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--gray-100)' : 'none' }}>
                <span><strong>{c.cat}</strong> — {c.items}</span>
                <button className="btn btn-sm btn-outline">ပြင်</button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-sm mt-md">အမျိုးအစားအသစ်</button>
        </div>
        <div className="card">
          <div className="card-title mb-md">ဒေသ/စျေးကွက်</div>
          <div style={{ fontSize: 'var(--font-sm)' }}>
            {[
              { region: 'မန္တလေးတိုင်း', markets: 'မန္တလေး, မိတ္ထီလာ, ပြင်ဦးလွင်' },
              { region: 'စစ်ကိုင်းတိုင်း', markets: 'စစ်ကိုင်း, မုံရွာ' },
              { region: 'မကွေးတိုင်း', markets: 'မကွေး, ပခုက္ကူ' },
              { region: 'ရန်ကုန်တိုင်း', markets: 'ရန်ကုန်, သန်လျင်' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                <span><strong>{r.region}</strong> — {r.markets}</span>
                <button className="btn btn-sm btn-outline">ပြင်</button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-sm mt-md">ဒေသအသစ်</button>
        </div>
      </div>
    </div>
  );
}
