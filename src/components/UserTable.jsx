import React, { useState } from "react";
import "../components/styles/UserTable.css";
import { deleteUserById } from "../services/userService";

const UserTable = ({ usuarios = [], onEdit, onDelete }) => {
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [modalState, setModalState] = useState({ open: false, usuario: null });

  const handleDelete = (usuario) => {
    setModalState({ open: true, usuario });
  };

  const confirmDelete = async () => {
    const { usuario } = modalState;
    try {
      await deleteUserById(usuario.id);
      onDelete(usuario.id);
      setFeedback({ type: "success", message: "Usuário excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setFeedback({
        type: "error",
        message: "Erro ao excluir o usuário. Tente novamente.",
      });
    } finally {
      setModalState({ open: false, usuario: null });
      setTimeout(() => setFeedback({ type: "", message: "" }), 3000);
    }
  };

  const closeModal = () => {
    setModalState({ open: false, usuario: null });
  };

  return (
    <div className="user-table-wrapper">
      {/* Feedback */}
      {feedback.message && (
        <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
      )}

      {/* Tabela */}
      {usuarios.length === 0 ? (
        <div className="loading">Nenhum usuário encontrado.</div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
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
              <tr key={user.id}>
                <td>{user.nome || "—"}</td>
                <td>{user.cpf || "—"}</td>
                <td>{user.email || "—"}</td>
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
                  <button className="btn-outline" onClick={() => onEdit(user)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(user)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmação */}
      {modalState.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Deseja realmente excluir{" "}
              <strong>{modalState.usuario?.nome || "este usuário"}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
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
