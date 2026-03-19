import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaFileInvoiceDollar } from "react-icons/fa";
// import { useMilhagemDetalhes } from "@/features/milhagens/hooks/useMilhagemDetalhes";
// import SeguradosTable from "@/features/segurados/components/SeguradosTable"
import {
  updateMilhagem,
  deleteMilhagem,
} from "../../services/comissaoService";
import { getAllProdutores } from "../../services/userService";
import "../../components/styles/MillhagemDetalhes.css";

const initialForm = {
  produtorUid: "",
  favorecido: "",
  numeroMilhagem: "",
  segurado: "",
  premioLiquido: 0,
  valor: 0,
  apolice: "",
  inicioVigencia: "",
  dtPagamento: "",
  obs: "",
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (date) => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "-"
    : new Intl.DateTimeFormat("pt-BR").format(parsedDate);
};

const toInputDate = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return parsedDate.toISOString().split("T")[0];
};

const MilhagemDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { milhagem, segurados, loading, error, refetch } = useMilhagemDetalhes(id);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [produtores, setProdutores] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const primeiroSegurado = useMemo(() => segurados?.[0] || {}, [segurados]);

  useEffect(() => {
    const loadProdutores = async () => {
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
    };

    loadProdutores();
  }, []);

  useEffect(() => {
    if (!milhagem) return;

    setFormData({
      produtorUid: milhagem.produtorUid || "",
      favorecido: milhagem.favorecido || milhagem.produtorNome || "",
      numeroMilhagem:
        milhagem.numeroMilhagem || milhagem.numero || "",
      segurado: primeiroSegurado.segurado || "",
      premioLiquido:
        primeiroSegurado.prLiqParc || milhagem.premioLiquido || 0,
      valor:
        primeiroSegurado.vlRepasse || milhagem.valor || milhagem.valorTotal || 0,
      apolice: primeiroSegurado.apolice || "",
      inicioVigencia: toInputDate(primeiroSegurado.inicioVigencia),
      dtPagamento: toInputDate(
        primeiroSegurado.dtPagamento || milhagem.dtPagamento
      ),
      obs: milhagem.obs || "",
    });
  }, [milhagem, primeiroSegurado]);

  const handleOpenEditModal = () => {
    setFormError("");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setShowAutocomplete(false);
    setFormError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      const seguradoAtualizado = {
        ...primeiroSegurado,
        segurado: formData.segurado || "",
        apolice: formData.apolice || "",
        inicioVigencia: formData.inicioVigencia || "",
        prLiqParc: parseFloat(formData.premioLiquido) || 0,
        vlRepasse: parseFloat(formData.valor) || 0,
        dtPagamento: formData.dtPagamento || "",
      };

      const payload = {
        ...milhagem,
        produtorUid: formData.produtorUid || milhagem.produtorUid || "",
        favorecido: formData.favorecido || "",
        produtorNome: formData.favorecido || "",
        numeroMilhagem: formData.numeroMilhagem || "",
        obs: formData.obs || "",
        valor: parseFloat(formData.valor) || 0,
        valorTotal: parseFloat(formData.valor) || 0,
        dtPagamento: formData.dtPagamento || "",
        segurados: [seguradoAtualizado],
      };

      await updateMilhagem(id, payload);
      await refetch();
      handleCloseEditModal();
    } catch (err) {
      setFormError("Erro ao atualizar comissão: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      setFormError("");
      await deleteMilhagem(id);
      navigate("/comissoes");
    } catch (err) {
      setFormError("Erro ao excluir comissão: " + err.message);
      setSaving(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p className="milhagem-status">Carregando comissão...</p>;
  if (error) return <p className="milhagem-status milhagem-status-error">{error}</p>;
  if (!milhagem) return <p className="milhagem-status">Comissão não encontrada.</p>;

  return (
    <div className="milhagem-detalhes-container">
      <div className="milhagem-toolbar">
        <button
          type="button"
          className="btn-action btn-outline"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Voltar</span>
        </button>

        <div className="milhagem-toolbar-actions">
          <button
            type="button"
            className="btn-action btn-edit"
            onClick={handleOpenEditModal}
          >
            <FaEdit />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className="btn-action btn-delete"
            onClick={() => setShowDeleteModal(true)}
          >
            <FaTrash />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      <header className="milhagem-detalhes-header">
        <div className="milhagem-title-group">
          <div className="milhagem-icon">
            <FaFileInvoiceDollar />
          </div>

          <div>
            <h1>
              Comissão #{milhagem.numeroMilhagem || milhagem.numero || "-"}
            </h1>
            <p className="milhagem-subtitle">
              Visualize os dados da comissão paga e os segurados vinculados.
            </p>
          </div>
        </div>
      </header>

      <section className="milhagem-info-grid">
        <div className="info-card">
          <span className="info-label">Favorecido</span>
          <strong>{milhagem.favorecido || milhagem.produtorNome || "-"}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Segurado principal</span>
          <strong>{primeiroSegurado.segurado || "-"}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Valor da comissão</span>
          <strong>
            {formatCurrency(
              primeiroSegurado.vlRepasse || milhagem.valor || milhagem.valorTotal
            )}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Prêmio líquido</span>
          <strong>
            {formatCurrency(primeiroSegurado.prLiqParc || milhagem.premioLiquido)}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Data de pagamento</span>
          <strong>
            {formatDate(primeiroSegurado.dtPagamento || milhagem.dtPagamento)}
          </strong>
        </div>

        <div className="info-card">
          <span className="info-label">Apólice</span>
          <strong>{primeiroSegurado.apolice || "-"}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Início vigência</span>
          <strong>{formatDate(primeiroSegurado.inicioVigencia)}</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Qtd. de segurados</span>
          <strong>{segurados?.length || 0}</strong>
        </div>
      </section>

      <section className="milhagem-obs-card">
        <span className="info-label">Observações</span>
        <p>{milhagem.obs || "Nenhuma observação cadastrada."}</p>
      </section>

      <section className="milhagem-segurados-section">
        <div className="section-top">
          <h2>Segurados vinculados</h2>
        </div>

        <SeguradosTable
          segurados={segurados}
          onEdit={(segurado) => {
            console.log("Editar segurado:", segurado);
          }}
          onDelete={(segurado) => {
            console.log("Excluir segurado:", segurado);
          }}
        />
      </section>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <h2>Editar Comissão</h2>

            {formError && <div className="alert-error">{formError}</div>}

            <form onSubmit={handleSaveEdit} className="form-milhagem">
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
                  <label>Segurado</label>
                  <input
                    type="text"
                    value={formData.segurado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        segurado: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Prêmio Líquido</label>
                  <input
                    type="number"
                    value={formData.premioLiquido}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        premioLiquido: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valor: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apólice</label>
                  <input
                    type="text"
                    value={formData.apolice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        apolice: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Início Vigência</label>
                  <input
                    type="date"
                    value={formData.inicioVigencia}
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
                    value={formData.dtPagamento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dtPagamento: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group form-group-full">
                  <label>Observações</label>
                  <textarea
                    value={formData.obs}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        obs: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseEditModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar exclusão</h3>
            {formError && <div className="alert-error">{formError}</div>}

            <p>
              Tem certeza que deseja excluir a comissão nº{" "}
              <strong>{milhagem.numeroMilhagem || milhagem.numero || "-"}</strong>?
            </p>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Excluindo..." : "Confirmar exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilhagemDetalhes;