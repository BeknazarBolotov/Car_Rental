import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import CarCard from '../components/CarCard';
import FilterBar from '../components/FilterBar';
import toast from 'react-hot-toast';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/cars?${params}`);
      setCars(data);
    } catch { toast.error('Failed to load cars'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700 }}>Browse Fleet</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>
          {loading ? 'Loading...' : `${cars.length} cars available`}
        </p>
      </div>
      <FilterBar filters={filters} onChange={setFilters} />
      {loading ? (
        <div className="spinner" />
      ) : cars.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48 }}>🚗</div>
          <h3 style={{ marginTop: 16, marginBottom: 8 }}>No cars found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {cars.map(car => <CarCard key={car._id} car={car} />)}
        </div>
      )}
    </div>
  );
}