'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GovernmentHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/registry', label: 'Registry' },
    { href: '/register', label: 'Register' },
    { href: '/analysis/curvature', label: 'Curvature' },
    { href: '/dating', label: 'Dating 💘' },
    { href: '/documents', label: 'Vault' },
    { href: '/verify', label: 'Verify' },
    { href: '/audit', label: 'Audit' },
  ];

  return (
    <>
      <header className="gov-header">
        <div className="gov-header-brand-container">
          <Link href="/" className="gov-header-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="gov-logo-frame">
              <img src="/logo.png" alt="Official National Banana Registry Seal" className="gov-logo-img" />
            </div>
            <div className="gov-title-block">
              <div className="gov-national-tag">GOVERNMENT OF BANANA REGULATION</div>
              <h1 className="gov-main-title">PAZAMAYI SHERIYAYI</h1>
              <div className="gov-subtitle">Department of Agricultural Classification & Verification</div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav (>= 1024px) */}
        <nav className="gov-desktop-nav" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`gov-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/admin" className="gov-admin-link">
            🔒 Staff
          </Link>
        </nav>

        {/* Mobile / Tablet Menu Button (< 1024px) */}
        <button
          type="button"
          className="gov-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="gov-hamburger-icon">
            {mobileMenuOpen ? '✕' : '☰'}
          </span>
          <span className="gov-hamburger-text">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="gov-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`gov-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
      >
        <div className="gov-drawer-header">
          <div className="gov-drawer-brand">
            <div className="gov-logo-frame-small">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div>
              <div className="gov-drawer-title">PAZAMAYI SHERIYAYI</div>
              <div className="gov-drawer-subtitle">Official Mobile Portal</div>
            </div>
          </div>
          <button
            type="button"
            className="gov-drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="gov-drawer-content">
          <div className="gov-drawer-section-title">ADMINISTRATION & REGISTRY</div>
          <nav className="gov-drawer-nav">
            <Link
              href="/"
              className={`gov-drawer-link ${pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">🏛️</span>
              <div>
                <div className="gov-drawer-link-title">Central Dashboard</div>
                <div className="gov-drawer-link-desc">Recent registrations & status</div>
              </div>
            </Link>

            <Link
              href="/registry"
              className={`gov-drawer-link ${pathname === '/registry' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">🗄️</span>
              <div>
                <div className="gov-drawer-link-title">Registry Archive</div>
                <div className="gov-drawer-link-desc">Search & filter all specimens</div>
              </div>
            </Link>

            <Link
              href="/register"
              className={`gov-drawer-link ${pathname === '/register' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">🍌</span>
              <div>
                <div className="gov-drawer-link-title">Register New Entity</div>
                <div className="gov-drawer-link-desc">Enroll specimen into registry</div>
              </div>
            </Link>

            <Link
              href="/verify"
              className={`gov-drawer-link ${pathname.startsWith('/verify') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">🔐</span>
              <div>
                <div className="gov-drawer-link-title">Verify Document / Specimen</div>
                <div className="gov-drawer-link-desc">Cryptographic ID authentication</div>
              </div>
            </Link>

            <Link
              href="/audit"
              className={`gov-drawer-link ${pathname === '/audit' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">📜</span>
              <div>
                <div className="gov-drawer-link-title">Master Audit Trail</div>
                <div className="gov-drawer-link-desc">Immutable system event logs</div>
              </div>
            </Link>
          </nav>

          <div className="gov-drawer-section-title">ANALYSIS & TOOLS</div>
          <nav className="gov-drawer-nav">
            <Link
              href="/analysis/curvature"
              className={`gov-drawer-link ${pathname.includes('curvature') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">📐</span>
              <div>
                <div className="gov-drawer-link-title">Curvature Checker</div>
                <div className="gov-drawer-link-desc">Camera & image geometric analysis</div>
              </div>
            </Link>

            <Link
              href="/analysis"
              className={`gov-drawer-link ${pathname === '/analysis' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">🔬</span>
              <div>
                <div className="gov-drawer-link-title">Analysis Engine</div>
                <div className="gov-drawer-link-desc">OpenCV computer vision metrics</div>
              </div>
            </Link>

            <Link
              href="/dating"
              className={`gov-drawer-link ${pathname.includes('dating') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">💘</span>
              <div>
                <div className="gov-drawer-link-title">Banana Dating Portal</div>
                <div className="gov-drawer-link-desc">Culinary chemistry & matches</div>
              </div>
            </Link>

            <Link
              href="/documents"
              className={`gov-drawer-link ${pathname.includes('documents') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="gov-drawer-icon">📁</span>
              <div>
                <div className="gov-drawer-link-title">Official Document Vault</div>
                <div className="gov-drawer-link-desc">Banadhaar & certificates</div>
              </div>
            </Link>
          </nav>

          <div className="gov-drawer-footer">
            <Link
              href="/admin"
              className="gov-drawer-admin-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔒 Staff / Admin Enclave
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
