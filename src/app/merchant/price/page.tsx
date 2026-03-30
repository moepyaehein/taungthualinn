'use client';

import { useState } from 'react';

export default function PricePage() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  return (
    <div className="tab-panel">
      <h1 className="page-title">စျေးနှုန်းတင်သွင်းခြင်း</h1>
      <p className="page-subtitle">တစ်ခုချင်း သို့မဟုတ် CSV ဖိုင်ဖြင့် အစုလိုက် တင်သွင်းနိုင်ပါသည်</p>

      {/* ── Mode Toggle ── */}
      <div className="card mb-lg" style={{ padding: '6px', display: 'inline-flex', gap: '4px', borderRadius: 'var(--radius-full)' }}>
        <button
          onClick={() => setMode('single')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: 'var(--font-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: mode === 'single' ? 'var(--primary-600)' : 'transparent',
            color: mode === 'single' ? '#fff' : 'var(--gray-500)',
            boxShadow: mode === 'single' ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none',
          }}
        >
          📝 တစ်ခုချင်းတင်
        </button>
        <button
          onClick={() => setMode('bulk')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: 'var(--font-sm)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: mode === 'bulk' ? '#4f46e5' : 'transparent',
            color: mode === 'bulk' ? '#fff' : 'var(--gray-500)',
            boxShadow: mode === 'bulk' ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none',
          }}
        >
          📁 အစုလိုက်တင်
        </button>
      </div>

      {/* ── Single Price Upload ── */}
      {mode === 'single' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card mb-lg">
            <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)',
                fontWeight: 700, color: '#fff', background: 'var(--primary-600)',
              }}>၁</span>
              ထုတ်ကုန်နှင့် စျေးကွက် ရွေးချယ်ပါ
            </div>
            <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
              <div className="form-group"><label className="form-label">အမျိုးအစား</label><select className="form-select"><option>ဆီထွက်သီးနှံ</option><option>စပါး</option><option>ပဲအမျိုးမျိုး</option><option>ဟင်းသီးဟင်းရွက်</option><option>သစ်သီးများ</option></select></div>
              <div className="form-group"><label className="form-label">ထုတ်ကုန်</label><select className="form-select"><option>နှမ်း</option><option>မြေပဲ</option><option>နေကြာ</option><option>မုန်ညင်း</option></select></div>
              <div className="form-group"><label className="form-label">ပြည်နယ်/တိုင်း</label><select className="form-select"><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option><option>မကွေးတိုင်း</option></select></div>
              <div className="form-group"><label className="form-label">စျေးကွက်</label><select className="form-select"><option>မန္တလေး</option><option>မိတ္ထီလာ</option><option>ပြင်ဦးလွင်</option></select></div>
              <div className="form-group"><label className="form-label">ယူနစ်</label><select className="form-select"><option>တစ်တင်း</option><option>တစ်ပိဿာ</option><option>တစ်တန်</option></select></div>
              <div className="form-group"><label className="form-label">မွမ်းမံနှုန်း</label><select className="form-select"><option>နေ့စဉ်</option><option>အပတ်စဉ်</option></select></div>
            </div>

            <div style={{
              marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)',
              borderTop: '1px solid var(--gray-100)',
            }}>
              <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-xs)',
                  fontWeight: 700, color: '#fff', background: 'var(--primary-600)',
                }}>၂</span>
                စျေးနှုန်း ထည့်သွင်းပါ
              </div>
              <div className="grid-3" style={{ gap: 'var(--space-sm)' }}>
                <div className="form-group"><label className="form-label">ဝယ်စျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၀,၀၀၀" /></div>
                <div className="form-group"><label className="form-label">ရောင်းစျေး (Ks)</label><input type="number" className="form-input" placeholder="ဥပမာ - ၅၂,၅၀၀" /></div>
                <div className="form-group"><label className="form-label">အရည်အသွေး</label><select className="form-select"><option>ပုံမှန်</option><option>အရည်အသွေးမြင့်</option><option>အရည်အသွေးနိမ့်</option></select></div>
              </div>
              <div className="form-group"><label className="form-label">မှတ်ချက်</label><textarea className="form-input" rows={2} placeholder="ဥပမာ — ဝယ်လိုအားကောင်း၊ ပမာဏများ"></textarea></div>
              <div className="flex gap-md">
                <button className="btn btn-outline" onClick={() => alert('မူကြမ်းသိမ်းပြီး')}>မူကြမ်းသိမ်းရန်</button>
                <button className="btn btn-primary" onClick={() => alert('တင်သွင်းပြီး')}>တင်သွင်းရန်</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Upload ── */}
      {mode === 'bulk' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card mb-lg">
            <div className="card-title mb-md" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              📁 CSV / Excel ဖိုင်ဖြင့် တင်သွင်းရန်
            </div>
            <div className="upload-zone" style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>📤</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)', marginBottom: 8, color: 'var(--gray-700)' }}>ဖိုင်ရွေးရန် နှိပ်ပါ သို့ ဒီနေရာသို့ ဆွဲချပါ</div>
              <div style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>CSV, Excel (.xlsx, .xls) ဖိုင်များ ထောက်ပံ့ပါသည်</div>
              <div style={{
                marginTop: 'var(--space-md)', display: 'inline-flex', gap: '8px',
                padding: '6px 16px', borderRadius: 'var(--radius-full)',
                background: 'var(--primary-50)', fontSize: 'var(--font-xs)',
                color: 'var(--primary-700)', fontWeight: 600,
              }}>
                အများဆုံး 500 row / 5MB
              </div>
            </div>

            {/* Download Template */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-md)', background: 'var(--gray-50)',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)',
              marginBottom: 'var(--space-lg)',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--gray-800)' }}>နမူနာ ဖိုင်ပုံစံ ဒေါင်းလုဒ်</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>ဤပုံစံအတိုင်း ဖြည့်သွင်းပြီး တင်သွင်းပါ</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => alert('နမူနာဖိုင် ဒေါင်းလုဒ်ပြီး')}>
                ⬇️ ဒေါင်းလုဒ်
              </button>
            </div>
          </div>

          {/* File Format Guide */}
          <div className="card mb-lg">
            <div className="card-title mb-md">📋 ဖိုင်ပုံစံ လမ်းညွှန်</div>
            <div className="table-wrapper"><table className="data-table">
              <thead><tr><th>ကော်လံ</th><th>ဖော်ပြချက်</th><th>ဥပမာ</th><th>လိုအပ်မှု</th></tr></thead>
              <tbody>
                <tr><td style={{ fontWeight: 600 }}>အမျိုးအစား</td><td>ထုတ်ကုန်အမျိုးအစား</td><td>ဆီထွက်သီးနှံ</td><td><span className="verify-badge verified">လိုအပ်</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>ထုတ်ကုန်</td><td>ထုတ်ကုန်အမည်</td><td>နှမ်း</td><td><span className="verify-badge verified">လိုအပ်</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>စျေးကွက်</td><td>စျေးကွက်အမည်</td><td>မန္တလေး</td><td><span className="verify-badge verified">လိုအပ်</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>ဝယ်စျေး</td><td>ဝယ်ယူစျေးနှုန်း (ကျပ်)</td><td>၅၁၀၀၀</td><td><span className="verify-badge verified">လိုအပ်</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>ရောင်းစျေး</td><td>ရောင်းချစျေးနှုန်း (ကျပ်)</td><td>၅၂၅၀၀</td><td><span className="verify-badge verified">လိုအပ်</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>အရည်အသွေး</td><td>ပုံမှန် / မြင့် / နိမ့်</td><td>ပုံမှန်</td><td><span className="verify-badge pending">ရွေးချယ်</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>မှတ်ချက်</td><td>ထပ်ဆောင်းမှတ်ချက်</td><td>ပမာဏများ</td><td><span className="verify-badge pending">ရွေးချယ်</span></td></tr>
              </tbody>
            </table></div>
          </div>

          {/* Upload History */}
          <div className="card">
            <div className="card-title mb-md">📂 ယခင် အစုလိုက်တင်သွင်းမှုများ</div>
            <div className="table-wrapper"><table className="data-table">
              <thead><tr><th>ရက်စွဲ</th><th>ဖိုင်အမည်</th><th>Row</th><th>Error</th><th>အခြေအနေ</th></tr></thead>
              <tbody>
                <tr><td>မတ် ၂၇</td><td>mandalay_prices_၀၃၂၇.csv</td><td>၂၄</td><td>၀</td><td><span className="verify-badge verified">အတည်ပြုပြီး</span></td></tr>
                <tr><td>မတ် ၂၅</td><td>weekly_oilseeds.xlsx</td><td>၁၈</td><td>၂</td><td><span className="verify-badge peer">စစ်ဆေးဆဲ</span></td></tr>
                <tr><td>မတ် ၂၂</td><td>all_products_၀၃၂၂.csv</td><td>၄၅</td><td>၁</td><td><span className="verify-badge verified">အတည်ပြုပြီး</span></td></tr>
              </tbody>
            </table></div>
          </div>
        </div>
      )}

      {/* ── Recent Submissions (shown in both modes) ── */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card-title mb-md">မကြာသေးမီ တင်သွင်းမှုများ</div>
        <div className="table-wrapper"><table className="data-table">
          <thead><tr><th>ရက်စွဲ</th><th>ထုတ်ကုန်</th><th>စျေးကွက်</th><th>ဝယ်/ရောင်းစျေး</th><th>တင်နည်း</th><th>အခြေအနေ</th></tr></thead>
          <tbody>
            <tr><td>မတ် ၂၈</td><td>နှမ်း</td><td>မန္တလေး</td><td>၅၁,၀၀၀ / ၅၂,၅၀၀</td><td><span style={{ fontSize: 'var(--font-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 600 }}>📝 တစ်ခုချင်း</span></td><td><span className="verify-badge verified">အတည်ပြုပြီး</span></td></tr>
            <tr><td>မတ် ၂၈</td><td>ပဲတီစိမ်း</td><td>မန္တလေး</td><td>၃၈,၀၀၀ / ၃၉,၅၀၀</td><td><span style={{ fontSize: 'var(--font-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>📁 အစုလိုက်</span></td><td><span className="verify-badge pending">စောင့်ဆဲ</span></td></tr>
            <tr><td>မတ် ၂၇</td><td>မြေပဲ</td><td>မိတ္ထီလာ</td><td>၄၂,၀၀၀ / ၄၃,၀၀၀</td><td><span style={{ fontSize: 'var(--font-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 600 }}>📝 တစ်ခုချင်း</span></td><td><span className="verify-badge verified">အတည်ပြုပြီး</span></td></tr>
            <tr><td>မတ် ၂၇</td><td>နှမ်း</td><td>မန္တလေး</td><td>၅၀,၅၀၀ / ၅၂,၀၀၀</td><td><span style={{ fontSize: 'var(--font-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: '#eef2ff', color: '#4f46e5', fontWeight: 600 }}>📁 အစုလိုက်</span></td><td><span className="verify-badge peer">ကုန်သည်စစ်ပြီး</span></td></tr>
            <tr><td>မတ် ၂၆</td><td>ဆန်</td><td>မန္တလေး</td><td>၂၈,၀၀၀ / ၂၉,၅၀၀</td><td><span style={{ fontSize: 'var(--font-xs)', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary-700)', fontWeight: 600 }}>📝 တစ်ခုချင်း</span></td><td><span className="verify-badge flagged">သံသယ</span></td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  );
}
