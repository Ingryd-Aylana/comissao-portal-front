import React, { useState, useEffect, useCallback } from "react";
import "../components/styles/Comissoes.css";
import { useNavigate } from "react-router-dom";
import {
  getMilhagensDoUsuarioLogado,
  createMilhagem,
  updateMilhagem,
  deleteMilhagem,
} from "../services/comissaoService";

const MinhasComissoes = () => {
  const [milhagens, setMilhagens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMilhagem, setSelectedMilhagem] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numeroMilhagem: "",
    favorecido: "",
    administradora: "",
    quantidadeSegurados: 0,
    premioBruto: 0,
    premioLiquido: 0,
    percentualComissao: 0,
    descontoComissao: 0,
    valorComissao: 0,
    obs: "",
  });

  const loadMilhagens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMilhagensDoUsuarioLogado();
      setMilhagens(data);
    } catch (err) {
      setError("Erro ao carregar milhagens: " + err.message);
      console.error("Erro:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMilhagens();
  }, [loadMilhagens]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await createMilhagem(formData);
      setShowModal(false);
      setFormData({
        numeroMilhagem: "",
        favorecido: "",
        administradora: "",
        quantidadeSegurados: 0,
        premioBruto: 0,
        premioLiquido: 0,
        percentualComissao: 0,
        descontoComissao: 0,
        valorComissao: 0,
        obs: "",
      });
      await loadMilhagens();
    } catch (err) {
      setError("Erro ao criar milhagem: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, newData) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateMilhagem(id, newData);
      await loadMilhagens();
    } catch (err) {
      setError("Erro ao atualizar milhagem: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta milhagem?")) {
      try {
        setIsLoading(true);
        setError(null);
        await deleteMilhagem(id);
        await loadMilhagens();
      } catch (err) {
        setError("Erro ao deletar milhagem: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  if (isLoading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <div className="logo-perfil">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="logo-img perfil-logo"
          />
        </div>
      <div className="header">
      
        <h1 className="title">Comissões Pagas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Nova Comissão
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrapper">
        <table className="table-comissoes">
          <thead>
            <tr>
              <th>Nº Milhagem</th>
              <th>Favorecido</th>
              <th>Administradora</th>
              <th className="text-center">Qtd. Segurados</th>
              <th className="text-right">Prêmio Bruto</th>
              <th className="text-right">Valor Comissão</th>
            </tr>
          </thead>
          <tbody>
            {milhagens.map((milhagem) => (
              <tr key={milhagem.id}>
                <td>{milhagem.numeroMilhagem}</td>
                <td>{milhagem.favorecido}</td>
                <td>{milhagem.administradora}</td>
                <td className="text-center">{milhagem.quantidadeSegurados}</td>
                <td className="text-right">{formatCurrency(milhagem.premioBruto)}</td>
                <td className="text-right">{formatCurrency(milhagem.valorComissao)}</td>
                <td>{formatDate(milhagem.dataCriacao)}</td>
                <td>
                  <div className="actions">
                    <button
                      onClick={() => navigate(`/milhagem/${milhagem.id}`)}
                      className="btn-success"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMilhagem(milhagem);
                        setShowModal(true);
                      }}
                      className="btn-warning"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(milhagem.id)}
                      className="btn-danger"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedMilhagem ? "Editar Milhagem" : "Nova Milhagem"}</h2>
            <form onSubmit={handleCreate} className="form-milhagem">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número da Milhagem</label>
                  <input
                    type="text"
                    value={formData.numeroMilhagem}
                    onChange={(e) =>
                      setFormData({ ...formData, numeroMilhagem: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Favorecido</label>
                  <input
                    type="text"
                    value={formData.favorecido}
                    onChange={(e) =>
                      setFormData({ ...formData, favorecido: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="text"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Data de Pagamento</label>
                  <input
                    type="text"
                    value={formData.dtPagamento}
                    onChange={(e) =>
                      setFormData({ ...formData, dtPagamento: e.target.value })
                    }
                    required
                  />
                </div>
                {/* Campos adicionais conforme necessário */}
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMilhagem(null);
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {selectedMilhagem ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasComissoes;
