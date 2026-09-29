import React from 'react';
import Link from 'next/link';
import { adminLogout, isAuthenticated } from '@/app/actions/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = await isAuthenticated();

  return (
    <div style={{ backgroundColor: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <header style={{ backgroundColor: '#18181b', color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', fontWeight: 'bold', letterSpacing: '1px' }}>NBR ADMIN PORTAL</div>
          {isAuth && <div style={{ backgroundColor: '#cc0000', padding: '3px 8px', fontSize: '0.68rem', fontWeight: 'bold', borderRadius: '4px' }}>RESTRICTED</div>}
        </div>
        
        {isAuth && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.88rem' }}>Partner DB</Link>
            <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '0.88rem' }}>Public Registry</Link>
            <form action={adminLogout}>
              <button type="submit" style={{ backgroundColor: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', minHeight: '36px' }}>
                LOGOUT
              </button>
            </form>
          </div>
        )}
      </header>

      <main style={{ padding: 'clamp(14px, 3vw, 28px)', flex: 1, width: '100%', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
