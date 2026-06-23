import { useState, useEffect } from 'react';
import { getSpaces, getAvailableSpaces } from '../services/api';
import BookingModal from '../components/BookingModal';

const SearchPage = ({ onGoToBookings }) => {
  const [spaces, setSpaces] = useState([]);
  const [filters, setFilters] = useState({
    tipo: '', capacidad: '', hora_entrada: '', hora_salida: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [busquedaPorHorario, setBusquedaPorHorario] = useState(false);

  const fetchSpaces = async (currentFilters) => {
    const f = currentFilters || filters;
    setLoading(true);
    try {
      let res;
      if (f.hora_entrada && f.hora_salida) {
        setBusquedaPorHorario(true);
        res = await getAvailableSpaces({
          hora_entrada: new Date(f.hora_entrada).toISOString(),
          hora_salida: new Date(f.hora_salida).toISOString(),
          tipo: f.tipo || undefined,
          capacidad: f.capacidad || undefined
        });
      } else {
        setBusquedaPorHorario(false);
        const params = {};
        if (f.tipo) params.tipo = f.tipo;
        if (f.capacidad) params.capacidad = f.capacidad;
        res = await getSpaces(params);
      }
      setSpaces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = async () => {
    const resetFilters = { tipo: '', capacidad: '', hora_entrada: '', hora_salida: '' };
    setFilters(resetFilters);
    setBusquedaPorHorario(false);
    await fetchSpaces(resetFilters);
  };

  useEffect(() => { fetchSpaces(); }, []);

  const hayFiltrosActivos = filters.hora_entrada || filters.hora_salida || filters.tipo || filters.capacidad;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Buscar Espacios</h2>

      {/* Filtros */}
      <div style={{
        background: 'white', padding: '1.5rem', borderRadius: '10px',
        marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
            Fecha y hora de entrada
          </label>
          <input
            type="datetime-local"
            value={filters.hora_entrada}
            onChange={e => setFilters({ ...filters, hora_entrada: e.target.value })}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
            Fecha y hora de salida
          </label>
          <input
            type="datetime-local"
            value={filters.hora_salida}
            onChange={e => setFilters({ ...filters, hora_salida: e.target.value })}
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
            Tipo
          </label>
          <select
            value={filters.tipo}
            onChange={e => setFilters({ ...filters, tipo: e.target.value })}
            style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #ddd' }}>
            <option value="">Todos</option>
            <option value="SALA">Sala</option>
            <option value="DESK">Escritorio</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
            Capacidad mínima
          </label>
          <input
            type="number" min="1"
            value={filters.capacidad}
            onChange={e => setFilters({ ...filters, capacidad: e.target.value })}
            placeholder="Ej: 6"
            style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd', width: '100px' }}
          />
        </div>

        <button
          onClick={() => fetchSpaces()}
          style={{
            padding: '0.65rem 1.5rem', background: '#1a1a2e',
            color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600
          }}>
          🔍 Buscar
        </button>

        {hayFiltrosActivos && (
          <button
            onClick={handleLimpiar}
            style={{
              padding: '0.65rem 1rem', background: '#f0f2f5',
              border: 'none', borderRadius: '6px', fontWeight: 600
            }}>
            ✕ Limpiar
          </button>
        )}
      </div>

      {busquedaPorHorario && filters.hora_entrada && filters.hora_salida && (
        <div style={{
          background: '#e3f2fd', padding: '0.75rem 1rem',
          borderRadius: '6px', marginBottom: '1.5rem',
          color: '#1565c0', fontSize: '0.9rem'
        }}>
          📅 Mostrando espacios disponibles del{' '}
          <strong>{new Date(filters.hora_entrada).toLocaleString('es-MX')}</strong>
          {' al '}
          <strong>{new Date(filters.hora_salida).toLocaleString('es-MX')}</strong>
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <p>Cargando espacios...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {spaces.length === 0 ? (
            <p style={{ color: '#666' }}>No se encontraron espacios disponibles.</p>
          ) : spaces.map(space => (
            <div key={space.id} style={{
              background: 'white', borderRadius: '10px',
              padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ color: '#1a1a2e' }}>{space.nombre}</h3>
                <span style={{
                  background: space.tipo === 'SALA' ? '#e3f2fd' : '#f3e5f5',
                  color: space.tipo === 'SALA' ? '#1565c0' : '#6a1b9a',
                  padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem'
                }}>
                  {space.tipo}
                </span>
              </div>

              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                📍 {space.piso}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                👥 Capacidad: {space.capacidad} personas
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {space.con_proyector && <span style={tagStyle}>📽 Proyector</span>}
                {space.con_aire && <span style={tagStyle}>❄️ Aire</span>}
                {space.con_pizarron && <span style={tagStyle}>📋 Pizarrón</span>}
                {space.con_tv && <span style={tagStyle}>📺 TV</span>}
              </div>

              <button
                onClick={() => setSelectedSpace(space)}
                style={{
                  width: '100%', padding: '0.65rem',
                  background: '#e94560', color: 'white',
                  border: 'none', borderRadius: '6px', fontWeight: 600
                }}>
                Reservar
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedSpace && (
        <BookingModal
          space={selectedSpace}
          initialHoraEntrada={filters.hora_entrada}
          initialHoraSalida={filters.hora_salida}
          onClose={() => setSelectedSpace(null)}
          onSuccess={() => {
            setSelectedSpace(null);
            fetchSpaces();
          }}
          onGoToBookings={onGoToBookings}
        />
      )}
    </div>
  );
};

const tagStyle = {
  background: '#f0f2f5', padding: '0.2rem 0.6rem',
  borderRadius: '20px', fontSize: '0.8rem', color: '#555'
};

export default SearchPage;