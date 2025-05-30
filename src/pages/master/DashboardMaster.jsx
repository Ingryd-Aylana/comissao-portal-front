import React, { useState, useEffect } from "react";
import { BarChart2, Users, DollarSign } from "lucide-react";
import "../../components/styles/DashboardMaster.css";
import { getUserStats } from "../../services/userService";
import { useAdminProtection } from "../../hooks/useAdminProtection";

export default function DashboardMaster() {
  const { loading: authLoading, error: authError } = useAdminProtection();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSegurados: 0,
    totalMilhagem: 0,
    produtoresAtivos: 0,
    rankingProdutores: [],
  });

  useEffect(() => {
    if (!authLoading && !authError) {
      loadStats();
    }
  }, [authLoading, authError]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getUserStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
      setError("Erro ao carregar dados. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="error-container">
        <p>{authError}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="master-dashboard-container">
      <div className="logo-perfil">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="logo-img perfil-logo"
        />
      </div>
      <h1 className="master-dashboard-title">Painel do Administrador</h1>

      {/* Cards Resumo */}
      <div className="master-card-grid">
        {/* Resumo de Vendas */}
        <div className="master-card">
          <BarChart2 size={24} />
          <span className="label">
            <strong>TOTAL DE SEGURADOS</strong>
          </span>
          <span className="value">{stats.totalSegurados}</span>
        </div>
        {/* Resumo de Comissão */}
        <div className="master-card">
          <DollarSign size={24} />
          <span className="label">
            <strong>MILHAGEM TOTAL</strong>
          </span>
          <span className="value">{formatCurrency(stats.totalMilhagem)}</span>
        </div>
        {/* Resumo de Produtores */}
        <div className="master-card">
          <Users size={24} />
          <span className="label">
            <strong>PRODUTORES ATIVOS</strong>
          </span>
          <span className="value">{stats.produtoresAtivos}</span>
        </div>
      </div>

      {/* Tabela de Ranking */}
      <section className="master-dashboard-table-section">
        <div className="dashboard-table-header">
          <h2>Ranking de Produtores</h2>
        </div>

        {stats.rankingProdutores.length > 0 ? (
          <table className="master-dashboard-table">
            <thead>
              <tr>
                <th>PRODUTOR</th>
                <th>E-MAIL</th>
                <th>MILHAGEM TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {stats.rankingProdutores.map((produtor, index) => (
                <tr key={produtor.id}>
                  <td>{produtor.nome}</td>
                  <td>{produtor.email}</td>
                  <td>{formatCurrency(produtor.totalMilhagem)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">Nenhum produtor encontrado.</p>
        )}
      </section>
    </main>
  );
}
