import { Star } from 'lucide-react';

export default function StarRating({ rating, interactive = false, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={16}
          fill={n <= rating ? 'var(--accent)' : 'transparent'}
          color={n <= rating ? 'var(--accent)' : 'var(--text-muted)'}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onChange && onChange(n)} />
      ))}
    </div>
  );
}