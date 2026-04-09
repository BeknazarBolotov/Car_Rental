import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY_CAR = { brand:'',model:'',year:2024,category:'sedan',pricePerDay:'',transmission:'automatic',fuel:'petrol',seats:5,mileage:0,color:'Black',image:'',description:'',features:'',isAvailable:true,location:'Bishkek' };

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [modal, setModal] = useState(null); // null | 'create' | car_object
  const [form, setForm] = useState(EMPTY_CAR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars').then(({ data }) => setCars(data)).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setForm(EMPTY_CAR); setModal('create'); };
  const openEdit = (car) => {
    setForm({ ...car, features: car.features?.join(', ') || '', year: car.year });
    setModal(car);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, features: form.features ? form.features.split(',').map(f => f.trim()) : [] };
    try {
      if (modal === 'create') {
        const { data } = await api.post('/cars', payload);
        setCars(prev => [data, ...prev]);
        toast.success('Car added!');
      } else {
        const { data } = await api.put(`/cars/${modal._id}`, payload);
        setCars(prev => prev.map(c => c._id === modal._id ? data : c));
        toast.success('Car updated!');
      }
      setModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteCar = async (id) => {
    if (!confirm('Delete this car?')) return;
    try {
      await api.delete(`/cars/${id}`);
      setCars(prev => prev.filter(c => c._id !== id));
      toast.success('Car deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Manage Cars</h1>
        <button className="btn btn-gold" onClick={openCreate}><Plus size={16} /> Add Car</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)' }}>
              {['Car','Category','Price/Day','Status','Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600 }}>{car.brand} {car.model}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{car.year} · {car.color}</div>
                </td>
                <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{car.category}</td>
                <td style={{ padding: '12px 16px', color: 'var(--accent)', fontWeight: 600 }}>${car.pricePerDay}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span className={`badge badge-${car.isAvailable ? 'available' : 'unavailable'}`}>
                    {car.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => openEdit(car)}>
                      <Pencil size={13} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => deleteCar(car._id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24
        }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 24 }}>{modal === 'create' ? 'Add New Car' : 'Edit Car'}</h2>
            <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { key: 'brand', label: 'Brand', full: false },
                { key: 'model', label: 'Model', full: false },
                { key: 'year', label: 'Year', type: 'number', full: false },
                { key: 'pricePerDay', label: 'Price/Day ($)', type: 'number', full: false },
                { key: 'color', label: 'Color', full: false },
                { key: 'seats', label: 'Seats', type: 'number', full: false },
                { key: 'mileage', label: 'Mileage (km)', type: 'number', full: false },
                { key: 'location', label: 'Location', full: false },
                { key: 'image', label: 'Image URL', full: true },
                { key: 'description', label: 'Description', full: true, textarea: true },
                { key: 'features', label: 'Features (comma-separated)', full: true },
              ].map(({ key, label, type = 'text', full, textarea }) => (
                <div key={key} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{label}</label>
                  {textarea ? (
                    <textarea className="input" rows={2} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ resize: 'vertical' }} />
                  ) : (
                    <input className="input" type={type} required={['brand','model','year','pricePerDay'].includes(key)}
                      value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  )}
                </div>
              ))}
              {/* Selects */}
              {[
                { key: 'category', label: 'Category', opts: ['sedan','suv','sports','luxury','electric','minivan'] },
                { key: 'transmission', label: 'Transmission', opts: ['automatic','manual'] },
                { key: 'fuel', label: 'Fuel', opts: ['petrol','diesel','electric','hybrid'] },
              ].map(({ key, label, opts }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <select className="input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="avail" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
                <label htmlFor="avail" style={{ fontSize: 13 }}>Available for booking</label>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-gold">{modal === 'create' ? 'Add Car' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}