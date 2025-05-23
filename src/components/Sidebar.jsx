import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars, FaChartPie, FaFileAlt, FaUser,
} from 'react-icons/fa';
import "./styles/Sidebar.css";
import { LogOut } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleMenuClick = () => setIsOpen(false);

//  Função de logout 
  const handleLogout = () => {
    // Limpa dados de sessão/localStorage se necessário
    localStorage.removeItem("token"); 
    sessionStorage.clear();

    // Redireciona para login
    navigate('/');
  };

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button className="hamburger" onClick={toggleSidebar} aria-label="Abrir menu lateral">
        <FaBars size={22} />
      </button>

      <aside ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo">
          <img src="/images/logo2.png" alt="Fedcorp Logo" className="logo-img" />
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={handleMenuClick}>
                <FaChartPie className="icon" /> DASHBOARD
              </Link>
            </li>
            <li className={location.pathname === '/relatorios' ? 'active' : ''}>
              <Link to="/relatorios" onClick={handleMenuClick}>
                <FaFileAlt className="icon" /> RELATÓRIOS
              </Link>
            </li>
            <li className={location.pathname === '/perfil' ? 'active' : ''}>
              <Link to="/perfil" onClick={handleMenuClick}>
                <FaUser className="icon" /> PERFIL
              </Link>
            </li>
            <li className={location.pathname === '/master/DashboardMaster' ? 'active' : ''}>
              <Link to="/master/dashboard" onClick={handleMenuClick}>
                <FaChartPie className="icon" /> DASHBOARD MASTER
              </Link>
            </li>
            <li className={location.pathname === '/master/UsuariosPage' ? 'active' : ''}>
              <Link to="/master/usuariosPage" onClick={handleMenuClick}>
                PÁGINA DE USUÁRIOS
              </Link>
            </li>
            <li className={location.pathname === '/master/UsuariosPage' ? 'active' : ''}>
              <Link to="/master/uploadCard" onClick={handleMenuClick}>
                IMPORTAÇÃO DE PLANILHA
              </Link>
            </li>
          </ul>

          {/* Botão de logout */}
          <div className="logout-section">
            <button onClick={handleLogout} className='logout-btn'>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
