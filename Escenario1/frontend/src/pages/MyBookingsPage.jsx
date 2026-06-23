import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';

const MyBookingsPage = ({ onBack }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    try {
      await cancelBooking(id);
      setMessage('✅ Reserva cancelada exitosamente');
      fetchBookings();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || 'Error al cancelar'}`);
    }
  };

  const isFuture = (fecha) => new Date(fecha) > new Date();

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#1a1a2e' }}>📅 Mis Reservas</h2>
        <button
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem', background: '#f0f2f5',
            border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}>
          ← Volver al buscador
        </button>
      </div>

      {message && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem',
          background: message.startsWith('✅') ? '#e8f5e9' : '#ffebee',
          color: message.startsWith('✅') ? '#2e7d32' : '#c62828'
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <p>Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <div style={{
          background: 'white', padding: '3rem', borderRadius: '10px',
          textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>No tienes reservas aún</p>
          <button
            onClick={onBack}
            style={{
              marginTop: '1rem', padding: '0.65rem 1.5rem',
              background: '#e94560', color: 'white',
              border: 'none', borderRadius: '6px', fontWeight: 600
            }}>
            Buscar espacios
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map(b => (
            <div key={b.id} style={{
              background: 'white', padding: '1.5rem', borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${b.status === 'CONFIRMED' ? '#2e7d32' : '#bdbdbd'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: '#1a1a2e', marginBottom: '0.4rem' }}>
                    {b.espacio_nombre}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    📍 {b.piso} · {b.tipo}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    📅 {new Date(b.hora_entrada).toLocaleDateString('es-MX', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    🕐 {new Date(b.hora_entrada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    {' → '}
                    {new Date(b.hora_salida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    👥 {b.asistentes} asistentes
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <span style={{
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                    background: b.status === 'CONFIRMED' ? '#e8f5e9' : '#f5f5f5',
                    color: b.status === 'CONFIRMED' ? '#2e7d32' : '#757575'
                  }}>
                    {b.status === 'CONFIRMED' ? '✅ Confirmada' : '❌ Cancelada'}
                  </span>

                  {b.status === 'CONFIRMED' && isFuture(b.hora_entrada) && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      style={{
                        padding: '0.4rem 1rem', background: '#ffebee',
                        color: '#c62828', border: '1px solid #c62828',
                        borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem'
                      }}>
                      Cancelar reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;