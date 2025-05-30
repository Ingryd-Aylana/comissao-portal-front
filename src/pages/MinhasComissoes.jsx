import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMilhagensDoUsuarioLogado,
  createMilhagem,
  updateMilhagem,
  deleteMilhagem,
} from "../services/comissaoService";

const MinhasComissoes = () => {
  const [milhagens, setMilhagens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMilhagem, setSelectedMilhagem] = useState(null);
  const navigate = useNavigate();

  // Estado para o formulário de nova milhagem
  const [formData, setFormData] = useState({
    numeroMilhagem: "",
    favorecido: "",
    administradora: "",
    quantidadeSegurados: 0,
    premioBruto: 0,
    premioLiquido: 0,
    percentualComissao: 0,
    descontoComissao: 0,
    valorComissao: 0,
    obs: "",
  });

  // Carregar milhagens
  const loadMilhagens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMilhagensDoUsuarioLogado();
      setMilhagens(data);
    } catch (err) {
      setError("Erro ao carregar milhagens: " + err.message);
      console.error("Erro:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMilhagens();
  }, [loadMilhagens]);

  // Handlers para o CRUD
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await createMilhagem(formData);
      setShowModal(false);
      setFormData({
        numeroMilhagem: "",
        favorecido: "",
        administradora: "",
        quantidadeSegurados: 0,
        premioBruto: 0,
        premioLiquido: 0,
        percentualComissao: 0,
        descontoComissao: 0,
        valorComissao: 0,
        obs: "",
      });
      await loadMilhagens();
    } catch (err) {
      setError("Erro ao criar milhagem: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, newData) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateMilhagem(id, newData);
      await loadMilhagens();
    } catch (err) {
      setError("Erro ao atualizar milhagem: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta milhagem?")) {
      try {
        setIsLoading(true);
        setError(null);
        await deleteMilhagem(id);
        await loadMilhagens();
      } catch (err) {
        setError("Erro ao deletar milhagem: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Minhas Comissões</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nova Comissão
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nº Milhagem</th>
              <th className="px-4 py-2 border">Favorecido</th>
              <th className="px-4 py-2 border">Administradora</th>
              <th className="px-4 py-2 border">Qtd. Segurados</th>
              <th className="px-4 py-2 border">Prêmio Bruto</th>
              <th className="px-4 py-2 border">Valor Comissão</th>
              <th className="px-4 py-2 border">Data Criação</th>
              <th className="px-4 py-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {milhagens.map((milhagem) => (
              <tr key={milhagem.id}>
                <td className="px-4 py-2 border">{milhagem.numeroMilhagem}</td>
                <td className="px-4 py-2 border">{milhagem.favorecido}</td>
                <td className="px-4 py-2 border">{milhagem.administradora}</td>
                <td className="px-4 py-2 border text-center">
                  {milhagem.quantidadeSegurados}
                </td>
                <td className="px-4 py-2 border text-right">
                  {formatCurrency(milhagem.premioBruto)}
                </td>
                <td className="px-4 py-2 border text-right">
                  {formatCurrency(milhagem.valorComissao)}
                </td>
                <td className="px-4 py-2 border">
                  {formatDate(milhagem.dataCriacao)}
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => navigate(`/milhagem/${milhagem.id}`)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMilhagem(milhagem);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(milhagem.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para criar/editar milhagem */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedMilhagem ? "Editar Milhagem" : "Nova Milhagem"}
            </h2>
            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Número da Milhagem</label>
                  <input
                    type="text"
                    value={formData.numeroMilhagem}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroMilhagem: e.target.value,
                      })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Favorecido</label>
                  <input
                    type="text"
                    value={formData.favorecido}
                    onChange={(e) =>
                      setFormData({ ...formData, favorecido: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>
                {/* Adicione mais campos conforme necessário */}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMilhagem(null);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {selectedMilhagem ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinhasComissoes;
