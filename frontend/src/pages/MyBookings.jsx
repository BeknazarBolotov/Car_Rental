import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Car } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings')
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 28 }}>My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="empty-state">
          <Car size={48} />
          <h3>No bookings yet</h3>
          <p style={{ marginTop: 8 }}>Browse our fleet and make your first booking</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(b => (
            <div key={b._id} className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 80, height: 60, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                <img src={b.car?.image || `https://via.placeholder.com/80x60/1a1a26/c9a84c?text=Car`}
                  alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                  {b.car?.brand} {b.car?.model}
                </h3>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} />
                    {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                  </span>
                  <span>• {b.totalDays} days • ${b.totalPrice}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`badge badge-${b.status}`}>{b.status}</span>
                {b.status === 'pending' && (
                  <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => cancel(b._id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}