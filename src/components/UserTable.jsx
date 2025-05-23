import React, { useState } from "react";
import "../components/styles/UserTable.css";

const mockUsers = [
  { id: 1, nome: "Michel Policeno", cpf: "123.456.789-00", email: "michel@email.com", status: "Ativo" },
  { id: 2, nome: "Ingryd Aylana", cpf: "987.654.321-00", email: "ingryd@email.com", status: "Ativo" },
  { id: 3, nome: "João Silva", cpf: "000.123.456-00", email: "joão@email.com", status: "Inativo" },
];

const UserTable = () => {
  const [usuarios, setUsuarios] = useState(mockUsers);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  const onEdit = (user) => {
    setUsuarioSelecionado(user);
    setIsEditModalOpen(true);
  };

  const onDelete = (user) => {
    setUsuarioParaExcluir(user);
    setIsDeleteModalOpen(true);
  };

  const confirmarExclusao = () => {
    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioParaExcluir.id));
    setIsDeleteModalOpen(false);
    setMensagemSucesso("Usuário excluído com sucesso!");
    setUsuarioParaExcluir(null);

    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  const handleSalvarEdicao = () => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((user) =>
        user.id === usuarioSelecionado.id ? usuarioSelecionado : user
      )
    );
    setIsEditModalOpen(false);
    setUsuarioSelecionado(null);
    setMensagemSucesso("Usuário salvo com sucesso!");
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr className="user-table-header">
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
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
                <span className={`status-badge ${user.status.toLowerCase()}`}>
                  <span className="status-dot"></span>
                  {user.status}
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

      {/* Modal de edição */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Usuário</h2>

            <label>Nome</label>
            <input
              type="text"
              value={usuarioSelecionado?.nome || ""}
              onChange={(e) =>
                setUsuarioSelecionado({ ...usuarioSelecionado, nome: e.target.value })
              }
            />

            <label>CPF</label>
            <input
              type="text"
              value={usuarioSelecionado?.cpf || ""}
              onChange={(e) =>
                setUsuarioSelecionado({ ...usuarioSelecionado, cpf: e.target.value })
              }
            />

            <label>E-mail</label>
            <input
              type="email"
              value={usuarioSelecionado?.email || ""}
              onChange={(e) =>
                setUsuarioSelecionado({ ...usuarioSelecionado, email: e.target.value })
              }
            />

            <label>Status</label>
            <select
              value={usuarioSelecionado?.status || ""}
              onChange={(e) =>
                setUsuarioSelecionado({ ...usuarioSelecionado, status: e.target.value })
              }
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button className="btn-outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-outline" onClick={handleSalvarEdicao}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o usuário <strong>{usuarioParaExcluir?.nome}</strong>?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }} className="modal-button">
              <button className="btn-outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn-outline" onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {mensagemSucesso && (
        <div className="mensagem-sucesso">
          {mensagemSucesso}
        </div>
      )}
    </div>
  );
};

export default UserTable;
