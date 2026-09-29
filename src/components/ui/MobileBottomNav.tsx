'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/', label: 'Home', icon: '🏛️', exact: true },
    { href: '/register', label: 'Register', icon: '🍌', exact: false },
    { href: '/analysis/curvature', label: 'Curvature', icon: '📐', exact: false },
    { href: '/dating', label: 'Dating', icon: '💘', exact: false },
    { href: '/verify', label: 'Verify', icon: '🔐', exact: false },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      {items.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="mobile-bottom-nav-icon">{item.icon}</span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
