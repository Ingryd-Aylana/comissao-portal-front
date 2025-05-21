import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../../components/styles/UploadCard.css";
import { FaFileExcel, FaUpload, FaPaperPlane } from "react-icons/fa";

export default function UploadCard({ onDataParsed, mostrarRelatorio }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(""); // Erro para envio da planilha
  const [success, setSuccess] = useState(false); // Envio da planilha com sucesso
  const [dados, setDados] = useState([]);
  const [isSending, setIsSending] = useState(false); // Está enviando

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSuccess(false); // resseta

    if (!file) {
      setError("Nenhum arquivo selecionado.");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Formato inválido. Por favor, envie um arquivo .xlsx ou .xls.");
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
        onDataParsed(jsonData);
      } catch (err) {
        setError(
          "Erro ao processar o arquivo. Verifique o conteúdo e tente novamente."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSendSpreadsheet = () => {
    console.log("📤 Enviando os dados da planilha para o back-end...", dados);

    setIsSending(true);
    setError("");
    setSuccess(false);

    // Envia para o back (mesmo que falhe)
    const enviarParaBack = async (jsonData) => {
      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dados: jsonData }),
        });

        if (!response.ok) throw new Error("Falha na comunicação com o servidor.");

        const resultado = await response.json();
        console.log("Resposta do servidor:", resultado);
        setSuccess(true); // Sucesso visual
      } catch (erro) {
        console.error("Erro ao enviar:", erro);
        setError("Erro ao enviar os dados. Tente novamente.");
      } finally {
        setIsSending(false);
      }
    };

    enviarParaBack(dados);

    // ✅ Exibe o relatório independente do back-end
    mostrarRelatorio();
  };

  return (
    <section className="upload-card">
      <div className="upload-container">
        {/* Logo */}
        <img src="/images/logo.png" alt="Logo" className="logo-perfil" />

        {/* Título com ícone */}
        <h2 className="upload-title">
          <FaFileExcel className="icon-xl" />
          Importar Arquivo Excel
        </h2>

        {/* Botão de upload */}
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

        {/* Nome do arquivo */}
        {fileName && (
          <p className="file-name">
            📁 Arquivo selecionado: <strong>{fileName}</strong>
          </p>
        )}

        {/* Feedback visual */}
        {error && <p className="error-alert">⚠️ {error}</p>}
        {success && <p className="success-alert">✅ Planilha enviada com sucesso!</p>}

        {/* Botão de envio */}
        <button
          className="btn-enviar"
          onClick={handleSendSpreadsheet}
          disabled={dados.length === 0 || isSending}
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
