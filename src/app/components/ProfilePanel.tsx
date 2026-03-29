'use client';

import React from 'react';

export interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  avatarInitial?: string;
  avatarStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export default function ProfilePanel({ isOpen, onClose, title, avatarInitial, avatarStyle, children }: ProfilePanelProps) {
  return (
    <>
      <div className={`profile-overlay${isOpen ? ' open' : ''}`} onClick={onClose}></div>
      <div className={`profile-panel${isOpen ? ' open' : ''}`}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))', 
          color: '#fff', 
          padding: 'var(--space-xl) var(--space-lg) var(--space-lg)', 
          position: 'relative',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: 'var(--space-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, margin: 0 }}>{title}</h2>
            <button className="topbar-btn" style={{ color: '#fff', background: 'rgba(255,255,255,0.2)' }} onClick={onClose}>✕</button>
          </div>
          <div className="profile-avatar-large" style={{ ...avatarStyle, border: '4px solid #fff', boxShadow: 'var(--shadow-md)', background: '#fff', color: 'var(--primary-600)', marginBottom: 0 }}>{avatarInitial}</div>
        </div>
        <div style={{ padding: '0 var(--space-lg)', paddingBottom: '100px' }}>
          {children}
        </div>
      </div>
    </>
  );
}
