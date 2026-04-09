import { Link } from 'react-router-dom';
import { Star, Fuel, Users, Zap } from 'lucide-react';

export default function CarCard({ car }) {
  const placeholder = `https://via.placeholder.com/400x220/12121a/c9a84c?text=${car.brand}+${car.model}`;

  return (
    <Link to={`/cars/${car._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius)', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer'
      }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(201,168,76,0.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
        {/* Image */}
        <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
          <img src={car.image || placeholder} alt={`${car.brand} ${car.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => e.target.src = placeholder} />
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
            padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1
          }}>{car.category}</div>
          {!car.isAvailable && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, color: 'var(--red)', letterSpacing: 2
            }}>UNAVAILABLE</div>
          )}
        </div>
        {/* Info */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>{car.brand} {car.model}</h3>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{car.year} · {car.color}</span>
            </div>
            {car.totalReviews > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={13} fill="var(--accent)" color="var(--accent)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{car.averageRating}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({car.totalReviews})</span>
              </div>
            )}
          </div>
          {/* Features row */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            {[
              { icon: <Fuel size={13} />, label: car.fuel },
              { icon: <Users size={13} />, label: `${car.seats} seats` },
              { icon: <Zap size={13} />, label: car.transmission },
            ].map(({ icon, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                {icon} {label}
              </span>
            ))}
          </div>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>
                ${car.pricePerDay}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/day</span>
            </div>
            <span style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: 'var(--accent)', color: '#0a0a0f'
            }}>Book Now →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}