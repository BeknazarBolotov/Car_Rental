import { Search } from 'lucide-react';

export default function FilterBar({ filters, onChange }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 28,
      display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center'
    }}>
      {/* Search */}
      <div style={{ flex: '1 1 220px', position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="input" placeholder="Search brand, model..." value={filters.search || ''}
          onChange={e => update('search', e.target.value)}
          style={{ paddingLeft: 36 }} />
      </div>
      {/* Category */}
      <select className="input" style={{ flex: '0 1 150px' }} value={filters.category || ''} onChange={e => update('category', e.target.value)}>
        <option value="">All Categories</option>
        {['sedan','suv','sports','luxury','electric','minivan'].map(c => (
          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        ))}
      </select>
      {/* Transmission */}
      <select className="input" style={{ flex: '0 1 150px' }} value={filters.transmission || ''} onChange={e => update('transmission', e.target.value)}>
        <option value="">Transmission</option>
        <option value="automatic">Automatic</option>
        <option value="manual">Manual</option>
      </select>
      {/* Price */}
      <input className="input" type="number" placeholder="Max price/day" style={{ flex: '0 1 140px' }}
        value={filters.maxPrice || ''} onChange={e => update('maxPrice', e.target.value)} />
      {/* Available only */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
        <input type="checkbox" checked={filters.available === 'true'} onChange={e => update('available', e.target.checked ? 'true' : '')}
          style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
        Available only
      </label>
      {/* Reset */}
      <button className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 14px' }} onClick={() => onChange({})}>
        Reset
      </button>
    </div>
  );
}