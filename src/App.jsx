import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login/Login";
import AdminRoute from "./routes/AdminRoute";

// Páginas usuário comum
import Dashboard from "./pages/produtor/Dashboard";
import RelatoriosPage from "./pages/produtor/RelatoriosPage";
import PerfilPage from "./pages/produtor/PerfilPage";

import MilhagemDetalhes from "./pages/MilhagemDetalhes";

// Páginas usuário master
import DashboardMaster from "./pages/master/DashboardMaster";
import RelatoriosProdutoresPage from "./pages/master/RelatoriosProdutoresPage";
import MinhasComissoes from "./pages/MinhasComissoes";
import UsuariosPage from "./pages/master/UsuariosPage";
import UploadCard from "./pages/master/UploadCard";
// import PerfilMasterPage from './pages/master/PerfilPage';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? (
    <>
      <Sidebar />
      <main className="container">{children}</main>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/milhagem/:id"
        element={
          <PrivateRoute>
            <MilhagemDetalhes />
          </PrivateRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <PrivateRoute>
            <RelatoriosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <PerfilPage />
          </PrivateRoute>
        }
      />

      {/* Rotas usuário master */}
      <Route
        path="/master/dashboard"
        element={
          <AdminRoute>
            <DashboardMaster />
          </AdminRoute>
        }
      />
      <Route
        path="/master/relatoriosProdutoresPage"
        element={
          <AdminRoute>
            <RelatoriosProdutoresPage />
          </AdminRoute>
        }
      />
      <Route
        path="/master/usuariosPage"
        element={
          <AdminRoute>
            <UsuariosPage />
          </AdminRoute>
        }
      />

      <Route
        path="/master/milhagens"
        element={
          <AdminRoute>
            <MinhasComissoes />
          </AdminRoute>
        }
      />

      <Route
        path="/master/uploadCard"
        element={
          <AdminRoute>
            <UploadCard />
          </AdminRoute>
        }
      />

      {/* <Route path="/master/perfil" element={<PerfilMasterPage />} /> */}
    </Routes>
  );
}

export default App;
