'use client';

import React from 'react';

interface TradeTransactionFormProps {
  role: 'merchant' | 'farmer' | 'admin';
}

export default function TradeTransactionForm({ role }: TradeTransactionFormProps) {
  const isMerchant = role === 'merchant';
  const isAdmin = role === 'admin';

  let pageTitle = isAdmin 
    ? 'အရောင်းအဝယ် စိစစ်ရန်စာမျက်နှာ (Admin Review)' 
    : (isMerchant 
      ? 'တောင်သူထံမှ ဝယ်ယူရန် ကုန်သွယ်မှုစာမျက်နှာ' 
      : 'ကုန်သည်သို့ ရောင်းချရန် ကုန်သွယ်မှုစာမျက်နှာ');
    
  let pageSubtitle = isAdmin
    ? 'အရောင်းအဝယ် အချက်အလက်များနှင့် ငွေလွှဲမှု မှန်ကန်ကြောင်း စိစစ်ခြင်း'
    : (isMerchant
      ? 'ဝယ်ယူရန် အတည်ပြုခြင်း'
      : 'ရောင်းချရန် အတည်ပြုခြင်း');

  const submitBtnText = isMerchant ? 'ဝယ်ယူရန်တင်မည်' : 'ရောင်းချရန်တင်မည်';
  const confirmBtnText = isMerchant ? 'ဝယ်ယူရန်အတည်ပြုမည်' : 'ရောင်းချရန်အတည်ပြုမည်';

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: 'var(--space-lg) 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 var(--space-md)' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
          <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
            {pageTitle}
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.1rem', color: 'var(--gray-600)' }}>
            {pageSubtitle}
          </p>
        </div>

        {/* 1. Transaction Summary */}
        <div className="card mb-lg" style={{ borderTop: '4px solid var(--primary-500)', boxShadow: 'var(--shadow-md)' }}>
          <div className="card-title mb-md">အရောင်းအဝယ် အကျဉ်းချုပ်</div>
          <div className="grid-2" style={{ gap: 'var(--space-lg)' }}>
            <div>
              <div className="form-label" style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>ငွေလွှဲ/အရောင်းအဝယ် အမှတ်</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-lg)' }}>TRN-20260329-001</div>
            </div>
            <div>
              <div className="form-label" style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>ရက်စွဲ</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-lg)' }}>၂၀၂၆ မတ်လ ၂၉ ရက်</div>
            </div>
            <div>
              <div className="form-label" style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>အခြေအနေ</div>
              <div><span className="verify-badge pending" style={{ padding: '6px 12px', fontSize: 'var(--font-sm)' }}>စိစစ်ဆဲ</span></div>
            </div>
            <div>
              <div className="form-label" style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>သီးနှံအမည်</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-lg)' }}>နှမ်း (မန္တလေး)</div>
            </div>
            <div>
              <div className="form-label" style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>အရေအတွက်</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-lg)', color: 'var(--primary-700)' }}>တင်း ၅၀</div>
            </div>
            <div>
              <div className="form-label" style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)' }}>သဘောတူစျေးနှုန်း (စုစုပေါင်း)</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-2xl)', color: 'var(--gray-900)' }}>၂,၆၂၅,၀၀၀ ကျပ်</div>
            </div>
          </div>
        </div>

        {/* 2. Product Information */}
        <div className="card mb-lg">
          <div className="card-title mb-md">သီးနှံအချက်အလက်များ</div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            <div className="form-group"><label className="form-label">သီးနှံအမည်</label><input type="text" className="form-input" defaultValue="နှမ်း" readOnly={isAdmin} /></div>
            <div className="form-group"><label className="form-label">အမျိုးအစား</label><select className="form-select" disabled={isAdmin}><option>ဆီကြိတ်နှမ်းမည်း</option><option>နှမ်းဖြူ</option></select></div>
            <div className="form-group"><label className="form-label">အရည်အသွေးအဆင့်</label><select className="form-select" disabled={isAdmin}><option>ပုံမှန်အဆင့် (Standard)</option><option>အမြင့်အဆင့် (High)</option></select></div>
            <div className="form-group"><label className="form-label">အရေအတွက်</label><input type="number" className="form-input" defaultValue={50} readOnly={isAdmin} /></div>
            <div className="form-group"><label className="form-label">ယူနစ်</label><select className="form-select" disabled={isAdmin}><option>တင်း</option><option>ပိဿာ</option><option>တန်</option></select></div>
            <div className="form-group"><label className="form-label">စျေးနှုန်း</label><input type="text" className="form-input" defaultValue="၅၂,၅၀၀ ကျပ်" readOnly={isAdmin} /></div>
            <div className="form-group"><label className="form-label">ရိတ်သိမ်းရက် / ရနိုင်မည့်ရက်</label><input type="date" className="form-input" defaultValue="2026-04-05" readOnly={isAdmin} /></div>
            <div className="form-group"><label className="form-label">မှတ်ချက်</label><input type="text" className="form-input" placeholder="အစိုဓာတ် ၁၀% အောက် ဖြစ်ရမည်" readOnly={isAdmin} /></div>
          </div>
        </div>

        {/* 3. Farmer Information */}
        <div className="card mb-lg">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
             <div className="card-title m-0">တောင်သူအချက်အလက်များ</div>
             <span className="verify-badge verified">အတည်ပြုပြီး</span>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            <div className="form-group"><label className="form-label">တောင်သူအမည်</label><input type="text" className="form-input" defaultValue="ဦးလှမောင်" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">မှတ်ပုံတင်အမှတ်</label><input type="text" className="form-input" defaultValue="၉/မထလ(နိုင်)၁၂၃၄၅၆" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">ဖုန်းနံပါတ်</label><input type="tel" className="form-input" defaultValue="၀၉-၁၂၃၄၅၆၇၈၉" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">လိပ်စာ / ကျေးရွာ</label><input type="text" className="form-input" defaultValue="ရွှေတောင်ရွာ" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">မြို့နယ်</label><input type="text" className="form-input" defaultValue="မလှိုင်" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">တိုင်း/ပြည်နယ်</label><input type="text" className="form-input" defaultValue="မန္တလေးတိုင်း" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">လယ်ယာအမည်</label><input type="text" className="form-input" defaultValue="ရွှေလယ်မြေ" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">အဓိကသီးနှံ</label><input type="text" className="form-input" defaultValue="နှမ်း၊ မြေပဲ" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">လယ်ယာအကျယ်အဝန်း</label><input type="text" className="form-input" defaultValue="၁၀ ဧက" readOnly={!isMerchant || isAdmin} /></div>
            <div className="form-group"><label className="form-label">သိုလှောင်နိုင်မှု</label><select className="form-select" disabled={!isMerchant || isAdmin}><option>ရှိသည် (ဂိုဒေါင်ငယ်)</option><option>မရှိပါ</option></select></div>
          </div>
        </div>

        {/* 4. Merchant Information */}
        <div className="card mb-lg">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
             <div className="card-title m-0">ကုန်သည်အချက်အလက်များ</div>
             <span className="verify-badge pending">စိစစ်ဆဲ</span>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
             <div className="form-group"><label className="form-label">ကုန်သည်အမည်</label><input type="text" className="form-input" defaultValue="ဦးကျော်မင်း" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">ကုမ္ပဏီအမည်</label><input type="text" className="form-input" defaultValue="ရွှေမန္တလေး ပွဲရုံ" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">လုပ်ငန်းမှတ်ပုံတင်အမှတ်</label><input type="text" className="form-input" placeholder="၁၂၃-၄၅၆-၇၈၉" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">ဖုန်းနံပါတ်</label><input type="text" className="form-input" defaultValue="၀၉-၉၈၇၆၅၄၃၂၁" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">မြို့နယ်</label><input type="text" className="form-input" defaultValue="ချမ်းအေးသာစံ" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">တိုင်း/ပြည်နယ်</label><input type="text" className="form-input" defaultValue="မန္တလေးတိုင်း" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">ဝယ်ယူနိုင်မှုပမာဏ</label><input type="text" className="form-input" defaultValue="အကန့်အသတ်မရှိ" readOnly={isMerchant || isAdmin} /></div>
             <div className="form-group"><label className="form-label">သိုလှောင်ရုံရှိ/မရှိ</label><select className="form-select" disabled={isMerchant || isAdmin}><option>ရှိသည် (ပွဲရုံကြီး)</option><option>မရှိပါ</option></select></div>
             <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">လုပ်ကိုင်သောစျေးကွက်များ</label><input type="text" className="form-input" defaultValue="မန္တလေးပွဲရုံတန်း၊ ရန်ကုန်ဘုရင့်နောင်" readOnly={isMerchant || isAdmin} /></div>
          </div>
        </div>

        {/* 5. KYC / Verification Details */}
        <div className="card mb-lg" style={{ background: 'var(--info-bg)', border: '1px solid #bfdbfe' }}>
          <div className="card-title mb-md" style={{ color: '#1e3a8a' }}>KYC အတည်ပြုရန်အချက်အလက်</div>
          <p style={{ fontSize: 'var(--font-sm)', color: '#1d4ed8', marginBottom: 'var(--space-lg)' }}>
            လုံခြုံစိတ်ချရသော အရောင်းအဝယ်ဖြစ်စေရန်အတွက် မိမိ၏ မှတ်ပုံတင် သို့မဟုတ် လုပ်ငန်းလိုင်စင်များကို မှန်ကန်စွာ တင်ပြပေးပါ။
          </p>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
             <div className="upload-zone" style={{ background: '#fff', padding: 'var(--space-xl) var(--space-md)' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🪪</div>
               <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>မှတ်ပုံတင်တင်ရန်</div>
               <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)', marginTop: '4px' }}>ရှေ့/နောက် ပုံစုံပါရမည်</div>
             </div>
             <div className="upload-zone" style={{ background: '#fff', padding: 'var(--space-xl) var(--space-md)' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📸</div>
               <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>ဓာတ်ပုံတင်ရန်</div>
               <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)', marginTop: '4px' }}>မှတ်ပုံတင်ကိုင်ဆောင်ထားသောပုံ</div>
             </div>
             <div className="upload-zone" style={{ background: '#fff', padding: 'var(--space-xl) var(--space-md)', gridColumn: '1 / -1' }}>
               <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📄</div>
               <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>လုပ်ငန်းလိုင်စင် / စာရွက်စာတမ်းတင်ရန်</div>
             </div>
          </div>
          {!isAdmin && (
            <div style={{ marginTop: 'var(--space-lg)', textAlign: 'right' }}>
               <button className="btn btn-primary" style={{ background: '#2563eb' }}>စိစစ်ရန်ပို့မည်</button>
            </div>
          )}
        </div>

        {/* 6. Delivery and Logistics */}
        <div className="card mb-lg">
          <div className="card-title mb-md">Logistics နှင့် သယ်ယူပို့ဆောင်ရေး</div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
             <div className="form-group"><label className="form-label">ပို့ဆောင်မှုအမျိုးအစား</label><select className="form-select" disabled={isAdmin}><option>လာယူမည်</option><option>ပို့ပေးမည်</option></select></div>
             <div className="form-group"><label className="form-label">တာဝန်ယူသူ</label><select className="form-select" disabled={isAdmin}><option>ကုန်သည်</option><option>တောင်သူ</option><option>ဝေမျှကျခံမည်</option></select></div>
             <div className="form-group"><label className="form-label">ပို့ဆောင်မည့်ရက်</label><input type="date" className="form-input" defaultValue="2026-04-06" readOnly={isAdmin} /></div>
             <div className="form-group"><label className="form-label">လိပ်စာ / နေရာ</label><input type="text" className="form-input" placeholder="ပွဲရုံလိပ်စာ သို့မဟုတ် ခြံလိပ်စာ" readOnly={isAdmin} /></div>
             <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">သယ်ယူပို့ဆောင်ရေးမှတ်ချက်</label><input type="text" className="form-input" placeholder="၁၂ ဘီးကားဖြင့် လာရောက်သယ်ယူမည်" readOnly={isAdmin} /></div>
          </div>
        </div>

        {/* 7. Payment */}
        <div className="card mb-lg" style={{ border: '1px solid var(--gray-200)' }}>
          <div className="card-title mb-md">ငွေပေးချေမှု အချက်အလက်များ</div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
             <div className="form-group"><label className="form-label">တစ်ယူနစ်စျေး (ကျပ်)</label><input type="text" className="form-input" defaultValue="၅၂,၅၀၀" readOnly={isAdmin} /></div>
             <div className="form-group"><label className="form-label">စုစုပေါင်းငွေပမာဏ (ကျပ်)</label><input type="text" className="form-input" defaultValue="၂,၆၂၅,၀၀၀" readOnly={isAdmin} /></div>
             <div className="form-group"><label className="form-label">သယ်ယူပို့ဆောင်စရိတ် (ကျပ်)</label><input type="text" className="form-input" defaultValue="၅၀,၀၀၀" readOnly={isAdmin} /></div>
             <div className="form-group"><label className="form-label">ကြိုတင်ငွေ (ကျပ်)</label><input type="text" className="form-input" defaultValue="၅၀၀,၀၀၀" readOnly={isAdmin} /></div>
          </div>
          
          <div style={{ padding: 'var(--space-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
               <span style={{ color: 'var(--gray-600)' }}>စုစုပေါင်း ကုန်ကျစရိတ်:</span>
               <span style={{ fontWeight: 600 }}>၂,၆၇၅,၀၀၀ ကျပ်</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
               <span style={{ color: 'var(--gray-600)' }}>ကြိုတင်ပေးပြီးငွေ:</span>
               <span style={{ fontWeight: 600, color: 'var(--success)' }}>- ၅၀၀,၀၀၀ ကျပ်</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--gray-200)', paddingTop: '12px' }}>
               <span style={{ fontWeight: 600, fontSize: 'var(--font-lg)' }}>ကျန်ငွေ (နောက်ဆုံးပေးချေရမည့်ငွေ):</span>
               <span style={{ fontWeight: 700, fontSize: 'var(--font-xl)', color: 'var(--primary-700)' }}>၂,၁၇၅,၀၀၀ ကျပ်</span>
             </div>
          </div>

          <div className="grid-2" style={{ gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
             <div className="form-group"><label className="form-label">ငွေပေးချေမှုနည်းလမ်း</label><select className="form-select" disabled={isAdmin}><option>KBZPay</option><option>WavePay</option><option>ဘဏ်လွှဲ</option><option>ငွေသား</option></select></div>
             <div className="form-group"><label className="form-label">ငွေပေးချေရမည့်ရက်</label><input type="date" className="form-input" defaultValue="2026-04-06" readOnly={isAdmin} /></div>
             <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">ငွေပေးချေမှုအခြေအနေ</label><select className="form-select" disabled={isAdmin}><option>ကြိုတင်ငွေပေးပြီး</option><option>အပြည့်အဝပေးပြီး</option><option>မပေးရသေးပြည့်စုံ</option></select></div>
          </div>
        </div>

        {/* 8. Terms and Agreement */}
        <div className="card mb-lg" style={{ background: 'var(--earth-50)', border: '1px solid var(--earth-200)' }}>
          <div className="card-title mb-md" style={{ color: 'var(--earth-700)' }}>သဘောတူညီချက်နှင့် အတည်ပြုခြင်း</div>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-700)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
            အထက်ပါ အရောင်းအဝယ်အချက်အလက်များအားလုံးကို ထပ်မံဖတ်ရှုစစ်ဆေးပြီး မှန်ကန်ကြောင်း ကိုယ်တိုင် မြင်တွေ့သဘောတူပါသည်။
          </p>
          
          <div className="form-group" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <input type="checkbox" id="farmer_agree" defaultChecked={!isMerchant} disabled={isMerchant || isAdmin} style={{ width: '22px', height: '22px', accentColor: 'var(--primary-600)' }} />
            <label htmlFor="farmer_agree" style={{ fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-base)' }}>တောင်သူအတည်ပြုချက် (သဘောတူသည်)</label>
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <input type="checkbox" id="merchant_agree" defaultChecked={isMerchant} disabled={!isMerchant || isAdmin} style={{ width: '22px', height: '22px', accentColor: 'var(--primary-600)' }} />
            <label htmlFor="merchant_agree" style={{ fontWeight: 600, cursor: 'pointer', fontSize: 'var(--font-base)' }}>ကုန်သည်အတည်ပြုချက် (သဘောတူသည်)</label>
          </div>

          <div className="form-group">
            <label className="form-label">မှတ်ချက်</label>
            <textarea className="form-input" rows={3} placeholder="အခြားသဘောတူညီချက်များချန်ထားလိုပါက ဤနေရာတွင် ရေးသားပါ..." readOnly={isAdmin}></textarea>
          </div>
          
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-500)', marginTop: 'var(--space-sm)' }}>
            အတည်ပြုချိန်: ၂၀၂၆ မတ်လ ၂၉ ရက်၊ နေ့လည် ၂:၃၀ 
          </div>
        </div>

        {/* 9. Final Confirmation and Actions */}
        <div className="card mb-lg" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', justifyContent: 'center' }}>
            {isAdmin ? (
              <>
                <button className="btn btn-danger" style={{ fontSize: 'var(--font-base)', background: '#ef4444' }}>ပယ်ဖျက်မည် (Reject)</button>
                <button className="btn btn-primary" style={{ fontSize: 'var(--font-base)', padding: '14px 32px' }}>အတည်ပြုမည် (Approve)</button>
              </>
            ) : (
              <>
                <button className="btn btn-outline" style={{ fontSize: 'var(--font-sm)' }}>မူကြမ်းသိမ်းမည်</button>
                <button className="btn btn-danger" style={{ fontSize: 'var(--font-sm)', background: '#ef4444' }}>ပယ်ဖျက်မည်</button>
                <button className="btn" style={{ fontSize: 'var(--font-sm)', background: 'var(--earth-500)', color: '#fff' }}>စိစစ်ရန်ပို့မည်</button>
                <button className="btn btn-primary" style={{ fontSize: 'var(--font-base)', padding: '14px 32px' }}>{submitBtnText}</button>
                <button className="btn btn-primary" style={{ fontSize: 'var(--font-base)', background: '#4f46e5' }}>{confirmBtnText}</button>
                <button className="btn" style={{ fontSize: 'var(--font-base)', background: '#10b981', color: '#fff' }}>ပြီးစီးကြောင်းသတ်မှတ်မည်</button>
              </>
            )}
          </div>
        </div>

        {/* Status timeline / Progress */}
        <div style={{ textAlign: 'center', padding: '0 var(--space-lg)' }}>
           <div style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-500)', marginBottom: '12px' }}>အရောင်းအဝယ် လုပ်ငန်းစဉ် အခြေအနေ</div>
           <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="verify-badge verified" style={{ opacity: 0.5 }}>မူကြမ်း</span>
              <span style={{ color: 'var(--gray-400)' }}>→</span>
              <span className="verify-badge pending">စိစစ်ဆဲ</span>
              <span style={{ color: 'var(--gray-400)' }}>→</span>
              <span className="verify-badge verified" style={{ opacity: 0.5 }}>အတည်ပြုပြီး</span>
              <span style={{ color: 'var(--gray-400)' }}>→</span>
              <span className="verify-badge pending" style={{ opacity: 0.5, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af' }}>ပို့ဆောင်နေဆဲ</span>
              <span style={{ color: 'var(--gray-400)' }}>→</span>
              <span className="verify-badge verified" style={{ opacity: 0.5 }}>ပြီးစီးသည်</span>
           </div>
        </div>

      </div>
    </div>
  );
}
