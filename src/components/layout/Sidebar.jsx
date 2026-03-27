import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { MENU_CONFIG } from "../../constants/menuConfig";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../constants/roles";
import "../styles/Sidebar.css";

export default function Sidebar({ onLogout }) {
  const { role, user, userData, isAdmin, isProducer } = useAuth();

  const normalizedRole = isAdmin
    ? ROLES.ADMIN
    : isProducer
    ? ROLES.PRODUTOR
    : role;

  const menuItems = MENU_CONFIG[normalizedRole] || [];

  const userName =
    userData?.nome ||
    userData?.nomeCompleto ||
    userData?.name ||
    "Usuário";

  const userEmail = userData?.email || user?.email || "";
  const userRoleLabel = normalizedRole || "Usuário";

  return (
    <aside className="app-shell__sidebar">
      <div className="app-shell__logo">
        <img
          src="/images/logo2.png"
          alt="Logo FedCorp"
          className="app-shell__logo-img"
        />
      </div>

      <div className="app-shell__brand">
        <h2 className="app-title">Portal do Produtor</h2>
        <p>Comissões e relatórios</p>
      </div>

      <nav className="app-shell__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "app-shell__nav-link active"
                : "app-shell__nav-link"
            }
          >
            {item.icon && (
              <span className="app-shell__nav-icon">{item.icon}</span>
            )}

            <span className="app-shell__nav-label">{item.label}</span>

            {item.badge && (
              <span className="app-shell__nav-badge">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="app-shell__footer">
        <button
          type="button"
          className="app-shell__logout-btn"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}