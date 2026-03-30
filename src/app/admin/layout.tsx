'use client';

import { useState } from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ProfilePanel from '../components/ProfilePanel';

const adminNav = [
  { href: '/admin', label: 'ပင်မ', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: '/admin/verify', label: 'KYC စိစစ်ရန်', icon: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
  { href: '/admin/users', label: 'အသုံးပြုသူများ', icon: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>' },
  { href: '/admin/analytics', label: 'အစီရင်ခံစာများ', icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  { href: '/admin/settings', label: 'ဆက်တင်များ', icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>' },
  { href: '/admin/emergency', label: 'အရေးပေါ်', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>', emergency: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div>
      <Topbar
        role="admin"
        userName="Admin"
        userInitial="A"
        locationText="ရှာဖွေရန်..."
        onProfileToggle={() => setProfileOpen(!profileOpen)}
      />
      <Sidebar items={adminNav} basePath="/admin" />
      <main className="main-content">{children}</main>

      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="Admin ပရိုဖိုင်" avatarInitial="A">
        <div className="text-center mb-lg" style={{ marginTop: '-10px' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px', color: 'var(--gray-800)' }}>Administrator</h3>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(5, 150, 105, 0.15)', color: 'var(--primary-700)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid var(--primary-300)' }}>★ System Root</span>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ကိုယ်ရေးအချက်အလက်</div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>အမည်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="Platform Admin" /></div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ရာထူး</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="Chief Administrator" /></div>
          <div className="form-group mb-md"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ဖုန်းနံပါတ်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="၀၉-၁၁၁-၂၂၂-၃၃၃" /></div>
          <div className="form-group m-0"><label className="form-label" style={{ color: 'var(--gray-600)' }}>အီးမေးလ်</label><input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} defaultValue="admin@taungthu.mm" /></div>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ဆက်တင်များ</div>
          <div className="form-group m-0"><label className="form-label" style={{ color: 'var(--gray-600)' }}>ဘာသာစကား</label><select className="form-select" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }}><option>မြန်မာ (Zawgyi/Unicode)</option><option>English</option></select></div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)', transition: 'all 0.2s ease', border: 'none' }} onClick={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; setTimeout(() => setProfileOpen(false), 150); }}>
          ပြောင်းလဲမှု သိမ်းဆည်းရန်
        </button>
      </ProfilePanel>
    </div>
  );
}
