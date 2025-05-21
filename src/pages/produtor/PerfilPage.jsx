import React, { useState } from 'react';
import "../../components/styles/PerfilPage.css";
import Footer from "../../components/Footer"
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaLock,
    FaRegEdit
} from 'react-icons/fa';

// Componente Modal interno
function ModalConfirmacao({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Dados salvos com sucesso!</h3>
                <button className="btn-modal" onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

export default function PerfilPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao@email.com',
        telefone: '(11) 98765-4321',
        pagamento: 'Cartão Alelo',
        endereço: 'Rua da Alfandega, 108',
        usuario: 'joaosilva',
        senha: '********'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => {
        if (isEditing) {
            console.log('Dados salvos:', formData);
            setShowModal(true); // Abre o modal ao salvar
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="main">
        
        <div className="perfil-container">
            <div className='logo-perfil'>
                <img src="/images/logo.png" alt="Logo" className="logo-img perfil-logo" />
            </div>

            <h1 className="perfil-title">Perfil do Produtor</h1>
            <div className="perfil-card">
                <div className="perfil-grid">
                    <div className="input-group">
                        <label><FaUser /> Nome</label>
                        <input
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            className={isEditing ? 'editable' : ''}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="input-group">
                        {/* Campo não editável */}
                        <label><FaIdCard /> CPF</label>
                        <input
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label><FaEnvelope /> E-mail</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={isEditing ? 'editable' : ''}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="input-group">
                        <label><FaPhone /> Telefone</label>
                        <input
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            className={isEditing ? 'editable' : ''}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="input-group">
                          {/* Campo não editável */}
                        <label><FaIdCard /> Pagamento</label>
                        <input
                            name="pagamento"
                            value={formData.pagamento}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label><FaUser /> Endereço</label>
                        <input
                            name="endereço"
                            value={formData.endereço}
                            onChange={handleChange}
                            className={isEditing ? 'editable' : ''}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="input-group">
                        <label><FaUser /> Usuário</label>
                        <input
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            className={isEditing ? 'editable' : ''}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="input-group">
                        <label><FaLock /> Senha</label>
                        <input
                            name="senha"
                            type="password"
                            value={formData.senha}
                            onChange={handleChange}
                            className={isEditing ? 'editable' : ''}
                            readOnly={!isEditing}
                        />
                    </div>
                </div>

                <button className="btn-editar" onClick={toggleEdit}>
                    <FaRegEdit /> {isEditing ? 'Salvar' : 'Editar Perfil'}
                </button>
                
            </div>

            <ModalConfirmacao isOpen={showModal} onClose={() => setShowModal(false)} />
            
        </div>
       <Footer />
        </div>
    );
}
