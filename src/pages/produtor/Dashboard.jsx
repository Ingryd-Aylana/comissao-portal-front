import React from "react";
import BannerCard from "../../components/BannerCard";
import useProducerData from "../../hooks/UseProducerData";
import { BarChart2, Users, DollarSign } from "lucide-react";
import "../../components/styles/Dashboard.css";
import Footer from "../../components/Footer";

export default function Dashboard() {
  const {
    producerInfo,
    totalSales,
    totalCommission,
    recentCommissions,
    totalSegurados,
    loading,
    error,
  } = useProducerData();

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  return (
    <>
      <BannerCard />

      <main className="dashboard-container">
        <h1 className="dashboard-title">Painel do Produtor</h1>
        {/* Nome do produtor */}
        <h3 className="dashboard-title">
          Olá, {producerInfo.nome_produtor || "Produtor"}!
        </h3>

        {/* Resumo de Vendas */}
        <div className="card-grid">
          <div className="card">
            <BarChart2 size={24} />
            <span className="label">
              <strong>TOTAL DE VENDAS</strong>
            </span>
            <span className="value">{formatCurrency(totalSales)}</span>
          </div>
          <div className="card">
            <DollarSign size={24} />
            <span className="label">
              <strong>MILHAGEM TOTAL</strong>
            </span>
            <span className="value">{formatCurrency(totalCommission)}</span>
          </div>
          <div className="card">
            <Users size={24} />
            <span className="label">
              <strong>ÚLTIMAS MILHAGENS</strong>
            </span>
            <span className="value">{totalSegurados}</span>
          </div>
        </div>

        {/* Tabela de Últimas Comissões */}
        <section className="dashboard-tables">
          <h2>Últimos Lançamentos</h2>
          {recentCommissions.length > 0 ? (
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
                    <td>{item.policyHolder || "-"}</td>
                    <td>{item.policyNumber || "-"}</td>
                    <td>{item.startDate || "-"}</td>
                    <td>{formatCurrency(item.netPremium)}</td>
                    <td>{formatCurrency(item.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">Nenhuma milhagem encontrada.</p>
          )}
        </section>

        {/* Dados do Produtor */}
        <div className="card-grid-produtor">
          <div className="card-produtor">
            <span className="label">
              <strong>PRODUTOR</strong>
            </span>
            <br />
            <span className="value">{producerInfo.nome_produtor || "-"}</span>
          </div>
          <div className="card-produtor">
            <span className="label">
              <strong>ADMINISTRADORA</strong>
            </span>
            <br />
            <span className="value">
              {producerInfo.nomeAdministradora || "-"}
            </span>
          </div>
          <div className="card-produtor">
            <span className="label">
              <strong>CONTATO</strong>
            </span>
            <br />
            <span className="value">
              {producerInfo.telefone || producerInfo.celular || "-"}
            </span>
          </div>
          <div className="card-produtor">
            <span className="label">
              <strong>E-MAIL</strong>
            </span>
            <br />
            <span className="value">{producerInfo.email || "-"}</span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
