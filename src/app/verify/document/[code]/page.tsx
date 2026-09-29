export const dynamic = 'force-dynamic';
import React from 'react';
import { verifyRecord } from '@/app/actions/verify';
import { OfficialCard } from '@/components/ui/OfficialCard';
import Link from 'next/link';

export const revalidate = 0;

export default async function QRVerificationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  const result = await verifyRecord('QR_REFERENCE', code);

  return (
    <div style={{ maxWidth: '850px', margin: '20px auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'var(--gov-blue)', margin: '0 0 6px 0', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)' }}>
          DIGITAL DOCUMENT VERIFICATION
        </h1>
        <p style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.82rem', margin: 0 }}>
          Pazamayi Sheriyayi • Official Authenticator
        </p>
      </div>

      <OfficialCard title="AUTHENTICATION RESULT">
        {result.success ? (
          <div>
            <div style={{ backgroundColor: result.status === 'VALID' ? 'var(--status-green-light)' : 'var(--status-warning-light)', padding: '18px 20px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '24px', border: `2px solid ${result.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)'}` }}>
               <h2 style={{ color: result.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)', margin: 0, fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)' }}>
                 {result.status === 'VALID' ? '✅ AUTHENTIC DOCUMENT' : `⚠️ ${result.message}`}
               </h2>
               <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 'bold', wordBreak: 'break-all' }}>
                 Verification Reference: {result.verificationReference}
               </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-light)', width: '35%' }}>Document Type</td>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{result.data.documentType.replace('_', ' ')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Document Number</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.documentNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Issued To</td>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--gov-blue)' }}>{result.data.banana.officialName}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Banana ID</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.bananaId}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Issue Date</td>
                    <td style={{ padding: '10px 12px' }}>{new Date(result.data.issueDate).toLocaleDateString()} (v{result.data.version})</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--text-light)' }}>Document Status</td>
                    <td style={{ padding: '10px 12px', fontWeight: 'bold', color: result.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)' }}>{result.data.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '24px', padding: '14px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: '8px' }}>
               <div>
                 <strong>REGISTRY RECORD:</strong> MATCHED<br/>
                 <strong>DOCUMENT INTEGRITY:</strong> VERIFIED
               </div>
               <div style={{ textAlign: 'right', color: 'var(--text-light)' }}>
                 Verified on {new Date().toLocaleString()}
               </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ backgroundColor: 'var(--status-red-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '20px', border: '2px solid var(--status-red)' }}>
               <h2 style={{ color: 'var(--status-red)', margin: 0, fontSize: '1.25rem' }}>
                 ❌ VERIFICATION FAILED
               </h2>
               <p style={{ marginTop: '12px', color: 'var(--text-dark)', fontWeight: 'bold', wordBreak: 'break-word' }}>{result.error}</p>
               <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-light)', wordBreak: 'break-all' }}>
                 Verification Reference: {result.verificationReference}
               </div>
            </div>
          </div>
        )}
      </OfficialCard>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/verify" style={{ color: 'var(--gov-blue)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
          ← Return to Main Verification Portal
        </Link>
      </div>
    </div>
  );
}
