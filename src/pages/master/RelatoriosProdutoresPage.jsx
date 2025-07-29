import React, { useState } from "react";
import "../../components/styles/RelatoriosProdutoresPage.css";

export default function RelatoriosProdutoresPage() {
  const [filtro, setFiltro] = useState("");
  const [mesSelecionado, setMesSelecionado] = useState("");

  const handleFiltro = (e) => setFiltro(e.target.value);
  const handleMesChange = (e) => setMesSelecionado(e.target.value);

  const dadosFiltrados = mockRelatorios.filter((relatorio) => {
    const nomeMatch = relatorio.produtor.toLowerCase().includes(filtro.toLowerCase());
    const mesMatch = mesSelecionado === "" || relatorio.mes === mesSelecionado;
    return nomeMatch && mesMatch;
  });

  return (
    <div className="relatorios-produtores-container">
      <h1>Relatórios de Produtores</h1>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome do produtor..."
          value={filtro}
          onChange={handleFiltro}
        />

        <select value={mesSelecionado} onChange={handleMesChange}>
          <option value="">Todos os meses</option>
          <option value="Janeiro">Janeiro</option>
          <option value="Fevereiro">Fevereiro</option>
          <option value="Março">Março</option>
          <option value="Abril">Abril</option>
          <option value="Maio">Maio</option>
        </select>
      </div>

      {/* Tabela */}
      <table className="tabela-relatorios">
        <thead>
          <tr>
            <th>Produtor</th>
            <th>Mês</th>
            <th>Data de Geração</th>
            <th>Total (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((relatorio, index) => (
            <tr key={index}>
              <td>{relatorio.produtor}</td>
              <td>{relatorio.mes}</td>
              <td>{relatorio.dataGeracao}</td>
              <td>R$ {relatorio.total.toFixed(2)}</td>
              <td>
                <button className="btn-export pdf">PDF</button>
                <button className="btn-export excel">Excel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
