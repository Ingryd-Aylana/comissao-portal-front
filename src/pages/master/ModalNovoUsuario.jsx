import React, { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import { createUser, updateUser } from "../../services/userService";

const initialState = {
  nome: "",
  cpf: "",
  email: "",
  senha: "",
  telefone: "",
  celular: "",
  endereco: "",
  tipoUsuario: "produtor",
  nomeAdministradora: "",
  status: "ativo",
};

const ModalNovoUsuario = ({
  isOpen,
  onClose,
  onSave,
  usuarioParaEditar = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!isOpen) return;

    if (usuarioParaEditar) {
      setFormData({
        nome: usuarioParaEditar.nome || "",
        cpf: usuarioParaEditar.cpf || "",
        email: usuarioParaEditar.email || "",
        senha: "",
        telefone: usuarioParaEditar.telefone || "",
        celular: usuarioParaEditar.celular || "",
        endereco: usuarioParaEditar.endereco || "",
        tipoUsuario: usuarioParaEditar.tipoUsuario || "produtor",
        nomeAdministradora: usuarioParaEditar.nomeAdministradora || "",
        status: usuarioParaEditar.status || "ativo",
      });
    } else {
      setFormData(initialState);
    }

    setError("");
  }, [usuarioParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanCPF = (cpf) => cpf.replace(/[^\d]/g, "");

  const validateFields = () => {
    const { nome, cpf, email, senha, telefone, celular } = formData;

    const cpfLimpo = cpf.replace(/[^\d]/g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;

    if (nome.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres.";
    }

    if (cpfLimpo.length !== 11) {
      return "CPF inválido. Deve conter 11 dígitos numéricos.";
    }

    if (!emailRegex.test(email)) {
      return "E-mail inválido.";
    }

    if (!usuarioParaEditar && senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }

    if (telefone && !telefoneRegex.test(telefone)) {
      return "Telefone inválido. Formato esperado: (00) 0000-0000";
    }

    if (celular && !telefoneRegex.test(celular)) {
      return "Celular inválido. Formato esperado: (00) 00000-0000";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      ...formData,
      cpf: cleanCPF(formData.cpf),
    };

    try {
      if (usuarioParaEditar) {
        await updateUser(usuarioParaEditar.id, payload);

        const usuarioAtualizado = {
          ...usuarioParaEditar,
          ...payload,
          id: usuarioParaEditar.id,
        };

        onSave(usuarioAtualizado);
      } else {
        const novoId = await createUser(payload);
        const novoUsuario = { ...payload, id: novoId };
        onSave(novoUsuario);
      }

      onClose();
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      setError(
        err.message || "Erro ao salvar usuário. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-modal__backdrop" onClick={onClose}>
      <div
        className="user-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-form-modal__header">
          <div className="user-form-modal__title-wrap">
            <div className="user-form-modal__icon">
              <User size={20} />
            </div>

            <div>
              <h2 className="user-form-modal__title">
                {usuarioParaEditar ? "Editar usuário" : "Cadastrar novo usuário"}
              </h2>
              <p className="user-form-modal__subtitle">
                Preencha os dados do usuário e salve as alterações.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="user-form-modal__close"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar modal"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="user-form-modal__alert user-form-modal__alert--error">
            {error}
          </div>
        )}

        <form className="user-form-modal__form" onSubmit={handleSubmit}>
          <div className="user-form-modal__field">
            <label>Nome completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="user-form-modal__field">
            <label>CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Digite apenas números"
            />
          </div>

          <div className="user-form-modal__field">
            <label>E-mail *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="user-form-modal__field">
            <label>
              {usuarioParaEditar ? "Nova senha (opcional)" : "Senha *"}
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required={!usuarioParaEditar}
              disabled={loading}
            />
          </div>

          <div className="user-form-modal__grid">
            <div className="user-form-modal__field">
              <label>Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                disabled={loading}
                placeholder="(00) 0000-0000"
              />
            </div>

            <div className="user-form-modal__field">
              <label>Celular</label>
              <input
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                disabled={loading}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="user-form-modal__field">
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              disabled={loading}
              placeholder="Rua, número, complemento, cidade - UF"
            />
          </div>

          <div className="user-form-modal__grid">
            <div className="user-form-modal__field">
              <label>Tipo de usuário *</label>
              <select
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="produtor">Produtor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="user-form-modal__field">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="user-form-modal__field">
            <label>Administradora</label>
            <input
              type="text"
              name="nomeAdministradora"
              value={formData.nomeAdministradora}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="user-form-modal__actions">
            <button
              type="button"
              className="user-form-modal__ghost-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="user-form-modal__primary-button"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovoUsuario;