import { db, auth } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

// Obter dados do usuário logado
export const getCurrentUserFirestoreData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
  if (!userDoc.exists()) throw new Error("Usuário não encontrado no Firestore");

  return { id: userDoc.id, ...userDoc.data() };
};

// Atualizar perfil do usuário logado
export const updateUserProfile = async (userData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  await updateDoc(doc(db, "usuarios", currentUser.uid), {
    ...userData,
    dataAtualizacao: Timestamp.now(),
  });
};

// Obter milhagens do usuário logado
export const getMilhagensDoUsuarioLogado = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const milhagensRef = collection(db, "milhagemComissoes");
  const q = query(milhagensRef, where("produtorUid", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  const milhagensComSegurados = [];

  for (const milhagemDoc of querySnapshot.docs) {
    const milhagem = {
      id: milhagemDoc.id,
      ...milhagemDoc.data(),
      dataCriacao: milhagemDoc.data().dataCriacao?.toDate(),
      dataAtualizacao: milhagemDoc.data().dataAtualizacao?.toDate(),
    };

    const seguradosRef = collection(db, "milhagemComissoes", milhagemDoc.id, "segurados");
    const seguradosSnapshot = await getDocs(seguradosRef);

    milhagem.segurados = seguradosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    milhagensComSegurados.push(milhagem);
  }

  return milhagensComSegurados;
};

// Buscar todas as milhagens (admin)
export const getTodasMilhagens = async () => {
  const milhagensRef = collection(db, "milhagemComissoes");
  const querySnapshot = await getDocs(milhagensRef);
  const milhagensComSegurados = [];

  for (const milhagemDoc of querySnapshot.docs) {
    const milhagem = {
      id: milhagemDoc.id,
      ...milhagemDoc.data(),
      dataCriacao: milhagemDoc.data().dataCriacao?.toDate(),
      dataAtualizacao: milhagemDoc.data().dataAtualizacao?.toDate(),
    };

    const seguradosRef = collection(db, "milhagemComissoes", milhagemDoc.id, "segurados");
    const seguradosSnapshot = await getDocs(seguradosRef);

    milhagem.segurados = seguradosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    milhagensComSegurados.push(milhagem);
  }

  return milhagensComSegurados;
};

// Criar nova milhagem
export const createMilhagem = async (milhagemData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  // Se o admin preencheu o produtorUid manualmente no formulário, prioriza esse valor
  const produtorUid = milhagemData.produtorUid || currentUser.uid;

  // Confere se o produtorUid existe no banco
  const produtorDoc = await getDoc(doc(db, "usuarios", produtorUid));
  if (!produtorDoc.exists()) {
    throw new Error("Usuário não encontrado no Firestore");
  }

  const dataReferencia = milhagemData.dataCriacao
    ? new Date(milhagemData.dataCriacao)
    : new Date();
  const dataInicioMes = new Date(dataReferencia.getFullYear(), dataReferencia.getMonth(), 1);

  const milhagemCompleta = {
    ...milhagemData,
    produtorUid,
    dataCriacao: dataInicioMes,
    dataAtualizacao: Timestamp.now(),
    status: "A",
  };

  const docRef = await addDoc(collection(db, "milhagemComissoes"), milhagemCompleta);
  return docRef.id;
};



// Função para atualizar uma milhagem
export const updateMilhagem = async (id, newData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuário não autenticado");

    const milhagemRef = doc(db, "milhagemComissoes", id);
    const milhagemDoc = await getDoc(milhagemRef);
    if (!milhagemDoc.exists()) throw new Error("Milhagem não encontrada");

    const userData = await getCurrentUserFirestoreData();

    // Log de permissão
    console.log(`Usuário autenticado: ${userData.id}, tipo: ${userData.tipoUsuario}`);
    if (userData.tipoUsuario !== "admin") {
      throw new Error("Permissão negada: apenas administradores podem editar milhagens.");
    }

    const batch = writeBatch(db);
    const now = Timestamp.now();
    const { segurados, ...milhagemData } = newData;

    console.log("Atualizando dados da milhagem...");
    batch.update(milhagemRef, {
      ...milhagemData,
      dataAtualizacao: now,
    });

    // Atualizar segurados: remove todos os antigos e recria os novos
    if (Array.isArray(segurados)) {
      console.log("Removendo segurados antigos...");
      const seguradosRef = collection(db, "milhagemComissoes", id, "segurados");
      const seguradosSnapshot = await getDocs(seguradosRef);

      seguradosSnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      console.log("Adicionando novos segurados...");
      for (const segurado of segurados) {
        const novoSeguradoRef = doc(collection(db, "milhagemComissoes", id, "segurados"));
        batch.set(novoSeguradoRef, {
          ...segurado,
          dataCriacao: now,
          dataAtualizacao: now,
          status: "A",
        });
      }
    }

    console.log("Salvando alterações no Firestore...");
    await batch.commit();
    console.log("✅ Milhagem atualizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar milhagem:", error.message);
    throw error; // propaga o erro para o front-end
  }
};

