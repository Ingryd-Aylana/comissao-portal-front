import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../../components/styles/UploadCard.css";
import { FaFileExcel, FaUpload, FaPaperPlane, FaUser } from "react-icons/fa";
import { getAllUsers } from "../../services/userService"; // Supondo que retorna lista de produtores

export default function UploadCard({ onDataParsed, mostrarRelatorio }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dados, setDados] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const [produtores, setProdutores] = useState([]);
  const [produtorSelecionado, setProdutorSelecionado] = useState("");

  useEffect(() => {
    async function carregarProdutores() {
      try {
        const usuarios = await getAllUsers();
        const apenasProdutores = usuarios.filter(u => u.tipo === "produtor");
        setProdutores(apenasProdutores);
      } catch (err) {
        setError("Erro ao carregar produtores.");
      }
    }

    carregarProdutores();
  }, []);

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

        {/* Seleção de Produtor */}
        <div className="upload-select-produtor">
          <label htmlFor="select-produtor">Selecione o produtor:</label>
          <select
            id="select-produtor"
            className="upload-produtor-dropdown"
            value={produtorSelecionado}
            onChange={(e) => setProdutorSelecionado(e.target.value)}
          >
            <option value="">-- Escolha um produtor --</option>
            {produtores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.email})
              </option>
            ))}
          </select>
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
