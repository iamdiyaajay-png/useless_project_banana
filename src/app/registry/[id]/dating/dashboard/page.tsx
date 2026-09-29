export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound, redirect } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import Link from 'next/link';
import { PartnerIcon } from '@/components/ui/PartnerIcon';

export const revalidate = 0;

export default async function DatingDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({ 
    where: { id },
    include: {
      relationships: {
        include: { foodPartner: true }
      }
    }
  });

  if (!banana) return notFound();
  if (banana.datingAvailability === 'NOT_ACTIVATED') redirect(`/registry/${id}/dating`);

  const partners = await prisma.foodPartner.findMany();
  
  const currentRelationship = banana.relationships.find(r => r.status === 'IN_RELATIONSHIP');

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
      
      {/* Main Content: Partner Grid */}
      <div style={{ flex: '2 1 540px', minWidth: 0, width: '100%' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', color: 'var(--gov-blue)', marginBottom: '4px' }}>POTENTIAL MATCHES</h2>
          <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.92rem' }}>Browse the registry of culinary partners available for compatibility assessment.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
          {partners.map(partner => (
            <div key={partner.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ backgroundColor: '#ffe6e6', padding: '20px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center' }}>
                <PartnerIcon icon={partner.imageIcon} size="5rem" />
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: 'var(--text-dark)', wordBreak: 'break-word' }}>{partner.name}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '10px', textTransform: 'uppercase' }}>{partner.personalityType}</div>
                
                <div style={{ marginBottom: '14px' }}>
                   {JSON.parse(partner.greenFlags || '[]').slice(0, 2).map((gf: string) => (
                     <div key={gf} style={{ fontSize: '0.78rem', color: 'var(--status-green)', marginBottom: '3px' }}>💚 {gf}</div>
                   ))}
                   {JSON.parse(partner.redFlags || '[]').length > 0 && (
                     <div style={{ fontSize: '0.78rem', color: 'var(--status-red)', marginBottom: '3px' }}>🚩 {JSON.parse(partner.redFlags || '[]').length} Red Flags</div>
                   )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link href={`/registry/${id}/dating/partner/${partner.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '10px', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', fontSize: '0.88rem', minHeight: '44px' }}>
                    VIEW LOVE FILE 💘
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar: Dating Profile & Actions */}
      <div style={{ flex: '1 1 280px', minWidth: 0, width: '100%' }}>
        <OfficialCard title="Dating Profile">
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Love File No.</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 600, wordBreak: 'break-all' }}>{banana.registrationNumber}</div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Identity</div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem', wordBreak: 'break-word' }}>{banana.officialName}</div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
            <div style={{ color: banana.datingAvailability === 'OPEN_FOR_MATCHING' ? 'var(--status-green)' : 'var(--gov-blue)', fontWeight: 'bold', fontSize: '0.9rem' }}>{banana.datingAvailability}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Looking For</div>
            <div style={{ fontSize: '0.9rem' }}>{banana.datingIntention}</div>
          </div>
        </OfficialCard>

        {currentRelationship && (
          <div style={{ marginTop: '20px' }}>
            <OfficialCard title="Current Relationship">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <PartnerIcon icon={currentRelationship.foodPartner.imageIcon} size="2.5rem" />
                <div>
                  <h3 style={{ margin: 0, color: 'var(--gov-blue)', fontSize: '1.1rem' }}>{currentRelationship.foodPartner.name}</h3>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Official Match</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Compatibility</span>
                <strong style={{ color: 'var(--status-green)', fontSize: '1.1rem' }}>{currentRelationship.compatibilityScore}%</strong>
              </div>
            </OfficialCard>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <OfficialCard title="Quick Actions">
            <Link href={`/registry/${id}/dating/compare`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', backgroundColor: 'var(--gov-blue-light)', color: 'var(--gov-blue-dark)', textDecoration: 'none', borderRadius: 'var(--radius-md)', border: '1px solid var(--gov-blue)', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', minHeight: '44px', fontSize: '0.9rem' }}>
              ⚖️ Compare Partners Side-by-Side
            </Link>
            <Link href={`/registry/${id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', backgroundColor: '#fff', color: 'var(--text-dark)', textDecoration: 'none', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px', minHeight: '44px', fontSize: '0.9rem' }}>
              View Life Record
            </Link>
            <Link href="/admin" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', backgroundColor: '#fff', color: '#b91c1c', textDecoration: 'none', borderRadius: 'var(--radius-md)', border: '1px dashed #fca5a5', fontWeight: 'bold', textAlign: 'center', fontSize: '0.85rem', minHeight: '44px' }}>
              🔒 Edit Partners (Staff)
            </Link>
          </OfficialCard>
        </div>
      </div>

    </div>
  );
}
