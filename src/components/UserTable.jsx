import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import "../components/styles/UserTable.css";

const UserTable = ({ usuarios = [], onEdit, onDelete }) => {
  if (usuarios.length === 0) {
    return <div className="user-table-empty">Nenhum usuário encontrado.</div>;
  }

  return (
    <div className="user-table-shell">
      <table className="user-table-modern">
        <colgroup>
          <col className="col-nome" />
          <col className="col-cpf" />
          <col className="col-email" />
          <col className="col-tipo" />
          <col className="col-status" />
          <col className="col-acoes" />
        </colgroup>

        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Tipo</th>
            <th>Status</th>
            <th className="user-table-modern__actions-column">Ações</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((user) => {
            const tipo = user.tipoUsuario === "admin" ? "Administrador" : "Produtor";
            const tipoClass =
              user.tipoUsuario === "admin"
                ? "user-badge user-badge--admin"
                : "user-badge user-badge--produtor";

            const status = user.status === "ativo" ? "Ativo" : "Inativo";
            const statusClass =
              user.status === "ativo"
                ? "user-status user-status--ativo"
                : "user-status user-status--inativo";

            return (
              <tr key={user.id}>
                <td title={user.nome || "—"}>
                  <span className="cell-text">{user.nome || "—"}</span>
                </td>

                <td title={user.cpf || "—"}>
                  <span className="cell-text">{user.cpf || "—"}</span>
                </td>

                <td title={user.email || "—"}>
                  <span className="cell-text">{user.email || "—"}</span>
                </td>

                <td>
                  <span className={tipoClass}>{tipo}</span>
                </td>

                <td>
                  <span className={statusClass}>
                    <span className="user-status__dot"></span>
                    {status}
                  </span>
                </td>

                <td className="user-table-modern__actions">
                  <button
                    type="button"
                    className="user-table-modern__icon-button user-table-modern__icon-button--edit"
                    onClick={() => onEdit(user)}
                    title="Editar usuário"
                    aria-label="Editar usuário"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className="user-table-modern__icon-button user-table-modern__icon-button--delete"
                    onClick={() => onDelete(user)}
                    title="Excluir usuário"
                    aria-label="Excluir usuário"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;