import React, { useEffect, useState } from "react";
import { FaUser } from 'react-icons/fa';

const ModalNovoUsuario = ({ isOpen, onClose, onSave, usuarioParaEditar = null }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    usuario: '',
    senha: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuarioParaEditar) {
      setFormData({
        nome: usuarioParaEditar.nome || '',
        cpf: usuarioParaEditar.cpf || '',
        email: usuarioParaEditar.email || '',
        usuario: usuarioParaEditar.usuario || '',
        senha: usuarioParaEditar.senha || ''
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        usuario: '',
        senha: ''
      });
    }
  }, [usuarioParaEditar]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { nome, cpf, email, usuario, senha } = formData;

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nome.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (!cpfRegex.test(cpf)) return "CPF inválido. Formato esperado: 000.000.000-00.";
    if (!emailRegex.test(email)) return "E-mail inválido.";
    if (usuario.length < 4) return "O nome de usuário deve ter pelo menos 4 caracteres.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onSave(formData); // dispara o salvamento no componente pai

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <FaUser className="modal-icon" />
          <h2 className="modal-title">
            {usuarioParaEditar ? "Editar Usuário" : "Cadastrar Novo Usuário"}
          </h2>
        </div>
        <hr /><br />

        {showSuccess && <div className="success-alert">Usuário salvo com sucesso!</div>}
        {error && <div className="error-alert">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <input type="text" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} required />
          <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
          <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
          <input type="text" name="usuario" placeholder="Usuário" value={formData.usuario} onChange={handleChange} required />
          <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />

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
