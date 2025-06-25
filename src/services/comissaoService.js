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


// Função para obter os dados do usuário logado do Firestore
export const getCurrentUserFirestoreData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
  if (!userDoc.exists()) {
    throw new Error("Usuário não encontrado no Firestore");
  }

  return { id: userDoc.id, ...userDoc.data() };
};

// Função para atualizar os dados do usuário
export const updateUserProfile = async (userData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  await updateDoc(doc(db, "usuarios", currentUser.uid), {
    ...userData,
    dataAtualizacao: Timestamp.now(),
  });
};

// Função para obter as milhagens do usuário logado
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

// ✅ NOVA FUNÇÃO: buscar todas as comissões do banco (admin)
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

// Função para criar uma nova milhagem
import { getAuth } from "firebase/auth";

// ...

export const createMilhagem = async (milhagemData) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Usuário não autenticado");

  const milhagemCompleta = {
    ...milhagemData,
    produtorUid: user.uid,
    criadoEm: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "milhagensComissoes"), milhagemCompleta);
  return docRef.id;
};

// Função para atualizar uma milhagem existente
export const updateMilhagem = async (id, newData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const milhagemRef = doc(db, "milhagemComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  if (milhagemDoc.data().produtorUid !== currentUser.uid) {
    throw new Error("Você não tem permissão para atualizar esta milhagem");
  }

  const batch = writeBatch(db);
  const now = Timestamp.now();
  const { segurados, ...milhagemData } = newData;

  batch.update(milhagemRef, {
    ...milhagemData,
    dataAtualizacao: now,
  });

  if (segurados && Array.isArray(segurados)) {
    const seguradosRef = collection(milhagemRef, "segurados");
    const seguradosSnapshot = await getDocs(seguradosRef);
    seguradosSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    for (const segurado of segurados) {
      const seguradoRef = doc(collection(milhagemRef, "segurados"));
      batch.set(seguradoRef, {
        ...segurado,
        dataCriacao: now,
        dataAtualizacao: now,
        status: "A",
      });
    }
  }

  await batch.commit();
};

// Função para deletar uma milhagem e seus segurados
export const deleteMilhagem = async (id) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const milhagemRef = doc(db, "milhagemComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  if (milhagemDoc.data().produtorUid !== currentUser.uid) {
    throw new Error("Você não tem permissão para deletar esta milhagem");
  }

  const batch = writeBatch(db);
  const seguradosRef = collection(milhagemRef, "segurados");
  const seguradosSnapshot = await getDocs(seguradosRef);
  seguradosSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  batch.delete(milhagemRef);
  await batch.commit();
};

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

    // Buscar nome do produtor (favorecido)
    try {
      const produtorDoc = await getDoc(doc(db, "usuarios", milhagem.produtorUid));
      if (produtorDoc.exists()) {
        milhagem.produtorNome = produtorDoc.data().nome || "Sem nome";
      } else {
        milhagem.produtorNome = "Produtor não encontrado";
      }
    } catch (err) {
      milhagem.produtorNome = "Erro ao buscar produtor";
    }

    // Buscar segurados da milhagem
    const seguradosRef = collection(db, "milhagemComissoes", milhagemDoc.id, "segurados");
    const seguradosSnapshot = await getDocs(seguradosRef);

    const segurados = seguradosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
