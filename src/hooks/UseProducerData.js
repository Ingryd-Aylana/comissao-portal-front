import { useState, useEffect } from "react";

export default function useProducerData() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [recentCommissions, setRecentCommissions] = useState([]);
  const [producerInfo, setProducerInfo] = useState({});

  useEffect(() => {
    // Simulação de dados mockados para teste em tela
    const fetchData = async () => {
      const mockData = {
        totalSales: 12500,
        totalCommission: 1750,
        recentCommissions: [
          {
            policyHolder: "Cond Barros",
            policyNumber: "AP123456",
            startDate: "01-05-2025",
            netPremium: 1200.0,
            commission: 180.0,
          },
          {
            policyHolder: "Cond Jardim de Oliveira",
            policyNumber: "AP789012",
            startDate: "15-05-2025",
            netPremium: 980.0,
            commission: 147.0,
          },
          {
            policyHolder: "Cond Flor",
            policyNumber: "AP345678",
            startDate: "20-05-2025",
            netPremium: 1500.0,
            commission: 225.0,
          },
        ],
        producerInfo: {
          nome_produtor: "Daniel Santos",
          email: "joao@email.com",
          telefone: "(11) 98765-4321",
          dadosPagamento: "Cartão Alelo",
        },
      };

      setTotalSales(mockData.totalSales);
      setTotalCommission(mockData.totalCommission);
      setRecentCommissions(mockData.recentCommissions);
      setProducerInfo(mockData.producerInfo);
    };

    fetchData();
  }, []);

  return {
    totalSales,
    totalCommission,
    recentCommissions,
    producerInfo,
  };
}
