'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import ProfilePanel from '../components/ProfilePanel';
import ChatAssistant from '../components/ChatAssistant';
import { createClient } from '@/lib/supabase/client';
import { apiPatch } from '@/lib/useApi';

const farmerNav = [
  { href: '/farmer', label: 'ပင်မစာမျက်နှာ', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { href: '/farmer/market', label: 'စျေးနှုန်းများ', icon: '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 3v18"/>' },
  { href: '/farmer/recommendation', label: 'AI ခန့်မှန်း', icon: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' },
  { href: '/farmer/records', label: 'မှတ်တမ်းများ', icon: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>' },
  { href: '/farmer/emergency', label: 'အရေးပေါ်', icon: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', emergency: true },
];

interface ProfileData {
  id: string;
  full_name: string;
  phone: string | null;
  region_id: number | null;
  region?: { id: number; name_mm: string } | null;
  trust_level: string;
}

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.status === 401) { router.push('/login'); return; }
        const json = await res.json();
        if (json.data) {
          setProfile(json.data);
          setFormName(json.data.full_name || '');
          setFormPhone(json.data.phone || '');
        }
      } catch { /* ignore */ }
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSave = async () => {
    setSaving(true);
    const { data } = await apiPatch('/api/profile', { full_name: formName, phone: formPhone });
    if (data) setProfile(data as ProfileData);
    setSaving(false);
    setProfileOpen(false);
  };

  const userName = profile?.full_name || 'တောင်သူ';
  const userInitial = userName.charAt(0);
  const regionName = profile?.region?.name_mm || 'ဒေသ';

  return (
    <div>
      <Topbar
        role="farmer"
        userName={userName}
        userInitial={userInitial}
        locationText={regionName}
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
        avatarInitial={userInitial}
      >
        <div className="text-center mb-lg" style={{ marginTop: '-10px' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px', color: 'var(--gray-800)' }}>{userName}</h3>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #a7f3d0' }}>
            {profile?.trust_level === 'trusted' ? '✓ ယုံကြည်ရသော တောင်သူ' : '● စံတောင်သူ'}
          </span>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ကိုယ်ရေးအချက်အလက်</div>
          <div className="form-group mb-md">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>အမည်</label>
            <input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} value={formName} onChange={(e) => setFormName(e.target.value)} />
          </div>
          <div className="form-group m-0">
            <label className="form-label" style={{ color: 'var(--gray-600)' }}>ဖုန်းနံပါတ်</label>
            <input className="form-input" style={{ background: '#fff', border: '1px solid var(--gray-300)', borderRadius: '10px' }} value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600 }} onClick={handleSave} disabled={saving}>
          {saving ? 'သိမ်းဆည်းနေသည်...' : 'အချက်အလက်များ သိမ်းဆည်းရန်'}
        </button>
        <button className="btn btn-outline" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: 'var(--font-sm)', marginTop: '12px', color: 'var(--danger)' }} onClick={handleLogout}>
          ထွက်ရန် (Logout)
        </button>
      </ProfilePanel>

      <ChatAssistant />
    </div>
  );
}
