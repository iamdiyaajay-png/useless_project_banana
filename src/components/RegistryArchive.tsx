'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function RegistryArchive() {
  const [specimens, setSpecimens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search states
  const [query, setQuery] = useState('');
  const [variety, setVariety] = useState('');
  const [status, setStatus] = useState('');

  const fetchSpecimens = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (variety) params.append('variety', variety);
      if (status) params.append('status', status);

      const res = await fetch(`/api/specimens/search?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      
      if (data.success) {
        setSpecimens(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSpecimens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSpecimens();
  };

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%', minWidth: 0 }}>
      
      {/* Sidebar: Filters */}
      <div style={{ flex: '1 1 280px', minWidth: 0, width: '100%' }}>
        <OfficialCard title="Archive Search & Filter">
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                Search Query
              </label>
              <input 
                type="text" 
                placeholder="ID, Name, Alias, Origin..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px', fontSize: '1rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                Variety Filter
              </label>
              <select 
                value={variety} 
                onChange={(e) => setVariety(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px', fontSize: '1rem' }}
              >
                <option value="">ALL VARIETIES</option>
                <option value="Musa paradisiaca">Musa paradisiaca</option>
                <option value="Musa acuminata">Musa acuminata</option>
                <option value="Musa balbisiana">Musa balbisiana</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                Status Filter
              </label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', minHeight: '44px', fontSize: '1rem' }}
              >
                <option value="">ALL STATUSES</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={{ 
                padding: '14px', 
                backgroundColor: 'var(--gov-blue)', 
                color: 'white', 
                border: 'none', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                minHeight: '44px',
                fontSize: '0.95rem',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              SUBMIT SEARCH
            </button>
            <button 
              type="button" 
              onClick={() => { setQuery(''); setVariety(''); setStatus(''); setTimeout(fetchSpecimens, 0); }} 
              style={{ 
                padding: '12px', 
                backgroundColor: '#f8fafc', 
                color: 'var(--text-dark)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer',
                minHeight: '44px',
                fontSize: '0.9rem'
              }}
            >
              RESET FILTERS
            </button>
          </form>
        </OfficialCard>
      </div>

      {/* Main Content: Results */}
      <div style={{ flex: '3 1 540px', minWidth: 0, width: '100%' }}>
        <OfficialCard title={`Registry Archive (${loading ? '...' : specimens.length})`}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              Querying National Database...
            </div>
          ) : specimens.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
              No specimens matched the given criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Photo</th>
                    <th>Registration No.</th>
                    <th>Official Name</th>
                    <th>Origin</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {specimens.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          {b.photo ? (
                            <img src={b.photo} alt={b.officialName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', color: '#999' }}>N/A</span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>
                        <Link href={`/registry/${b.id}`} style={{ fontWeight: 'bold' }}>
                          {b.registrationNumber}
                        </Link>
                      </td>
                      <td style={{ fontWeight: 500 }}>{b.officialName}</td>
                      <td>{b.origin || 'Unknown'}</td>
                      <td>
                        <StatusBadge status={b.registryStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </OfficialCard>
      </div>

    </div>
  );
}
