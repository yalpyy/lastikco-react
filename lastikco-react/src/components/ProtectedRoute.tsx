import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { session, loading } = useAuthStore();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Oturum bilgisi yükleniyor...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/giris" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
