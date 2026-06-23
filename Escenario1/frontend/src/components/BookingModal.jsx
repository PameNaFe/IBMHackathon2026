import { useState } from 'react';
import { createBooking } from '../services/api';

const BookingModal = ({ space, onClose, onSuccess, onGoToBookings }) => {
   const [form, setForm] = useState({
    hora_entrada: initialHoraEntrada || '',
    hora_salida: initialHoraSalida || '',
    asistentes: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createBooking({
        espacio_id: space.id,
        hora_entrada: new Date(form.hora_entrada).toISOString(),
        hora_salida: new Date(form.hora_salida).toISOString(),
        asistentes: parseInt(form.asistentes)
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', padding: '2rem',
        width: '100%', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>¡Reserva Confirmada!</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Tu espacio en <strong>{space.nombre}</strong> ha sido reservado exitosamente.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={onSuccess} style={{
                flex: 1, padding: '0.75rem', background: '#f0f2f5',
                border: 'none', borderRadius: '6px', fontWeight: 600
              }}>
                Seguir buscando
              </button>
              <button onClick={onGoToBookings} style={{
                flex: 1, padding: '0.75rem', background: '#1a1a2e',
                color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600
              }}>
                Ver mis reservas
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 style={{ marginBottom: '0.5rem', color: '#1a1a2e' }}>
              Reservar: {space.nombre}
            </h3>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              📍 {space.piso} · 👥 Capacidad: {space.capacidad}
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Hora de entrada
                </label>
                <input type="datetime-local" required value={form.hora_entrada}
                  onChange={e => setForm({ ...form, hora_entrada: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Hora de salida
                </label>
                <input type="datetime-local" required value={form.hora_salida}
                  onChange={e => setForm({ ...form, hora_salida: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Número de asistentes
                </label>
                <input type="number" min="1" max={space.capacidad} required value={form.asistentes}
                  onChange={e => setForm({ ...form, asistentes: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
              </div>

              {error && (
                <p style={{
                  color: '#e94560', background: '#fff0f0', padding: '0.75rem',
                  borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem'
                }}>
                  {error}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={onClose} style={{
                  flex: 1, padding: '0.75rem', background: '#f0f2f5',
                  border: 'none', borderRadius: '6px', fontWeight: 600
                }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading} style={{
                  flex: 1, padding: '0.75rem', background: '#e94560',
                  color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600
                }}>
                  {loading ? 'Reservando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;