'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'အီးမေးလ် သို့ စကားဝှက် မှားနေပါသည်'
        : authError.message);
      setLoading(false);
      return;
    }

    // Get user role to redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role || 'farmer';
      router.push(`/${role}`);
    } else {
      router.push('/farmer');
    }
  };

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 var(--space-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Link href="/" className="landing-logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
            <Image src="/logo.png" alt="TaungThu Alin" width={48} height={48} style={{ objectFit: 'contain' }} />
            တောင်သူအလင်း
          </Link>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--font-sm)' }}>အကောင့်ဖြင့် ဝင်ရောက်ပါ</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          {error && (
            <div className="alert-banner danger mb-lg" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
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
              <label className="form-label">စကားဝှက်</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
              {loading ? 'ဝင်ရောက်နေပါသည်...' : 'ဝင်ရောက်ရန်'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-sm)', color: 'var(--gray-500)' }}>
          အကောင့်မရှိသေးဘူးလား?{' '}
          <Link href="/signup" style={{ color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}>
            အကောင့်ဖွင့်ရန်
          </Link>
        </div>
      </div>
    </div>
  );
}
