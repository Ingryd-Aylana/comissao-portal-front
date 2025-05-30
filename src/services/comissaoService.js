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
    // Tenta buscar por email se não encontrar por UID
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("email", "==", currentUser.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Usuário não encontrado no Firestore");
    }

    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  }

  return { id: userDoc.id, ...userDoc.data() };
};

// Função para atualizar os dados do usuário
export const updateUserProfile = async (userData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  // Buscar o documento do usuário
  const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
  if (!userDoc.exists()) {
    // Tenta buscar por email
    const usersRef = collection(db, "usuarios");
    const q = query(usersRef, where("email", "==", currentUser.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Usuário não encontrado no Firestore");
    }

    // Atualizar usando o ID encontrado
    const userDocId = querySnapshot.docs[0].id;
    await updateDoc(doc(db, "usuarios", userDocId), {
      ...userData,
      dataAtualizacao: Timestamp.now(),
    });
    return;
  }

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

  const milhagensRef = collection(db, "milhagensComissoes");
  const q = query(milhagensRef, where("produtorUid", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    dataCriacao: doc.data().dataCriacao?.toDate(),
    dataAtualizacao: doc.data().dataAtualizacao?.toDate(),
  }));
};

// Função para criar uma nova milhagem
export const createMilhagem = async (milhagemData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const now = Timestamp.now();
  const milhagemWithMetadata = {
    ...milhagemData,
    produtorEmail: currentUser.email,
    produtorUid: currentUser.uid,
    dataCriacao: now,
    dataAtualizacao: now,
    status: milhagemData.status || "A", // Status ativo por padrão
  };

  const docRef = await addDoc(
    collection(db, "milhagensComissoes"),
    milhagemWithMetadata
  );
  return docRef.id;
};

// Função para atualizar uma milhagem existente
export const updateMilhagem = async (id, newData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  // Verificação de segurança
  const milhagemRef = doc(db, "milhagensComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  if (milhagemDoc.data().produtorUid !== currentUser.uid) {
    throw new Error("Você não tem permissão para atualizar esta milhagem");
  }

  // Remover campos protegidos
  const { produtorEmail, produtorUid, dataCriacao, ...safeData } = newData;

  await updateDoc(milhagemRef, {
    ...safeData,
    dataAtualizacao: Timestamp.now(),
  });
};

// Função para deletar uma milhagem e seus segurados
export const deleteMilhagem = async (id) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  // Verificação de segurança
  const milhagemRef = doc(db, "milhagensComissoes", id);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  if (milhagemDoc.data().produtorUid !== currentUser.uid) {
    throw new Error("Você não tem permissão para deletar esta milhagem");
  }

  // Buscar todos os segurados da milhagem
  const seguradosRef = collection(db, "milhagensComissoes", id, "segurados");
  const seguradosSnapshot = await getDocs(seguradosRef);

  // Usar batch para deletar milhagem e segurados
  const batch = writeBatch(db);

  // Adicionar deleção dos segurados ao batch
  seguradosSnapshot.docs.forEach((seguradoDoc) => {
    batch.delete(
      doc(db, "milhagensComissoes", id, "segurados", seguradoDoc.id)
    );
  });

  // Adicionar deleção da milhagem ao batch
  batch.delete(milhagemRef);

  // Executar o batch
  await batch.commit();
};
