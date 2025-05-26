import { useState, useEffect } from 'react';

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
            policyHolder: 'João Barros',
            policyNumber: 'AP123456',
            startDate: '2025-05-01',
            netPremium: 1200.00,
            commission: 180.00,
          },
          {
            policyHolder: 'Maria Oliveira',
            policyNumber: 'AP789012',
            startDate: '2025-04-25',
            netPremium: 980.00,
            commission: 147.00,
          },
          {
            policyHolder: 'Carlos Pereira',
            policyNumber: 'AP345678',
            startDate: '2025-04-15',
            netPremium: 1500.00,
            commission: 225.00,
          },
        ],
        producerInfo: {
          nome_produtor: 'João Santos',
          email: 'joao@email.com',
          telefone: '(11) 98765-4321',
          dadosPagamento: 'Cartão Alelo',
        }
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
