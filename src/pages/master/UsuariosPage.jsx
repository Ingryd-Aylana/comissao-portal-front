import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import UserTable from "../../components/UserTable";
import ModalNovoUsuario from "./ModalNovoUsuario";
import "../../components/styles/UsuariosPage.css";

import {
  getAllUsers,
  searchUsers,
  deleteUserById,
} from "../../services/userService";
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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

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
      setCurrentPage(1);
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
      setCurrentPage(1);
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

  const handleDeleteUser = (usuario) => {
    setUsuarioParaExcluir(usuario);
    setIsDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    try {
      await deleteUserById(usuarioParaExcluir.id);
      setUsuarios((prev) =>
        prev.filter((u) => u.id !== usuarioParaExcluir.id)
      );
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

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(usuarios.length / itemsPerPage));
  }, [usuarios.length]);

  const currentUsuarios = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return usuarios.slice(indexOfFirstItem, indexOfLastItem);
  }, [usuarios, currentPage]);

  if (authLoading || loading) {
    return (
      <section className="users-page">
        <div className="users-page__feedback">
          <p>Carregando usuários...</p>
        </div>
      </section>
    );
  }

  if (authError) {
    return (
      <section className="users-page">
        <div className="users-page__feedback users-page__feedback--error">
          <p>{authError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="users-page">
      <header className="users-page__header">
        

        <button className="users-page__primary-button" onClick={handleAddUser}>
          <Plus size={18} />
          Novo usuário
        </button>
      </header>

      <section className="users-page__toolbar">
        <div className="users-page__search">
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou e-mail..."
            className="users-page__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            className="users-page__secondary-button"
            onClick={handleSearch}
            disabled={searching}
          >
            <Search size={18} />
            {searching ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </section>

      {mensagemSucesso && (
        <div className="users-page__alert users-page__alert--success">
          {mensagemSucesso}
        </div>
      )}

      {error && (
        <div className="users-page__alert users-page__alert--error">
          {error}
        </div>
      )}

      <section className="users-page__panel">
        {usuarios.length === 0 ? (
          <p className="users-page__empty">Nenhum usuário encontrado.</p>
        ) : (
          <>
            <div className="users-page__table-wrapper">
              <UserTable
                usuarios={currentUsuarios}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            </div>

            <div className="users-page__pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>

              <span>
                Página {currentPage} de {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </section>

      <ModalNovoUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        usuarioParaEditar={editData}
        onSave={handleSaveUser}
      />

      {isDeleteModalOpen && (
        <div className="users-page__modal-backdrop">
          <div className="users-page__delete-modal">
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{usuarioParaExcluir?.nome}</strong>?
            </p>

            <div className="users-page__delete-actions">
              <button
                type="button"
                className="users-page__ghost-button"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="users-page__danger-button"
                onClick={confirmarExclusao}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsuariosPage;