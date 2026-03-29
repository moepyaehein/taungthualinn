'use client';

import { useState } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ProfilePanel from '../components/ProfilePanel';

const merchantNav = [
  { href: '/merchant', label: 'ပင်မ', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: '/merchant/price', label: 'စျေးတင်', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>' },
  { href: '/merchant/bulk', label: 'အစုလိုက်', icon: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>' },
  { href: '/merchant/listings', label: 'ကမ်းလှမ်း', icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
  { href: '/merchant/verify', label: 'အတည်ပြု', icon: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
  { href: '/merchant/analytics', label: 'ခွဲခြမ်း', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  { href: '/merchant/emergency', label: 'အရေးပေါ်', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', emergency: true },
  { href: '/merchant/notifications', label: 'သတိပေး', icon: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>' },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div>
      <Topbar
        role="merchant"
        userName="ဦးကျော်မင်း"
        userInitial="က"
        locationText="မန္တလေးစျေး"
        onProfileToggle={() => setProfileOpen(!profileOpen)}
      />
      <Sidebar items={merchantNav} basePath="/merchant" />
      <main className="main-content">{children}</main>

      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="ကုန်သည် ပရိုဖိုင်" avatarInitial="က">
        <div className="text-center mb-lg" style={{ marginTop: '-10px' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px', color: 'var(--gray-800)' }}>ဦးကျော်မင်း</h3>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(5, 150, 105, 0.15)', color: 'var(--primary-700)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--primary-300)' }}>★ စစ်ဆေးပြီး ကုန်သည်</span>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ကိုယ်ရေးအချက်အလက်</div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ကုန်သည်အမည်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="ဦးကျော်မင်း" /></div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>လုပ်ငန်းအမည်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="ရွှေမန္တလေး ကုန်သည်" /></div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ဖုန်းနံပါတ်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="09-456-789-012" /></div>
          <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div className="form-group m-0"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ပြည်နယ်/တိုင်း</label><select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }}><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option><option>မကွေးတိုင်း</option></select></div>
            <div className="form-group m-0"><label className="form-label" style={{ color: 'var(--gray-600)' }}>မြို့နယ်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="ချမ်းအေးသာစံ" /></div>
          </div>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>အရောင်းအဝယ် ဆက်တင်</div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ရောင်းဝယ်သည့် အမျိုးအစား</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="ဆီထွက်သီးနှံ, ပဲ" /></div>
          <div className="form-group mb-md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label className="form-label m-0" style={{ color: 'var(--gray-600)' }}>အရေးပေါ်ဝယ်ယူသူ</label>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>သီးနှံများ အရေးပေါ်ကူညီရန်</div>
            </div>
            <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label>
          </div>
          <div className="form-group m-0"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ဘာသာစကား</label><select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }}><option>မြန်မာ</option><option>English</option></select></div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)', transition: 'all 0.2s ease', border: 'none' }} onClick={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; setTimeout(() => setProfileOpen(false), 150); }}>
          ပြောင်းလဲမှု သိမ်းဆည်းရန်
        </button>
      </ProfilePanel>
    </div>
  );
}
