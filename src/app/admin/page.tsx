export const dynamic = 'force-dynamic';
import React from 'react';
import { adminLogin, isAuthenticated } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';

export const metadata = {
  title: 'Admin Portal - Pazamayi Sheriyayi'
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAuthenticated()) {
    redirect('/admin/partners');
  }

  const { error } = await searchParams;

  return (
    <div style={{ maxWidth: '420px', margin: 'clamp(20px, 6vh, 60px) auto', width: '100%' }}>
      <OfficialCard title="ADMINISTRATIVE ACCESS">
        <div style={{ marginBottom: '20px', color: 'var(--text-light)', fontSize: '0.88rem' }}>
          Restricted to authorized officials of the Pazamayi Sheriyayi.
        </div>
        
        {error === 'invalid' && (
          <div style={{ backgroundColor: 'var(--status-red-light)', border: '1px solid var(--status-red)', color: 'var(--status-red)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontWeight: 'bold', fontSize: '0.88rem' }}>
            ACCESS DENIED: Invalid email or password.
          </div>
        )}

        <form action={adminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px', fontSize: '1rem' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px', fontSize: '1rem' }} 
            />
          </div>
          <button 
            type="submit" 
            style={{ padding: '14px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px', minHeight: '48px', fontSize: '0.95rem' }}
          >
            SECURE LOGIN
          </button>
        </form>
      </OfficialCard>
    </div>
  );
}
