import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../../components/styles/UploadCard.css";
import { FaFileExcel, FaUpload, FaPaperPlane } from "react-icons/fa";
import { getAllProdutores, searchProdutoresByNomeOuEmail } from "../../services/userService";

export default function UploadCard({ onDataParsed, mostrarRelatorio }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dados, setDados] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const [produtores, setProdutores] = useState([]);
  const [inputBusca, setInputBusca] = useState("");
  const [produtorSelecionado, setProdutorSelecionado] = useState("");

  useEffect(() => {
    const buscar = async () => {
      try {
        if (inputBusca.trim().length >= 3) {
          const resultados = await searchProdutoresByNomeOuEmail(inputBusca);
          setProdutores(resultados);
          setError(""); // Limpa erro após busca bem-sucedida
        } else {
          const todos = await getAllProdutores();
          setProdutores(todos);
          setError(""); // Limpa erro após busca bem-sucedida
        }
      } catch (err) {
        console.error("Erro ao carregar produtores:", err);
      }
    };

    const timeout = setTimeout(buscar, 400);
    return () => clearTimeout(timeout);
  }, [inputBusca]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSuccess(false);
    if (!file) return setError("Nenhum arquivo selecionado.");
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls"))
      return setError("Formato inválido. Envie um arquivo .xlsx ou .xls.");

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

        if (jsonData.length === 0) return setError("A planilha está vazia.");

        setDados(jsonData);
        onDataParsed(jsonData);
      } catch (err) {
        setError("Erro ao processar o arquivo.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSelectProdutor = (produtor) => {
    setInputBusca(`${produtor.nome} (${produtor.email})`);
    setProdutorSelecionado(produtor.id);
  };

  const produtoresFiltrados = produtores.filter((p) =>
    `${p.nome} ${p.email}`.toLowerCase().includes(inputBusca.toLowerCase())
  );

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

      if (!response.ok) throw new Error("Falha ao enviar para o servidor.");

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
    <section className="upload-card">
      <div className="upload-container">
        <img src="/images/logo.png" alt="Logo" className="logo-perfil" />
        <h2 className="upload-title">
          <FaFileExcel className="icon-xl" />
          Importar Arquivo Excel
        </h2>

        {/* Busca de Produtor com Autocomplete */}
        <div className="upload-select-produtor">
          <label htmlFor="busca-produtor">Selecione o produtor:</label>
          <input
            type="text"
            id="busca-produtor"
            placeholder="Digite o nome ou e-mail..."
            value={inputBusca}
            onChange={(e) => {
              setInputBusca(e.target.value);
              setProdutorSelecionado(""); // limpa se usuário digitar de novo
            }}
            className="upload-produtor-dropdown"
          />
          {inputBusca && produtoresFiltrados.length > 0 && (
            <ul className="autocomplete-list">
              {produtoresFiltrados.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectProdutor(p)}
                  className="autocomplete-item"
                >
                  {p.nome} ({p.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upload */}
        <label htmlFor="file-upload" className="upload-label">
          <FaUpload className="icon-sm" />
          Escolher arquivo
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden-input"
        />

        {fileName && (
          <p className="file-name">
            📁 Arquivo: <strong>{fileName}</strong>
          </p>
        )}

        {error && <p className="error-alert">⚠️ {error}</p>}
        {success && <p className="success-alert">✅ Planilha enviada!</p>}

        <button
          className="btn-enviar"
          onClick={handleSendSpreadsheet}
          disabled={dados.length === 0 || isSending || !produtorSelecionado}
        >
          {isSending ? "⏳ Enviando..." : (
            <>
              <FaPaperPlane className="icon-sm" />
              Enviar Planilha
            </>
          )}
        </button>
      </div>
    </section>
  );
}
