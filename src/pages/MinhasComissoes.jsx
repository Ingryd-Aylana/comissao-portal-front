import React, { useState, useEffect, useCallback } from "react";
import "../components/styles/Comissoes.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import {
  getMilhagensDeTodosUsuarios,
  createMilhagem,
  updateMilhagem,
  deleteMilhagem,
} from "../services/comissaoService";
import { getAllProdutores } from "../services/userService";

const MinhasComissoes = () => {
  const [milhagens, setMilhagens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtro, setFiltro] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMilhagem, setSelectedMilhagem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [milhagemToDelete, setMilhagemToDelete] = useState(null);
  const [showDetalhes, setShowDetalhes] = useState(false);
  const [produtores, setProdutores] = useState([]);
  const navigate = useNavigate();

  const initialForm = {
    numeroMilhagem: "",
    favorecido: "",
    segurado: "",
    quantidadeSegurados: 0,
    premioBruto: 0,
    premioLiquido: 0,
    percentualComissao: 0,
    descontoComissao: 0,
    valorComissao: 0,
    obs: "",
    apolice: "",
    inicioVigencia: "",
    dtPagamento: "",
    valor: 0,
  };

  const [formData, setFormData] = useState(initialForm);

  const loadMilhagens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMilhagensDeTodosUsuarios();
      const milhagensComInfo = data.map((milhagem) => {
        const primeiroSegurado = milhagem.segurados?.[0] || {};
        return {
          ...milhagem,
          favorecido: milhagem.favorecido || milhagem.produtorNome || "Produtor desconhecido",
          segurado: primeiroSegurado.segurado || "",
          premioBruto: primeiroSegurado.premioBruto || 0,
          apolice: primeiroSegurado.apolice || "",
          inicioVigencia: primeiroSegurado.inicioVigencia || "",
          valor: primeiroSegurado.vlRepasse || milhagem.valor || 0,
          premioLiquido: primeiroSegurado.prLiqParc || 0,
          dtPagamento: primeiroSegurado.dtPagamento || milhagem.dtPagamento || "",
        };
      });
      setMilhagens(milhagensComInfo);
    } catch (err) {
      setError("Erro ao carregar milhagens: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProdutores = useCallback(async () => {
    try {
      const produtores = await getAllProdutores();
      const produtoresFiltrados = produtores.filter(
        (user) => user.tipoUsuario === "produtor" && user.nome
      );
      setProdutores(produtoresFiltrados);
    } catch (err) {
      console.error("Erro ao carregar produtores:", err);
      setProdutores([]);
    }
  }, []);

  useEffect(() => {
    loadMilhagens();
    loadProdutores();
  }, [loadMilhagens, loadProdutores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      if (selectedMilhagem) {
        await updateMilhagem(selectedMilhagem.id, formData);
      } else {
        await createMilhagem(formData);
        setFormData(initialForm);
      }
      setShowModal(false);
      setSelectedMilhagem(null);
      setShowDetalhes(false);
      await loadMilhagens();
    } catch (err) {
      setError("Erro ao salvar milhagem: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
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
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "" : new Intl.DateTimeFormat("pt-BR").format(parsedDate);
  };

  const filteredMilhagens = milhagens.filter((milhagem) => {
    const filtroLower = filtro.toLowerCase();
    return (
      milhagem.numeroMilhagem?.toString().includes(filtroLower) ||
      milhagem.favorecido?.toLowerCase().includes(filtroLower) ||
      milhagem.segurado?.toLowerCase().includes(filtroLower)
    );
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredMilhagens.length / itemsPerPage);
  const paginatedMilhagens = filteredMilhagens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <div className="logo-perfil">
        <img src="/images/logo.png" alt="Logo" className="logo-img perfil-logo" />
      </div>

      <div className="header">
        <h1 className="title">Comissões Pagas</h1>
        <button
          onClick={() => {
            setSelectedMilhagem(null);
            setFormData(initialForm);
            setShowDetalhes(false);
            setShowModal(true);
          }}
          className="btn-primary"
        >
          Nova Comissão
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="filter-wrapper">
        <div className="filter-box">
          <span className="filter-icon"><FaSearch /></span>
          <input
            type="text"
            className="filter-input"
            placeholder="Filtrar comissões..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table-comissoes">
          <thead>
            <tr>
              <th>Nº Milhagem</th>
              <th>Favorecido</th>
              <th>Segurado</th>
              <th className="text-right">Prêmio Líquido</th>
              <th className="text-right">Valor</th>
              <th className="text-right">Data de Pagamento</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMilhagens.map((milhagem) => (
              <tr key={milhagem.id}>
                <td>{milhagem.numeroMilhagem}</td>
                <td>{milhagem.favorecido}</td>
                <td>{milhagem.segurado}</td>
                <td className="text-right">{formatCurrency(milhagem.premioLiquido)}</td>
                <td className="text-right">{formatCurrency(milhagem.valor)}</td>
                <td>{formatDate(milhagem.dtPagamento)}</td>
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
                        setFormData({ ...milhagem });
                        setShowModal(true);
                        setShowDetalhes(false);
                      }}
                      className="btn-warning"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setMilhagemToDelete(milhagem);
                        setShowDeleteModal(true);
                      }}
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

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedMilhagem ? "Editar Milhagem" : "Nova Milhagem"}</h2>
            <form onSubmit={handleSubmit} className="form-milhagem">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número da Milhagem</label>
                  <input
                    type="number"
                    value={formData.numeroMilhagem}
                    onChange={(e) =>
                      setFormData({ ...formData, numeroMilhagem: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group" style={{ position: "relative" }}>
                  <label>Favorecido</label>
                  <input
                    type="text"
                    value={formData.favorecido}
                    onChange={(e) =>
                      setFormData({ ...formData, favorecido: e.target.value })
                    }
                    autoComplete="off"
                    required
                  />
                  {formData.favorecido.length > 0 && (
                    <ul className="autocomplete-list">
                      {produtores
                        .filter((p) =>
                          p.nome.toLowerCase().includes(formData.favorecido.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((p) => (
                          <li
                            key={p.id}
                            onClick={() =>
                              setFormData({ ...formData, favorecido: p.nome })
                            }
                          >
                            {p.nome}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>

                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="number"
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
                    type="date"
                    value={formData.dtPagamento}
                    onChange={(e) =>
                      setFormData({ ...formData, dtPagamento: e.target.value })
                    }
                    required
                  />
                </div>

                {(!selectedMilhagem || showDetalhes) && (
                  <>
                    <div className="form-group">
                      <label>Segurado</label>
                      <input
                        type="text"
                        value={formData.segurado || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, segurado: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Prêmio Bruto</label>
                      <input
                        type="number"
                        value={formData.premioBruto || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            premioBruto: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Apólice</label>
                      <input
                        type="text"
                        value={formData.apolice || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, apolice: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Início Vigência</label>
                      <input
                        type="date"
                        value={formData.inicioVigencia || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inicioVigencia: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {selectedMilhagem && (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowDetalhes(!showDetalhes)}
                  >
                    {showDetalhes ? "Ocultar Detalhes" : "Mostrar Detalhes"}
                  </button>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMilhagem(null);
                    setShowDetalhes(false);
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

      {/* Modal de exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir a milhagem nº{" "}
              {milhagemToDelete?.numeroMilhagem}?
            </p>
            <div className="form-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-danger"
                onClick={async () => {
                  await handleDelete(milhagemToDelete.id);
                  setShowDeleteModal(false);
                  setMilhagemToDelete(null);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasComissoes;
