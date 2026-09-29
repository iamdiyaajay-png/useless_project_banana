export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { isAuthenticated, updateFoodPartner } from '@/app/actions/admin';
import { redirect, notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { PartnerIcon } from '@/components/ui/PartnerIcon';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminPartnerEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }

  const { id } = await params;
  const partner = await prisma.foodPartner.findUnique({ where: { id } });

  if (!partner) return notFound();

  // Helper to pre-populate arrays as comma separated string
  const redFlagsStr = JSON.parse(partner.redFlags || '[]').join(', ');
  const greenFlagsStr = JSON.parse(partner.greenFlags || '[]').join(', ');

  // Create bound action with ID
  const updateAction = updateFoodPartner.bind(null, id);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/admin/partners" style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>&larr; Back to Database</Link>
      </div>

      <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '6px', wordBreak: 'break-word' }}>Edit Love File: {partner.name}</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '0.95rem' }}>Update profile image, flags, and ex-stories.</p>

      <OfficialCard title="Partner Profile Editor">
        <form action={updateAction} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px', minWidth: '220px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Name</label>
              <input type="text" name="name" defaultValue={partner.name} required style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px' }} />
              
              <label style={{ display: 'block', fontWeight: 600, marginTop: '16px', marginBottom: '6px', fontSize: '0.9rem' }}>Upload Image (Overrides Emoji)</label>
              <input type="file" name="imageFile" accept="image/*" style={{ width: '100%', padding: '10px', border: '1px dashed var(--gov-blue)', borderRadius: 'var(--radius-md)', backgroundColor: '#f0f9ff', minHeight: '44px' }} />
            </div>
            <div style={{ width: '120px', textAlign: 'center', margin: '0 auto' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Current</label>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <PartnerIcon icon={partner.imageIcon} size="4rem" />
              </div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '4px' }}>Emoji Fallback</label>
              <input type="text" name="imageIcon" defaultValue={partner.imageIcon?.startsWith('data:') ? '' : (partner.imageIcon || '')} style={{ width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '1.5rem', textAlign: 'center', minHeight: '44px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Personality Type</label>
            <input type="text" name="personalityType" defaultValue={partner.personalityType || ''} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Description</label>
            <textarea name="description" defaultValue={partner.description || ''} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', resize: 'vertical' }} />
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
             <h3 style={{ margin: '0 0 12px 0', color: '#b91c1c', fontSize: '1.05rem' }}>Red Flags (Comma Separated)</h3>
             <textarea name="redFlags" defaultValue={redFlagsStr} rows={3} placeholder="e.g. Too sweet, Gets sticky, Melts fast" style={{ width: '100%', padding: '12px', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', backgroundColor: '#fef2f2', resize: 'vertical' }} />
          </div>

          <div>
             <h3 style={{ margin: '0 0 12px 0', color: '#15803d', fontSize: '1.05rem' }}>Green Flags (Comma Separated)</h3>
             <textarea name="greenFlags" defaultValue={greenFlagsStr} rows={3} placeholder="e.g. Crunchy, Reliable, Classic" style={{ width: '100%', padding: '12px', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', backgroundColor: '#f0fdf4', resize: 'vertical' }} />
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Ex-Story / Dating History</label>
            <textarea name="datingHistory" defaultValue={partner.datingHistory || ''} rows={4} placeholder="Describe their past relationships..." style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Culinary History</label>
            <textarea name="culinaryHistory" defaultValue={partner.culinaryHistory || ''} rows={4} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ padding: '14px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '12px', minHeight: '48px', width: '100%', maxWidth: '320px' }}>
            SAVE PROFILE CHANGES
          </button>
        </form>
      </OfficialCard>
    </div>
  );
}
