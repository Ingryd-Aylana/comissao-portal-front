import React, { useState, useEffect, useCallback } from "react";
import "../../components/styles/Comissoes.css";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFileExcel,
  FaFilePdf,
  FaPlus,
} from "react-icons/fa";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import {
  getMilhagensDeTodosUsuarios,
  createMilhagem,
  updateMilhagem,
  deleteMilhagem,
} from "../../services/comissaoService";
import { getAllProdutores } from "../../services/userService";

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
  const [produtores, setProdutores] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const initialForm = {
    produtorUid: "",
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
          favorecido:
            milhagem.favorecido ||
            milhagem.produtorNome ||
            "Produtor desconhecido",
          segurado: primeiroSegurado.segurado || "",
          premioBruto: primeiroSegurado.VlBase || 0,
          apolice: primeiroSegurado.apolice || "",
          inicioVigencia: primeiroSegurado.inicioVigencia || "",
          valor: primeiroSegurado.vlRepasse || milhagem.valor || 0,
          premioLiquido: primeiroSegurado.prLiqParc || 0,
          dtPagamento:
            primeiroSegurado.dtPagamento || milhagem.dtPagamento || "",
        };
      });

      setMilhagens(milhagensComInfo);
    } catch (err) {
      setError("Erro ao carregar comissões: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProdutores = useCallback(async () => {
    try {
      const produtoresData = await getAllProdutores();
      const produtoresFiltrados = produtoresData.filter(
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filtro]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      if (selectedMilhagem) {
        const seguradoObj = {
          segurado: formData.segurado || "",
          apolice: formData.apolice || "",
          inicioVigencia: formData.inicioVigencia || "",
          vlRepasse: parseFloat(formData.valor) || 0,
          prLiqParc: parseFloat(formData.premioLiquido) || 0,
          dtPagamento: formData.dtPagamento || "",
        };

        const milhagemAtualizada = {
          ...formData,
          segurados: [seguradoObj],
        };

        await updateMilhagem(selectedMilhagem.id, milhagemAtualizada);
      } else {
        await createMilhagem(formData);
      }

      setShowModal(false);
      setSelectedMilhagem(null);
      setFormData(initialForm);
      await loadMilhagens();
    } catch (err) {
      setError("Erro ao salvar comissão: " + err.message);
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
      setError("Erro ao deletar comissão: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setSelectedMilhagem(null);
    setFormData(initialForm);
    setShowAutocomplete(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMilhagem(null);
    setFormData(initialForm);
    setShowAutocomplete(false);
  };

  const handleEdit = (milhagem) => {
    const primeiroSegurado = milhagem.segurados?.[0] || {};

    setSelectedMilhagem(milhagem);
    setFormData({
      produtorUid: milhagem.produtorUid || "",
      numeroMilhagem: milhagem.numeroMilhagem || "",
      favorecido: milhagem.favorecido || "",
      segurado: primeiroSegurado.segurado || "",
      quantidadeSegurados: milhagem.quantidadeSegurados || 0,
      premioBruto: primeiroSegurado.VlBase || 0,
      premioLiquido: primeiroSegurado.prLiqParc || 0,
      percentualComissao: milhagem.percentualComissao || 0,
      descontoComissao: milhagem.descontoComissao || 0,
      valorComissao: milhagem.valorComissao || 0,
      obs: milhagem.obs || "",
      apolice: primeiroSegurado.apolice || "",
      inicioVigencia: primeiroSegurado.inicioVigencia || "",
      dtPagamento: primeiroSegurado.dtPagamento || milhagem.dtPagamento || "",
      valor: primeiroSegurado.vlRepasse || milhagem.valor || 0,
    });
    setShowAutocomplete(false);
    setShowModal(true);
  };

  const handleViewDetails = (id) => {
    const basePath = isAdmin ? ROUTES.ADMIN_COMISSOES : ROUTES.APP_COMISSOES;
    const destino = `${basePath}/${id}`;
    navigate(destino);
  };

  const handleExportExcel = () => {
    const header = [
      "Número",
      "Favorecido",
      "Segurado",
      "Prêmio Líquido",
      "Valor",
      "Data de Pagamento",
    ];

    const rows = filteredMilhagens.map((milhagem) => [
      milhagem.numeroMilhagem || "",
      milhagem.favorecido || "",
      milhagem.segurado || "",
      Number(milhagem.premioLiquido || 0),
      Number(milhagem.valor || 0),
      milhagem.dtPagamento || "",
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(";"))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "comissoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    window.print();
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) || 0);

  const formatDate = (date) => {
    if (!date) return "-";
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime())
      ? "-"
      : new Intl.DateTimeFormat("pt-BR").format(parsedDate);
  };

  const filteredMilhagens = milhagens.filter((milhagem) => {
    const filtroLower = filtro.toLowerCase();

    return (
      milhagem.numeroMilhagem?.toString().toLowerCase().includes(filtroLower) ||
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
    <div className="comissoes-page">
      <div className="comissoes-header">
        <div>
          <h1 className="comissoes-title">Comissões Pagas</h1>
          <p className="comissoes-subtitle">
            Gerencie todas as comissões cadastradas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewModal}
          className="btn-primary"
        >
          <FaPlus />
          Nova Comissão
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrap">
        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon">
              <FaSearch />
            </span>

            <input
              type="text"
              className="search-input"
              placeholder="Filtrar por favorecido, segurado ou nº..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />

            {filtro && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setFiltro("")}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <button type="button" className="filter-btn">
            Filtrar
          </button>

          <button type="button" className="filter-btn">
            Ordenar
          </button>

          <div className="toolbar-right">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportExcel}
            >
              <FaFileExcel />
              Excel
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleExportPdf}
            >
              <FaFilePdf />
              PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Carregando comissões...</div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="table-comissoes">
                <thead>
                  <tr>
                    <th>Nº Comissão</th>
                    <th>Favorecido</th>
                    <th>Segurado</th>
                    <th className="text-right">Prêmio Líquido</th>
                    <th className="text-right">Valor</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMilhagens.length > 0 ? (
                    paginatedMilhagens.map((milhagem) => (
                      <tr key={milhagem.id}>
                        <td>
                          <span className="milhagem-tag">
                            {milhagem.numeroMilhagem}
                          </span>
                        </td>
                        <td>
                          <strong>{milhagem.favorecido}</strong>
                        </td>
                        <td className="seg-cell">{milhagem.segurado || "-"}</td>
                        <td className="text-right">
                          {formatCurrency(milhagem.premioLiquido)}
                        </td>
                        <td className="text-right val-green">
                          {formatCurrency(milhagem.valor)}
                        </td>
                      
                        <td>
                          <div className="actions">
                           

                            <button
                              type="button"
                              onClick={() => handleEdit(milhagem)}
                              className="action-btn ab-amber"
                              title="Editar"
                            >
                              <FaEdit />
                              
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setMilhagemToDelete(milhagem);
                                setShowDeleteModal(true);
                              }}
                              className="action-btn ab-red"
                              title="Excluir"
                            >
                              <FaTrash />
                              
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row">
                        Nenhuma comissão encontrada para "{filtro}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span className="footer-count">
                {filteredMilhagens.length} registro(s) encontrado(s)
              </span>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`page-button ${currentPage === i + 1 ? "active" : ""
                      }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedMilhagem ? "Editar Comissão" : "Nova Comissão"}</h2>

            <form onSubmit={handleSubmit} className="form-milhagem">
              <div className="form-grid">
                <div className="form-group">
                  <label>Número da Comissão</label>
                  <input
                    type="text"
                    value={formData.numeroMilhagem}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroMilhagem: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group autocomplete-wrapper">
                  <label>Favorecido</label>
                  <input
                    type="text"
                    value={formData.favorecido}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        favorecido: e.target.value,
                      });
                      setShowAutocomplete(true);
                    }}
                    onFocus={() => setShowAutocomplete(true)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                    autoComplete="off"
                    required
                  />

                  {formData.favorecido.length > 0 && showAutocomplete && (
                    <ul className="autocomplete-list">
                      {produtores
                        .filter((p) =>
                          p.nome
                            .toLowerCase()
                            .includes(formData.favorecido.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((p) => (
                          <li
                            key={p.id}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                favorecido: p.nome,
                                produtorUid: p.id,
                              });
                              setShowAutocomplete(false);
                            }}
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
                  <label>Prêmio Líquido</label>
                  <input
                    type="number"
                    value={formData.premioLiquido || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        premioLiquido: parseFloat(e.target.value) || 0,
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

                <div className="form-group">
                  <label>Data de Pagamento</label>
                  <input
                    type="date"
                    value={formData.dtPagamento || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dtPagamento: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
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

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-content--small">
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir a comissão nº{" "}
              <strong>{milhagemToDelete?.numeroMilhagem}</strong>?
            </p>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setMilhagemToDelete(null);
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
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