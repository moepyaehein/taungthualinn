'use client';

import Link from 'next/link';
import Image from 'next/image';

// The LogoSVG has been replaced by an image tag using next/image below
// You will need to save your logo image as 'logo.png' in the public/ folder
interface TopbarProps {
  role?: string;
  userName: string;
  userInitial: string;
  locationText: string;
  avatarStyle?: React.CSSProperties;
  onProfileToggle: () => void;
}

export default function Topbar({ role = 'farmer', userName, userInitial, locationText, avatarStyle, onProfileToggle }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link href="/" className="topbar-logo">
          <Image src="/logo.png" alt="TaungThu Alin" width={32} height={32} style={{ objectFit: 'contain' }} />
          တောင်သူအလင်း
        </Link>
        {role !== 'admin' && (
          <div className="topbar-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>{locationText}</span>
          </div>
        )}
      </div>
      <div className="topbar-right">
        {role === 'admin' && (
          <button className="topbar-btn" style={{ color: 'var(--danger)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="notification-badge"></span>
          </button>
        )}
        <button className="topbar-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="notification-badge"></span>
        </button>
        <div className="topbar-profile" onClick={onProfileToggle}>
          <div className="topbar-avatar" style={avatarStyle}>{userInitial}</div>
          <span className="topbar-profile-name">{userName}</span>
        </div>
      </div>
    </header>
  );
}
