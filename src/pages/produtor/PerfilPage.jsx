import React, { useState, useEffect } from "react";
import "../../components/styles/PerfilPage.css";
import Footer from "../../components/Footer";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaLock,
  FaRegEdit,
  FaBuilding,
  FaMobileAlt,
} from "react-icons/fa";
import {
  getCurrentUserFirestoreData,
  updateUserProfile,
} from "../../services/comissaoService";

// Componente Modal interno
function ModalConfirmacao({ isOpen, onClose, message, isError }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className={`modal-content ${isError ? "error" : "success"}`}>
        <h3>{message}</h3>
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
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    celular: "",
    nomeAdministradora: "",
    endereco: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getCurrentUserFirestoreData();
        setFormData({
          nome: userData.nome || "",
          cpf: userData.cpf || "",
          email: userData.email || "",
          telefone: userData.telefone || "",
          celular: userData.celular || "",
          nomeAdministradora: userData.nomeAdministradora || "",
          endereco: userData.endereco || "",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        showModalMessage("Erro ao carregar dados do usuário.", true);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { nome, email, telefone, celular, endereco } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;

    if (nome.trim().length < 3)
      return "O nome deve ter pelo menos 3 caracteres.";
    if (!emailRegex.test(email)) return "E-mail inválido.";
    if (telefone && !telefoneRegex.test(telefone))
      return "Telefone inválido. Formato esperado: (00) 00000-0000.";
    if (celular && !telefoneRegex.test(celular))
      return "Celular inválido. Formato esperado: (00) 00000-0000.";
    if (endereco && endereco.trim().length < 5)
      return "O endereço deve ter pelo menos 5 caracteres.";

    return "";
  };

  const showModalMessage = (message, error = false) => {
    setModalMessage(message);
    setIsError(error);
    setShowModal(true);
  };

  const toggleEdit = async () => {
    if (isEditing) {
      const validationError = validateFields();
      if (validationError) {
        showModalMessage(validationError, true);
        return;
      }

      try {
        await updateUserProfile(formData);
        showModalMessage("Dados atualizados com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        showModalMessage("Erro ao atualizar perfil. Tente novamente.", true);
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando dados do perfil...</p>
      </div>
    );
  }

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
              <label>
                <FaIdCard /> CPF
              </label>
              <input
                name="cpf"
                value={formData.cpf}
                readOnly
                className="readonly"
              />
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
                placeholder="(00) 0000-0000"
              />
            </div>

            <div className="input-group">
              <label>
                <FaMobileAlt /> Celular
              </label>
              <input
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="input-group">
              <label>
                <FaBuilding /> Administradora
              </label>
              <input
                name="nomeAdministradora"
                value={formData.nomeAdministradora}
                readOnly
                className="readonly"
              />
            </div>

            <div className="input-group full-width">
              <label>
                <FaIdCard /> Endereço
              </label>
              <input
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className={isEditing ? "editable" : ""}
                readOnly={!isEditing}
                placeholder="Rua, número, complemento, cidade - UF"
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
          message={modalMessage}
          isError={isError}
        />
      </div>
    </div>
  );
}
