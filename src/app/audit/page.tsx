export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { OfficialCard } from '@/components/ui/OfficialCard';

export const revalidate = 0;

export default async function GlobalAuditLogsPage() {
  const events = await prisma.auditEvent.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50
  });

  const getEventCategoryColor = (type: string) => {
    if (type.includes('REGISTERED')) return 'var(--gov-blue)';
    if (type.includes('ANALYSIS') || type.includes('DETECTED') || type.includes('CURVATURE')) return '#4a148c'; 
    if (type.includes('BANANAPRINT') || type.includes('SPECIMEN')) return '#006064'; 
    if (type.includes('DATING') || type.includes('MATCH') || type.includes('COMPATIBILITY') || type.includes('PARTNER') || type.includes('RELATIONSHIP')) return '#cc0000'; 
    if (type.includes('DOCUMENT')) return '#e65100'; 
    if (type.includes('VERIFIED') || type.includes('VERIFICATION')) return '#2e7d32'; 
    return 'var(--text-light)';
  };

  const getEventIcon = (type: string) => {
    if (type.includes('REGISTERED')) return '🏛️';
    if (type.includes('ANALYSIS') || type.includes('DETECTED') || type.includes('CURVATURE')) return '🔬';
    if (type.includes('BANANAPRINT') || type.includes('SPECIMEN')) return '🧬';
    if (type.includes('DATING') || type.includes('MATCH') || type.includes('COMPATIBILITY') || type.includes('PARTNER') || type.includes('RELATIONSHIP')) return '💘';
    if (type.includes('DOCUMENT')) return '📜';
    if (type.includes('VERIFIED') || type.includes('VERIFICATION')) return '🔐';
    return '📌';
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', marginBottom: '8px' }}>Master Audit Trail</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', margin: 0 }}>
          Chronological cryptographic history of all registry events and actions.
        </p>
      </div>

      <OfficialCard title="MASTER AUDIT RECORD">
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)' }}>No events recorded.</div>
        ) : (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ position: 'absolute', top: '0', bottom: '0', left: '18px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
             
             {events.map((evt: any) => {
               const color = getEventCategoryColor(evt.eventType);
               const icon = getEventIcon(evt.eventType);
               return (
                 <div key={evt.id} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '50%', backgroundColor: color, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.1rem', boxShadow: '0 0 0 3px var(--ivory)' }}>
                       {icon}
                    </div>
                    <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px 14px', flex: 1, minWidth: 0, boxShadow: 'var(--shadow-sm)' }}>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                         <span>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(evt.timestamp)}</span>
                         <span style={{ fontFamily: 'monospace', fontWeight: 600, wordBreak: 'break-all' }}>{evt.bananaId}</span>
                       </div>
                       <div style={{ fontWeight: 'bold', color: color, marginBottom: '6px', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                         {evt.eventType.replace(/_/g, ' ')}
                       </div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', wordBreak: 'break-word' }}>
                         {evt.description}
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </OfficialCard>
    </div>
  );
}
