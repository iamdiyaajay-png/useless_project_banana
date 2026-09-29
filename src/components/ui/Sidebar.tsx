'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const adminLinks = [
    { href: '/', label: 'Dashboard', icon: '🏛️', exact: true },
    { href: '/registry', label: 'Registry Archive', icon: '🗄️', exact: false },
    { href: '/register', label: 'Register New Entity', icon: '🍌', exact: false },
    { href: '/verify', label: 'Verify Document', icon: '🔐', exact: false },
    { href: '/audit', label: 'Audit Logs', icon: '📜', exact: false },
  ];

  const toolLinks = [
    { href: '/analysis/curvature', label: 'Curvature Checker', icon: '📐', exact: false },
    { href: '/analysis', label: 'Analysis Engine', icon: '🔬', exact: true },
    { href: '/dating', label: 'Dating Portal', icon: '💘', exact: false },
    { href: '/documents', label: 'Document Vault', icon: '📁', exact: false },
  ];

  return (
    <aside className="app-sidebar" aria-label="Desktop Sidebar Navigation">
      <div className="sidebar-section-header">
        <span>ADMINISTRATION</span>
      </div>
      <nav className="sidebar-nav">
        {adminLinks.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{link.icon}</span>
              <span className="sidebar-nav-text">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-section-header" style={{ marginTop: '24px' }}>
        <span>REGISTRY TOOLS</span>
      </div>
      <nav className="sidebar-nav">
        {toolLinks.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{link.icon}</span>
              <span className="sidebar-nav-text">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/admin" className="sidebar-admin-btn">
          🔒 Staff / Admin Enclave
        </Link>
        <div className="sidebar-version-badge">
          System v2.4 • National Registry
        </div>
      </div>
    </aside>
  );
}
