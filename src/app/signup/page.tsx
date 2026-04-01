'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'merchant'>('farmer');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (authError) {
      setError(authError.message === 'User already registered'
        ? 'ဤအီးမေးလ်ဖြင့် အကောင့်ရှိပြီးဖြစ်ပါသည်'
        : authError.message);
      setLoading(false);
      return;
    }

    // 2. Create profile row
    if (authData.user) {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: fullName,
        role,
        phone: phone || null,
        email,
        trust_level: 'standard',
        is_active: true,
      });
    }

    setSuccess(true);
    setLoading(false);

    // Auto-redirect after 2 seconds
    setTimeout(() => {
      router.push(`/${role}`);
    }, 2000);
  };

  if (success) {
    return (
      <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '420px', padding: 'var(--space-xl)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>✓</div>
          <h2 style={{ fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--success)' }}>အကောင့် ဖွင့်ပြီးပါပြီ!</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>ခဏစောင့်ပါ... ဒက်ရှ်ဘုတ်သို့ ပို့ဆောင်နေပါသည်</p>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px', padding: '0 var(--space-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Link href="/" className="landing-logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <Image src="/logo.png" alt="TaungThu Alin" width={48} height={48} style={{ objectFit: 'contain' }} />
            တောင်သူအလင်း
          </Link>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>အကောင့်အသစ် ဖွင့်ပါ</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          {error && (
            <div className="alert-banner danger mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Role Selection */}
            <div className="form-group mb-lg">
              <label className="form-label">အခန်းကဏ္ဍ ရွေးပါ</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'farmer' ? 'var(--primary-600)' : 'var(--gray-200)'}`,
                    background: role === 'farmer' ? 'var(--primary-50, rgba(5,150,105,0.06))' : '#fff',
                    color: role === 'farmer' ? 'var(--primary-700)' : 'var(--gray-500)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: 'var(--font-sm)',
                  }}
                >
                  🌾 တောင်သူ
                </button>
                <button
                  type="button"
                  onClick={() => setRole('merchant')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'merchant' ? 'var(--primary-600)' : 'var(--gray-200)'}`,
                    background: role === 'merchant' ? 'var(--primary-50, rgba(5,150,105,0.06))' : '#fff',
                    color: role === 'merchant' ? 'var(--primary-700)' : 'var(--gray-500)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: 'var(--font-sm)',
                  }}
                >
                  🏪 ကုန်သည်
                </button>
              </div>
            </div>

            <div className="form-group mb-lg">
              <label className="form-label">အမည်</label>
              <input
                type="text"
                className="form-input"
                placeholder="ဥပမာ - ဦးအောင်မြင့်"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-lg">
              <label className="form-label">ဖုန်းနံပါတ်</label>
              <input
                type="tel"
                className="form-input"
                placeholder="ဥပမာ - 09-123-456-789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group mb-lg">
              <label className="form-label">အီးမေးလ်</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group mb-lg">
              <label className="form-label">စကားဝှက် (အနည်းဆုံး ၆ လုံး)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: 'var(--font-md)',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'ဖန်တီးနေပါသည်...' : 'အကောင့်ဖွင့်ရန်'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>
          အကောင့်ရှိပြီးသား?{' '}
          <Link href="/login" style={{ color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
            ဝင်ရောက်ရန်
          </Link>
        </div>
      </div>
    </div>
  );
}
