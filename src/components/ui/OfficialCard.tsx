import React from 'react';

export function OfficialCard({ title, children, className = '' }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`institutional-border ${className}`} style={{
      backgroundColor: '#fff',
      marginBottom: '24px',
      position: 'relative',
      width: '100%',
      minWidth: 0,
    }}>
      <h2 style={{ 
        borderBottom: '1px solid var(--border-color)', 
        paddingBottom: '12px', 
        marginBottom: '20px',
        fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        wordBreak: 'break-word',
      }}>
        {title}
      </h2>
      <div style={{ minWidth: 0, width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
