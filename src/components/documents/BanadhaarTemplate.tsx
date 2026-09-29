import React from 'react';

export function BanadhaarTemplate({ banana, document }: { banana: any, document: any }) {
  return (
    <div style={{ padding: 'clamp(12px, 3vw, 32px)', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%', borderRadius: 'var(--radius-md)' }}>
      
      {/* FRONT OF CARD */}
      <div className="banadhaar-card" style={{ width: '100%', maxWidth: '560px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', position: 'relative', border: '1px solid #cbd5e1' }}>
         {/* Card Header */}
         <div style={{ backgroundColor: 'var(--gov-blue)', color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '50%', padding: '3px', display: 'flex' }}>
              <div style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', letterSpacing: '1px', fontFamily: 'var(--font-family-serif)' }}>PAZAMAYI SHERIYAYI</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-gold)', letterSpacing: '1px' }}>GOVERNMENT BANANA IDENTITY CARD • BANADHAAR</div>
            </div>
         </div>

         <div style={{ padding: 'clamp(14px, 3vw, 20px)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Photo Area */}
            <div style={{ width: '110px', height: '145px', minWidth: '100px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fafafa', borderRadius: '4px', overflow: 'hidden', margin: '0 auto' }}>
               {banana.photo ? (
                 <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#999', fontSize: '0.75rem', fontWeight: 600 }}>NO PHOTO</div>
               )}
            </div>

            {/* Details */}
            <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
               <div style={{ marginBottom: '10px' }}>
                 <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Official Name</div>
                 <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 'bold', color: 'var(--text-dark)', wordBreak: 'break-word', lineHeight: 1.2 }}>{banana.officialName}</div>
               </div>
               
               <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                 <div>
                   <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Estimated Birth</div>
                   <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{banana.estimatedBirthDate ? new Date(banana.estimatedBirthDate).toLocaleDateString() : 'NOT AVAILABLE'}</div>
                 </div>
                 <div>
                   <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Origin</div>
                   <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{banana.origin || 'UNKNOWN'}</div>
                 </div>
               </div>

               <div style={{ marginBottom: '12px' }}>
                 <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Estimated Variety</div>
                 <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>{banana.estimatedVariety || 'PENDING'}</div>
               </div>

               <div style={{ marginTop: '14px', textAlign: 'center', backgroundColor: 'var(--gov-blue-light)', padding: '6px', borderRadius: '4px' }}>
                 <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--gov-blue)', letterSpacing: '2px', wordBreak: 'break-all' }}>
                   {banana.registrationNumber}
                 </div>
                 <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', letterSpacing: '1px' }}>MERA PAZHAM, MERI PEHCHAN</div>
               </div>
            </div>
         </div>
         
         <div style={{ height: '6px', backgroundColor: 'var(--muted-gold)' }}></div>
      </div>

      {/* BACK OF CARD */}
      <div className="banadhaar-card" style={{ width: '100%', maxWidth: '560px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', position: 'relative', border: '1px solid #cbd5e1', padding: 'clamp(14px, 3vw, 20px)', display: 'flex', flexDirection: 'column' }}>
         <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '14px', fontStyle: 'italic', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
           Official Identity Credential of the specimen in the Pazamayi Sheriyayi.
         </div>

         <div style={{ display: 'flex', gap: '16px', flex: 1, flexWrap: 'wrap' }}>
           <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
             <div style={{ marginBottom: '12px' }}>
               <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>BananaPrint ID</div>
               <div style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all' }}>{banana.bananaPrintId || 'PENDING ANALYSIS'}</div>
             </div>
             <div style={{ marginBottom: '12px' }}>
               <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Scientific Classification</div>
               <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{banana.scientificClassification || 'Musa spp.'}</div>
             </div>
             <div style={{ marginBottom: '12px' }}>
               <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Registry Status</div>
               <div style={{ fontWeight: 'bold', color: 'var(--status-green)', fontSize: '0.85rem' }}>{banana.registryStatus}</div>
             </div>
           </div>

           <div style={{ width: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', margin: '0 auto' }}>
             <div style={{ textAlign: 'center' }}>
               <div style={{ width: '84px', height: '84px', backgroundColor: '#000', padding: '3px', borderRadius: '4px' }}>
                  {/* Fake QR visual block */}
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', padding: '2px' }}>
                    {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ backgroundColor: ((i * 13) % 17) > 8 ? '#000' : '#fff' }} />)}
                  </div>
               </div>
               <div style={{ fontSize: '0.6rem', marginTop: '4px', fontFamily: 'monospace', fontWeight: 600 }}>SCAN TO VERIFY</div>
             </div>
             <div style={{ textAlign: 'center', marginTop: '8px' }}>
               <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>Issue Date</div>
               <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{new Date(document.issueDate).toLocaleDateString()}</div>
               <div style={{ fontSize: '0.6rem', color: 'var(--text-light)', marginTop: '2px', wordBreak: 'break-all' }}>{document.documentNumber}</div>
             </div>
           </div>
         </div>

         <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
           <div style={{ fontSize: '0.7rem', color: 'var(--gov-blue)' }}>
             <strong>Authorized Digital Credential</strong><br/>
             Pazamayi Sheriyayi • Dept. of Agriculture
           </div>
           <div style={{ height: '28px', display: 'flex', alignItems: 'flex-end' }}>
             <img src="/signature.png" alt="Signature" style={{ maxHeight: '100%', maxWidth: '90px', objectFit: 'contain' }} />
           </div>
         </div>
      </div>

    </div>
  );
}
