import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';
import MyBookingsPage from './pages/MyBookingsPage';

const AppContent = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('search');

  if (!user) return <LoginPage />;

  return (
    <div>
      <nav style={{
        background: '#1a1a2e', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', color: 'white'
      }}>
        <h2 style={{ margin: 0 }}>🏢 OfficeSpace</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('search')} style={{
            background: currentPage === 'search' ? '#e94560' : 'transparent',
            color: 'white', border: '1px solid white',
            padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer'
          }}>
            Buscar Espacios
          </button>

          <button onClick={() => setCurrentPage('mybookings')} style={{
            background: currentPage === 'mybookings' ? '#e94560' : 'transparent',
            color: 'white', border: '1px solid white',
            padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer'
          }}>
            Mis Reservas
          </button>

          {user.perfil === 'ADMINISTRADOR' && (
            <button onClick={() => setCurrentPage('admin')} style={{
              background: currentPage === 'admin' ? '#e94560' : 'transparent',
              color: 'white', border: '1px solid white',
              padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer'
            }}>
              Panel Admin
            </button>
          )}

          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {user.nombre} ({user.perfil})
          </span>

          <button onClick={logout} style={{
            background: 'transparent', color: '#e94560',
            border: '1px solid #e94560', padding: '0.4rem 1rem',
            borderRadius: '4px', cursor: 'pointer', fontWeight: 600
          }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      {currentPage === 'search' && <SearchPage onGoToBookings={() => setCurrentPage('mybookings')} />}
      {currentPage === 'mybookings' && <MyBookingsPage onBack={() => setCurrentPage('search')} />}
      {currentPage === 'admin' && <AdminPage />}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;