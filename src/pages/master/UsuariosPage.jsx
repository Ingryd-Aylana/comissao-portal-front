import React, { useState } from "react";
import UserTable from "../../components/UserTable";
import ModalNovoUsuario from "../master/ModalNovoUsuario";
import "../../components/styles/UsuariosPage.css";
import { Plus, Search } from "lucide-react";

const UsuariosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null); // Dados do usuário a ser editado

  // Abrir modal para novo usuário
  const handleAddUser = () => {
    setEditData(null);
    setShowModal(true);
  };

  // Abrir modal para edição de usuário
  const handleEditUser = (usuario) => {
    setEditData(usuario);
    setShowModal(true);
  };

  // Excluir usuário com confirmação
  const handleDeleteUser = (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmar) {
      // Aqui você pode integrar com o backend (API DELETE)
      console.log("Usuário excluído com ID:", id);
    }
  };

  return (
    <div className="user-page">
      <div className="usuarios-page-container">
        <div className="logo-perfil">
          <img src="/images/logo.png" alt="Logo" className="logo-img perfil-logo" />
        </div>

        <div className="usuarios-header">
          <h1 className="usuarios-title">Usuários Cadastrados</h1>
          {/* Sessão para cadastrar novos usuários */}
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
          />
          {/* busca de usuários cadastrados, buscar referência no banco de dados */}
          <button className="usuarios-search-button">
            <Search className="icon" />
            Buscar
          </button>
        </div>

        {/* Tabela mencionada vindo de outro arquivo */}
        <UserTable
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>

      {/* Modal de criação/edição de usuário */}
      <ModalNovoUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        usuarioParaEditar={editData}
        onSave={(dados) => {
          // salvar novo usuário ou atualizar existente
          console.log("Salvar usuário (criação ou edição)", dados);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default UsuariosPage;
