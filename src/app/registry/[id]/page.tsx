export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import Link from 'next/link';

export const revalidate = 0;

export default async function RegistryMasterProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id },
    include: { 
      auditEvents: { orderBy: { timestamp: 'desc' } },
      analyses: { orderBy: { timestamp: 'desc' }, take: 1 },
      documents: { where: { status: 'VALID' } },
      relationships: { include: { foodPartner: true }, orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  if (!banana) return notFound();

  const latestAnalysis = banana.analyses[0];
  const activeRelationship = banana.relationships[0];

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Profile Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px', borderBottom: '3px solid var(--gov-blue)', paddingBottom: '20px' }}>
        <h1 style={{ margin: '0 0 6px 0', color: 'var(--gov-blue)', fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', letterSpacing: '2px' }}>
          BANANA DIGITAL PROFILE
        </h1>
        <div style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--gov-blue-dark)', wordBreak: 'break-all' }}>
          {banana.registrationNumber}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        {/* Left Column: Module Status Overview & Core Data */}
        <div style={{ flex: '2 1 540px', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Banana Specimen Summary Card */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ 
              width: '130px', 
              height: '130px', 
              minWidth: '110px',
              backgroundColor: '#f0f0f0', 
              border: '2px solid var(--gov-blue)', 
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {banana.photo ? (
                <img src={banana.photo} alt="Banana Specimen" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>NO PHOTO</div>
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', margin: '0 0 6px 0', color: 'var(--gov-blue-dark)', wordBreak: 'break-word' }}>
                {banana.officialName}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '4px' }}>
                Banana ID: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-dark)', wordBreak: 'break-all' }}>{banana.id}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                Origin: <strong>{banana.origin || 'Unknown'}</strong>
              </div>
            </div>
          </div>

          <OfficialCard title="MODULE STATUS OVERVIEW">
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
               
               {/* Identity */}
               <Link href="/register" style={{ display: 'block', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff', transition: 'box-shadow var(--transition-fast)' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>IDENTITY</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--status-green)', marginTop: '2px' }}>✓ {banana.registryStatus}</div>
                 <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-light)' }}>Registered: {new Date(banana.registrationDate).toLocaleDateString()}</div>
               </Link>

               {/* Analysis */}
               <Link href={`/registry/${banana.id}/analysis`} style={{ display: 'block', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>ANALYSIS</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: latestAnalysis ? 'var(--status-green)' : 'var(--status-warning)', marginTop: '2px' }}>
                   {latestAnalysis ? '✓ Completed' : '⚠️ Pending'}
                 </div>
                 {latestAnalysis && <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-light)' }}>Curvature: {latestAnalysis.curvature}° | Ripeness: {latestAnalysis.ripeness}%</div>}
               </Link>

               {/* BananaPrint */}
               <Link href={`/registry/${banana.id}/analysis`} style={{ display: 'block', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>BANANAPRINT</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: banana.bananaPrintId ? 'var(--status-green)' : 'var(--status-warning)', marginTop: '2px' }}>
                   {banana.bananaPrintId ? '✓ Generated' : '⚠️ Pending Analysis'}
                 </div>
                 {banana.bananaPrintId && <div style={{ fontSize: '0.75rem', marginTop: '6px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{banana.bananaPrintId}</div>}
               </Link>

               {/* Relationship */}
               <Link href={`/registry/${banana.id}/dating`} style={{ display: 'block', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>RELATIONSHIP</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: banana.datingAvailability === 'OPEN_FOR_MATCHING' || banana.relationshipStatus === 'IN_RELATIONSHIP' ? '#cc0000' : 'var(--text-light)', marginTop: '2px' }}>
                   {banana.relationshipStatus === 'IN_RELATIONSHIP' ? `💘 ${activeRelationship?.foodPartner.name || 'Partner'}` : banana.datingAvailability === 'OPEN_FOR_MATCHING' ? '💘 Active Pool' : 'Not Active'}
                 </div>
                 {activeRelationship && <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-light)' }}>Compatibility: {activeRelationship.compatibilityScore}%</div>}
               </Link>

               {/* Documents */}
               <Link href={`/registry/${banana.id}/documents`} style={{ display: 'block', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>DOCUMENTS</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: banana.documents.length > 0 ? 'var(--status-green)' : 'var(--status-warning)', marginTop: '2px' }}>
                   {banana.documents.length > 0 ? `✓ ${banana.documents.length} Available` : '⚠️ None Generated'}
                 </div>
                 <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-light)' }}>View official certificates</div>
               </Link>

               {/* Verification */}
               <Link href={`/verify?target=${banana.id}`} style={{ display: 'block', padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit', backgroundColor: '#fff' }}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 600 }}>VERIFICATION</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--status-green)', marginTop: '2px' }}>
                   ✓ Enabled
                 </div>
                 <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-light)' }}>Verify ID, Doc, or Specimen</div>
               </Link>

             </div>
          </OfficialCard>

        </div>

        {/* Right Column: Banana Life Record */}
        <div style={{ flex: '1 1 320px', minWidth: 0, width: '100%' }}>
          <OfficialCard title="BANANA LIFE RECORD">
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              A complete chronological history of events sourced natively from the master Audit Event system.
            </div>
            
            {banana.auditEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)' }}>No life events recorded.</div>
            ) : (
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {/* The chronological line */}
                 <div style={{ position: 'absolute', top: '0', bottom: '0', left: '18px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                 
                 {banana.auditEvents.map((evt: any) => {
                   const color = getEventCategoryColor(evt.eventType);
                   const icon = getEventIcon(evt.eventType);
                   return (
                     <div key={evt.id} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '38px', height: '38px', minWidth: '38px', borderRadius: '50%', backgroundColor: color, color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.1rem', boxShadow: '0 0 0 3px var(--ivory)' }}>
                           {icon}
                        </div>
                        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px 14px', flex: 1, minWidth: 0, boxShadow: 'var(--shadow-sm)' }}>
                           <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '2px' }}>
                             {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(evt.timestamp)}
                           </div>
                           <div style={{ fontWeight: 'bold', color: color, marginBottom: '4px', fontSize: '0.88rem', wordBreak: 'break-word' }}>
                             {evt.eventType.replace(/_/g, ' ')}
                           </div>
                           <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', wordBreak: 'break-word' }}>
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

      </div>
    </div>
  );
}
