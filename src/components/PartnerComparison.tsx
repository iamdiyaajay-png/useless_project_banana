'use client';

import React, { useState } from 'react';
import { PartnerIcon } from '@/components/ui/PartnerIcon';

export function PartnerComparison({ partners, banana }: { partners: any[], banana: any }) {
  const [p1Id, setP1Id] = useState<string>('');
  const [p2Id, setP2Id] = useState<string>('');

  const p1 = partners.find(p => p.id === p1Id);
  const p2 = partners.find(p => p.id === p2Id);

  // Simple deterministic string hash
  const hashStr = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const getAttr = (partner: any, key: string) => {
    if (!partner || !banana) return 0;
    const seed = hashStr(`${banana.id}-${partner.id}-${key}`);
    return 40 + (seed % 60);
  };

  const getScore = (partner: any) => {
    if (!partner || !banana) return 0;
    const wTrad = getAttr(partner, 'traditionalPairing') * 0.30;
    const wTaste = getAttr(partner, 'taste') * 0.25;
    const wText = getAttr(partner, 'texture') * 0.15;
    const wFreq = getAttr(partner, 'frequency') * 0.10;
    const wStab = getAttr(partner, 'stability') * 0.10;
    const wHist = getAttr(partner, 'history') * 0.10;
    return Math.max(0, Math.min(100, Math.round(wTrad + wTaste + wText + wFreq + wStab + wHist)));
  };

  const s1 = getScore(p1);
  const s2 = getScore(p2);
  
  let recommendation = null;
  if (p1 && p2) {
    if (s1 > s2) recommendation = p1.name;
    else if (s2 > s1) recommendation = p2.name;
    else recommendation = 'TIED';
  }

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Candidate 1</label>
          <select value={p1Id} onChange={e => setP1Id(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '44px', fontSize: '0.95rem' }}>
            <option value="">Select a partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem' }}>Candidate 2</label>
          <select value={p2Id} onChange={e => setP2Id(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minHeight: '44px', fontSize: '0.95rem' }}>
            <option value="">Select a partner...</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {p1 && p2 && (
        <>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--gov-blue-light)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', minWidth: '130px' }}>Factor</th>
                  <th style={{ padding: '12px', fontSize: '1.1rem', color: s1 >= s2 ? 'var(--status-green)' : 'inherit', minWidth: '130px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ wordBreak: 'break-word' }}>{p1.name}</span> <PartnerIcon icon={p1.imageIcon} size="1.8rem" />
                    </div>
                  </th>
                  <th style={{ padding: '12px', fontSize: '1.1rem', color: s2 >= s1 ? 'var(--status-green)' : 'inherit', minWidth: '130px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ wordBreak: 'break-word' }}>{p2.name}</span> <PartnerIcon icon={p2.imageIcon} size="1.8rem" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Traditional Pairing', key: 'traditionalPairing' },
                  { label: 'Taste Chemistry', key: 'taste' },
                  { label: 'Texture Alignment', key: 'texture' },
                  { label: 'Pairing Frequency', key: 'frequency' },
                  { label: 'Partner Stability', key: 'stability' },
                  { label: 'History Score', key: 'history' },
                ].map(row => {
                  const v1 = getAttr(p1, row.key);
                  const v2 = getAttr(p2, row.key);
                  return (
                    <tr key={row.key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 'bold', color: 'var(--text-light)', fontSize: '0.9rem' }}>{row.label}</td>
                      <td style={{ padding: '10px 12px', fontWeight: v1 >= v2 ? 'bold' : 'normal', color: v1 > v2 ? 'var(--gov-blue)' : 'inherit', fontSize: '1rem' }}>{v1}%</td>
                      <td style={{ padding: '10px 12px', fontWeight: v2 >= v1 ? 'bold' : 'normal', color: v2 > v1 ? 'var(--gov-blue)' : 'inherit', fontSize: '1rem' }}>{v2}%</td>
                    </tr>
                  );
                })}
                <tr style={{ borderBottom: '2px solid var(--gov-blue)', backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '14px 12px', textAlign: 'left', fontWeight: 'bold', fontSize: '1rem' }}>OVERALL COMPATIBILITY</td>
                  <td style={{ padding: '14px 12px', fontSize: '1.4rem', fontWeight: 'bold', color: s1 > s2 ? 'var(--status-green)' : 'inherit' }}>{s1}%</td>
                  <td style={{ padding: '14px 12px', fontSize: '1.4rem', fontWeight: 'bold', color: s2 > s1 ? 'var(--status-green)' : 'inherit' }}>{s2}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', backgroundColor: 'var(--gov-blue-light)', border: '2px solid var(--gov-blue)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--gov-blue)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 600 }}>DEPARTMENT RECOMMENDATION</div>
            <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: 'var(--gov-blue-dark)', wordBreak: 'break-word' }}>{recommendation}</div>
          </div>
        </>
      )}
    </div>
  );
}
