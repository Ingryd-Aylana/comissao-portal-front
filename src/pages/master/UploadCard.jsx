import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Upload, Send, Search } from "lucide-react";

import "../../components/styles/UploadCard.css";
import {
  getAllProdutores,
  searchProdutoresByNomeOuEmail,
} from "../../services/userService";

export default function UploadCard({ onDataParsed, mostrarRelatorio }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dados, setDados] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const [produtores, setProdutores] = useState([]);
  const [inputBusca, setInputBusca] = useState("");
  const [produtorSelecionado, setProdutorSelecionado] = useState("");
  const [loadingProdutores, setLoadingProdutores] = useState(false);

  useEffect(() => {
    const buscar = async () => {
      try {
        setLoadingProdutores(true);

        if (inputBusca.trim().length >= 3) {
          const resultados = await searchProdutoresByNomeOuEmail(inputBusca);
          setProdutores(resultados);
          setError("");
        } else {
          const todos = await getAllProdutores();
          setProdutores(todos);
          setError("");
        }
      } catch (err) {
        console.error("Erro ao carregar produtores:", err);
      } finally {
        setLoadingProdutores(false);
      }
    };

    const timeout = setTimeout(buscar, 400);
    return () => clearTimeout(timeout);
  }, [inputBusca]);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    setSuccess(false);

    if (!file) {
      setError("Nenhum arquivo selecionado.");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Formato inválido. Envie um arquivo .xlsx ou .xls.");
      return;
    }

    setFileName(file.name);
    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData.length === 0) {
          setError("A planilha está vazia.");
          return;
        }

        setDados(jsonData);

        if (typeof onDataParsed === "function") {
          onDataParsed(jsonData);
        }
      } catch (err) {
        console.error("Erro ao processar arquivo:", err);
        setError("Erro ao processar o arquivo.");
      }
    };

    reader.readAsArrayBuffer(file);
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
    setIsSending(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dados,
          produtorId: produtorSelecionado,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar para o servidor.");
      }

      const resultado = await response.json();
      console.log("Resposta do servidor:", resultado);
      setSuccess(true);
    } catch (erro) {
      console.error("Erro ao enviar os dados:", erro);
      setError("Erro ao enviar os dados.");
    } finally {
      setIsSending(false);
    }
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
              <p>Arquivos aceitos: .xlsx e .xls</p>
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
                    placeholder="Digite o nome ou e-mail..."
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
                <p className="upload-field__hint">Carregando produtores...</p>
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
                accept=".xlsx, .xls"
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
                  dados.length === 0 || isSending || !produtorSelecionado
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
            <li>Use apenas arquivos Excel nos formatos permitidos.</li>
            <li>Verifique se a planilha não está vazia.</li>
            <li>Após o envio, valide o processamento dos dados.</li>
          </ul>

          <div className="upload-side-card__status">
            <span className="upload-side-card__status-label">
              Linhas carregadas
            </span>
            <strong>{dados.length}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}