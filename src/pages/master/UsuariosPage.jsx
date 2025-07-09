import React, { useState, useEffect } from "react";
import UserTable from "../../components/UserTable";
import ModalNovoUsuario from "./ModalNovoUsuario";
import "../../components/styles/UsuariosPage.css";
import { Plus, Search } from "lucide-react";
import { getAllUsers, searchUsers, deleteUserById } from "../../services/userService";
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
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  useEffect(() => {
    if (!authLoading && !authError) {
      loadUsers();
    }
  }, [authLoading, authError]);

  // Carrega todos os usuários
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

  // Busca usuários por nome, CPF ou e-mail
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

  // Abre modal para cadastro
  const handleAddUser = () => {
    setEditData(null);
    setShowModal(true);
  };

  // Abre modal para edição
  const handleEditUser = (usuario) => {
    setEditData(usuario);
    setShowModal(true);
  };

  // Salva novo usuário ou edição
  const handleSaveUser = (usuarioSalvo) => {
    if (editData) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioSalvo.id ? usuarioSalvo : u))
      );
      setMensagemSucesso("Usuário editado com sucesso!");
    } else {
      setUsuarios((prev) => [...prev, usuarioSalvo]);
      setMensagemSucesso("Usuário criado com sucesso!");
    }
    setTimeout(() => setMensagemSucesso(""), 3000);
    setShowModal(false);
  };

  // Prepara exclusão de usuário
  const handleDeleteUser = (usuario) => {
    setUsuarioParaExcluir(usuario);
    setIsDeleteModalOpen(true);
  };

  // Confirma e executa exclusão
  const confirmarExclusao = async () => {
    try {
      await deleteUserById(usuarioParaExcluir.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioParaExcluir.id));
      setMensagemSucesso("Usuário excluído com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3000);
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setError("Erro ao excluir usuário. Por favor, tente novamente.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setUsuarioParaExcluir(null);
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

        {mensagemSucesso && <div className="mensagem-sucesso">{mensagemSucesso}</div>}
        {error && <div className="error-message">{error}</div>}

        {usuarios.length === 0 ? (
          <div className="error-message">Nenhum usuário encontrado.</div>
        ) : (
          <UserTable
            usuarios={usuarios}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      <ModalNovoUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        usuarioParaEditar={editData}
        onSave={handleSaveUser}
      />

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{usuarioParaExcluir?.nome}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
