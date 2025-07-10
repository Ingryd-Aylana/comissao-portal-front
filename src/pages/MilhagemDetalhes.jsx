import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeguradosByMilhagem,
  createSegurado,
  updateSegurado,
  deleteSegurado,
} from "../services/seguradoService";
import { getMilhagemById } from "../services/comissaoService";
import "../components/styles/MilhagemDetalhes.css";

const MilhagemDetalhes = () => {
  const { id: milhagemId } = useParams();
  const navigate = useNavigate();

  const [milhagem, setMilhagem] = useState(null);
  const [segurados, setSegurados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (milhagemId) {
      loadDados();
    }
  }, [loadDados]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0);
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "";

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="milhagem-detalhes-container">
      <div className="header">
        <div className="info-box">
          <div className="btn-container">
            <button onClick={() => navigate(-1)} className="btn-geral">Voltar</button>
          </div>

          <h1 className="titulo">Detalhes da Milhagem</h1>

          {milhagem ? (
            <div className="milhagem-info">
              <p><strong>Segurado:</strong> {segurados[0]?.segurado || "—"}</p>
              <p><strong>Nº Milhagem:</strong> {milhagem.numeroMilhagem}</p>
              <p><strong>Valor:</strong> {formatCurrency(milhagem.valorComissao)}</p>


            </div>

          ) : (
            <p>Nenhum dado encontrado para esta milhagem.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilhagemDetalhes;
