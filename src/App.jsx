import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// Páginas usuário comum
import Dashboard from './pages/produtor/Dashboard';
import RelatoriosPage from './pages/produtor/RelatoriosPage';
import PerfilPage from './pages/produtor/PerfilPage';

// Páginas usuário master
import DashboardMaster from './pages/master/DashboardMaster';
import RelatoriosProdutoresPage from './pages/master/RelatoriosProdutoresPage';
import UsuariosPage from './pages/master/UsuariosPage';
import UploadCard from './pages/master/UploadCard';
// import PerfilMasterPage from './pages/master/PerfilPage'; 

function App() {
  return (
    <>
      <Sidebar />
      <main className="container">
        <Routes>
          {/* Rotas usuário comum */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />

          {/* Rotas usuário master */}
          <Route path="/master/dashboard" element={<DashboardMaster />} />
          <Route path="/master/relatoriosProdutoresPage" element={<RelatoriosProdutoresPage />} />
          <Route path="/master/usuariosPage" element={<UsuariosPage />} />
          <Route path="/master/uploadCard" element={<UploadCard />} />
          {/* <Route path="/master/perfil" element={<PerfilMasterPage />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
