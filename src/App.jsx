import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login/Login";

// Páginas usuário comum
import Dashboard from "./pages/produtor/Dashboard";
import RelatoriosPage from "./pages/produtor/RelatoriosPage";
import PerfilPage from "./pages/produtor/PerfilPage";
import MinhasComissoes from "./pages/MinhasComissoes";
import MilhagemDetalhes from "./pages/MilhagemDetalhes";

// Páginas usuário master
import DashboardMaster from "./pages/master/DashboardMaster";
import RelatoriosProdutoresPage from "./pages/master/RelatoriosProdutoresPage";
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
        path="/milhagens"
        element={
          <PrivateRoute>
            <MinhasComissoes />
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
          <PrivateRoute>
            <DashboardMaster />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/relatoriosProdutoresPage"
        element={
          <PrivateRoute>
            <RelatoriosProdutoresPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/usuariosPage"
        element={
          <PrivateRoute>
            <UsuariosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/uploadCard"
        element={
          <PrivateRoute>
            <UploadCard />
          </PrivateRoute>
        }
      />
      {/* <Route path="/master/perfil" element={<PerfilMasterPage />} /> */}
    </Routes>
  );
}

export default App;
