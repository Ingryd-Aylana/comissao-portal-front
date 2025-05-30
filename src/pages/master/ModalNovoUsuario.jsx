import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { createUser, updateUser } from "../../services/userService";

const ModalNovoUsuario = ({
  isOpen,
  onClose,
  onSave,
  usuarioParaEditar = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
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
      setFormData({
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
      });
    }
    setError("");
  }, [usuarioParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const { nome, cpf, email, senha, telefone, celular } = formData;

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-\d{4}$/;

    if (nome.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (!cpfRegex.test(cpf))
      return "CPF inválido. Formato esperado: 000.000.000-00";
    if (!emailRegex.test(email)) return "E-mail inválido.";
    if (!usuarioParaEditar && senha.length < 6)
      return "A senha deve ter pelo menos 6 caracteres.";
    if (telefone && !telefoneRegex.test(telefone))
      return "Telefone inválido. Formato esperado: (00) 0000-0000";
    if (celular && !telefoneRegex.test(celular))
      return "Celular inválido. Formato esperado: (00) 00000-0000";

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

    try {
      if (usuarioParaEditar) {
        await updateUser(usuarioParaEditar.id, formData);
      } else {
        await createUser(formData);
      }

      onSave(formData);
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
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <FaUser className="modal-icon" />
          <h2 className="modal-title">
            {usuarioParaEditar ? "Editar Usuário" : "Cadastrar Novo Usuário"}
          </h2>
        </div>
        <hr />

        {error && <div className="error-alert">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
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

          <div className="form-group">
            <label>CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              disabled={loading || usuarioParaEditar}
              placeholder="000.000.000-00"
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Usuário *</label>
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

            <div className="form-group">
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

          <div className="form-group">
            <label>Administradora</label>
            <input
              type="text"
              name="nomeAdministradora"
              value={formData.nomeAdministradora}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-salvar" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNovoUsuario;
