import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    try {
      const { data } = await api.put(`/users/${id}`, { role });
      setUsers(prev => prev.map(u => u._id === id ? data : u));
      toast.success('Role updated');
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 28 }}>Manage Users</h1>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              {['Name','Email','Phone','Role','Status','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select className="input" style={{ padding: '4px 8px', width: 'auto', fontSize: 12 }}
                    value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                    <option value="user">user</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge badge-${u.isActive ? 'approved' : 'rejected'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => deleteUser(u._id)}>
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}