// Deletar milhagem e segurados
export const deleteMilhagem = async (id) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const milhagemRef = doc(db, "milhagemComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);
  if (!milhagemDoc.exists()) throw new Error("Milhagem não encontrada");

  const batch = writeBatch(db);
  const seguradosRef = collection(milhagemRef, "segurados");
  const seguradosSnapshot = await getDocs(seguradosRef);
  seguradosSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

  batch.delete(milhagemRef);
  await batch.commit();
};

// Buscar milhagens de todos os usuários (admin)
export const getMilhagensDeTodosUsuarios = async () => {
  const milhagensRef = collection(db, "milhagemComissoes");
  const querySnapshot = await getDocs(milhagensRef);
  const milhagensCompletas = [];

  for (const milhagemDoc of querySnapshot.docs) {
    const milhagem = {
      id: milhagemDoc.id,
      ...milhagemDoc.data(),
      dataCriacao: milhagemDoc.data().dataCriacao?.toDate(),
      dataAtualizacao: milhagemDoc.data().dataAtualizacao?.toDate(),
    };

    try {
      const produtorDoc = await getDoc(doc(db, "usuarios", milhagem.produtorUid));
      milhagem.produtorNome = produtorDoc.exists()
        ? produtorDoc.data().nome || "Sem nome"
        : "Produtor não encontrado";
    } catch {
      milhagem.produtorNome = "Erro ao buscar produtor";
    }

    const seguradosRef = collection(db, "milhagemComissoes", milhagemDoc.id, "segurados");
    const seguradosSnapshot = await getDocs(seguradosRef);
    const segurados = seguradosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    milhagem.segurados = segurados;

    if (segurados.length > 0) {
      const primeiro = segurados[0];
      milhagem.segurado = primeiro.nome || primeiro.segurado || "Não informado";
      milhagem.valorComissao = primeiro.valorComissao || 0;
      milhagem.premioLiquido = primeiro.premioLiquido || primeiro.premioBruto || 0;
    }

    milhagensCompletas.push(milhagem);
  }

  return milhagensCompletas;
};

// Buscar milhagem por ID
export const getMilhagemById = async (id) => {
  const milhagemRef = doc(db, "milhagemComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  const milhagem = {
    id: milhagemDoc.id,
    ...milhagemDoc.data(),
    dataCriacao: milhagemDoc.data().dataCriacao?.toDate(),
    dataAtualizacao: milhagemDoc.data().dataAtualizacao?.toDate(),
  };

  try {
    const produtorDoc = await getDoc(doc(db, "usuarios", milhagem.produtorUid));
    milhagem.produtorNome = produtorDoc.exists()
      ? produtorDoc.data().nome || "Sem nome"
      : "Produtor não encontrado";
  } catch {
    milhagem.produtorNome = "Erro ao buscar produtor";
  }

  return milhagem;
};
