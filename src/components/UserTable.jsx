import React, { useState } from "react";
import "../components/styles/UserTable.css";

const mockUsers = [
  { id: 1, nome: "Michel Policeno", cpf: "123.456.789-00", email: "michel@email.com" },
  { id: 2, nome: "Ingryd Aylana", cpf: "987.654.321-00", email: "ingryd@email.com" },
];

const UserTable = () => {
  const [usuarios, setUsuarios] = useState(mockUsers);

  const handleEdit = (id) => {
    console.log("Editar usuário:", id);
  };

  const handleDelete = (id) => {
    console.log("Excluir usuário:", id);
  };

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead>
          <tr className="user-table-header">
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th className="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} className="user-table-row">
              <td>{user.nome}</td>
              <td>{user.cpf}</td>
              <td>{user.email}</td>
              <td className="acoes">
                <div className="acoes-buttons">
                  <button className="btn-outline" onClick={() => handleEdit(user.id)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(user.id)}>
                Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
