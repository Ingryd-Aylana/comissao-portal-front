import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeguradosByMilhagem,
  createSegurado,
  updateSegurado,
  deleteSegurado,
} from "../services/seguradoService";
import { getMilhagemById } from "../services/userService";
import "../components/styles/MilhagemDetalhes.css";

const MilhagemDetalhes = () => {
  const { id: milhagemId } = useParams();
  const navigate = useNavigate();

  const [milhagem, setMilhagem] = useState(null);
  const [segurados, setSegurados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSegurado, setSelectedSegurado] = useState(null);

  const initialForm = {
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
  };

  const [formData, setFormData] = useState(initialForm);

  const loadDados = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const milhagemData = await getMilhagemById(milhagemId);
      setMilhagem(milhagemData);

      const seguradosData = await getSeguradosByMilhagem(milhagemId);
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
      setFormData(initialForm);
      await loadDados();
    } catch (err) {
      setError("Erro ao criar segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, newData) => {
    try {
      setIsLoading(true);
      await updateSegurado(milhagemId, id, newData);
      setShowModal(false);
      setSelectedSegurado(null);
      await loadDados();
    } catch (err) {
      setError("Erro ao atualizar segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este segurado?")) return;
    try {
      setIsLoading(true);
      await deleteSegurado(milhagemId, id);
      await loadDados();
    } catch (err) {
      setError("Erro ao excluir segurado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("pt-BR") : "";

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="milhagem-detalhes-container">
      <div className="header">
        <div className="info-box">
          <div className="btn-container">
          <button onClick={() => navigate(-1)} className="btn-geral">Voltar</button>
          </div>
          <h1 className="titulo">Detalhes da Milhagem</h1>
          {milhagem && (
            <div className="milhagem-info">
              <p><strong>Favorecido:</strong> {milhagem.favorecido}</p>
              <p><strong>Segurado:</strong> {milhagem.segurado}</p>
              <p><strong>Nº Milhagem:</strong> {milhagem.numeroMilhagem}</p>
              <p><strong>Valor:</strong> {formatCurrency(milhagem.valor)}</p>
              <p><strong>Data de Pagamento:</strong> {formatDate(milhagem.dtPagamento)}</p>
            </div>
          )}
        </div>
       
      </div>
    </div>
  );
};

export default MilhagemDetalhes;
