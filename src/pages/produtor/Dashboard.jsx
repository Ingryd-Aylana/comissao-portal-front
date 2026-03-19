import React, { useMemo, useState } from "react";
import {
  BarChart2,
  DollarSign,
  Users,
  Building2,
  Phone,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
  Inbox
} from "lucide-react";
import useProducerData from "../../hooks/UseProducerData";
import "../../components/styles/Dashboard.css";

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));
  };

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return recentCommissions.slice(indexOfFirstItem, indexOfLastItem);
  }, [recentCommissions, currentPage]);

  const totalPages = Math.max(1, Math.ceil(recentCommissions.length / itemsPerPage));

  const infoCards = [
    {
      label: "Produtor",
      value: producerInfo.nome_produtor || "-",
      icon: <Building2 size={18} />,
      accentClass: "accent-navy",
    },
    {
      label: "Administradora",
      value: producerInfo.nomeAdministradora || "-",
      icon: <FileText size={18} />,
      accentClass: "accent-blue",
    },
    {
      label: "Contato",
      value: producerInfo.telefone || producerInfo.celular || "-",
      icon: <Phone size={18} />,
      accentClass: "accent-green",
    },
    {
      label: "E-mail",
      value: producerInfo.email || "-",
      icon: <Mail size={18} />,
      accentClass: "accent-gold",
    },
  ];

  const kpis = [
    {
      label: "Total de Vendas",
      value: formatCurrency(totalSales),
      icon: <BarChart2 size={22} />,
      helper: "Prêmio líquido acumulado",
      accentClass: "accent-blue",
    },
    {
      label: "Milhagem Total",
      value: formatCurrency(totalCommission),
      icon: <DollarSign size={22} />,
      helper: "Total de comissões",
      accentClass: "accent-gold",
    },
    {
      label: "Últimas Milhagens",
      value: totalSegurados,
      icon: <Users size={22} />,
      helper: "Segurados vinculados",
      accentClass: "accent-green",
    },

  ];

  if (loading) {
    return (
      <div className="dashboard-feedback">
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-feedback dashboard-feedback-error">
        <p>Erro ao carregar dados: {error}</p>
      </div>
    );
  }

  return (
    <>


      <main className="dashboard-modern">
        <section className="dashboard-hero">
          <div className="dashboard-hero-lines" />
          <div className="dashboard-hero-glow glow-1" />
          <div className="dashboard-hero-glow glow-2" />

          <div className="dashboard-hero-content">
            <span className="dashboard-hero-tag">Bem-vindo de volta</span>
            <h1 className="dashboard-hero-title">
              Olá, <span>{producerInfo.nome_produtor || "Produtor"}</span>!
            </h1>
            <p className="dashboard-hero-description">
              Veja o resumo da sua performance, seus lançamentos recentes e os principais dados do seu cadastro.
            </p>
          </div>
        </section>

        <section className="dashboard-kpi-grid">
          {kpis.map((item) => (
            <article key={item.label} className={`dashboard-kpi-card ${item.accentClass}`}>
              <div className="dashboard-kpi-top">
                <div className="dashboard-kpi-icon">{item.icon}</div>
                <span className="dashboard-kpi-label">{item.label}</span>
              </div>
              <strong className="dashboard-kpi-value">{item.value}</strong>
              <span className="dashboard-kpi-helper">{item.helper}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-head">
            <div>
              <h2>Últimos Lançamentos</h2>
              <p>Suas comissões mais recentes</p>
            </div>
          </div>

          {recentCommissions.length > 0 ? (
            <>
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Segurado</th>
                      <th>Apólice</th>
                      <th>Prêmio Líq.</th>
                      <th>Milhagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={`${item.policyNumber || "item"}-${index}`}>
                        <td>{item.policyHolder || "-"}</td>
                        <td>{item.policyNumber || "-"}</td>
                        <td>{formatCurrency(item.netPremium)}</td>
                        <td>{formatCurrency(item.commission)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="dashboard-pagination">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <span>
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">
                <Inbox size={38} strokeWidth={1.8} />
              </div>
              <h3>Nenhuma milhagem encontrada</h3>
              <p>
                Quando houver vendas efetivadas, suas milhagens aparecerão aqui.
              </p>
            </div>
          )}
        </section>


      </main>


    </>
  );
}