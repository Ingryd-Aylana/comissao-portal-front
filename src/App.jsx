import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./config/firebase";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login/Login";

// Páginas usuário comum
import Dashboard from "./pages/produtor/Dashboard";
import RelatoriosPage from "./pages/produtor/RelatoriosPage";
import PerfilPage from "./pages/produtor/PerfilPage";
import MilhagemDetalhes from "./pages/MilhagemDetalhes";

// Páginas master
import DashboardMaster from "./pages/master/DashboardMaster";
import RelatoriosProdutoresPage from "./pages/master/RelatoriosProdutoresPage";
import MinhasComissoes from "./pages/MinhasComissoes";
import UsuariosPage from "./pages/master/UsuariosPage";
import UploadCard from "./pages/master/UploadCard";
// import PerfilMasterPage from "./pages/master/PerfilPage";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setTipoUsuario(data.tipoUsuario);
        }
      } catch (error) {
        console.error("Erro ao buscar tipo de usuário:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(tipoUsuario)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <main className="container">{children}</main>
    </>
  );
};

function App() {
  return (
    <div className="app-wrapper">
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas para usuários do tipo "produtor" */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={["produtor"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <PrivateRoute allowedRoles={["produtor"]}>
            <RelatoriosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute allowedRoles={["produtor"]}>
            <PerfilPage />
          </PrivateRoute>
        }
      />

      {/* Rotas para usuários do tipo "admin" */}
      <Route
        path="/master/DashboardMaster"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardMaster />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/relatoriosProdutoresPage"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <RelatoriosProdutoresPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/usuariosPage"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <UsuariosPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/milhagens"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <MinhasComissoes />
          </PrivateRoute>
        }
      />

      <Route
        path="/milhagem/:id"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <MilhagemDetalhes />
          </PrivateRoute>
        }
      />
      <Route
        path="/master/uploadCard"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <UploadCard />
          </PrivateRoute>
        }
      />
    
    </Routes>
    </div>
  );
}

export default App;
