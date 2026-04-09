import { Link } from 'react-router-dom';
import { Car, Shield, Star, Clock } from 'lucide-react';

export default function Home() {
  const features = [
    { icon: <Car size={28} />, title: 'Premium Fleet', desc: 'From sedans to supercars, curated for excellence' },
    { icon: <Shield size={28} />, title: 'Fully Insured', desc: 'Comprehensive coverage on every rental' },
    { icon: <Star size={28} />, title: '5-Star Service', desc: 'Rated by thousands of satisfied customers' },
    { icon: <Clock size={28} />, title: '24/7 Support', desc: 'Always here when you need us' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-block', padding: '5px 14px', background: 'var(--accent-dim)',
              borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--accent)',
              letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24
            }}>Premium Car Rental</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
              Drive Your<br /><span style={{ color: 'var(--accent)' }}>Dream Car</span><br />Today
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40, maxWidth: 420 }}>
              Experience luxury and performance with our handpicked fleet of premium vehicles. Seamless booking, transparent pricing.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <Link to="/cars" className="btn btn-gold" style={{ padding: '14px 32px', fontSize: 15 }}>Browse Fleet →</Link>
              <Link to="/register" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: 15 }}>Get Started</Link>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, marginTop: 52 }}>
              {[['500+','Premium Cars'],['10K+','Happy Clients'],['50+','Cities']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>{n}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 400, height: 400, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 180
            }}>🏎️</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '80px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 12 }}>Why Choose <span style={{ color: 'var(--accent)' }}>LuxeDrive</span></h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48, fontSize: 16 }}>Premium experience from start to finish</p>
        <div className="grid-4">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <div style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, marginBottom: 16 }}>Ready to Hit the Road?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 36 }}>Sign up now and get access to our full premium fleet</p>
          <Link to="/cars" className="btn btn-gold" style={{ padding: '14px 40px', fontSize: 16 }}>Explore All Cars →</Link>
        </div>
      </section>
    </div>
  );
}