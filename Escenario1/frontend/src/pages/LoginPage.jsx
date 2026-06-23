import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

const LoginPage = () => {
  const { saveLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, contrasena);
      saveLogin(res.data.token, res.data.user);
    } catch (err) {
      setError('Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
    }}>
      <div style={{
        background: 'white', padding: '2.5rem',
        borderRadius: '12px', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#1a1a2e', marginBottom: '0.5rem' }}>
          🏢 OfficeSpace
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
          Gestión de espacios de trabajo
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%', padding: '0.75rem',
                border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '0.75rem',
                border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>

          {error && (
            <p style={{
              color: '#e94560', background: '#fff0f0',
              padding: '0.75rem', borderRadius: '6px',
              marginBottom: '1rem', fontSize: '0.9rem'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: '#e94560', color: 'white',
              border: 'none', borderRadius: '6px',
              fontSize: '1rem', fontWeight: 600
            }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem' }}>
            <strong>Admin:</strong> admin@corporativoalpha.com / Admin123
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            <strong>Colaborador:</strong> carlos.mendez@corporativoalpha.com / User123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;