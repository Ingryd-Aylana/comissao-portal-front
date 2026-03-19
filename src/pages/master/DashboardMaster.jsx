import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  Users,
  DollarSign,
  Download,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import "../../components/styles/DashboardMaster.css";
import { getUserStats } from "../../services/userService";
import { auth, db } from "../../config/firebase";

export default function DashboardMaster() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [stats, setStats] = useState({
    totalSegurados: 0,
    totalMilhagem: 0,
    produtoresAtivos: 0,
    rankingProdutores: [],
  });

  useEffect(() => {
    const verificarAdminECarregar = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setAuthError("Usuário não autenticado.");
          navigate("/login");
          return;
        }

        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          setAuthError("Dados do usuário não encontrados.");
          navigate("/login");
          return;
        }

        const userData = userDocSnap.data();

        if (userData.tipoUsuario !== "admin") {
          setAuthError("Acesso negado. Esta área é restrita a administradores.");
          navigate("/app/dashboard");
          return;
        }

        const data = await getUserStats();
        setStats(data);
      } catch (err) {
        console.error("Erro de autenticação ou carregamento:", err);
        setAuthError("Erro ao verificar permissões.");
      } finally {
        setLoading(false);
      }
    };

    verificarAdminECarregar();
  }, [navigate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));
  };

 const rankingOrdenado = useMemo(() => {
  return [...(stats.rankingProdutores || [])]
    .sort(
      (a, b) =>
        Number(b.milhagem || b.totalMilhagem || 0) -
        Number(a.milhagem || a.totalMilhagem || 0)
    )
    .slice(0, 3);
}, [stats.rankingProdutores]);

  const produtoresCompletude = useMemo(() => {
    return rankingOrdenado.slice(0, 5).map((produtor, index) => {
      const valoresFixos = [94, 87, 72, 61, 55];
      return {
        nome:
          produtor.nome ||
          produtor.name ||
          produtor.nomeCompleto ||
          "Produtor sem nome",
        pct: valoresFixos[index] || 50,
      };
    });
  }, [rankingOrdenado]);

  const handleExport = () => {
    const header = ["Posição", "Nome", "Email", "Milhagem"];
    const rows = rankingOrdenado.map((item, index) => [
      index + 1,
      item.nome || item.name || item.nomeCompleto || "Sem nome",
      item.email || "Sem e-mail",
      Number(item.milhagem || item.totalMilhagem || 0),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(";"))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ranking_produtores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPosClass = (index) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "bronze";
    return "other";
  };

  const getProgressClass = (pct) => {
    if (pct >= 85) return "is-green";
    if (pct >= 70) return "is-yellow";
    return "is-red";
  };

  if (loading) {
    return (
      <section className="admin-dashboard">
        <div className="admin-dashboard__feedback">
          <p>Carregando dados do dashboard...</p>
        </div>
      </section>
    );
  }

  if (authError) {
    return (
      <section className="admin-dashboard">
        <div className="admin-dashboard__feedback admin-dashboard__feedback--error">
          <p>{authError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h2 className="admin-dashboard__title">Painel do Administrador</h2>
          <p className="admin-dashboard__subtitle">
            Visão geral da operação e ranking de produtores.
          </p>
        </div>
      </header>

      <section className="admin-dashboard__stats">
        <article className="admin-kpi-card admin-kpi-card--blue">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Total de Produtores</span>
            <div className="admin-kpi-card__icon">
              <BarChart2 size={20} />
            </div>
          </div>

          <strong className="admin-kpi-card__value">
            {stats.totalSegurados}
          </strong>

          <span className="admin-kpi-card__delta admin-kpi-card__delta--up">
            <TrendingUp size={14} />
            4 novos este mês
          </span>
        </article>

        <article className="admin-kpi-card admin-kpi-card--gold">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Milhagem Total</span>
            <div className="admin-kpi-card__icon">
              <DollarSign size={20} />
            </div>
          </div>

          <strong className="admin-kpi-card__value">
            {formatCurrency(stats.totalMilhagem)}
          </strong>

          <span className="admin-kpi-card__delta admin-kpi-card__delta--up">
            <TrendingUp size={14} />
            12% vs mês anterior
          </span>
        </article>

        <article className="admin-kpi-card admin-kpi-card--green">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Produtores Ativos</span>
            <div className="admin-kpi-card__icon">
              <Users size={20} />
            </div>
          </div>

          <strong className="admin-kpi-card__value">
            {stats.produtoresAtivos}
          </strong>

          <span className="admin-kpi-card__delta admin-kpi-card__delta--neutral">
            de {stats.totalSegurados} cadastrados
          </span>
        </article>
      </section>

      <section className="admin-dashboard__grid">
        <article className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-header">
            <div>
              <h3>Ranking de Produtores</h3>
              <p>Ordenado por milhagem total</p>
            </div>

            <button
              type="button"
              className="admin-dashboard__export-btn"
              onClick={handleExport}
            >
              <Download size={16} />
              Exportar Excel
            </button>
          </div>

          <div className="admin-dashboard__ranking-list">
            {rankingOrdenado.length > 0 ? (
              rankingOrdenado.map((produtor, index) => (
                <div className="admin-dashboard__ranking-row" key={index}>
                  <div
                    className={`admin-dashboard__ranking-pos ${getPosClass(
                      index
                    )}`}
                  >
                    {index + 1}
                  </div>

                  <div className="admin-dashboard__ranking-info">
                    <div className="admin-dashboard__ranking-name">
                      {produtor.nome ||
                        produtor.name ||
                        produtor.nomeCompleto ||
                        "Produtor sem nome"}
                    </div>
                    <div className="admin-dashboard__ranking-email">
                      {produtor.email || "Sem e-mail"}
                    </div>
                  </div>

                  <div className="admin-dashboard__ranking-value">
                    {formatCurrency(
                      produtor.milhagem || produtor.totalMilhagem || 0
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-dashboard__empty">
                Nenhum produtor encontrado para o ranking.
              </div>
            )}
          </div>
        </article>

        <article className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-title-alone">
            Completude por Produtor
          </div>

          <div className="admin-dashboard__progress-list">
            {produtoresCompletude.length > 0 ? (
              produtoresCompletude.map((item, index) => (
                <div className="admin-dashboard__progress-item" key={index}>
                  <div className="admin-dashboard__progress-head">
                    <span className="admin-dashboard__progress-label">
                      {item.nome}
                    </span>
                    <span className="admin-dashboard__progress-value">
                      {item.pct}%
                    </span>
                  </div>

                  <div className="admin-dashboard__progress-bar">
                    <div
                      className={`admin-dashboard__progress-fill ${getProgressClass(
                        item.pct
                      )}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-dashboard__empty">
                Nenhum dado de completude disponível.
              </div>
            )}
          </div>
        </article>
      </section>
    </section>
  );
}