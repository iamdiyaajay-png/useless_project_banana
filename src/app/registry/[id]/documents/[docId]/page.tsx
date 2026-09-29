export const dynamic = 'force-dynamic';
import React from 'react';
import { prisma } from '@/lib/services';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintAction } from '@/components/documents/PrintAction';
import { BanadhaarTemplate } from '@/components/documents/BanadhaarTemplate';
import { CertificateTemplate } from '@/components/documents/CertificateTemplate';
import { ReportTemplate } from '@/components/documents/ReportTemplate';

export const revalidate = 0;

export default async function DocumentViewerPage({ params }: { params: Promise<{ id: string, docId: string }> }) {
  const { id, docId } = await params;
  
  const banana = await prisma.banana.findUnique({
    where: { id },
    include: {
      analyses: { orderBy: { timestamp: 'desc' } },
      relationships: { include: { foodPartner: true } },
      documents: true
    }
  });
  
  if (!banana) return notFound();

  const document = banana.documents.find(d => d.id === docId);
  if (!document) return notFound();

  // Determine what to render
  let TemplateContent;
  switch (document.documentType) {
    case 'BANADHAAR':
      TemplateContent = <BanadhaarTemplate banana={banana} document={document} />;
      break;
    case 'REGISTRATION_CERT':
      TemplateContent = <CertificateTemplate type="REGISTRATION" banana={banana} document={document} />;
      break;
    case 'BIRTH_CERT':
      TemplateContent = <CertificateTemplate type="BIRTH" banana={banana} document={document} />;
      break;
    case 'PHYSICAL_REPORT':
      TemplateContent = <ReportTemplate type="PHYSICAL" banana={banana} document={document} />;
      break;
    case 'VARIETY_REPORT':
      TemplateContent = <ReportTemplate type="VARIETY" banana={banana} document={document} />;
      break;
    case 'COMPATIBILITY_CERT':
      TemplateContent = <CertificateTemplate type="COMPATIBILITY" banana={banana} document={document} />;
      break;
    case 'COMPLETE_FILE':
      TemplateContent = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="page-break" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: 'var(--gov-blue)' }}>PAZAMAYI SHERIYAYI</h1>
            <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', letterSpacing: '2px' }}>COMPLETE BANANA DOSSIER</h2>
            <div style={{ marginTop: '24px', fontSize: '1rem', textAlign: 'left', border: '2px solid var(--border-color)', padding: '20px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
              <p><strong>Banana:</strong> {banana.officialName}</p>
              <p><strong>Banana ID:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{banana.id}</span></p>
              <p><strong>File Reference:</strong> <span style={{ fontFamily: 'monospace' }}>{document.documentNumber}</span></p>
              <p><strong>Status:</strong> <span style={{ color: 'var(--status-green)', fontWeight: 'bold' }}>{document.status}</span></p>
            </div>
          </div>
          <div className="page-break"><BanadhaarTemplate banana={banana} document={document} /></div>
          <div className="page-break"><CertificateTemplate type="REGISTRATION" banana={banana} document={document} /></div>
          <div className="page-break"><CertificateTemplate type="BIRTH" banana={banana} document={document} /></div>
          <div className="page-break"><ReportTemplate type="VARIETY" banana={banana} document={document} /></div>
          <div className="page-break"><ReportTemplate type="PHYSICAL" banana={banana} document={document} /></div>
          {banana.relationships.length > 0 && <div className="page-break"><CertificateTemplate type="COMPATIBILITY" banana={banana} document={document} /></div>}
        </div>
      );
      break;
    default:
      TemplateContent = <div>Template not implemented.</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div className="hide-on-print" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px', 
        backgroundColor: '#fff', 
        padding: '14px 18px', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-md)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Link href={`/registry/${id}/documents`} style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.88rem' }}>
            ← Back to Vault
          </Link>
          <div style={{ marginTop: '4px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 'bold', wordBreak: 'break-all' }}>Viewing: {document.documentNumber}</div>
        </div>
        <div>
          <PrintAction bananaId={id} documentType={document.documentType} />
        </div>
      </div>

      <div className="document-container" style={{ margin: '0 auto', width: '100%', backgroundColor: '#fff', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {TemplateContent}
      </div>
    </div>
  );
}
