import React from 'react';
import { DocumentHeader, DocumentFooter } from './DocumentHeader';

export function ReportTemplate({ type, banana, document }: { type: 'PHYSICAL' | 'VARIETY', banana: any, document: any }) {
  
  let title = '';
  let bodyContent = null;
  
  const analysis = banana.analyses.length > 0 ? banana.analyses[0] : null;

  if (type === 'PHYSICAL') {
    title = 'PHYSICAL ANALYSIS REPORT';
    bodyContent = (
      <>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
           <div style={{ width: '160px', height: '160px', minWidth: '130px', border: '2px solid var(--gov-blue)', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px', margin: '0 auto', borderRadius: '4px' }}>
              {analysis && analysis.imageReference ? (
                <img src={analysis.imageReference} alt="Specimen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : banana.photo ? (
                <img src={banana.photo} alt="Specimen" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#999', fontSize: '0.75rem', fontWeight: 600 }}>NO IMAGE</span>
              )}
           </div>
           <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
             <h3 style={{ margin: '0 0 12px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', color: 'var(--gov-blue)', fontSize: '1.1rem' }}>SPECIMEN DETAILS</h3>
             <div className="table-responsive">
             <table style={{ width: '100%', textAlign: 'left', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
               <tbody>
                 <tr><th style={{ padding: '6px 0', width: '40%' }}>Banana ID:</th><td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{banana.id}</td></tr>
                 <tr><th style={{ padding: '6px 0' }}>Official Name:</th><td>{banana.officialName}</td></tr>
                 <tr><th style={{ padding: '6px 0' }}>Analysis ID:</th><td style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{analysis ? analysis.id : 'N/A'}</td></tr>
                 <tr><th style={{ padding: '6px 0' }}>Analysis Date:</th><td>{analysis ? new Date(analysis.timestamp).toLocaleDateString() : 'N/A'}</td></tr>
                 <tr><th style={{ padding: '6px 0' }}>Method:</th><td style={{ color: 'var(--status-warning)', fontWeight: 'bold' }}>{analysis ? analysis.analysisMethod : 'N/A'}</td></tr>
               </tbody>
             </table>
             </div>
           </div>
        </div>

        <h3 style={{ margin: '0 0 12px 0', borderBottom: '2px solid var(--gov-blue)', paddingBottom: '6px', color: 'var(--gov-blue)', fontSize: '1.1rem' }}>MEASURED HEURISTICS</h3>
        {analysis ? (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Assessment Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Curvature Angle</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{analysis.curvature}%</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>IMAGE-DERIVED</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Straightness Index</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{analysis.straightnessIndex}%</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>IMAGE-DERIVED</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Color Ripeness</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{analysis.ripeness}%</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>HEURISTIC</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Detection Confidence</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{analysis.detectionConfidence}%</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>AI-ASSISTED</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
           <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '4px' }}>ANALYSIS PENDING</div>
        )}
      </>
    );
  } else if (type === 'VARIETY') {
    title = 'VARIETY ASSESSMENT REPORT';
    bodyContent = (
      <>
        <div style={{ textAlign: 'center', margin: '24px auto', padding: '20px', backgroundColor: 'var(--gov-blue-light)', border: '2px solid var(--gov-blue)', borderRadius: 'var(--radius-md)', maxWidth: '500px' }}>
           {banana.photo && (
             <div style={{ width: '80px', height: '100px', border: '2px solid var(--gov-blue)', padding: '2px', backgroundColor: '#fff', margin: '0 auto 12px auto', borderRadius: '2px' }}>
               <img src={banana.photo} alt="Banana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
           )}
           <div style={{ fontSize: '0.85rem', color: 'var(--gov-blue)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px', fontWeight: 600 }}>AI-ESTIMATED VARIETY</div>
           <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 'bold', color: 'var(--gov-blue-dark)', wordBreak: 'break-word' }}>
             {banana.estimatedVariety || 'ASSESSMENT PENDING'}
           </div>
           {banana.varietyConfidence && (
             <div style={{ fontSize: '0.9rem', color: 'var(--status-green)', marginTop: '6px', fontWeight: 'bold' }}>
               CONFIDENCE: {banana.varietyConfidence}%
             </div>
           )}
        </div>

        <div className="table-responsive" style={{ maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
            <tbody>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)', width: '40%' }}>Banana ID</td>
                <td style={{ padding: '10px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{banana.id}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Scientific Classification</td>
                <td style={{ padding: '10px' }}>{banana.scientificClassification || 'Musa spp.'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Analysis Date</td>
                <td style={{ padding: '10px' }}>{analysis ? new Date(analysis.timestamp).toLocaleDateString() : 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--text-light)' }}>Methodology</td>
                <td style={{ padding: '10px', color: 'var(--status-warning)', fontWeight: 'bold' }}>AI-ASSISTED VISUAL ESTIMATION</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '24px', padding: '14px', border: '1px solid var(--border-color)', backgroundColor: '#fafafa', fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center', borderRadius: '4px' }}>
          <strong>IMPORTANT DISCLAIMER:</strong> This document represents an AI-assisted visual estimation based on heuristic features. It is not a certified botanical determination and cannot be used for legal agricultural classification.
        </div>
      </>
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
           <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Analysis Division</div>
         </div>
      </div>

      <DocumentFooter documentNumber={document.documentNumber} qrReference={document.qrReference} />
    </div>
  );
}
