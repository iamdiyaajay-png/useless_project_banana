export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { AnalysisEngine } from '@/components/AnalysisEngine';
import Link from 'next/link';

export const revalidate = 0;

export default async function GlobalAnalysisPage() {
  // Try to find the canonical demo banana first
  let banana = await prisma.banana.findUnique({
    where: { id: 'BNR-KL-2026-004821' }
  });

  // Fallback to the most recently registered banana if demo is missing
  if (!banana) {
    banana = await prisma.banana.findFirst({
      orderBy: { createdAt: 'desc' }
    });
  }

  if (!banana) return notFound();

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '6px' }}>BANANA ANALYSIS ENGINE</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', margin: 0 }}>
          Real-time physical and optical inspection for {banana.officialName}.
        </p>
      </div>

      {!banana.photo ? (
        <div style={{ backgroundColor: 'var(--status-red-light)', border: '1px solid var(--status-red)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <strong style={{ color: 'var(--status-red)', fontSize: '1.15rem' }}>ANALYSIS UNAVAILABLE</strong>
          <p style={{ marginTop: '8px', marginBottom: '20px', color: 'var(--text-dark)' }}>No specimen image is currently associated with this banana for standard analysis.</p>
          <Link 
            href={`/analysis/curvature`}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px', backgroundColor: 'var(--gov-blue)', color: '#fff', textDecoration: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', minHeight: '44px' }}
          >
            🍌 LAUNCH CURVATURE CHECKER INSTEAD
          </Link>
        </div>
      ) : (
        <AnalysisEngine bananaId={banana.id} photoUrl={banana.photo} />
      )}
    </div>
  );
}
