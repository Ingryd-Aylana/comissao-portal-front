import React, { useEffect, useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  Send,
  Search,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import "../../components/styles/UploadCard.css";

import {
  buscarProdutores,
  previewPlanilha,
  importarSingle,
} from "../../services/fedcorpApi.js";

export default function UploadCard({ onDataParsed }) {
  const [arquivo, setArquivo] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [preview, setPreview] = useState([]);
  const [produtores, setProdutores] = useState([]);
  const [inputBusca, setInputBusca] = useState("");
  const [produtorSelecionado, setProdutorSelecionado] = useState("");
  const [loadingProdutores, setLoadingProdutores] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoadingProdutores(true);
        setError("");

        const resultado = await buscarProdutores(inputBusca);
        setProdutores(Array.isArray(resultado) ? resultado : []);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtores.");
      } finally {
        setLoadingProdutores(false);
      }
    };

    const timer = setTimeout(carregar, 400);
    return () => clearTimeout(timer);
  }, [inputBusca]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];

    setSuccess(false);
    setError("");
    setPreview([]);
    setArquivo(null);
    setFileName("");

    if (!file) {
      setError("Nenhum arquivo selecionado.");
      return;
    }

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setError("Formato inválido. Envie .xlsx, .xls ou .csv.");
      return;
    }

    try {
      setArquivo(file);
      setFileName(file.name);

      const resultadoPreview = await previewPlanilha(file, 10);
      const linhasPreview = resultadoPreview?.preview || [];

      setPreview(linhasPreview);

      if (typeof onDataParsed === "function") {
        onDataParsed(linhasPreview);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao pré-visualizar a planilha.");
    }
  };

  const handleSelectProdutor = (produtor) => {
    setInputBusca(`${produtor.nome} (${produtor.email})`);
    setProdutorSelecionado(produtor.id);
  };

  const produtoresFiltrados = useMemo(() => {
    return produtores.filter((p) =>
      `${p.nome} ${p.email}`.toLowerCase().includes(inputBusca.toLowerCase())
    );
  }, [produtores, inputBusca]);

  const handleSendSpreadsheet = async () => {
    try {
      setIsSending(true);
      setError("");
      setSuccess(false);

      if (!arquivo) {
        throw new Error("Selecione um arquivo.");
      }

      if (!produtorSelecionado) {
        throw new Error("Selecione um produtor.");
      }

      await importarSingle(arquivo, produtorSelecionado, "Importação manual");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao enviar os dados.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadTemplate = () => {
    const dadosModelo = [
      {
        Segurado: "",
        Apólice: "",
        "Prêmio Líquido": "",
        Comissão: "",
      },
      {
        Segurado: "",
        Apólice: "",
        "Prêmio Líquido": "",
        Comissão: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(dadosModelo);

    worksheet["!cols"] = [
      { wch: 35 },
      { wch: 22 },
      { wch: 18 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo");

    XLSX.writeFile(workbook, "modelo-planilha-comissao.xlsx");
  };

  return (
    <section className="upload-page">
      <div className="upload-page__grid">
        <section className="upload-panel">
          <div className="upload-panel__head">
            <div className="upload-panel__icon">
              <FileSpreadsheet size={22} />
            </div>

            <div>
              <h3>Upload do arquivo</h3>
              <p>Arquivos aceitos: .xlsx, .xls e .csv</p>
            </div>
          </div>

          <div className="upload-panel__content">
            <div className="upload-field">
              <label htmlFor="busca-produtor" className="upload-field__label">
                Produtor
              </label>

              <div className="upload-autocomplete">
                <div className="upload-autocomplete__input-wrap">
                  <Search size={18} className="upload-autocomplete__icon" />
                  <input
                    type="text"
                    id="busca-produtor"
                    placeholder="Digite o nome ou e-mail."
                    value={inputBusca}
                    onChange={(e) => {
                      setInputBusca(e.target.value);
                      setProdutorSelecionado("");
                    }}
                    className="upload-autocomplete__input"
                  />
                </div>

                {inputBusca && produtoresFiltrados.length > 0 && (
                  <ul className="upload-autocomplete__list">
                    {produtoresFiltrados.map((p) => (
                      <li
                        key={p.id}
                        onClick={() => handleSelectProdutor(p)}
                        className="upload-autocomplete__item"
                      >
                        <strong>{p.nome}</strong>
                        <span>{p.email}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {loadingProdutores && (
                <p className="upload-field__hint">Carregando produtores.</p>
              )}
            </div>

            <div className="upload-field">
              <label htmlFor="file-upload" className="upload-field__label">
                Arquivo
              </label>

              <label htmlFor="file-upload" className="upload-file-picker">
                <Upload size={18} />
                Escolher arquivo
              </label>

              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="upload-hidden-input"
              />

              {fileName && (
                <div className="upload-file-info">
                  <span>Arquivo selecionado</span>
                  <strong>{fileName}</strong>
                </div>
              )}
            </div>

            {error && (
              <div className="upload-alert upload-alert--error">{error}</div>
            )}

            {success && (
              <div className="upload-alert upload-alert--success">
                Planilha enviada com sucesso!
              </div>
            )}

            <div className="upload-actions">
              <button
                type="button"
                className="upload-submit-button"
                onClick={handleSendSpreadsheet}
                disabled={
                  preview.length === 0 || isSending || !produtorSelecionado
                }
              >
                {isSending ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={18} />
                    Enviar planilha
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <aside className="upload-side-card">
          <h3>Regras rápidas</h3>

          <ul className="upload-side-card__list">
            <li>Selecione o produtor antes de enviar a planilha.</li>
            <li>Baixe a planilha modelo para garantir compatibilidade.</li>
            <li>Use apenas arquivos Excel ou CSV nos formatos permitidos.</li>
            <li>Verifique se a planilha não está vazia.</li>
            <li>Após o envio, valide o processamento dos dados.</li>
          </ul>

          <button
            type="button"
            className="upload-template-button"
            onClick={handleDownloadTemplate}
          >
            <Download size={18} />
            Baixar modelo de planilha
          </button>

          <div className="upload-side-card__status">
            <span className="upload-side-card__status-label">
              Linhas carregadas
            </span>
            <strong>{preview.length}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}