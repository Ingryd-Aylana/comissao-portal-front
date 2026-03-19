import React, { useState, useEffect, useRef } from "react";
import "../../components/styles/RelatoriosPage.css";
import {
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { Search, ClipboardList } from "lucide-react";
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
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [producerData, setProducerData] = useState(null);
  const [pdfRelatorioSelecionado, setPdfRelatorioSelecionado] = useState(null);
  const [activeTab, setActiveTab] = useState("Mensal");

  const printRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userData = await getCurrentUserFirestoreData();
        setProducerData(userData);

        const milhagens = await getMilhagensDoUsuarioLogado();

        const relatoriosPorMes = milhagens.reduce((acc, milhagem) => {
          const data = new Date(milhagem.dataCriacao);

          if (data.getFullYear() === 2025 && data.getMonth() === 6) {
            data.setMonth(5);
          }

          const mesKey = `${data.getFullYear()}-${String(
            data.getMonth() + 1
          ).padStart(2, "0")}`;

          const mes = new Date(
            data.getFullYear(),
            data.getMonth(),
            1
          ).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          });

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
          acc[mesKey].premio += milhagem.premio || 0;

          return acc;
        }, {});

        const relatoriosArray = Object.values(relatoriosPorMes).sort((a, b) => {
          return (
            new Date(b.dataGeracao.split("/").reverse().join("-")) -
            new Date(a.dataGeracao.split("/").reverse().join("-"))
          );
        });

        setRelatorios(relatoriosArray);
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
        setError("Erro ao carregar relatórios. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPdf = async (relatorio) => {
    try {
      setPdfRelatorioSelecionado(relatorio);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const input = printRef.current;
      if (!input) throw new Error("Referência para PDF não encontrada.");

      const pdf = new jsPDF("p", "mm", "a4");
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      const formattedName = (producerData?.nome || "usuario")
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const nomeArquivo = relatorio
        ? `relatorio-milhagem-${formattedName}-${relatorio.mes}.pdf`
        : `relatorios-milhagem-${formattedName}.pdf`;

      pdf.save(nomeArquivo);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setPdfRelatorioSelecionado(null);
    }
  };

  const handleDownloadExcel = (relatorio) => {
    try {
      const dadosMensais = relatorio.detalhes.flatMap((milhagem) =>
        (milhagem.segurados || []).map((segurado) => ({
          Segurado: segurado.segurado || "-",
          Apólice: segurado.apolice || "-",
          "Início Vigência":
            segurado.inicioVig && segurado.inicioVig.toDate
              ? segurado.inicioVig.toDate().toLocaleDateString("pt-BR")
              : segurado.inicioVig instanceof Date
              ? segurado.inicioVig.toLocaleDateString("pt-BR")
              : "-",
          "Prêmio Líquido": segurado.prLiqParc || 0,
          Milhagem: segurado.vlRepasse || 0,
        }))
      );

      const worksheet = XLSX.utils.json_to_sheet(dadosMensais);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, relatorio.mes.split(" ")[0]);

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formattedName = (producerData?.nome || "usuario")
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      saveAs(blob, `relatorio-milhagem-${formattedName}-${relatorio.mes}.xlsx`);
    } catch (err) {
      console.error("Erro ao gerar Excel do mês:", err);
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
      <div className="relatorios-page-modern">
        <div className="relatorios-page-header">
          <div>
            <h1>Relatórios</h1>
            <p>Acompanhe e exporte seus dados de comissão.</p>
          </div>

          <button
            className="relatorios-top-btn"
            onClick={() => {
              if (filteredRelatorios[0]) {
                handleDownloadPdf(filteredRelatorios[0]);
              }
            }}
            disabled={!filteredRelatorios.length}
          >
            <FaFilePdf />
            <span>Exportar PDF</span>
          </button>
        </div>

        <div className="relatorios-hero">
          <div className="relatorios-hero-lines" />

          <div className="relatorios-hero-text">
            <div className="relatorios-hero-greeting">Relatórios disponíveis</div>
            <div className="relatorios-hero-title">
              Acompanhe seus relatórios <span>em tempo real</span>
            </div>
          </div>

          <button
            className="relatorios-hero-excel-btn"
            onClick={() => {
              if (filteredRelatorios[0]) {
                handleDownloadExcel(filteredRelatorios[0]);
              }
            }}
            disabled={!filteredRelatorios.length}
          >
            <FaFileExcel />
            <span>Excel</span>
          </button>
        </div>

       

        <div className="relatorios-card">
          <div className="relatorios-toolbar">
            <div className="relatorios-search-box">
              <Search size={16} strokeWidth={2} className="relatorios-search-icon" />
              <input
                type="text"
                placeholder="Buscar por mês..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relatorios-search-input"
              />
            </div>

            <div className="relatorios-count">
              {filteredRelatorios.length > 0
                ? `${filteredRelatorios.length} relatório${filteredRelatorios.length > 1 ? "s" : ""} encontrado${filteredRelatorios.length > 1 ? "s" : ""}.`
                : "Nenhum relatório disponível."}
            </div>
          </div>

          {filteredRelatorios.length > 0 ? (
            <div className="relatorios-table-wrapper">
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
                        <div className="relatorios-actions">
                          <button
                            className="btn-export pdf"
                            onClick={() => handleDownloadPdf(relatorio)}
                          >
                            <FaFilePdf />
                            <span>PDF</span>
                          </button>

                          <button
                            className="btn-export excel"
                            onClick={() => handleDownloadExcel(relatorio)}
                          >
                            <FaFileExcel />
                            <span>Excel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="relatorios-empty-state">
              <div className="relatorios-empty-icon">
                <ClipboardList size={40} strokeWidth={1.8} />
              </div>

              <div className="relatorios-empty-title">Sem relatórios ainda</div>

              <div className="relatorios-empty-desc">
                Quando importações forem feitas pelo admin, os relatórios aparecerão aqui.
              </div>
            </div>
          )}
        </div>

        {pdfRelatorioSelecionado && (
          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <div ref={printRef} className="print-container">
              <CoverReport
                dadosCapa={{
                  produtor: producerData?.nome || "Não informado",
                  pagamento: producerData?.dadosPagamento || "Não informado",
                  contato: producerData?.telefone || "Não informado",
                  email: producerData?.email || "Não informado",
                  totalApolices: pdfRelatorioSelecionado.detalhes.length,
                  premio: pdfRelatorioSelecionado.premio || 0,
                  repasse: pdfRelatorioSelecionado.milhagem || 0,
                }}
              />
              <DetailedReport
                dados={pdfRelatorioSelecionado.detalhes.flatMap((milhagem) =>
                  (milhagem.segurados || []).map((segurado) => ({
                    policyHolder: segurado.segurado,
                    policyNumber: segurado.apolice,
                    startDate:
                      segurado.inicioVig && segurado.inicioVig.toDate
                        ? segurado.inicioVig.toDate().toLocaleDateString("pt-BR")
                        : segurado.inicioVig instanceof Date
                        ? segurado.inicioVig.toLocaleDateString("pt-BR")
                        : "-",
                    netPremium: segurado.prLiqParc || 0,
                    commission: segurado.vlRepasse || 0,
                  }))
                )}
                produtorNome={producerData?.nome || "Produtor"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}