import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';
import { useAuth } from '../../contexts/AuthContext';

import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/produtor/Dashboard';
import RelatoriosPage from '../../pages/produtor/RelatoriosPage';
import PerfilPage from '../../pages/produtor/PerfilPage';
import MinhasComissoes from '../../pages/master/MinhasComissoes';
import MilhagemDetalhes from '../../pages/master/MilhagemDetalhes';

import DashboardMaster from '../../pages/master/DashboardMaster';
import RelatoriosProdutoresPage from '../../pages/master/RelatoriosProdutoresPage';
import UsuariosPage from '../../pages/master/UsuariosPage';
import UploadCard from '../../pages/master/UploadCard';

import ProducerLayout from '../layouts/ProducerLayout';
import AdminLayout from '../layouts/AdminLayout';

function RootRedirect() {
  const { isAdmin, isProducer, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem' }}>Carregando...</div>;
  }

  if (isAdmin) {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }

  if (isProducer) {
    return <Navigate to={ROUTES.APP_DASHBOARD} replace />;
  }

  return <Navigate to={ROUTES.LOGIN} replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <RootRedirect />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.APP_DASHBOARD}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.PRODUTOR]}>
                <ProducerLayout title="Dashboard" subtitle="Visão geral do produtor">
                  <Dashboard />
                </ProducerLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.APP_RELATORIOS}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.PRODUTOR]}>
                <ProducerLayout title="Relatórios" subtitle="Seus relatórios">
                  <RelatoriosPage />
                </ProducerLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.APP_COMISSOES}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.PRODUTOR]}>
                <ProducerLayout title="Comissões" subtitle="Suas comissões">
                  <MinhasComissoes />
                </ProducerLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={`${ROUTES.APP_COMISSOES}/:id`}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.PRODUTOR]}>
                <ProducerLayout title="Detalhes da Comissão" subtitle="Informações da comissão">
                  <MilhagemDetalhes />
                </ProducerLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.APP_PERFIL}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.PRODUTOR]}>
                <ProducerLayout title="Perfil" subtitle="Seus dados cadastrais">
                  <PerfilPage />
                </ProducerLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout title="Dashboard Admin" subtitle="Visão geral administrativa">
                  <DashboardMaster />
                </AdminLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_RELATORIOS}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout title="Relatórios" subtitle="Relatórios dos produtores">
                  <RelatoriosProdutoresPage />
                </AdminLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_USUARIOS}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout title="Usuários" subtitle="Gestão de usuários">
                  <UsuariosPage />
                </AdminLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_UPLOAD}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout title="Upload" subtitle="Importação de arquivos">
                  <UploadCard />
                </AdminLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_COMISSOES}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout title="Comissões" subtitle="Cadastro e histórico de comissões">
                  <MinhasComissoes />
                </AdminLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path={`${ROUTES.ADMIN_COMISSOES}/:id`}
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout title="Detalhes da Comissão" subtitle="Informações da comissão">
                  <MilhagemDetalhes />
                </AdminLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}