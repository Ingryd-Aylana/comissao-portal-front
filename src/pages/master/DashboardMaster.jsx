import React, { useState, useEffect } from "react";
import { BarChart2, Users, DollarSign } from "lucide-react";
import "../../components/styles/DashboardMaster.css";
import { getUserStats } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
          navigate("/dashboard");
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
    }).format(value);
  };

  const totalPages = Math.ceil(stats.rankingProdutores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = stats.rankingProdutores.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
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
        <div className="master-card">
          <BarChart2 size={24} />
          <span className="label">
            <strong>TOTAL DE PRODUTORES</strong>
          </span>
          <span className="value">{stats.totalSegurados}</span>
        </div>
        <div className="master-card">
          <DollarSign size={24} />
          <span className="label">
            <strong>MILHAGEM TOTAL</strong>
          </span>
          <span className="value">{formatCurrency(stats.totalMilhagem)}</span>
        </div>
        <div className="master-card">
          <Users size={24} />
          <span className="label">
            <strong>PRODUTORES ATIVOS</strong>
          </span>
          <span className="value">{stats.produtoresAtivos}</span>
        </div>
      </div>

      {/* Tabela de Ranking com Paginação */}
      <section className="master-dashboard-table-section">
        <div className="dashboard-table-header">
          <h2>Ranking de Produtores</h2>
        </div>

        {stats.rankingProdutores.length > 0 ? (
          <>
            <table className="master-dashboard-table">
              <thead>
                <tr>
                  <th>PRODUTOR</th>
                  <th>E-MAIL</th>
                  <th>MILHAGEM TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((produtor) => (
                  <tr key={produtor.id}>
                    <td>{produtor.nome}</td>
                    <td>{produtor.email}</td>
                    <td>{formatCurrency(produtor.totalMilhagem)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="pagination-controls">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Próximo
              </button>
            </div>
          </>
        ) : (
          <p className="no-data-message">Nenhum produtor encontrado.</p>
        )}
      </section>
    </main>
  );
}
