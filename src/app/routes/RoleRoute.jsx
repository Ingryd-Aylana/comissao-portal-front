import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export default function RoleRoute({ children, allowedRoles = [] }) {
  const { role, isAdmin, isProducer, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem' }}>Carregando...</div>;
  }

  const normalizedRole = isAdmin
    ? ROLES.ADMIN
    : isProducer
    ? ROLES.PRODUTOR
    : role;

  if (!allowedRoles.includes(normalizedRole)) {
    const fallbackRoute =
      normalizedRole === ROLES.ADMIN
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.APP_DASHBOARD;

    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
}