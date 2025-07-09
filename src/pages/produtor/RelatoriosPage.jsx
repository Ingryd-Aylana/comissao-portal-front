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

import useProducerData from "../../hooks/UseProducerData";

export default function RelatoriosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [producerData, setProducerData] = useState(null);
  const [pdfRelatorioSelecionado, setPdfRelatorioSelecionado] = useState(null);

  const printRef = useRef();
  const { recentCommissions } = useProducerData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUserFirestoreData();
        setProducerData(userData);

        const milhagens = await getMilhagensDoUsuarioLogado();
        console.log("Datas carregadas:", milhagens.map(m => m.dataCriacao));

        const relatoriosPorMes = milhagens.reduce((acc, milhagem) => {
          const data = new Date(milhagem.dataCriacao);

          if (data.getFullYear() === 2025 && data.getMonth() === 6) {
            data.setMonth(5); // Corrigir Julho para Junho
          }

          const mesKey = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
          const mes = new Date(data.getFullYear(), data.getMonth(), 1).toLocaleDateString("pt-BR", {
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
          return new Date(b.dataGeracao.split("/").reverse().join("-")) - new Date(a.dataGeracao.split("/").reverse().join("-"));
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

      pdf.save(`relatorio-milhagem-${formattedName}-${relatorio.mes}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setPdfRelatorioSelecionado(null);
    }
  };

  const handleDownloadExcel = () => {
    try {
      const dadosExcel = recentCommissions.map((item) => ({
        "Segurado": item.policyHolder || "-",
        "Apólice": item.policyNumber || "-",
        "Início Vigência": item.startDate || "-",
        "Prêmio Líquido": item.netPremium || 0,
        "Milhagem": item.commission || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formattedName = (producerData?.nome || "usuario")
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      saveAs(blob, `relatorio-milhagem-${formattedName}.xlsx`);
    } catch (err) {
      console.error("Erro ao gerar Excel:", err);
    }
  };

  const filteredRelatorios = relatorios.filter((relatorio) =>
    relatorio.mes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-container"><p>Carregando relatórios...</p></div>;
  if (error) return <div className="error-container"><p>{error}</p></div>;

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
                  <td>{new Intl.NumberFormat("pt-BR", {
                    style: "currency", currency: "BRL"
                  }).format(relatorio.milhagem)}</td>
                  <td>
                    <button
                      className="btn-export pdf"
                      onClick={() => handleDownloadPdf(relatorio)}
                    >
                      <FaFilePdf /> PDF
                    </button>
                    <button
                      className="btn-export excel"
                      onClick={handleDownloadExcel}
                      style={{ marginLeft: "8px" }}
                    >
                      <FaFileExcel /> Excel
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

        {/* Área oculta para geração do PDF */}
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
