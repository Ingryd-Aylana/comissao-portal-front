import React, { useState, useEffect, useRef } from "react";
import "../../components/styles/RelatoriosPage.css";
import RelatorioImagem from "../../components/RelatorioImagem";
import { FaFilePdf, FaFileExcel, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import CoverReport from "../../rel-pdf/CoverReport";
import DetailedReport from "../../rel-pdf/DetailedReport";

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
  const [producerData, setProducerData] = useState(null);

  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Buscar dados do usuário
        const userData = await getCurrentUserFirestoreData();
        setProducerData(userData);

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
              detalhes: [],
              premio: 0,
            };
          }

          acc[mesKey].milhagem += milhagem.valorComissao || 0;
          acc[mesKey].detalhes.push(milhagem);
          // Caso tenha campo premio em milhagem, soma aqui também
          acc[mesKey].premio += milhagem.premio || 0;

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

  // Dados para a capa do PDF
  const dadosCapa = {
    produtor: producerData?.nome || "Não informado",
    pagamento: producerData?.dadosPagamento || "Não informado",
    contato: producerData?.telefone || "Não informado",
    email: producerData?.email || "Não informado",
    totalApolices: relatorios.length,
    premio: relatorios.reduce((sum, r) => sum + (r.premio || 0), 0),
    repasse: relatorios.reduce((sum, r) => sum + (r.milhagem || 0), 0),
  };

  // Função para gerar e baixar o PDF automaticamente
  const handleDownloadPdf = async (index) => {
    setDownloading((prev) => ({ ...prev, [`${index}-pdf`]: true }));

    try {
      const input = printRef.current;
      if (!input) throw new Error("Referência para PDF não encontrada.");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Captura o conteúdo em alta resolução
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Proporção da imagem no PDF
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Adiciona a primeira página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Adiciona páginas extras enquanto sobrar conteúdo vertical
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Formata nome do produtor para nome do arquivo
      const formattedName = (producerData?.nome || "usuario")
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      pdf.save(`relatorio-milhagem-${formattedName}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setDownloading((prev) => ({ ...prev, [`${index}-pdf`]: false }));
    }
  };


  // Função para gerar e baixar Excel
  const handleDownloadExcel = (index) => {
    setDownloading({ [`${index}-excel`]: true });

    try {
      // Montar dados para Excel (exemplo: cabeçalho + detalhes)
      const relatorio = relatorios[index];
      const detalhes = relatorio.detalhes;

      // Mapear dados para formato Excel
      const dadosExcel = detalhes.map((item) => ({
        "Data": new Date(item.dataCriacao).toLocaleDateString("pt-BR"),
        "Comissão": item.valorComissao,
        "Descrição": item.descricao || "",
        // Adicione mais campos conforme necessário
      }));

      // Criar planilha e pasta de trabalho
      const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      // Gerar arquivo Excel (xlsx)
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Criar blob e salvar arquivo
      const blob = new Blob([wbout], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Formatar nome do arquivo
      const formattedName = (producerData?.nome || "usuario")
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      saveAs(blob, `relatorio-milhagem-${formattedName}.xlsx`);
    } catch (err) {
      console.error("Erro ao gerar Excel:", err);
    } finally {
      setDownloading({ [`${index}-excel`]: false });
    }
  };
  const filteredRelatorios = relatorios.filter((relatorio) =>
    relatorio.mes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="loading-container">
        <p>Carregando relatórios...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );

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
                    <button
                      className="btn-export pdf"
                      onClick={() => handleDownloadPdf(index)}
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

                    <button
                      className="btn-export excel"
                      onClick={() => handleDownloadExcel(index)}
                      disabled={downloading[`${index}-excel`]}
                      style={{ marginLeft: "8px" }}
                    >
                      {downloading[`${index}-excel`] ? (
                        "Baixando..."
                      ) : (
                        <>
                          <FaFileExcel /> Excel
                        </>
                      )}
                    </button>
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

        {/* Área oculta para captura do PDF */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <div ref={printRef} className="print-container">
            <CoverReport dadosCapa={dadosCapa} />
            <DetailedReport dados={relatorios.flatMap((r) => r.detalhes || [])} />
          </div>

        </div>
      </div>
    </div>
  );
}