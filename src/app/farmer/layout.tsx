'use client';

import { useState } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ProfilePanel from '../components/ProfilePanel';
import ChatAssistant from '../components/ChatAssistant';

const farmerNav = [
  { href: '/farmer', label: 'ပင်မစာမျက်နှာ', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: '/farmer/market', label: 'စျေးနှုန်းများ', icon: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 3v18"/>' },
  { href: '/farmer/recommendation', label: 'AI အကြံပြု', icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' },
  { href: '/farmer/emergency', label: 'အရေးပေါ်', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', emergency: true },
  { href: '/farmer/records', label: 'မှတ်တမ်းများ', icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div>
      <Topbar
        role="farmer"
        userName="ဦးအောင်မြင့်"
        userInitial="အ"
        locationText="မန္တလေးတိုင်း"
        onProfileToggle={() => setProfileOpen(!profileOpen)}
      />
      <Sidebar items={farmerNav} basePath="/farmer" />
      <main className="main-content">
        {children}
      </main>

      <ProfilePanel
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="စိုက်ပျိုးရေး ပရိုဖိုင်"
        avatarInitial="အ"
      >
        <div className="text-center mb-lg" style={{ marginTop: '-10px' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px', color: 'var(--gray-800)' }}>ဦးအောင်မြင့်</h3>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #a7f3d0' }}>✓ ယုံကြည်ရသော တောင်သူ</span>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ကိုယ်ရေးအချက်အလက်</div>
          <div className="form-group mb-md">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>အမည်</label>
            <input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="ဦးအောင်မြင့်" />
          </div>
          <div className="form-group m-0">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>ဖုန်းနံပါတ်</label>
            <input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="09-123-456-789" />
          </div>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ခြံနှင့် သီးနှံအချက်အလက်</div>
          <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
            <div className="form-group m-0">
              <label className="form-label" style={{ color: 'var(--gray-600)' }}>တိုင်း / ပြည်နယ်</label>
              <select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="မန္တလေးတိုင်း"><option>မန္တလေးတိုင်း</option><option>စစ်ကိုင်းတိုင်း</option><option>ရှမ်းပြည်နယ်</option></select>
            </div>
            <div className="form-group m-0">
              <label className="form-label" style={{ color: 'var(--gray-600)' }}>မြို့နယ်</label>
              <select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="ချမ်းအေးသာစံ"><option>ချမ်းအေးသာစံ</option><option>အမရပူရ</option><option>ကျောက်မဲ</option></select>
            </div>
          </div>
          <div className="form-group m-0">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>အဓိက စိုက်ပျိုးသော သီးနှံများ</label>
            <select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="နှမ်း၊ ပဲ"><option>နှမ်း၊ ပဲ</option><option>စပါး</option><option>မြေပဲ၊ နေကြာ</option></select>
          </div>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>စျေးကွက် ဆက်တင်များ</div>
          <div className="form-group mb-md">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>နှစ်သက်သော စျေးကွက် (AI)</label>
            <select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="မန္တလေး"><option>မန္တလေး</option><option>ရန်ကုန်</option><option>မူဆယ်</option></select>
          </div>
          <div className="form-group m-0">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>အက်ပ် ဘာသာစကား</label>
            <select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="မြန်မာ"><option>မြန်မာ (Zawgyi/Unicode)</option><option>English</option></select>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)', transition: 'all 0.2s ease', border: 'none' }} onClick={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; setTimeout(() => setProfileOpen(false), 150); }}>
          အချက်အလက်များ သိမ်းဆည်းရန်
        </button>
      </ProfilePanel>

      <ChatAssistant />
    </div>
  );
}
