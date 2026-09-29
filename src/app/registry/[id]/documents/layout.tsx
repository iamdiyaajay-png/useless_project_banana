import React from 'react';
import Link from 'next/link';

export default async function DocumentsLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header className="hide-on-print" style={{ 
        borderBottom: '3px solid var(--gov-blue)', 
        paddingBottom: '16px', 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ margin: 0, color: 'var(--gov-blue)', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', display: 'flex', alignItems: 'center', gap: '10px', wordBreak: 'break-word' }}>
            <span>🏛️</span> DOCUMENT & CERTIFICATION DIVISION
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.82rem' }}>
            Official Banana Record Vault • Pazamayi Sheriyayi
          </p>
        </div>
        <div>
          <Link href={`/registry/${id}`} style={{ 
            color: 'var(--gov-blue)', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            padding: '8px 14px',
            backgroundColor: 'var(--gov-blue-light)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.88rem',
            whiteSpace: 'nowrap'
          }}>
            ← Return to Profile
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
