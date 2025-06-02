import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChartPie,
  FaFileAlt,
  FaUser,
  FaMoneyBillWave,
} from "react-icons/fa";
import "./styles/Sidebar.css";
import { LogOut } from "lucide-react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { getCurrentUserFirestoreData } from "../services/comissaoService";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getCurrentUserFirestoreData();
        setUserData(data);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        // Se houver erro ao carregar dados do usuário, fazer logout
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleMenuClick = () => setIsOpen(false);

  // Função de logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        localStorage.removeItem("token");
        sessionStorage.clear();
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Função para capitalizar nome do usuário
  const capitalizeName = (name) => {
    return name?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <button
        className="hamburger"
        onClick={toggleSidebar}
        aria-label="Abrir menu lateral"
      >
        <FaBars size={22} />
      </button>

      <aside ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">
          <img
            src="/images/logo2.png"
            alt="Fedcorp Logo"
            className="logo-img"
          />
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li className={location.pathname === "/dashboard" ? "active" : ""}>
              <Link to="/dashboard" onClick={handleMenuClick}>
                <FaChartPie className="icon" /> DASHBOARD
              </Link>
            </li>
            {/* <li className={location.pathname === "/milhagens" ? "active" : ""}>
              <Link to="/milhagens" onClick={handleMenuClick}>
                <FaMoneyBillWave className="icon" /> MINHAS COMISSÕES
              </Link>
            </li> */}
            <li className={location.pathname === "/relatorios" ? "active" : ""}>
              <Link to="/relatorios" onClick={handleMenuClick}>
                <FaFileAlt className="icon" /> RELATÓRIOS
              </Link>
            </li>
            <li className={location.pathname === "/perfil" ? "active" : ""}>
              <Link to="/perfil" onClick={handleMenuClick}>
                <FaUser className="icon" /> PERFIL
              </Link>
            </li>

            {/* Mostrar links de admin apenas se o usuário tiver permissão */}
            {userData?.tipoUsuario === "admin" && (
              <>
                <li
                  className={
                    location.pathname === "/master/dashboard" ? "active" : ""
                  }
                >
                  <Link to="/master/dashboard" onClick={handleMenuClick}>
                    <FaChartPie className="icon" /> DASHBOARD MASTER
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/master/usuariosPage" ? "active" : ""
                  }
                >
                  <Link to="/master/usuariosPage" onClick={handleMenuClick}>
                    PÁGINA DE USUÁRIOS
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/master/uploadCard" ? "active" : ""
                  }
                >
                  <Link to="/master/uploadCard" onClick={handleMenuClick}>
                    IMPORTAÇÃO DE PLANILHA
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Seção do usuário */}
          <div className="logout-section" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ textAlign: 'center' }}>
              {loading
                ? "Carregando..."
                : capitalizeName(userData?.nome || "Usuário")}
            </p>

            <button onClick={handleLogout} className="logout-btn">
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
