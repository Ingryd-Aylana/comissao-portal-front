import { useAuth } from "../../contexts/AuthContext";

export default function Topbar({ title = "Portal", subtitle = "" }) {
  const { user, userData, logout } = useAuth();

  const userName =
    userData?.nome ||
    userData?.nomeCompleto ||
    userData?.name ||
    "Usuário";

  const userRole = userData?.tipoUsuario || user?.email || "";

  return (
    <header className="app-shell__topbar">
      <div className="app-shell__topbar-left">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>

      <div className="app-shell__topbar-right">
        <div className="app-shell__topbar-user">
          <strong>{userName}</strong>
          <span>{userRole}</span>
        </div>

        <button className="app-shell__logout" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}