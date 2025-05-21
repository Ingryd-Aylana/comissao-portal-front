import React, { useState } from "react";
import { FaUser } from 'react-icons/fa';

const ModalNovoUsuario = ({ isOpen, onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // fazer a chamada ao backend para salvar os dados

    setShowSuccess(true); // Exibe a mensagem
    setTimeout(() => {
      setShowSuccess(false); // Esconde após 3 segundos
      onClose(); // Fecha o modal automaticamente 
    }, 3000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <FaUser className="modal-icon" />
          <h2 className="modal-title">Cadastrar Novo Usuário</h2>
        </div>
        <hr />
        <br />
        {showSuccess && (
          <div className="success-alert">
            Usuário cadastrado com sucesso!
          </div>
        )}
        <form className="modal-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nome completo" required />
          <input type="text" placeholder="CPF" required />
          <input type="email" placeholder="E-mail" required />
          <input type="text" placeholder="Usuário" required />
          <input type="password" placeholder="Senha" required />

          <div className="modal-actions">
            <button type="submit" className="btn-salvar">Salvar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovoUsuario;
