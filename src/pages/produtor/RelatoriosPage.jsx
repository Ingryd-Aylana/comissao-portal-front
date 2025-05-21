import React, { useState } from "react";
import "../../components/styles/RelatoriosPage.css";
import RelatorioImagem from "../../components/RelatorioImagem";
import { FaFilePdf, FaFileExcel, FaSearch } from 'react-icons/fa';

// Dados inseridos para teste em tela
const relatoriosMock = [
  { mes: "Maio/2025", dataGeracao: "13/05/2025", milhagem: "R$ 593,18", pdf: true, excel: true },
  { mes: "Abril/2025", dataGeracao: "10/04/2025", milhagem: "R$ 1080,22", pdf: true, excel: true },
  { mes: "Março/2025", dataGeracao: "11/03/2025", milhagem: "R$ 746,00", pdf: true, excel: true },
];

export default function RelatoriosPage() {
  const [searchTerm, setSearchTerm] = useState(""); // Controle da barra de busca
  const [downloading, setDownloading] = useState({}); // Estado para botões de download

  // Simula o processo de download e atualiza o estado dos botões
  const handleDownload = (index, type) => {
    setDownloading({ [`${index}-${type}`]: true });

    setTimeout(() => {
      setDownloading({ [`${index}-${type}`]: false });
      // Lógica real de download será implementada aqui, se Deus quiser
    }, 2000);
  };

  // Filtro aplicado ao array de relatórios com base no termo pesquisado
  const filteredRelatorios = relatoriosMock.filter((relatorio) =>
    relatorio.mes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main">
      
      <div className="relatorios-container">
        <RelatorioImagem />

        <h1>Relatórios Disponíveis</h1>

        {/* Barra de busca por mês do relatório */}
        <div className="relatorio-filtro">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por mês..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="relatorios-table">
          {/* Cabeçalho da planilha */}
          <thead>
            <tr>
              <th>Mês</th>
              <th>Data de Geração</th>
              <th>Milhagem</th>
              <th>Exportar</th>
            </tr>
          </thead>

          <tbody>
            {filteredRelatorios.map((relatorio, index) => (
              // Referência aos dados criados, e corpo da planilha
              <tr key={index}>
                <td>{relatorio.mes}</td>
                <td>{relatorio.dataGeracao}</td>
                <td>{relatorio.milhagem}</td>
                <td>
                  {/* Botões para baixar os relatórios */}
                  {relatorio.pdf && (
                    <button
                      className="btn-export pdf"
                      onClick={() => handleDownload(index, 'pdf')}
                      disabled={downloading[`${index}-pdf`]}
                    >
                      {downloading[`${index}-pdf`] ? 'Baixando...' : (
                        <>
                          <FaFilePdf /> PDF
                        </>
                      )}
                    </button>
                  )}
                  {relatorio.excel && (
                    <button
                      className="btn-export excel"
                      onClick={() => handleDownload(index, 'excel')}
                      disabled={downloading[`${index}-excel`]}
                    >
                      {downloading[`${index}-excel`] ? 'Baixando...' : (
                        <>
                          <FaFileExcel /> Excel
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>     
      </div>
  );
}
