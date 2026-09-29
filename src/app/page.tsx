export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { prisma } from '@/lib/services';

export const revalidate = 0;

export default async function Home() {
  const bananas = await prisma.banana.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', marginBottom: '8px' }}>Central Registry Dashboard</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', margin: 0 }}>
          Welcome to the Pazamayi Sheriyayi. View recently registered specimens and their verification statuses below.
        </p>
      </div>

      <OfficialCard title="Recent Registrations">
        {bananas.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>No subjects registered yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Photo</th>
                  <th>Registration No.</th>
                  <th>Official Name</th>
                  <th>Origin</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bananas.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        {b.photo ? (
                          <img src={b.photo} alt={b.officialName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', color: '#999' }}>N/A</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>
                      <Link href={`/registry/${b.id}`} style={{ fontWeight: 'bold' }}>
                        {b.registrationNumber}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 500 }}>{b.officialName}</td>
                    <td>{b.origin || 'Unknown'}</td>
                    <td>
                      <StatusBadge status={b.registryStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </OfficialCard>

      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <Link 
          href="/registry" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 28px', 
            backgroundColor: 'var(--gov-blue)', 
            color: '#fff', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            letterSpacing: '0.5px',
            width: '100%',
            maxWidth: '380px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'background-color var(--transition-fast)'
          }}
        >
          VIEW FULL REGISTRY ARCHIVE
        </Link>
      </div>
    </div>
  );
}
