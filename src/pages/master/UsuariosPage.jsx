import React, { useState, useEffect } from "react";
import UserTable from "../../components/UserTable";
import ModalNovoUsuario from "./ModalNovoUsuario";
import "../../components/styles/UsuariosPage.css";
import { Plus, Search } from "lucide-react";
import { getAllUsers, searchUsers } from "../../services/userService";
import { useAdminProtection } from "../../hooks/useAdminProtection";

const UsuariosPage = () => {
  const { loading: authLoading, error: authError } = useAdminProtection();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!authLoading && !authError) {
      loadUsers();
    }
  }, [authLoading, authError]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Erro ao carregar usuários. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setSearching(true);
      const results = await searchUsers(searchTerm);
      setUsuarios(results);
      setError(null);
    } catch (err) {
      console.error("Erro na busca:", err);
      setError("Erro ao buscar usuários. Por favor, tente novamente.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddUser = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEditUser = (usuario) => {
    setEditData(usuario);
    setShowModal(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      await loadUsers(); // Recarrega a lista após salvar
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      setError("Erro ao salvar usuário. Por favor, tente novamente.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="error-container">
        <p>{authError}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="usuarios-page-container">
        <div className="logo-perfil">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="logo-img perfil-logo"
          />
        </div>

        <div className="usuarios-header">
          <h1 className="usuarios-title">Usuários Cadastrados</h1>
          <button className="usuarios-button" onClick={handleAddUser}>
            <Plus className="icon" />
            Novo Usuário
          </button>
        </div>

        <div className="usuarios-search-bar">
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou e-mail..."
            className="usuarios-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="usuarios-search-button"
            onClick={handleSearch}
            disabled={searching}
          >
            <Search className="icon" />
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <UserTable
          usuarios={usuarios}
          onEdit={handleEditUser}
          onDelete={loadUsers}
        />
      </div>

      <ModalNovoUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        usuarioParaEditar={editData}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UsuariosPage;
