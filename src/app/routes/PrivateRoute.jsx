import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem' }}>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}