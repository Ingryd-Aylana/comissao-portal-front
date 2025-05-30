import { useState, useEffect } from "react";
import {
  getMilhagensDoUsuarioLogado,
  getCurrentUserFirestoreData,
} from "../services/comissaoService";

export default function useProducerData() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [recentCommissions, setRecentCommissions] = useState([]);
  const [producerInfo, setProducerInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados do usuário
        const userData = await getCurrentUserFirestoreData();
        setProducerInfo({
          nome_produtor: userData.nome,
          email: userData.email,
          telefone: userData.telefone,
          celular: userData.celular,
          endereco: userData.endereco,
          nomeAdministradora: userData.nomeAdministradora,
        });

        // Buscar milhagens do usuário
        const milhagens = await getMilhagensDoUsuarioLogado();

        // Calcular totais
        let totalPremioLiquido = 0;
        let totalComissao = 0;

        milhagens.forEach((milhagem) => {
          totalPremioLiquido += milhagem.premioLiquido || 0;
          totalComissao += milhagem.valorComissao || 0;
        });

        setTotalSales(totalPremioLiquido);
        setTotalCommission(totalComissao);

        // Pegar as 3 comissões mais recentes
        const recentMilhagens = milhagens
          .sort((a, b) => b.dataCriacao - a.dataCriacao)
          .slice(0, 3)
          .map((milhagem) => ({
            policyHolder: milhagem.favorecido,
            policyNumber: milhagem.numeroMilhagem,
            startDate: milhagem.dataCriacao
              ? new Date(milhagem.dataCriacao).toLocaleDateString("pt-BR")
              : "",
            netPremium: milhagem.premioLiquido || 0,
            commission: milhagem.valorComissao || 0,
          }));

        setRecentCommissions(recentMilhagens);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao carregar dados:", err);

        // Resetar estados em caso de erro
        setTotalSales(0);
        setTotalCommission(0);
        setRecentCommissions([]);
        setProducerInfo({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    totalSales,
    totalCommission,
    recentCommissions,
    producerInfo,
    loading,
    error,
  };
}
