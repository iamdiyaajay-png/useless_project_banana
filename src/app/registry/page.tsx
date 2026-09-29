export const dynamic = 'force-dynamic';
import React from 'react';
import RegistryArchive from '@/components/RegistryArchive';

export const metadata = {
  title: 'Registry Archive - Pazamayi Sheriyayi',
};

export default function RegistryPage() {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>Registry Archive</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', margin: 0 }}>
          Search and filter the complete database of officially registered specimens.
        </p>
      </div>
      
      <RegistryArchive />
    </div>
  );
}
