import React, { useState } from "react";
import UserTable from "../../components/UserTable";
import ModalNovoUsuario from "../master/ModalNovoUsuario";
import "../../components/styles/UsuariosPage.css"
import { Plus, Search } from "lucide-react";


const UsuariosPage = () => {
    const [showModal, setShowModal] = useState(false)


    return (
        <div className="user-page">
            <div className="usuarios-page-container">
                <div className='logo-perfil'>
                    <img src="/images/logo.png" alt="Logo" className="logo-img perfil-logo" />
                </div>

                <div className="usuarios-header">
                    <h1 className="usuarios-title">Usuários Cadastrados</h1>
                    {/* Sessão para cadastrar novos usuários */}
                    <button className="usuarios-button" onClick={() => setShowModal(true)}>
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
                <UserTable />
            </div>

            {/* Modal de criação de usuário */}
            <ModalNovoUsuario isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default UsuariosPage;
