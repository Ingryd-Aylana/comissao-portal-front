import React, { useState, useEffect } from "react";
import "../../components/styles/RelatoriosPage.css";
import RelatorioImagem from "../../components/RelatorioImagem";
import { FaFilePdf, FaFileExcel, FaSearch } from "react-icons/fa";
import {
  getMilhagensDoUsuarioLogado,
  getCurrentUserFirestoreData,
} from "../../services/comissaoService";

export default function RelatoriosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [downloading, setDownloading] = useState({});
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [producerName, setProducerName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Buscar dados do usuário
        const userData = await getCurrentUserFirestoreData();
        setProducerName(userData.nome || "");

        const milhagens = await getMilhagensDoUsuarioLogado();

        // Agrupar milhagens por mês
        const relatoriosPorMes = milhagens.reduce((acc, milhagem) => {
          const data = new Date(milhagem.dataCriacao);
          const mes = data.toLocaleString("pt-BR", {
            month: "long",
            year: "numeric",
          });
          const mesKey = `${data.getFullYear()}-${data.getMonth()}`;

          if (!acc[mesKey]) {
            acc[mesKey] = {
              mes: mes.charAt(0).toUpperCase() + mes.slice(1),
              dataGeracao: data.toLocaleDateString("pt-BR"),
              milhagem: 0,
              pdf: true,
              excel: true,
            };
          }

          acc[mesKey].milhagem += milhagem.valorComissao || 0;
          return acc;
        }, {});

        // Converter para array e ordenar por data mais recente
        const relatoriosArray = Object.values(relatoriosPorMes).sort((a, b) => {
          const [diaA, mesA, anoA] = a.dataGeracao.split("/");
          const [diaB, mesB, anoB] = b.dataGeracao.split("/");
          return (
            new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA)
          );
        });

        setRelatorios(relatoriosArray);
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
        setError(
          "Erro ao carregar relatórios. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (index, type) => {
    setDownloading({ [`${index}-${type}`]: true });

    try {
      // Formatar o nome do produtor (remover espaços e caracteres especiais)
      const formattedName = producerName
        .replace(/\s+/g, "") // Remove espaços
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Remove acentos

      // Define o nome do arquivo com o nome do produtor
      const nomeArquivo =
        type === "pdf"
          ? `relatorio-milhagem-${formattedName}.pdf`
          : `relatorio-milhagem-${formattedName}.xlsx`;

      // Caminho relativo ao public/
      const url = `/relatorios/${nomeArquivo}`;

      // Criar elemento <a> para simular o download
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Erro ao baixar relatório ${type}:`, err);
    } finally {
      setDownloading({ [`${index}-${type}`]: false });
    }
  };

  const filteredRelatorios = relatorios.filter((relatorio) =>
    relatorio.mes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando relatórios...</p>
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
    <div className="main">
      <div className="relatorios-container">
        <RelatorioImagem />

        <h1>Relatórios Disponíveis</h1>

        <div className="relatorio-filtro">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por mês..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredRelatorios.length > 0 ? (
          <table className="relatorios-table">
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
                <tr key={index}>
                  <td>{relatorio.mes}</td>
                  <td>{relatorio.dataGeracao}</td>
                  <td>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(relatorio.milhagem)}
                  </td>
                  <td>
                    {relatorio.pdf && (
                      <button
                        className="btn-export pdf"
                        onClick={() => handleDownload(index, "pdf")}
                        disabled={downloading[`${index}-pdf`]}
                      >
                        {downloading[`${index}-pdf`] ? (
                          "Baixando..."
                        ) : (
                          <>
                            <FaFilePdf /> PDF
                          </>
                        )}
                      </button>
                    )}
                    {/* {relatorio.excel && (
                      <button
                        className="btn-export excel"
                        onClick={() => handleDownload(index, "excel")}
                        disabled={downloading[`${index}-excel`]}
                      >
                        {downloading[`${index}-excel`] ? (
                          "Baixando..."
                        ) : (
                          <>
                            <FaFileExcel /> Excel
                          </>
                        )}
                      </button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">
            {searchTerm
              ? "Nenhum relatório encontrado para o período pesquisado."
              : "Nenhum relatório disponível."}
          </p>
        )}
      </div>
    </div>
  );
}
