export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import Link from 'next/link';

export const revalidate = 0;

export default async function DatingSelectionPage() {
  const bananas = await prisma.banana.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--gov-blue)', marginBottom: '8px' }}>
          PAZAMAYI SHERIYAYI DATING PORTAL 💘
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', margin: 0 }}>
          Select a registered specimen to enter the Culinary Chemistry & Matchmaking Portal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
        {bananas.map(banana => (
          <div key={banana.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow var(--transition-fast)' }}>
            
            {banana.photo ? (
              <div style={{ height: '180px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                 <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ height: '180px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3.5rem' }}>
                🍌
              </div>
            )}

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'monospace' }}>
                ID: {banana.registrationNumber}
              </div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: 'var(--gov-blue)', wordBreak: 'break-word' }}>
                {banana.officialName}
              </h3>
              
              <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Status</span>
                  <strong style={{ color: banana.datingAvailability === 'NOT_ACTIVATED' ? 'var(--text-light)' : 'var(--status-green)', fontSize: '0.88rem' }}>
                    {banana.datingAvailability === 'NOT_ACTIVATED' ? 'INACTIVE' : 'ACTIVE'}
                  </strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)' }}>Variety</span>
                  <strong style={{ fontSize: '0.88rem' }}>{banana.estimatedVariety || 'Unknown'}</strong>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link 
                  href={banana.datingAvailability === 'NOT_ACTIVATED' ? `/registry/${banana.id}/dating` : `/registry/${banana.id}/dating/dashboard`} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--gov-blue)', 
                    color: '#fff', 
                    padding: '12px', 
                    textDecoration: 'none', 
                    borderRadius: 'var(--radius-md)', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    minHeight: '44px'
                  }}
                >
                  ENTER AS {banana.officialName.toUpperCase()} 💘
                </Link>
              </div>
            </div>
          </div>
        ))}

        {bananas.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', marginBottom: '16px' }}>No specimens found in the registry.</p>
            <Link href="/register" style={{ display: 'inline-block', backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '12px 24px', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>
              Register a New Specimen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
