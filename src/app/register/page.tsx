export const dynamic = 'force-dynamic';
import React from 'react';
import { RegistrationForm } from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>NEW BANANA REGISTRATION</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', margin: 0 }}>
          Submit a specimen for registration in the Pazamayi Sheriyayi.
        </p>
      </div>

      <RegistrationForm />
    </div>
  );
}
