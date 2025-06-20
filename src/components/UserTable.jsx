import React, { useState, useEffect } from "react";
import "../components/styles/UserTable.css";
import { getAllUsers, deleteUserById } from "../services/userService";

const UserTable = ({ onEdit }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [modalState, setModalState] = useState({ open: false, usuario: null });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsuarios(data);
      setFeedback({ type: "", message: "" });
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setFeedback({
        type: "error",
        message: "Erro ao carregar usuários. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (usuario) => {
    setModalState({ open: true, usuario });
  };

  const confirmDelete = async () => {
    const { usuario } = modalState;
    try {
      await deleteUserById(usuario.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
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

      {/* Loader */}
      {isLoading ? (
        <div className="loading">Carregando usuários...</div>
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
              <strong>{modalState.usuario?.nome}</strong>?
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
