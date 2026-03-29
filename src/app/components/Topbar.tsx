'use client';

import Link from 'next/link';

interface LogoSVGProps {
  color?: string;
}

const LogoSVG = ({ color = '#059669' }: LogoSVGProps) => (
  <svg viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="15" fill={color} />
    <path d="M16 6c-1 4-4 7-4 12a4 4 0 008 0c0-5-3-8-4-12z" fill="#fff" />
    <path d="M12 20c2-1 4-1 6-1" stroke="#fff" strokeWidth="1.5" />
  </svg>
);

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
          <LogoSVG color="#059669" />
          တောင်သူအလင်း
        </Link>
        <div className="topbar-location">
          {role === 'admin' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
          )}
          <span>{locationText}</span>
        </div>
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
