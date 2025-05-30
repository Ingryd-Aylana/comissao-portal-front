import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeguradosByMilhagem,
  createSegurado,
  updateSegurado,
  deleteSegurado,
} from "../services/seguradoService";

const MilhagemDetalhes = () => {
  const { id: milhagemId } = useParams();
  const navigate = useNavigate();
  const [segurados, setSegurados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSegurado, setSelectedSegurado] = useState(null);

  // Estado para o formulário de novo segurado
  const [formData, setFormData] = useState({
    segurado: "",
    nossoNumero: "",
    dtProposta: "",
    seguradora: "",
    ramo: "",
    apolice: "",
    endosso: "",
    statusDoc: "",
    tipo: "",
    inicioVig: "",
    fimVig: "",
    parc: "",
    prLiqParc: 0,
    dtPrev: "",
    percentParticipacao: 0,
    baseRepasse: "",
    vlBase: 0,
    percentRepasse: 0,
    vlRepasse: 0,
    obsSegurado: "",
    canceladoSegurado: false,
  });

  // Carregar segurados
  const loadSegurados = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSeguradosByMilhagem(milhagemId);
      setSegurados(data);
    } catch (err) {
      setError("Erro ao carregar segurados: " + err.message);
      console.error("Erro:", err);
    } finally {
      setIsLoading(false);
    }
  }, [milhagemId]);

  useEffect(() => {
    loadSegurados();
  }, [loadSegurados]);

  // Handlers para o CRUD
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await createSegurado(milhagemId, formData);
      setShowModal(false);
      setFormData({
        segurado: "",
        nossoNumero: "",
        dtProposta: "",
        seguradora: "",
        ramo: "",
        apolice: "",
        endosso: "",
        statusDoc: "",
        tipo: "",
        inicioVig: "",
        fimVig: "",
        parc: "",
        prLiqParc: 0,
        dtPrev: "",
        percentParticipacao: 0,
        baseRepasse: "",
        vlBase: 0,
        percentRepasse: 0,
        vlRepasse: 0,
        obsSegurado: "",
        canceladoSegurado: false,
      });
      await loadSegurados();
    } catch (err) {
      setError("Erro ao criar segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (seguradoId, newData) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateSegurado(milhagemId, seguradoId, newData);
      await loadSegurados();
      setShowModal(false);
      setSelectedSegurado(null);
    } catch (err) {
      setError("Erro ao atualizar segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (seguradoId) => {
    if (window.confirm("Tem certeza que deseja excluir este segurado?")) {
      try {
        setIsLoading(true);
        setError(null);
        await deleteSegurado(milhagemId, seguradoId);
        await loadSegurados();
      } catch (err) {
        setError("Erro ao deletar segurado: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold inline-block">
            Detalhes da Milhagem
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Novo Segurado
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Segurado</th>
              <th className="px-4 py-2 border">Nosso Número</th>
              <th className="px-4 py-2 border">Data Proposta</th>
              <th className="px-4 py-2 border">Seguradora</th>
              <th className="px-4 py-2 border">Ramo</th>
              <th className="px-4 py-2 border">Valor Base</th>
              <th className="px-4 py-2 border">Valor Repasse</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {segurados.map((segurado) => (
              <tr
                key={segurado.id}
                className={segurado.canceladoSegurado ? "bg-red-100" : ""}
              >
                <td className="px-4 py-2 border">{segurado.segurado}</td>
                <td className="px-4 py-2 border">{segurado.nossoNumero}</td>
                <td className="px-4 py-2 border">
                  {formatDate(segurado.dtProposta)}
                </td>
                <td className="px-4 py-2 border">{segurado.seguradora}</td>
                <td className="px-4 py-2 border">{segurado.ramo}</td>
                <td className="px-4 py-2 border text-right">
                  {formatCurrency(segurado.vlBase)}
                </td>
                <td className="px-4 py-2 border text-right">
                  {formatCurrency(segurado.vlRepasse)}
                </td>
                <td className="px-4 py-2 border">{segurado.statusDoc}</td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setSelectedSegurado(segurado);
                        setFormData(segurado);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(segurado.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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

      {/* Modal para criar/editar segurado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedSegurado ? "Editar Segurado" : "Novo Segurado"}
            </h2>
            <form
              onSubmit={
                selectedSegurado
                  ? (e) => {
                      e.preventDefault();
                      handleUpdate(selectedSegurado.id, formData);
                    }
                  : handleCreate
              }
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Nome do Segurado</label>
                  <input
                    type="text"
                    value={formData.segurado}
                    onChange={(e) =>
                      setFormData({ ...formData, segurado: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Nosso Número</label>
                  <input
                    type="text"
                    value={formData.nossoNumero}
                    onChange={(e) =>
                      setFormData({ ...formData, nossoNumero: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Data da Proposta</label>
                  <input
                    type="date"
                    value={
                      formData.dtProposta
                        ? new Date(formData.dtProposta)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, dtProposta: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                {/* Adicione mais campos conforme necessário */}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSegurado(null);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {selectedSegurado ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilhagemDetalhes;
