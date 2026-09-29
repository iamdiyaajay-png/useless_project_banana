export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/services';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { notFound } from 'next/navigation';

export default async function RegistrationSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> | { id?: string } }) {
  const resolvedParams = await searchParams;
  const id = resolvedParams?.id;
  if (!id) return notFound();

  const banana = await prisma.banana.findUnique({
    where: { id }
  });

  if (!banana) return notFound();

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '6px' }}>BANANA REGISTRATION SUCCESSFUL</h1>
      </div>

      <div style={{ 
        backgroundColor: 'var(--status-green-light)', 
        border: '1px solid var(--status-green)',
        padding: '18px 20px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: '1.8rem', color: 'var(--status-green)', lineHeight: 1 }}>✓</div>
        <div>
          <h2 style={{ margin: 0, color: 'var(--status-green)', fontSize: '1.15rem' }}>REGISTRATION CONFIRMED</h2>
          <div style={{ color: 'var(--status-green)', opacity: 0.9, fontSize: '0.88rem' }}>Subject has been officially recorded in the Pazamayi Sheriyayi.</div>
        </div>
      </div>

      <OfficialCard title="Registration Details">
        <div className="table-responsive">
          <table>
            <tbody>
              <tr>
                <th style={{ padding: '12px', width: '35%' }}>Official Banana Name</th>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{banana.officialName}</td>
              </tr>
              <tr>
                <th style={{ padding: '12px' }}>Banana ID / Reg. No.</th>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '1.05rem', wordBreak: 'break-all' }}>{banana.registrationNumber}</td>
              </tr>
              <tr>
                <th style={{ padding: '12px' }}>Registration Date</th>
                <td style={{ padding: '12px' }}>{new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(banana.createdAt)}</td>
              </tr>
              <tr>
                <th style={{ padding: '12px' }}>Registry Status</th>
                <td style={{ padding: '12px' }}>
                  <StatusBadge status={banana.registryStatus} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </OfficialCard>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
        <Link 
          href={`/registry/${banana.id}`}
          style={{
            backgroundColor: 'var(--gov-blue)',
            color: '#fff',
            padding: '12px 24px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            fontSize: '0.92rem'
          }}
        >
          VIEW BANANA PROFILE
        </Link>
        <Link 
          href="/"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--gov-blue)',
            border: '2px solid var(--gov-blue)',
            padding: '12px 24px',
            textDecoration: 'none',
            fontWeight: 'bold',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            fontSize: '0.92rem'
          }}
        >
          GO TO REGISTRY DASHBOARD
        </Link>
      </div>
    </div>
  );
}
