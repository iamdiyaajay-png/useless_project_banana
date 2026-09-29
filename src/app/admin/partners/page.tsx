export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { isAuthenticated } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { PartnerIcon } from '@/components/ui/PartnerIcon';

export const revalidate = 0;

export default async function AdminPartnersDashboard() {
  if (!(await isAuthenticated())) {
    redirect('/admin');
  }

  const partners = await prisma.foodPartner.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', marginBottom: '6px' }}>Culinary Partners Database</h1>
        <p style={{ color: 'var(--text-light)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', margin: 0 }}>
          Manage profiles, compatibility flags, and dating histories for registry food partners.
        </p>
      </div>

      <OfficialCard title="Registered Partners">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Icon</th>
                <th>Name</th>
                <th>Personality</th>
                <th>Flags</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(partner => {
                const redFlags = JSON.parse(partner.redFlags || '[]');
                const greenFlags = JSON.parse(partner.greenFlags || '[]');
                
                return (
                  <tr key={partner.id}>
                    <td>
                      <PartnerIcon icon={partner.imageIcon} size="2.2rem" />
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{partner.name}</td>
                    <td>{partner.personalityType}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--status-green)', marginRight: '8px' }}>{greenFlags.length} Green</span>
                        <span style={{ color: 'var(--status-red)' }}>{redFlags.length} Red</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link 
                        href={`/admin/partners/${partner.id}`}
                        style={{ padding: '8px 14px', backgroundColor: '#f4f4f5', border: '1px solid var(--border-color)', borderRadius: '4px', textDecoration: 'none', color: 'var(--text-dark)', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block', whiteSpace: 'nowrap', minHeight: '36px' }}
                      >
                        EDIT PROFILE
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </OfficialCard>
    </div>
  );
}
