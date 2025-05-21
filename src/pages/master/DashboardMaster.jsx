import React, { useState } from 'react';
import { BarChart2, Users, DollarSign } from 'lucide-react';
import "../../components/styles/DashboardMaster.css"

export default function DashboardMaster() {
  // Estado para controlar o filtro de mês
  const [selectedMonth, setSelectedMonth] = useState("Maio/2025");

  // Dados mockados para exibição no dashboard
  const totalComissao = "R$ 8.320,00";
  const totalProdutores = 12;
  const totalVendas = 342;

  // Dados de ranking fictícios
  const rankingMock = [
    { nome: "João Silva", comissao: "R$ 2.100,00", vendas: 40 },
    { nome: "Maria Santos", comissao: "R$ 1.880,00", vendas: 38 },
    { nome: "Carlos Lima", comissao: "R$ 1.560,00", vendas: 32 },
  ];

  return (
    <main className="master-dashboard-container">
      <div className='logo-perfil'>
        <img src="/images/logo.png" alt="Logo" className="logo-img perfil-logo" />
      </div>
      <h1 className="master-dashboard-title">Painel do Administrador</h1>

      {/* Cards Resumo */}
      <div className="master-card-grid">
         {/* Resumo de Vendas */}
        <div className="master-card">
          <BarChart2 size={24} />
          <span className="label"><strong>TOTAL DE VENDAS</strong></span>
          <span className="value">{totalVendas}</span>
        </div>
         {/* Resumo de Comissão */}
        <div className="master-card">
          <DollarSign size={24} />
          <span className="label"><strong>MILHAGEM TOTAL</strong></span>
          <span className="value">{totalComissao}</span>
        </div>
         {/* Resumo de Produtores */}
        <div className="master-card">
          <Users size={24} />
          <span className="label"><strong>PRODUTORES ATIVOS</strong></span>
          <span className="value">{totalProdutores}</span>
        </div>
      </div>

      {/* Tabela de Ranking com Filtro */}
      <section className="master-dashboard-table-section">
        {/* Cabeçalho da tabela com filtro de mês */}
        <div className="dashboard-table-header">
          <h2>Ranking de Produtores</h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="select-month"
          >
            <option>Maio/2025</option>
            <option>Abril/2025</option>
            <option>Março/2025</option>
          </select>
        </div>

        {/* Estrutura da tabela */}
        <table className="master-dashboard-table">
          <thead>
            <tr>
              <th>PRODUTOR</th>
              <th>MILHAGEM</th>
              <th>VENDAS</th>
            </tr>
          </thead>
          <tbody>
            {rankingMock.map((produtor, index) => (
              <tr key={index}>
                <td>{produtor.nome}</td>
                <td>{produtor.comissao}</td>
                <td>{produtor.vendas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
