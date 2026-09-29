'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyRecord } from '@/app/actions/verify';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { MatchEngine } from '@/components/MatchEngine';

function VerificationResult({ result, onReset }: { result: any, onReset: () => void }) {
  if (!result) return null;

  return (
    <div style={{ marginTop: '24px', width: '100%', minWidth: 0 }}>
      {result.success ? (
        <div style={{ 
          backgroundColor: '#fff', 
          border: `2px solid ${result.status === 'VALID' || result.status === 'ACTIVE' || result.message.includes('AUTHENTIC') ? 'var(--status-green)' : 'var(--status-warning)'}`, 
          borderRadius: 'var(--radius-md)', 
          padding: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
           <h2 style={{ 
             color: result.status === 'VALID' || result.status === 'ACTIVE' || result.message.includes('AUTHENTIC') ? 'var(--status-green)' : 'var(--status-warning)', 
             margin: '0 0 12px 0', 
             fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
             wordBreak: 'break-word'
           }}>
             {result.message.includes('AUTHENTIC') ? '✅ ' : '⚠️ '}{result.message}
           </h2>
           <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '20px', wordBreak: 'break-all' }}>
             Verification Reference: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{result.verificationReference}</span>
           </div>
           
           {result.isBanana && (
             <div className="table-responsive">
               <table>
                 <tbody>
                   <tr><td style={{ fontWeight: 'bold', width: '35%' }}>Banana Name</td><td>{result.data.officialName}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Banana ID</td><td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.id}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Registration No.</td><td style={{ fontFamily: 'monospace' }}>{result.data.registrationNumber}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Registry Status</td><td style={{ color: 'var(--status-green)', fontWeight: 'bold' }}>{result.data.registryStatus}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Registration Date</td><td>{new Date(result.data.registrationDate).toLocaleDateString()}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>BananaPrint ID</td><td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.bananaPrintId || 'PENDING'}</td></tr>
                 </tbody>
               </table>
             </div>
           )}

           {result.isDoc && (
             <div className="table-responsive">
               <table>
                 <tbody>
                   <tr><td style={{ fontWeight: 'bold', width: '35%' }}>Document Type</td><td>{result.data.documentType}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Document No.</td><td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.documentNumber}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Issued To</td><td style={{ fontWeight: 'bold', color: 'var(--gov-blue)' }}>{result.data.banana?.officialName}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Banana ID</td><td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.data.bananaId}</td></tr>
                   <tr><td style={{ fontWeight: 'bold' }}>Document Status</td><td style={{ fontWeight: 'bold', color: result.data.status === 'VALID' ? 'var(--status-green)' : 'var(--status-warning)' }}>{result.data.status}</td></tr>
                 </tbody>
               </table>
             </div>
           )}

           <button 
             onClick={onReset} 
             style={{ 
               marginTop: '20px', 
               padding: '12px 20px', 
               backgroundColor: 'transparent', 
               border: '2px solid var(--gov-blue)', 
               color: 'var(--gov-blue)', 
               fontWeight: 'bold', 
               cursor: 'pointer', 
               borderRadius: 'var(--radius-md)',
               width: '100%',
               maxWidth: '280px',
               minHeight: '44px'
             }}
           >
             VERIFY ANOTHER RECORD
           </button>
        </div>
      ) : (
        <div style={{ backgroundColor: 'var(--status-red-light)', border: '2px solid var(--status-red)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center' }}>
           <h2 style={{ color: 'var(--status-red)', margin: '0 0 8px 0', fontSize: '1.3rem' }}>❌ VERIFICATION FAILED</h2>
           <p style={{ fontWeight: 'bold', margin: '0 0 12px 0', color: 'var(--status-red)', wordBreak: 'break-word' }}>Reason: {result.error}</p>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '20px', wordBreak: 'break-all' }}>
             Verification Reference: <span style={{ fontFamily: 'monospace' }}>{result.verificationReference}</span>
           </div>
           <button 
             onClick={onReset} 
             style={{ 
               padding: '12px 24px', 
               backgroundColor: 'var(--status-red)', 
               color: '#fff', 
               border: 'none', 
               fontWeight: 'bold', 
               cursor: 'pointer', 
               borderRadius: 'var(--radius-md)',
               minHeight: '44px',
               width: '100%',
               maxWidth: '240px'
             }}
           >
             TRY AGAIN
           </button>
        </div>
      )}
    </div>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const targetBananaId = searchParams.get('target') || undefined;

  const [activeTab, setActiveTab] = useState<'ID' | 'REG' | 'DOC' | 'VISUAL'>('ID');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleVerify = async (type: 'BANANA_ID' | 'REGISTRATION_NUMBER' | 'DOCUMENT_NUMBER') => {
    setLoading(true);
    setResult(null);
    const res = await verifyRecord(type, query);
    setResult(res);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Invalid file type.');
        return;
      }
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const tabs = [
    { id: 'ID', label: 'Banana ID' },
    { id: 'REG', label: 'Reg. Number' },
    { id: 'DOC', label: 'Document No.' },
    { id: 'VISUAL', label: 'Specimen Image' }
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
      
      {/* Left: Input */}
      <div style={{ flex: '2 1 540px', minWidth: 0, width: '100%' }}>
         <OfficialCard title="SELECT VERIFICATION METHOD">
           {/* Responsive scrollable tabs */}
           <div style={{ 
             display: 'flex', 
             overflowX: 'auto', 
             WebkitOverflowScrolling: 'touch',
             borderBottom: '2px solid var(--border-color)', 
             marginBottom: '20px',
             gap: '4px',
             paddingBottom: '2px'
           }}>
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setResult(null); setQuery(''); setPhotoUrl(null); }}
                  style={{
                    padding: '10px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab.id ? '3px solid var(--gov-blue)' : '3px solid transparent',
                    color: activeTab === tab.id ? 'var(--gov-blue)' : 'var(--text-light)',
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    minHeight: '44px',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
           </div>

           {/* Input Area */}
           {!result && activeTab !== 'VISUAL' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                  Enter {activeTab === 'ID' ? 'Banana ID' : activeTab === 'REG' ? 'Registration Number' : 'Document Number'}:
                </label>
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder={activeTab === 'ID' ? 'BNR-KL-2026-000000' : activeTab === 'REG' ? 'REG-2026-000000' : 'BNR/REG/2026/000000'}
                  style={{ padding: '12px 14px', fontSize: '1.05rem', fontFamily: 'monospace', border: '2px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '48px', width: '100%' }}
                />
                <button 
                  onClick={() => handleVerify(activeTab === 'ID' ? 'BANANA_ID' : activeTab === 'REG' ? 'REGISTRATION_NUMBER' : 'DOCUMENT_NUMBER')}
                  disabled={loading || !query}
                  style={{ 
                    padding: '14px', 
                    backgroundColor: 'var(--gov-blue)', 
                    color: '#fff', 
                    fontSize: '1rem', 
                    fontWeight: 'bold', 
                    border: 'none', 
                    borderRadius: 'var(--radius-md)', 
                    cursor: loading || !query ? 'not-allowed' : 'pointer', 
                    opacity: loading || !query ? 0.7 : 1,
                    minHeight: '48px',
                    width: '100%',
                    maxWidth: '300px'
                  }}
                >
                  {loading ? 'VERIFYING RECORD...' : `VERIFY ${activeTab}`}
                </button>
             </div>
           )}

           {activeTab === 'VISUAL' && !photoUrl && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: 'var(--text-light)', margin: 0 }}>Upload a photograph of the specimen to verify its identity against the Pazamayi Sheriyayi using BananaPrint.</p>
                <div style={{ border: '2px dashed var(--border-color-dark)', padding: '30px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa' }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '0.95rem', cursor: 'pointer', maxWidth: '100%' }} />
                </div>
             </div>
           )}

         </OfficialCard>

         {activeTab === 'VISUAL' && photoUrl && (
            <div style={{ marginTop: '24px' }}>
              <MatchEngine photoUrl={photoUrl} targetBananaId={targetBananaId} />
            </div>
         )}

         <VerificationResult result={result} onReset={() => { setResult(null); setQuery(''); }} />

      </div>

      {/* Right: Verification Process Flow */}
      <div style={{ flex: '1 1 280px', minWidth: 0, width: '100%' }}>
         <OfficialCard title="VERIFICATION PROCESS">
           <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', minWidth: '28px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>1</div>
                <div><strong>Input Data</strong><br/><span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Provide document reference or specimen photo.</span></div>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', height: '16px', marginLeft: '13px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', minWidth: '28px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>2</div>
                <div><strong>Registry Lookup</strong><br/><span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>System queries official database records.</span></div>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', height: '16px', marginLeft: '13px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', minWidth: '28px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>3</div>
                <div><strong>Status Validation</strong><br/><span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>System verifies active/revoked statuses.</span></div>
              </div>
              <div style={{ borderLeft: '2px solid var(--border-color)', height: '16px', marginLeft: '13px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', minWidth: '28px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>4</div>
                <div><strong>Authentication Result</strong><br/><span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Result logged permanently to Audit trail.</span></div>
              </div>
           </div>
         </OfficialCard>
      </div>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ borderBottom: '3px solid var(--gov-blue)', paddingBottom: '16px', marginBottom: '28px' }}>
        <h1 style={{ margin: 0, color: 'var(--gov-blue)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)' }}>
          DIGITAL VERIFICATION & AUTHENTICATION DIVISION
        </h1>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-light)', fontFamily: 'monospace', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          Official Validation Portal • Pazamayi Sheriyayi
        </p>
      </header>
      
      <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Loading verification service...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
