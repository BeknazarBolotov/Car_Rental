import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Car, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cars: 0, users: 0, bookings: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/cars'), api.get('/users'), api.get('/bookings')]).then(([c, u, b]) => {
      const revenue = b.data.filter(x => x.status === 'approved').reduce((s, x) => s + x.totalPrice, 0);
      setStats({ cars: c.data.length, users: u.data.length, bookings: b.data.length, revenue });
      setBookings(b.data.slice(0, 10));
    }).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/cars" className="btn btn-gold" style={{ fontSize: 13, padding: '8px 16px' }}>Manage Cars</Link>
          <Link to="/admin/users" className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>Manage Users</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { icon: <Car size={22} />, label: 'Total Cars', val: stats.cars, color: 'var(--accent)' },
          { icon: <Users size={22} />, label: 'Total Users', val: stats.users, color: 'var(--blue)' },
          { icon: <BookOpen size={22} />, label: 'Bookings', val: stats.bookings, color: 'var(--green)' },
          { icon: <TrendingUp size={22} />, label: 'Revenue', val: `$${stats.revenue.toLocaleString()}`, color: 'var(--accent)' },
        ].map(({ icon, label, val, color }) => (
          <div key={label} className="card">
            <div style={{ color, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk', color, marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bookings table */}
      <div className="card">
        <h2 style={{ fontSize: 18, marginBottom: 20 }}>Recent Bookings</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['User','Car','Dates','Total','Status','Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px' }}>{b.user?.name || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{b.car?.brand} {b.car?.model}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--accent)', fontWeight: 600 }}>${b.totalPrice}</td>
                  <td style={{ padding: '12px' }}><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td style={{ padding: '12px' }}>
                    {b.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, color: 'var(--green)' }}
                          onClick={() => updateStatus(b._id, 'approved')}>Approve</button>
                        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, color: 'var(--red)' }}
                          onClick={() => updateStatus(b._id, 'rejected')}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}