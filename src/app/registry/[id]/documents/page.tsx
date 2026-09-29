export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { DocumentGeneratorButton } from '@/components/documents/DocumentGeneratorButton';
import Link from 'next/link';

export const revalidate = 0;

export default async function DocumentVaultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { createdAt: 'desc' } },
      auditEvents: { 
        where: { source: 'DOCUMENT_VAULT' },
        orderBy: { timestamp: 'desc' },
        take: 5
      }
    }
  });

  if (!banana) return notFound();

  const activeDocs = banana.documents.filter(d => d.status === 'VALID');

  const requiredTypes = [
    { type: 'BANADHAAR', name: 'Banana Identity Card (Banadhaar)' },
    { type: 'REGISTRATION_CERT', name: 'Certificate of Registration' },
    { type: 'BIRTH_CERT', name: 'Certificate of Birth' },
    { type: 'PHYSICAL_REPORT', name: 'Physical Analysis Report' },
    { type: 'VARIETY_REPORT', name: 'Variety Assessment Report' },
    { type: 'COMPATIBILITY_CERT', name: 'Compatibility Certificate' },
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
      
      {/* Left Column: Register & Available Certificates */}
      <div style={{ flex: '2 1 540px', minWidth: 0, width: '100%' }}>
        <OfficialCard title="AVAILABLE CERTIFICATES">
          <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '0.92rem' }}>
            Generate or view official certificates associated with this specimen. All credentials draw directly from verified National Registry records.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requiredTypes.map(rt => {
              const doc = activeDocs.find(d => d.documentType === rt.type);
              return (
                <div key={rt.type} style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ minWidth: 0, flex: '1 1 200px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-dark)', wordBreak: 'break-word' }}>{rt.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                      Status: {doc ? <strong style={{ color: 'var(--status-green)' }}>ISSUED (v{doc.version})</strong> : <strong style={{ color: 'var(--status-warning)' }}>PENDING GENERATION</strong>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {doc && (
                      <Link href={`/registry/${id}/documents/${doc.id}`} style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid var(--gov-blue)', color: 'var(--gov-blue)', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        VIEW
                      </Link>
                    )}
                    <DocumentGeneratorButton bananaId={id} documentType={rt.type} hasExisting={!!doc} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '28px', borderTop: '2px solid var(--border-color)', paddingTop: '20px' }}>
             <h3 style={{ margin: '0 0 8px 0', color: 'var(--gov-blue)', fontSize: '1.1rem' }}>GENERATE COMPLETE BANANA DOSSIER</h3>
             <p style={{ color: 'var(--text-light)', marginBottom: '16px', fontSize: '0.9rem' }}>Compile all valid certificates into a single consolidated file reference.</p>
             <DocumentGeneratorButton bananaId={id} documentType="COMPLETE_FILE" hasExisting={!!activeDocs.find(d => d.documentType === 'COMPLETE_FILE')} label="GENERATE BUNDLE 📦" />
          </div>
        </OfficialCard>

        <div style={{ marginTop: '24px' }}>
          <OfficialCard title="DOCUMENT REGISTER">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Document No.</th>
                    <th>Type</th>
                    <th>Ver.</th>
                    <th>Issue Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {banana.documents.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{doc.documentNumber}</td>
                      <td>{doc.documentType}</td>
                      <td>v{doc.version}</td>
                      <td>{new Date(doc.issueDate).toLocaleDateString()}</td>
                      <td style={{ color: doc.status === 'VALID' ? 'var(--status-green)' : 'var(--status-red)', fontWeight: 'bold' }}>{doc.status}</td>
                    </tr>
                  ))}
                  {banana.documents.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>No documents registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </OfficialCard>
        </div>
      </div>

      {/* Right Column: Summary & History */}
      <div style={{ flex: '1 1 280px', minWidth: 0, width: '100%' }}>
        <OfficialCard title="DOCUMENT SUMMARY">
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>File Reference No.</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 600, wordBreak: 'break-all' }}>{banana.registrationNumber}</div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Active Docs</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.6rem', color: 'var(--gov-blue)' }}>{activeDocs.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revoked / Expired</div>
            <div style={{ fontWeight: 'bold', color: 'var(--status-red)', fontSize: '1.1rem' }}>{banana.documents.length - activeDocs.length}</div>
          </div>
        </OfficialCard>

        <div style={{ marginTop: '24px' }}>
          <OfficialCard title="DOCUMENT HISTORY">
             <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
               {banana.auditEvents.map(evt => (
                 <div key={evt.id} style={{ borderLeft: '3px solid var(--gov-blue)', paddingLeft: '12px' }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{new Date(evt.timestamp).toLocaleString()}</div>
                   <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{evt.eventType.replace(/_/g, ' ')}</div>
                   <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', wordBreak: 'break-word' }}>{evt.description}</div>
                 </div>
               ))}
               {banana.auditEvents.length === 0 && <div style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>No vault history recorded.</div>}
             </div>
          </OfficialCard>
        </div>
      </div>

    </div>
  );
}
