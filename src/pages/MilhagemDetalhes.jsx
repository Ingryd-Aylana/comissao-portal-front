import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeguradosByMilhagem,
  createSegurado,
  updateSegurado,
  deleteSegurado,
} from "../services/seguradoService";
import { getMilhagemById } from "../services/userService"; // ✅ Corrigido aqui

const MilhagemDetalhes = () => {
  const { id: milhagemId } = useParams();
  const navigate = useNavigate();
  const [milhagemData, setMilhagemData] = useState(null); // ⬅ Dados da milhagem
  const [segurados, setSegurados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSegurado, setSelectedSegurado] = useState(null);

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

  const loadDados = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const milhagem = await getMilhagemById(milhagemId);
      const seguradosData = await getSeguradosByMilhagem(milhagemId);
      setMilhagemData(milhagem); // ⬅ atualiza milhagem
      setSegurados(seguradosData);
    } catch (err) {
      setError("Erro ao carregar dados: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [milhagemId]);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
      await loadDados();
    } catch (err) {
      setError("Erro ao criar segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (seguradoId, newData) => {
    try {
      setIsLoading(true);
      await updateSegurado(milhagemId, seguradoId, newData);
      await loadDados();
      setShowModal(false);
      setSelectedSegurado(null);
    } catch (err) {
      setError("Erro ao atualizar segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (seguradoId) => {
    if (window.confirm("Deseja realmente excluir este segurado?")) {
      try {
        setIsLoading(true);
        await deleteSegurado(milhagemId, seguradoId);
        await loadDados();
      } catch (err) {
        setError("Erro ao deletar segurado: " + err.message);
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

  const formatDate = (date) =>
    date ? new Intl.DateTimeFormat("pt-BR").format(date) : "";

  if (isLoading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate("/master/dashboardMaster")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Voltar
          </button>
          <h1 className="text-2xl font-bold inline-block">
            Detalhes da Milhagem
          </h1>
          {milhagemData && (
            <div className="text-gray-600 mt-1 text-sm">
              Referência: <strong>{milhagemData.referencia}</strong> | Mês:{" "}
              <strong>{milhagemData.mes}</strong>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Novo Segurado
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-4 py-2">Segurado</th>
              <th className="px-4 py-2">Nosso Número</th>
              <th className="px-4 py-2">Data Proposta</th>
              <th className="px-4 py-2">Seguradora</th>
              <th className="px-4 py-2">Ramo</th>
              <th className="px-4 py-2 text-right">Valor Base</th>
              <th className="px-4 py-2 text-right">Valor Repasse</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Ações</th>
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
                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center gap-2">
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

      {/* Modal omitido para foco — segue igual ao seu anterior */}
    </div>
  );
};

export default MilhagemDetalhes;
