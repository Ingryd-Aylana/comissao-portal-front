import { auth } from "../config/firebase.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado.");

  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json.error || `Erro HTTP ${res.status}`;
    throw new Error(message);
  }

  return json.data ?? json;
}

export async function previewPlanilha(arquivo, limit = 10) {
  const headers = await getAuthHeader();
  const form = new FormData();
  form.append("arquivo", arquivo);

  const res = await fetch(`${API_URL}/api/upload/preview?limit=${limit}`, {
    method: "POST",
    headers,
    body: form,
  });

  return handleResponse(res);
}

export async function importarSingle(arquivo, produtorUid, obs = "") {
  const headers = await getAuthHeader();
  const form = new FormData();

  form.append("arquivo", arquivo);
  form.append("produtorUid", produtorUid);
  if (obs) form.append("obs", obs);

  const res = await fetch(`${API_URL}/api/upload/single`, {
    method: "POST",
    headers,
    body: form,
  });

  return handleResponse(res);
}

export async function importarLote(arquivo, obs = "") {
  const headers = await getAuthHeader();
  const form = new FormData();

  form.append("arquivo", arquivo);
  if (obs) form.append("obs", obs);

  const res = await fetch(`${API_URL}/api/upload/batch`, {
    method: "POST",
    headers,
    body: form,
  });

  return handleResponse(res);
}

export async function buscarProdutores(termo = "") {
  const headers = await getAuthHeader();

  const res = await fetch(
    `${API_URL}/api/usuarios/produtores?termo=${encodeURIComponent(termo)}`,
    { headers }
  );

  return handleResponse(res);
}

export async function getDashboardStats() {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/api/usuarios/stats/dashboard`, {
    headers,
  });

  return handleResponse(res);
}

export async function getComissoes() {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/api/comissoes`, {
    headers,
  });

  return handleResponse(res);
}

export async function deletarComissao(id) {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/api/comissoes/${id}`, {
    method: "DELETE",
    headers,
  });

  return handleResponse(res);
}

export async function getUsuarioLogado() {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/api/usuarios/me`, {
    headers,
  });

  return handleResponse(res);
}

export async function atualizarMeuPerfil(payload) {
  const headers = await getAuthHeader();

  const res = await fetch(`${API_URL}/api/usuarios/me`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}