export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { CompatibilityActions } from '@/components/CompatibilityActions';
import { PartnerIcon } from '@/components/ui/PartnerIcon';
import Link from 'next/link';

export const revalidate = 0;

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string, partnerId: string }> }) {
  const { id, partnerId } = await params;
  
  const banana = await prisma.banana.findUnique({ where: { id } });
  const partner = await prisma.foodPartner.findUnique({ where: { id: partnerId } });

  if (!banana || !partner) return notFound();

  const greenFlags = JSON.parse(partner.greenFlags || '[]');
  const redFlags = JSON.parse(partner.redFlags || '[]');
  const datingHistory = partner.datingHistory || '';

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href={`/registry/${id}/dating/dashboard`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
        ← Back to Matches
      </Link>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        
        {/* Left Column: Profile & History */}
        <div style={{ flex: '2 1 480px', minWidth: 0, width: '100%' }}>
          <OfficialCard title="Partner Relationship Profile">
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
              <PartnerIcon icon={partner.imageIcon} size="5rem" style={{ backgroundColor: '#ffe6e6', padding: '12px', border: '3px solid #ffcccc', borderRadius: '12px' }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{ margin: '0 0 4px 0', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', color: 'var(--text-dark)', wordBreak: 'break-word' }}>{partner.name}</h2>
                <div style={{ fontSize: '1.05rem', color: 'var(--gov-blue)', fontFamily: 'serif', fontStyle: 'italic' }}>
                  {partner.personalityType}
                </div>
                <div style={{ marginTop: '6px', color: 'var(--text-light)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  Looking for: <strong>{partner.whatItSeeks}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <h3 style={{ borderBottom: '2px solid var(--status-green)', color: 'var(--status-green)', paddingBottom: '6px', marginBottom: '12px', fontSize: '0.95rem' }}>💚 GREEN FLAGS</h3>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.88rem' }}>
                  {greenFlags.map((gf: string) => <li key={gf} style={{ marginBottom: '6px' }}>{gf}</li>)}
                </ul>
              </div>
              <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <h3 style={{ borderBottom: '2px solid var(--status-red)', color: 'var(--status-red)', paddingBottom: '6px', marginBottom: '12px', fontSize: '0.95rem' }}>🚩 RED FLAGS</h3>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.88rem' }}>
                  {redFlags.map((rf: string) => <li key={rf} style={{ marginBottom: '6px' }}>{rf}</li>)}
                  {redFlags.length === 0 && <li style={{ color: 'var(--text-light)' }}>No known red flags.</li>}
                </ul>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '12px', color: 'var(--gov-blue)', fontSize: '1rem' }}>💔 LOVE HISTORY</h3>
            {!datingHistory ? (
              <p style={{ color: 'var(--text-light)', fontStyle: 'italic', fontSize: '0.9rem' }}>No past records available.</p>
            ) : (
              <div style={{ border: '1px solid var(--border-color)', padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa', fontSize: '0.88rem' }}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{datingHistory}</p>
              </div>
            )}
          </OfficialCard>
        </div>

        {/* Right Column: Actions & Compatibility */}
        <div style={{ flex: '1 1 300px', minWidth: 0, width: '100%' }}>
          <CompatibilityActions bananaId={id} partnerId={partner.id} partnerName={partner.name} />
        </div>
      </div>
    </div>
  );
}
