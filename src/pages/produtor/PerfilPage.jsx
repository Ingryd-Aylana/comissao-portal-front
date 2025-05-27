import React, { useState } from "react";
import "../../components/styles/PerfilPage.css";
import Footer from "../../components/Footer";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaLock,
  FaRegEdit,
} from "react-icons/fa";

// Componente Modal interno
function ModalConfirmacao({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Dados salvos com sucesso!</h3>
        <button className="btn-modal" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "Daniel Santos",
    cpf: "123.456.789-00",
    email: "daniel@email.com",
    telefone: "(11) 98765-4321",
    pagamento: "Cartão Alelo",
    endereço: "Rua da Alfandega, 108",
    usuario: "danielsilva",
    senha: "********",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { nome, email, telefone, endereço, usuario, senha } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;

    if (nome.trim().length < 3)
      return "O nome deve ter pelo menos 3 caracteres.";
    if (!emailRegex.test(email)) return "E-mail inválido.";
    if (!telefoneRegex.test(telefone))
      return "Telefone inválido. Formato esperado: (00) 00000-0000.";
    if (endereço.trim().length < 5)
      return "O endereço deve ter pelo menos 5 caracteres.";
    if (usuario.trim().length < 4)
      return "O nome de usuário deve ter pelo menos 4 caracteres.";
    if (senha.trim().length < 6)
      return "A senha deve ter pelo menos 6 caracteres.";

    return "";
  };

  const toggleEdit = () => {
    if (isEditing) {
      const validationError = validateFields();
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      console.log("Dados salvos:", formData);
      setShowModal(true); // Abre o modal ao salvar
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="main">
      <div className="perfil-container">
        <div className="logo-perfil">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="logo-img perfil-logo"
          />
        </div>

        <h1 className="perfil-title">Perfil do Produtor</h1>

        <div className="perfil-card">
          {error && <div className="error-alert">{error}</div>}

          <div className="perfil-grid">
            <div className="input-group">
              <label>
                <FaUser /> Nome
              </label>
              <input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              {/* Campo não editável */}
              <label>
                <FaIdCard /> CPF
              </label>
              <input name="cpf" value={formData.cpf} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>
                <FaEnvelope /> E-mail
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>
                <FaPhone /> Telefone
              </label>
              <input
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              {/* Campo não editável */}
              <label>
                <FaIdCard /> Pagamento
              </label>
              <input
                name="pagamento"
                value={formData.pagamento}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>
                <FaUser /> Endereço
              </label>
              <input
                name="endereço"
                value={formData.endereço}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>
                <FaUser /> Usuário
              </label>
              <input
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <label>
                <FaLock /> Senha
              </label>
              <input
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <button className="btn-editar" onClick={toggleEdit}>
            <FaRegEdit /> {isEditing ? "Salvar" : "Editar Perfil"}
          </button>
        </div>

        <ModalConfirmacao
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>

      <Footer />
    </div>
  );
}
