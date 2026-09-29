import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeader';

export function CertificateTemplate({ type, banana, document }: { type: 'REGISTRATION' | 'BIRTH' | 'COMPATIBILITY', banana: any, document: any }) {
  
  let title = '';
  let bodyContent = null;
  let isCompatibility = type === 'COMPATIBILITY';

  if (type === 'REGISTRATION') {
    title = 'CERTIFICATE OF BANANA REGISTRATION';
    bodyContent = (
      <>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', textAlign: 'center', margin: '24px 0 16px 0' }}>
          This is to certify that the specimen identified as
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', textAlign: 'center', color: 'var(--gov-blue)', margin: 0, wordBreak: 'break-word' }}>
            {banana.officialName}
          </h3>
          {banana.photo && (
            <div style={{ width: '70px', height: '90px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff', borderRadius: '2px' }}>
              <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', margin: '0 0 24px 0' }}>
          has been officially registered in the Pazamayi Sheriyayi.
        </p>
        
        <div className="table-responsive" style={{ maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Registration Number</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{banana.registrationNumber}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Banana ID</td>
                <td style={{ padding: '10px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{banana.id}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Registration Date</td>
                <td style={{ padding: '10px' }}>{new Date(banana.registrationDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Origin</td>
                <td style={{ padding: '10px' }}>{banana.origin || 'UNKNOWN'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Registry Status</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--status-green)' }}>{banana.registryStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  } else if (type === 'BIRTH') {
    title = 'CERTIFICATE OF BANANA BIRTH';
    bodyContent = (
      <>
        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', textAlign: 'center', margin: '24px 0 16px 0' }}>
          This record formally attests to the estimated origin and emergence of
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', textAlign: 'center', color: 'var(--gov-blue)', margin: 0, wordBreak: 'break-word' }}>
            {banana.officialName}
          </h3>
          {banana.photo && (
            <div style={{ width: '70px', height: '90px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff', borderRadius: '2px' }}>
              <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
        
        <div style={{ textAlign: 'center', margin: '24px auto', padding: '18px', border: '2px dashed var(--muted-gold)', backgroundColor: '#fffdf5', maxWidth: '500px', borderRadius: 'var(--radius-md)' }}>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>ESTIMATED DATE OF ORIGIN/BIRTH</div>
           <div style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: 'bold', color: 'var(--gov-blue)' }}>
             {banana.estimatedBirthDate ? new Date(banana.estimatedBirthDate).toLocaleDateString() : 'NOT AVAILABLE'}
           </div>
           {!banana.estimatedBirthDate && <div style={{ fontSize: '0.85rem', color: 'var(--status-red)', marginTop: '4px' }}>Estimation not possible.</div>}
        </div>
        
        <div className="table-responsive" style={{ maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Banana ID</td>
                <td style={{ padding: '10px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{banana.id}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Origin Location</td>
                <td style={{ padding: '10px' }}>{banana.origin || 'UNKNOWN'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Estimated Variety</td>
                <td style={{ padding: '10px' }}>{banana.estimatedVariety || 'PENDING ASSESSMENT'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  } else if (type === 'COMPATIBILITY') {
    title = 'CERTIFICATE OF COMPATIBILITY';
    
    const relationship = banana.relationships.length > 0 ? banana.relationships[0] : null;

    bodyContent = (
      <div style={{ position: 'relative' }}>
        <p style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', textAlign: 'center', margin: '20px 0', position: 'relative', zIndex: 1 }}>
          The Pazamayi Sheriyayi has formally assessed culinary chemistry between:
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '0 0 24px 0', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '16px' }}>
           <div style={{ textAlign: 'center', flex: '1 1 140px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             {banana.photo && (
               <div style={{ width: '70px', height: '90px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff', marginBottom: '8px', borderRadius: '2px' }}>
                 <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
             )}
             <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'var(--gov-blue)', margin: 0, wordBreak: 'break-word' }}>{banana.officialName}</h3>
             <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Registered Specimen</div>
           </div>
           <div style={{ fontSize: '1.5rem', color: '#cc0000', margin: '0 8px', fontWeight: 'bold' }}>&</div>
           <div style={{ textAlign: 'center', flex: '1 1 140px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             {relationship?.foodPartner?.imageIcon && (
               <div style={{ width: '70px', height: '90px', border: '2px solid #cc0000', padding: '2px', backgroundColor: '#fff', marginBottom: '8px', borderRadius: '2px' }}>
                 <img src={relationship.foodPartner.imageIcon} alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </div>
             )}
             <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'var(--gov-blue)', margin: 0, wordBreak: 'break-word' }}>{relationship ? relationship.foodPartner.name : 'UNKNOWN'}</h3>
             <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Certified Partner</div>
           </div>
        </div>
        
        <div style={{ textAlign: 'center', margin: '20px auto', padding: '18px', backgroundColor: '#ffe6e6', border: '2px solid #ff9999', borderRadius: '8px', maxWidth: '450px', position: 'relative', zIndex: 1 }}>
           <div style={{ fontSize: '0.85rem', color: '#cc0000', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', fontWeight: 'bold' }}>OVERALL COMPATIBILITY</div>
           <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 'bold', color: '#cc0000', lineHeight: 1 }}>
             {relationship ? `${relationship.compatibilityScore}%` : 'N/A'}
           </div>
           <div style={{ fontSize: '0.95rem', color: '#cc0000', marginTop: '6px', fontWeight: 'bold' }}>
             {relationship && relationship.compatibilityScore > 85 ? 'HIGH COMPATIBILITY' : relationship && relationship.compatibilityScore > 60 ? 'MODERATE COMPATIBILITY' : 'LOW COMPATIBILITY'}
           </div>
        </div>

        <div className="table-responsive" style={{ maxWidth: '600px', margin: '0 auto 24px auto', position: 'relative', zIndex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', backgroundColor: '#fff' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)', width: '35%' }}>Relationship Risk</td>
                <td style={{ padding: '10px', fontWeight: 'bold', color: relationship && relationship.riskLevel === 'LOW' ? 'var(--status-green)' : 'var(--status-warning)' }}>{relationship ? relationship.riskLevel : 'UNKNOWN'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Assessment Factors</td>
                <td style={{ padding: '10px' }}>
                  Traditional Pairing, Taste Chemistry, Texture Alignment, Pairing Frequency, Relationship Stability.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="document-content document-border" style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div className="watermark">PAZAMAYI SHERIYAYI</div>
      <DocumentHeader title={title} />
      
      <div style={{ minHeight: '300px' }}>
        {bodyContent}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
         <div className="seal-area" style={{ border: 'none', padding: 0, overflow: 'hidden' }}>
           <img src="/seal.png" alt="Official Seal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
         </div>
         <div style={{ textAlign: 'center', width: '220px', marginLeft: 'auto' }}>
           <div style={{ borderBottom: '1px solid var(--text-dark)', marginBottom: '6px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <img src="/signature.png" alt="Signature" style={{ maxHeight: '100%', maxWidth: '100px', objectFit: 'contain' }} />
           </div>
           <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 'bold' }}>Authorized Signature</div>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{isCompatibility ? 'Compatibility Division' : 'Documentation Division'}</div>
         </div>
      </div>

      <DocumentFooter documentNumber={document.documentNumber} qrReference={document.qrReference} />
    </div>
  );
}
