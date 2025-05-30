import { db, auth } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Função auxiliar para verificar permissão na milhagem
const verificarPermissaoMilhagem = async (milhagemId) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const milhagemRef = doc(db, "milhagensComissoes", milhagemId);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  if (milhagemDoc.data().produtorUid !== currentUser.uid) {
    throw new Error("Você não tem permissão para acessar esta milhagem");
  }

  return milhagemDoc;
};

// Função para obter segurados de uma milhagem
export const getSeguradosByMilhagem = async (milhagemId) => {
  await verificarPermissaoMilhagem(milhagemId);

  const seguradosRef = collection(
    db,
    "milhagensComissoes",
    milhagemId,
    "segurados"
  );
  const querySnapshot = await getDocs(seguradosRef);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    dtProposta: doc.data().dtProposta?.toDate(),
    inicioVig: doc.data().inicioVig?.toDate(),
    fimVig: doc.data().fimVig?.toDate(),
    dtPrev: doc.data().dtPrev?.toDate(),
  }));
};

// Função para criar um novo segurado
export const createSegurado = async (milhagemId, seguradoData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  await verificarPermissaoMilhagem(milhagemId);

  // Converter datas para Timestamp
  const seguradoWithDates = {
    ...seguradoData,
    dtProposta: seguradoData.dtProposta
      ? Timestamp.fromDate(new Date(seguradoData.dtProposta))
      : null,
    inicioVig: seguradoData.inicioVig
      ? Timestamp.fromDate(new Date(seguradoData.inicioVig))
      : null,
    fimVig: seguradoData.fimVig
      ? Timestamp.fromDate(new Date(seguradoData.fimVig))
      : null,
    dtPrev: seguradoData.dtPrev
      ? Timestamp.fromDate(new Date(seguradoData.dtPrev))
      : null,
    userImportou: currentUser.uid,
    statusSegurado: seguradoData.statusSegurado || "A", // Status ativo por padrão
  };

  const docRef = await addDoc(
    collection(db, "milhagensComissoes", milhagemId, "segurados"),
    seguradoWithDates
  );

  return docRef.id;
};

// Função para atualizar um segurado existente
export const updateSegurado = async (milhagemId, seguradoId, newData) => {
  await verificarPermissaoMilhagem(milhagemId);

  // Converter datas para Timestamp
  const updateData = {
    ...newData,
    dtProposta: newData.dtProposta
      ? Timestamp.fromDate(new Date(newData.dtProposta))
      : null,
    inicioVig: newData.inicioVig
      ? Timestamp.fromDate(new Date(newData.inicioVig))
      : null,
    fimVig: newData.fimVig
      ? Timestamp.fromDate(new Date(newData.fimVig))
      : null,
    dtPrev: newData.dtPrev
      ? Timestamp.fromDate(new Date(newData.dtPrev))
      : null,
  };

  const seguradoRef = doc(
    db,
    "milhagensComissoes",
    milhagemId,
    "segurados",
    seguradoId
  );
  await updateDoc(seguradoRef, updateData);
};

// Função para deletar um segurado
export const deleteSegurado = async (milhagemId, seguradoId) => {
  await verificarPermissaoMilhagem(milhagemId);

  const seguradoRef = doc(
    db,
    "milhagensComissoes",
    milhagemId,
    "segurados",
    seguradoId
  );
  await deleteDoc(seguradoRef);
};
