import React from "react";
import "./DetailedReport.css";

function DetailedReport({ dados = [], produtorNome = "Produtor" }) {
  const hoje = new Date().toLocaleDateString("pt-BR");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);
  };

  return (
    <section className="detailed-report" id="pagina-detalhada">
      <header className="report-header">
        <div className="logo-box">
          <img src="/images/logo2.png" alt="Logo" className="logo-img" />
        </div>
        <div className="header-banner">
          <div className="banner-content">
            <h3>{produtorNome}</h3>
            <p className="report-date">Gerado em: {hoje}</p>
          </div>
        </div>
      </header>

      <table className="report-table">
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
          {dados.length > 0 ? (
            dados.map((item, idx) => (
              <tr key={idx}>
                <td>{item.policyHolder}</td>
                <td>{item.policyNumber}</td>
                <td>{item.startDate}</td>
                <td>{formatCurrency(item.netPremium)}</td>
                <td>{formatCurrency(item.commission)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhum dado disponível.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default DetailedReport;
