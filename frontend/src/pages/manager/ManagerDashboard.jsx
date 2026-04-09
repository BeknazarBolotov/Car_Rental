import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Car, BookOpen } from 'lucide-react';

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings').then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Manager Dashboard</h1>
        <Link to="/admin/cars" className="btn btn-gold" style={{ fontSize: 13, padding: '8px 16px' }}>
          <Car size={14} /> Add Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {['pending','approved','rejected','cancelled'].map(s => {
          const count = bookings.filter(b => b.status === s).length;
          return (
            <div key={s} className="card" style={{ textAlign: 'center', cursor: 'pointer', border: filter === s ? '1px solid var(--accent)' : '' }}
              onClick={() => setFilter(filter === s ? 'all' : s)}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: 4 }}>{count}</div>
              <div style={{ fontSize: 12, textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{s}</div>
            </div>
          );
        })}
      </div>

      {/* Bookings */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18 }}>
            {filter === 'all' ? 'All Bookings' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings`}
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400, marginLeft: 8 }}>({filtered.length})</span>
          </h2>
          {filter !== 'all' && (
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 12px' }} onClick={() => setFilter('all')}>Show all</button>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => (
            <div key={b._id} style={{ padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.car?.brand} {b.car?.model}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {b.user?.name} ({b.user?.email}) · {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()} · {b.totalDays}d · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>${b.totalPrice}</span>
                </div>
                {b.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Note: {b.notes}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
                {b.status === 'pending' && (
                  <>
                    <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12, color: 'var(--green)' }}
                      onClick={() => updateStatus(b._id, 'approved')}>✓ Approve</button>
                    <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12, color: 'var(--red)' }}
                      onClick={() => updateStatus(b._id, 'rejected')}>✗ Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No bookings found.</p>}
        </div>
      </div>
    </div>
  );
}