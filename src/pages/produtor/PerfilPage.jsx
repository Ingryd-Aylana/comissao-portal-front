import React, { useState, useEffect } from "react";
import "../../components/styles/PerfilPage.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaRegEdit,
  FaBuilding,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";
import {
  getCurrentUserFirestoreData,
  updateUserProfile,
} from "../../services/comissaoService";

function ModalConfirmacao({ isOpen, onClose, message, isError }) {
  if (!isOpen) return null;

  return (
    <div className="producer-profile-modal-overlay">
      <div
        className={`producer-profile-modal-box ${
          isError ? "producer-profile-modal-error" : "producer-profile-modal-success"
        }`}
      >
        <h3>{message}</h3>
        <button className="producer-profile-modal-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  name,
  value,
  onChange,
  readOnly,
  placeholder,
  fullWidth = false,
}) {
  return (
    <div
      className={`producer-profile-field ${
        fullWidth ? "producer-profile-field-full" : ""
      }`}
    >
      <label className="producer-profile-field-label">
        <span className="producer-profile-field-icon">{icon}</span>
        <span>{label}</span>
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`producer-profile-field-input ${
          readOnly
            ? "producer-profile-field-input-readonly"
            : "producer-profile-field-input-editable"
        }`}
      />
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
          nome: userData?.nome || "",
          cpf: userData?.cpf || "",
          email: userData?.email || "",
          telefone: userData?.telefone || "",
          celular: userData?.celular || "",
          nomeAdministradora: userData?.nomeAdministradora || "",
          endereco: userData?.endereco || "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const { nome, email, telefone, celular, endereco } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;

    if (nome.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres.";
    }

    if (!emailRegex.test(email)) {
      return "E-mail inválido.";
    }

    if (telefone && !telefoneRegex.test(telefone)) {
      return "Telefone inválido. Formato esperado: (00) 00000-0000.";
    }

    if (celular && !telefoneRegex.test(celular)) {
      return "Celular inválido. Formato esperado: (00) 00000-0000.";
    }

    if (endereco && endereco.trim().length < 5) {
      return "O endereço deve ter pelo menos 5 caracteres.";
    }

    return "";
  };

  const showModalMessage = (message, error = false) => {
    setModalMessage(message);
    setIsError(error);
    setShowModal(true);
  };

  const handleEditOrSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const validationError = validateFields();

    if (validationError) {
      showModalMessage(validationError, true);
      return;
    }

    try {
      await updateUserProfile(formData);
      showModalMessage("Dados atualizados com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showModalMessage("Erro ao atualizar perfil. Tente novamente.", true);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando dados do perfil...</p>
      </div>
    );
  }

  const initialLetter = formData.nome?.trim()?.charAt(0)?.toUpperCase() || "P";

  return (
    <div className="main">
      <div className="producer-profile-page">
        <div className="producer-profile-header">
          <div className="producer-profile-header-texts">
            <h1 className="producer-profile-title">Meu Perfil</h1>
            <p className="producer-profile-subtitle">
              Gerencie suas informações pessoais.
            </p>
          </div>

          <button
            type="button"
            className="producer-profile-top-action"
            onClick={handleEditOrSave}
          >
            {isEditing ? <FaSave /> : <FaRegEdit />}
            <span>{isEditing ? "Salvar alterações" : "Editar perfil"}</span>
          </button>
        </div>

        <div className="producer-profile-card">
          <div className="producer-profile-banner">
            <div className="producer-profile-banner-lines" />

            <div className="producer-profile-avatar">{initialLetter}</div>

            <div className="producer-profile-banner-info">
              <div className="producer-profile-banner-name">
                {formData.nome || "Produtor"}
              </div>
              <div className="producer-profile-banner-role">
                Produtor
                {formData.nomeAdministradora
                  ? ` · ${formData.nomeAdministradora}`
                  : ""}
              </div>
            </div>
          </div>

          <div className="producer-profile-content">
            <section className="producer-profile-section">
              <h2 className="producer-profile-section-title">
                Informações Pessoais
              </h2>

              <div className="producer-profile-grid">
                <ProfileField
                  icon={<FaUser />}
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />

                <ProfileField
                  icon={<FaIdCard />}
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />

                <ProfileField
                  icon={<FaEnvelope />}
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />

                <ProfileField
                  icon={<FaPhone />}
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="(00) 0000-0000"
                />

                <ProfileField
                  icon={<FaMobileAlt />}
                  label="Celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="(00) 00000-0000"
                />

                <ProfileField
                  icon={<FaBuilding />}
                  label="Administradora"
                  name="nomeAdministradora"
                  value={formData.nomeAdministradora}
                  onChange={handleChange}
                  readOnly={true}
                  placeholder="—"
                />

                <ProfileField
                  icon={<FaMapMarkerAlt />}
                  label="Endereço"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="Rua, número, complemento, cidade - UF"
                  fullWidth={true}
                />
              </div>
            </section>
          </div>
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