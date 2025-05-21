import React from 'react';
import BannerCard from '../../components/BannerCard';
import useProducerData from '../../hooks/UseProducerData';
import { BarChart2, Users, DollarSign } from 'lucide-react';
import "../../components/styles/Dashboard.css"
import Footer from '../../components/Footer';

export default function Dashboard() {
  const {
    totalSales,
    totalCommission,
    recentCommissions,
  } = useProducerData();

  const isLoading = totalSales === 0 && totalCommission === 0 && recentCommissions.length === 0;

  if (isLoading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando dados...</p>;
  }

  return (
    <>
      <BannerCard />

      <main className="dashboard-container">
        <h1 className="dashboard-title">Painel do Produtor</h1>

        {/* Resumo de Vendas */}
        <div className="card-grid">
          <div className="card">
            <BarChart2 size={24} />
            <span className="label"><strong>TOTAL DE VENDAS</strong></span>
            <span className="value">{totalSales}</span>
          </div>
          <div className="card">
          <DollarSign size={24} />
            <span className="label"><strong>MILHAGEM TOTAL</strong></span>
            <span className="value">R$ {totalCommission}</span>
          </div>
          <div className="card">
              <Users size={24} />
            <span className="label"><strong>ÚLTIMAS MILHAGENS</strong></span>
            <span className="value">{recentCommissions.length}</span>
          </div>
        </div>

        {/* Tabela de Últimas Comissões */}
        <section className="dashboard-tables">
          <h2>Últimos Lançamentos</h2>
          <table>
            <thead>
              <tr>
                <th>SEGURADO</th>
                <th>APÓLICE</th>
                <th>INÍCIO VIG</th>
                <th>PRÊMIO LIQ.</th>
                <th>MILHAGEM</th>
              </tr>
            </thead>
            <tbody>
              {recentCommissions.map((item, index) => (
                <tr key={index}>
                  <td>{item.policyHolder}</td>
                  <td>{item.policyNumber}</td>
                  <td>{item.startDate}</td>
                  <td>R$ {item.netPremium.toFixed(2)}</td>
                  <td>R$ {item.commission.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Dados do Produtor */}
        <div className="card-grid-produtor">
          <div className="card-produtor">
            <span className="label"><strong>PRODUTOR</strong></span>
          </div>
          <div className="card-produtor">
            <span className="label"><strong>DADOS DE PAGAMENTO</strong></span>
          </div>
          <div className="card-produtor">
            <span className="label"><strong>CONTATO:</strong></span>
          </div>
          <div className="card-produtor">
            <span className="label"><strong>E-MAIL:</strong></span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
