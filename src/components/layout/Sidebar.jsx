import { NavLink } from "react-router-dom";
import { MENU_CONFIG } from "../../constants/menuConfig";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../constants/roles";

export default function Sidebar() {
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
        <h2>Portal do Produtor</h2>
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
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}