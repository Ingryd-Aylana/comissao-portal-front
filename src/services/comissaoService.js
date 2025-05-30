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
  collectionGroup,
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

  // Atualizar usando o UID
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

  // Array para armazenar as milhagens com seus segurados
  const milhagensComSegurados = [];

  // Para cada milhagem, buscar seus segurados
  for (const milhagemDoc of querySnapshot.docs) {
    const milhagem = {
      id: milhagemDoc.id,
      ...milhagemDoc.data(),
      dataCriacao: milhagemDoc.data().dataCriacao?.toDate(),
      dataAtualizacao: milhagemDoc.data().dataAtualizacao?.toDate(),
    };

    // Buscar segurados da milhagem
    const seguradosRef = collection(
      db,
      "milhagemComissoes",
      milhagemDoc.id,
      "segurados"
    );
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
export const createMilhagem = async (milhagemData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const now = Timestamp.now();
  const { segurados, ...milhagemWithoutSegurados } = milhagemData;

  const milhagemWithMetadata = {
    ...milhagemWithoutSegurados,
    produtorUid: currentUser.uid,
    dataCriacao: now,
    dataAtualizacao: now,
    status: milhagemData.status || "A", // Status ativo por padrão
  };

  const batch = writeBatch(db);

  // Criar documento da milhagem
  const milhagemRef = doc(collection(db, "milhagemComissoes"));
  batch.set(milhagemRef, milhagemWithMetadata);

  // Se houver segurados, criar subcoleção
  if (segurados && Array.isArray(segurados)) {
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
  return milhagemRef.id;
};

// Função para atualizar uma milhagem existente
export const updateMilhagem = async (id, newData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  // Verificação de segurança
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

  // Separar segurados do resto dos dados
  const { segurados, ...milhagemData } = newData;

  // Atualizar milhagem
  batch.update(milhagemRef, {
    ...milhagemData,
    dataAtualizacao: now,
  });

  // Se houver segurados para atualizar
  if (segurados && Array.isArray(segurados)) {
    // Primeiro, excluir segurados existentes
    const seguradosRef = collection(milhagemRef, "segurados");
    const seguradosSnapshot = await getDocs(seguradosRef);
    seguradosSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Depois, adicionar os novos segurados
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

  // Verificação de segurança
  const milhagemRef = doc(db, "milhagemComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  if (milhagemDoc.data().produtorUid !== currentUser.uid) {
    throw new Error("Você não tem permissão para deletar esta milhagem");
  }

  const batch = writeBatch(db);

  // Buscar e deletar todos os segurados
  const seguradosRef = collection(milhagemRef, "segurados");
  const seguradosSnapshot = await getDocs(seguradosRef);
  seguradosSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Deletar a milhagem
  batch.delete(milhagemRef);

  await batch.commit();
};
