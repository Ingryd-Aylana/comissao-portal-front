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
  const [totalSegurados, setTotalSegurados] = useState(0);

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
        let totalSegurados = 0;

        milhagens.forEach((milhagem) => {
          totalPremioLiquido += milhagem.premioLiquido || 0;
          totalComissao += milhagem.valorComissao || 0;
          // Adicionar quantidade de segurados da sub-coleção
          totalSegurados += milhagem.segurados?.length || 0;
        });

        setTotalSales(totalPremioLiquido);
        setTotalCommission(totalComissao);
        setTotalSegurados(totalSegurados);

        // Pegar os 3 segurados mais recentes de todas as milhagens
        const allSegurados = milhagens.flatMap((milhagem) =>
          (milhagem.segurados || []).map((segurado) => ({
            ...segurado,
            milhagemId: milhagem.id,
            dataCriacao: milhagem.dataCriacao,
          }))
        );

        const recentSegurados = allSegurados
          .sort((a, b) => b.dataCriacao - a.dataCriacao)
          .slice(0, 3)
          .map((segurado) => ({
            policyHolder: segurado.segurado,
            policyNumber: segurado.apolice,
            startDate:
              segurado.inicioVig && segurado.inicioVig.toDate
                ? segurado.inicioVig.toDate().toLocaleDateString("pt-BR")
                : segurado.inicioVig instanceof Date
                ? segurado.inicioVig.toLocaleDateString("pt-BR")
                : "-",
            netPremium: segurado.prLiqParc || 0,
            commission: segurado.vlRepasse || 0,
          }));

        setRecentCommissions(recentSegurados);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao carregar dados:", err);

        // Resetar estados em caso de erro
        setTotalSales(0);
        setTotalCommission(0);
        setRecentCommissions([]);
        setProducerInfo({});
        setTotalSegurados(0);
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
    totalSegurados,
  };
}
