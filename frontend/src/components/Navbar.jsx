import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut, User, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky', top: 0, zIndex: 100, padding: '0 24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 20 }}>
          <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={18} color="#0a0a0f" />
          </div>
          <span>LUXE<span style={{ color: 'var(--accent)' }}>DRIVE</span></span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 24, marginLeft: 16 }}>
          <Link to="/cars" style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color='var(--accent)'}
            onMouseOut={e => e.target.style.color='var(--text-secondary)'}>Browse Cars</Link>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent)', textTransform: 'uppercase', fontSize: 11, fontWeight: 600, marginRight: 6 }}>{user.role}</span>
                {user.name}
              </span>
              {user.role !== 'user' && (
                <Link to={`/${user.role}`} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              )}
              {user.role === 'user' && (
                <Link to="/my-bookings" className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>
                  <User size={14} /> My Bookings
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: 13 }}>
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '7px 18px', fontSize: 14 }}>Login</Link>
              <Link to="/register" className="btn btn-gold" style={{ padding: '7px 18px', fontSize: 14 }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}