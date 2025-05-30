import React, { useState, useEffect } from "react";
import "../components/styles/UserTable.css";
import { getAllUsers, deleteUserById } from "../services/userService";

const UserTable = ({ onEdit }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

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

  const onDelete = (user) => {
    setUsuarioParaExcluir(user);
    setIsDeleteModalOpen(true);
  };

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

  if (loading) {
    return <div className="loading">Carregando usuários...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-table-wrapper">
      {mensagemSucesso && (
        <div className="mensagem-sucesso">{mensagemSucesso}</div>
      )}
      {error && <div className="error-message">{error}</div>}

      <table className="user-table">
        <thead>
          <tr className="user-table-header">
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Tipo</th>
            <th>Status</th>
            <th className="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} className="user-table-row">
              <td>{user.nome}</td>
              <td>{user.cpf}</td>
              <td>{user.email}</td>
              <td>
                <span className={`tipo-badge ${user.tipoUsuario}`}>
                  {user.tipoUsuario === "admin" ? "Administrador" : "Produtor"}
                </span>
              </td>
              <td>
                <span className={`status-badge ${user.status}`}>
                  <span className="status-dot"></span>
                  {user.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="acoes">
                <div className="acoes-buttons">
                  <button className="btn-outline" onClick={() => onEdit(user)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => onDelete(user)}>
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmação de exclusão */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{usuarioParaExcluir?.nome}</strong>?
            </p>
            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
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

export default UserTable;
