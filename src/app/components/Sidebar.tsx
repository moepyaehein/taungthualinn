'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  emergency?: boolean;
}

export interface SidebarProps {
  items: NavItem[];
  basePath: string;
}

export default function Sidebar({ items, basePath }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname.startsWith(href);
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-nav">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link${isActive(item.href) ? ' active' : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{ __html: item.icon }} />
            <span>{item.label}</span>
            {item.emergency && <span className="emergency-dot"></span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}
