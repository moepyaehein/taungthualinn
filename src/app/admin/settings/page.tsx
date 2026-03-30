'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { key: 'general', label: 'အထွေထွေ', icon: '⚙️' },
    { key: 'pricing', label: 'စျေးနှုန်းသတ်မှတ်ချက်', icon: '💰' },
    { key: 'notifications', label: 'အသိပေးချက်', icon: '🔔' },
    { key: 'security', label: 'လုံခြုံရေး', icon: '🔒' },
    { key: 'data', label: 'ဒေတာစီမံ', icon: '📦' },
  ];

  return (
    <div className="tab-panel">
      <h1 className="page-title">ဆက်တင်များ</h1>
      <p className="page-subtitle">ပလက်ဖောင်း ပြင်ဆင်သတ်မှတ်ချက်များ</p>

      {saved && (
        <div className="alert-banner success mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div><strong>✓ သိမ်းဆည်းပြီး!</strong> ပြောင်းလဲမှုများကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-lg)' }}>
        {/* Settings Nav */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', alignSelf: 'start' }}>
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px 18px',
                border: 'none',
                borderLeft: activeSection === s.key ? '3px solid var(--primary-600)' : '3px solid transparent',
                background: activeSection === s.key ? 'var(--primary-50, rgba(5,150,105,0.06))' : 'transparent',
                color: activeSection === s.key ? 'var(--primary-700)' : 'var(--gray-600)',
                fontWeight: activeSection === s.key ? 700 : 500,
                fontSize: 'var(--font-sm)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: '1px solid var(--gray-100)',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div>
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
              <div className="card-title mb-lg">အထွေထွေ ဆက်တင်များ</div>

              <div className="form-group mb-lg">
                <label className="form-label">ပလက်ဖောင်း အမည်</label>
                <input className="form-input" defaultValue="တောင်သူအလင်း" />
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginTop: 4 }}>ပလက်ဖောင်း ခေါင်းစီးတွင် ပြသမည့် အမည်</div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">မူလ ဘာသာစကား</label>
                <select className="form-select">
                  <option>မြန်မာ (Unicode)</option>
                  <option>English</option>
                </select>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">တိုင်းဒေသကြီး / ပြည်နယ် ကန့်သတ်ချက်</label>
                <select className="form-select" multiple defaultValue={['မန္တလေးတိုင်း', 'စစ်ကိုင်းတိုင်း', 'မကွေးတိုင်း']} style={{ height: '120px' }}>
                  <option value="မန္တလေးတိုင်း">မန္တလေးတိုင်း</option>
                  <option value="စစ်ကိုင်းတိုင်း">စစ်ကိုင်းတိုင်း</option>
                  <option value="မကွေးတိုင်း">မကွေးတိုင်း</option>
                  <option value="ရှမ်းပြည်နယ်">ရှမ်းပြည်နယ်</option>
                  <option value="ကယားပြည်နယ်">ကယားပြည်နယ်</option>
                  <option value="ရန်ကုန်တိုင်း">ရန်ကုန်တိုင်း</option>
                  <option value="ပဲခူးတိုင်း">ပဲခူးတိုင်း</option>
                </select>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginTop: 4 }}>စျေးနှုန်းဒေတာ လက်ခံမည့် ဒေသများ</div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">ငွေကြေးယူနစ်</label>
                <select className="form-select">
                  <option>ကျပ် (Ks)</option>
                  <option>USD ($)</option>
                </select>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">ကုန်ပစ္စည်း အလေးချိန် ယူနစ်</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['ပိဿာ', 'တင်း', 'အိတ်', 'ကီလိုဂရမ်'].map((unit) => (
                    <label key={unit} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', cursor: 'pointer', fontSize: 'var(--font-sm)' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)' }} />
                      {unit}
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSave}>သိမ်းဆည်းရန်</button>
            </div>
          )}

          {/* Pricing Rules */}
          {activeSection === 'pricing' && (
            <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
              <div className="card-title mb-lg">စျေးနှုန်း စစ်ဆေးရေး သတ်မှတ်ချက်</div>

              <div className="form-group mb-lg">
                <label className="form-label">စျေးကွာဟမှု သံသယ (Outlier) အတိုင်းအတာ</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input className="form-input" type="number" defaultValue={15} style={{ width: '100px' }} />
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>% — ဤပမာဏထက် ပိုကွာပါက အလိုအလျောက်သံသယ မှတ်သွားပါမည်</span>
                </div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">အနိမ့်ဆုံး / အမြင့်ဆုံး စျေးနှုန်းကန့်သတ်</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <input className="form-input" placeholder="အနိမ့်ဆုံး (Ks)" style={{ width: '160px' }} defaultValue="100" />
                  <span style={{ color: 'var(--gray-400)' }}>~</span>
                  <input className="form-input" placeholder="အမြင့်ဆုံး (Ks)" style={{ width: '160px' }} defaultValue="500000" />
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--gray-400)' }}>ကျပ်/ပိဿာ</span>
                </div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">ကုန်သည် စစ်ဆေးခြင်း (Peer Verification) လိုအပ်မှု</label>
                <select className="form-select">
                  <option>ကုန်သည် ၁ ဦး စစ်ပြီးမှ Admin ဆီရောက်မည်</option>
                  <option>ကုန်သည် ၂ ဦး စစ်ပြီးမှ Admin ဆီရောက်မည်</option>
                  <option>ကုန်သည်စစ်ရန် မလို (Admin တိုက်ရိုက်)</option>
                </select>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">စျေးနှုန်း အသက်ဝင်ချိန် (Expiry)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input className="form-input" type="number" defaultValue={48} style={{ width: '100px' }} />
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>နာရီ — ဤကာလ ကုန်ဆုံးပါက စျေးနှုန်းကို ဟောင်းအဖြစ် မှတ်ပါမည်</span>
                </div>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '16px 20px', borderRadius: '12px', marginBottom: 'var(--space-lg)', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: 'var(--font-sm)' }}>🤖 AI စစ်ဆေးခြင်း</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)', width: 18, height: 18 }} />
                  <span style={{ fontSize: 'var(--font-sm)' }}>AI အကြံပြုချက်ဖြင့် စျေးနှုန်း ခြားနားမှုကို အလိုအလျောက် စစ်ဆေးမည်</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)', width: 18, height: 18 }} />
                  <span style={{ fontSize: 'var(--font-sm)' }}>ရာသီအလိုက် စျေးနှုန်းခန့်မှန်းချက်ကို နှိုင်းယှဉ်ပြမည်</span>
                </label>
              </div>

              <button className="btn btn-primary" onClick={handleSave}>သိမ်းဆည်းရန်</button>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
              <div className="card-title mb-lg">အသိပေးချက် ဆက်တင်များ</div>

              {[
                { label: 'ကုန်သည်အသစ် မှတ်ပုံတင်ခြင်း', desc: 'ကုန်သည်အသစ်တစ်ဦး အကောင့်ဖွင့်ပါက', defaultChecked: true },
                { label: 'စျေးနှုန်း သံသယ (Outlier)', desc: 'AI မှ သံသယဖြစ်ဖွယ် စျေးနှုန်း တွေ့ပါက', defaultChecked: true },
                { label: 'Bulk Upload တင်သွင်းမှု', desc: 'ကုန်သည်မှ CSV/Excel ဖိုင် တင်ပါက', defaultChecked: true },
                { label: 'အရေးပေါ် ထုတ်ပြန်ချက်', desc: 'သဘာဝဘေးအန္တရာယ် / စျေးကွက်အရေးပေါ်', defaultChecked: true },
                { label: 'စျေးနှုန်း ကုန်ဆုံးခြင်း', desc: 'တင်ထားသော စျေးနှုန်း သက်တမ်းကုန်ဆုံးပါက', defaultChecked: false },
                { label: 'ပလက်ဖောင်း စွမ်းဆောင်ရည်', desc: 'လစဉ် အသုံးပြုမှု အချက်အလက်', defaultChecked: false },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: i < 5 ? '1px solid var(--gray-100)' : 'none',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
                    <input type="checkbox" defaultChecked={item.defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: item.defaultChecked ? 'var(--primary-600)' : 'var(--gray-300)',
                      borderRadius: '24px', transition: '0.3s',
                    }}>
                      <span style={{
                        position: 'absolute', content: '""', height: 18, width: 18,
                        left: item.defaultChecked ? '22px' : '3px', bottom: '3px',
                        backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                      }} />
                    </span>
                  </label>
                </div>
              ))}

              <div className="form-group" style={{ marginTop: 'var(--space-lg)' }}>
                <label className="form-label">အသိပေးချက် ပေးပို့မည့်နည်းလမ်း</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['App Push', 'SMS', 'Email', 'Telegram Bot'].map((method) => (
                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', cursor: 'pointer', fontSize: 'var(--font-sm)' }}>
                      <input type="checkbox" defaultChecked={method === 'App Push' || method === 'Telegram Bot'} style={{ accentColor: 'var(--primary-600)' }} />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }} onClick={handleSave}>သိမ်းဆည်းရန်</button>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
              <div className="card-title mb-lg">လုံခြုံရေး ဆက်တင်များ</div>

              <div className="form-group mb-lg">
                <label className="form-label">ကုန်သည် မှတ်ပုံတင်ခိုင်းခြင်း</label>
                <select className="form-select">
                  <option>ဖုန်းနံပါတ် OTP စစ်ဆေးပြီးမှ</option>
                  <option>Admin ခွင့်ပြုပြီးမှ</option>
                  <option>ဖုန်း OTP + Admin ခွင့်ပြုချက်</option>
                  <option>လွတ်လပ်စွာ မှတ်ပုံတင်ခွင့်ပြု</option>
                </select>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">Admin session သက်တမ်း</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input className="form-input" type="number" defaultValue={24} style={{ width: '100px' }} />
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>နာရီ</span>
                </div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">Login မှားယွင်းမှု ကန့်သတ်</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input className="form-input" type="number" defaultValue={5} style={{ width: '80px' }} />
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>ကြိမ် ထက်ပိုပါက</span>
                  <input className="form-input" type="number" defaultValue={30} style={{ width: '80px' }} />
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>မိနစ် ပိတ်ပင်မည်</span>
                </div>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '16px 20px', borderRadius: '12px', marginBottom: 'var(--space-lg)', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: 'var(--font-sm)' }}>🔐 လုံခြုံရေး အဆင့်မြင့်</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)', width: 18, height: 18 }} />
                  <span style={{ fontSize: 'var(--font-sm)' }}>Two-Factor Authentication (2FA) Admin အတွက် မဖြစ်မနေ</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--primary-600)', width: 18, height: 18 }} />
                  <span style={{ fontSize: 'var(--font-sm)' }}>IP Address ကန့်သတ်ချက် ဖွင့်ရန်</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-600)', width: 18, height: 18 }} />
                  <span style={{ fontSize: 'var(--font-sm)' }}>Audit Log ကို အချိန်မရွေး မှတ်တမ်းတင်ရန်</span>
                </label>
              </div>

              <button className="btn btn-primary" onClick={handleSave}>သိမ်းဆည်းရန်</button>
            </div>
          )}

          {/* Data Management */}
          {activeSection === 'data' && (
            <div className="card" style={{ animation: 'fadeIn 0.25s ease' }}>
              <div className="card-title mb-lg">ဒေတာ စီမံခန့်ခွဲမှု</div>

              <div className="form-group mb-lg">
                <label className="form-label">Bulk Upload ခွင့်ပြုသော ဖိုင်အမျိုးအစား</label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['.csv', '.xlsx', '.xls', '.json'].map((ext) => (
                    <label key={ext} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', cursor: 'pointer', fontSize: 'var(--font-sm)', fontFamily: 'monospace' }}>
                      <input type="checkbox" defaultChecked={ext !== '.json'} style={{ accentColor: 'var(--primary-600)' }} />
                      {ext}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">ဖိုင်အရွယ်အစား ကန့်သတ်ချက်</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input className="form-input" type="number" defaultValue={10} style={{ width: '100px' }} />
                  <span style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>MB (အများဆုံး)</span>
                </div>
              </div>

              <div className="form-group mb-lg">
                <label className="form-label">ဟောင်းစျေးနှုန်းဒေတာ ထိန်းသိမ်းချိန်</label>
                <select className="form-select" defaultValue="၁ နှစ်">
                  <option>၆ လ</option>
                  <option>၁ နှစ်</option>
                  <option>၂ နှစ်</option>
                  <option>အကန့်အသတ်မရှိ</option>
                </select>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginTop: 4 }}>ဤကာလထက် ကျော်သော ဒေတာကို archive သို့ ရွှေ့ပါမည်</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '12px', border: '1px solid var(--gray-200)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>ဒေတာဘေ့စ် အရွယ်အစား</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>၂.၃ GB</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginTop: 4 }}>၅ GB ထဲမှ</div>
                </div>
                <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '12px', border: '1px solid var(--gray-200)', textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>နောက်ဆုံး Backup</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>မတ် ၂၈</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--gray-400)', marginTop: 4 }}>နေ့စဉ် အလိုအလျောက်</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={handleSave}>သိမ်းဆည်းရန်</button>
                <button className="btn btn-outline">ဒေတာ Export</button>
                <button className="btn btn-danger">Cache ရှင်းလင်းရန်</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
