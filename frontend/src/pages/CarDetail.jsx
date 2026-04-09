import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { MapPin, Fuel, Users, Zap, Calendar } from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startDate: '', endDate: '', notes: '' });
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(({ data }) => setCar(data))
      .catch(() => toast.error('Car not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (user.role !== 'user') return toast.error('Only users can book cars');
    setBookingLoading(true);
    try {
      await api.post('/bookings', { carId: id, ...booking });
      toast.success('Booking submitted! Awaiting approval.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setBookingLoading(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post(`/cars/${id}/reviews`, review);
      setCar(data);
      toast.success('Review added!');
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!car) return <div className="empty-state"><h3>Car not found</h3></div>;

  const placeholder = `https://via.placeholder.com/800x400/12121a/c9a84c?text=${car.brand}+${car.model}`;
  const totalDays = booking.startDate && booking.endDate
    ? Math.max(0, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000))
    : 0;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
        {/* LEFT */}
        <div>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 28, height: 380, background: 'var(--bg-elevated)' }}>
            <img src={car.image || placeholder} alt={`${car.brand} ${car.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => e.target.src = placeholder} />
          </div>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)', fontWeight: 600 }}>{car.category}</span>
            <h1 style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>{car.brand} {car.model}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{car.year}</span>
              <StarRating rating={Math.round(car.averageRating)} />
              <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>({car.totalReviews} reviews)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 13 }}>
                <MapPin size={13} /> {car.location}
              </span>
            </div>
          </div>
          {/* Specs */}
          <div className="card" style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { icon: <Fuel size={18} />, label: 'Fuel', val: car.fuel },
              { icon: <Zap size={18} />, label: 'Transmission', val: car.transmission },
              { icon: <Users size={18} />, label: 'Seats', val: car.seats },
              { icon: <Calendar size={18} />, label: 'Mileage', val: `${car.mileage?.toLocaleString() || 0} km` },
            ].map(({ icon, label, val }) => (
              <div key={label} style={{ textAlign: 'center', padding: '16px 8px', borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--accent)', display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
          {/* Description */}
          {car.description && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 10, fontSize: 16 }}>About</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{car.description}</p>
            </div>
          )}
          {/* Features */}
          {car.features?.length > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 12, fontSize: 16 }}>Features</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {car.features.map(f => (
                  <span key={f} style={{ padding: '4px 12px', background: 'var(--accent-dim)', borderRadius: 20, fontSize: 12, color: 'var(--accent)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Reviews */}
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 18 }}>Reviews</h3>
            {car.reviews?.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No reviews yet. Be the first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {car.reviews.map((r, i) => (
                  <div key={i} style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.userName}</span>
                      <StarRating rating={r.rating} />
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
            {/* Add review form (users only) */}
            {user?.role === 'user' && (
              <form onSubmit={handleReview} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ fontSize: 14 }}>Write a Review</h4>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Rating</label>
                  <StarRating rating={review.rating} interactive onChange={v => setReview({ ...review, rating: v })} />
                </div>
                <textarea className="input" placeholder="Share your experience..." rows={3} required
                  value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })}
                  style={{ resize: 'vertical' }} />
                <button className="btn btn-gold" type="submit" style={{ alignSelf: 'flex-start', padding: '9px 20px', fontSize: 13 }}>
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT - Booking Card */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div className="card" style={{ border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>${car.pricePerDay}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>/day</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span className={`badge badge-${car.isAvailable ? 'available' : 'unavailable'}`}>
                {car.isAvailable ? '✓ Available' : '✗ Unavailable'}
              </span>
            </div>
            {car.isAvailable && (
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Pick-up Date</label>
                  <input className="input" type="date" required min={new Date().toISOString().split('T')[0]}
                    value={booking.startDate} onChange={e => setBooking({ ...booking, startDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Return Date</label>
                  <input className="input" type="date" required min={booking.startDate || new Date().toISOString().split('T')[0]}
                    value={booking.endDate} onChange={e => setBooking({ ...booking, endDate: e.target.value })} />
                </div>
                <textarea className="input" placeholder="Special requests..." rows={2}
                  value={booking.notes} onChange={e => setBooking({ ...booking, notes: e.target.value })}
                  style={{ resize: 'none' }} />
                {totalDays > 0 && (
                  <div style={{ padding: '12px 14px', background: 'var(--accent-dim)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>${car.pricePerDay} × {totalDays} days</span>
                      <span style={{ fontWeight: 600, color: 'var(--accent)' }}>${car.pricePerDay * totalDays}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                      <span>Total</span>
                      <span style={{ color: 'var(--accent)' }}>${car.pricePerDay * totalDays}</span>
                    </div>
                  </div>
                )}
                <button className="btn btn-gold" type="submit" disabled={bookingLoading}
                  style={{ padding: '13px', width: '100%', justifyContent: 'center', fontSize: 15 }}>
                  {bookingLoading ? 'Booking...' : user ? 'Book Now' : 'Login to Book'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}