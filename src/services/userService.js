import { db, auth } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updatePassword,
} from "firebase/auth";



// Verifica se o usuário atual é admin
export const checkAdminPermission = async () => {
  try {
    if (!auth.currentUser) throw new Error("Usuário não autenticado");

    const userDoc = await getDoc(doc(db, "usuarios", auth.currentUser.uid));
    if (!userDoc.exists()) throw new Error("Usuário não encontrado");

    const userData = userDoc.data();
    if (userData.tipoUsuario !== "admin") throw new Error("Acesso não autorizado");

    return true;
  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    throw error;
  }
};

// Busca todos os usuários
export const getAllUsers = async () => {
  try {
    await checkAdminPermission();
    const usersRef = collection(db, "usuarios");
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dataCriacao: doc.data().dataCriacao?.toDate(),
      dataAtualizacao: doc.data().dataAtualizacao?.toDate(),
    }));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

// Busca apenas produtores ativos
export const getAllProdutores = async () => {
  try {
    const produtoresRef = collection(db, "usuarios");
    // Se quiser todos os produtores, sem filtro de status, use apenas where tipoUsuario == "produtor"
    const q = query(produtoresRef, where("tipoUsuario", "==", "produtor"));
    const querySnapshot = await getDocs(q);
    const produtores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return produtores;
  } catch (error) {
    console.error("Erro ao buscar produtores:", error);
    throw error;
  }
};

// Cria um novo usuário
export const createUser = async (userData) => {
  try {
    await checkAdminPermission();
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.senha);

    const { senha, ...userDataWithoutPassword } = userData;
    const userDoc = {
      ...userDataWithoutPassword,
      uid: userCredential.user.uid,
      tipoUsuario: userData.tipoUsuario || "produtor",
      status: "ativo",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    };

    const userRef = doc(db, "usuarios", userCredential.user.uid);
    await setDoc(userRef, userDoc);

    return userCredential.user.uid;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.code !== "auth/email-already-in-use" && auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch (deleteError) {
        console.error("Erro ao limpar usuário do Auth:", deleteError);
      }
    }
    throw error;
  }
};

// Busca usuário por UID
export const getUserByUid = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "usuarios", uid));
    if (!userDoc.exists()) throw new Error("Usuário não encontrado");
    return {
      id: userDoc.id,
      ...userDoc.data(),
      dataCriacao: userDoc.data().dataCriacao?.toDate(),
      dataAtualizacao: userDoc.data().dataAtualizacao?.toDate(),
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

// Atualiza um usuário
export const updateUser = async (userId, userData) => {
  try {
    await checkAdminPermission();
    const userDoc = await getDoc(doc(db, "usuarios", userId));
    if (!userDoc.exists()) throw new Error("Usuário não encontrado");

    const currentData = userDoc.data();

    if (userData.email && userData.email !== currentData.email) {
      await updateEmail(auth.currentUser, userData.email);
    }

    if (userData.senha) {
      await updatePassword(auth.currentUser, userData.senha);
    }

    const { senha, ...updateData } = userData;
    await updateDoc(doc(db, "usuarios", userId), {
      ...updateData,
      dataAtualizacao: Timestamp.now(),
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
};

// Deleta um usuário
export const deleteUserById = async (userId) => {
  try {
    await checkAdminPermission();
    const userDoc = await getDoc(doc(db, "usuarios", userId));
    if (!userDoc.exists()) throw new Error("Usuário não encontrado");

    if (auth.currentUser) await deleteUser(auth.currentUser);

    await deleteDoc(doc(db, "usuarios", userId));
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};

// Busca usuários por termo
export const searchUsers = async (searchTerm) => {
  try {
    await checkAdminPermission();
    const usersRef = collection(db, "usuarios");
    const querySnapshot = await getDocs(usersRef);

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dataCriacao: doc.data().dataCriacao?.toDate(),
      dataAtualizacao: doc.data().dataAtualizacao?.toDate(),
    }));

    return users.filter(
      (user) =>
        user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cpf?.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

// Função para obter os dados do usuário logado
export const getCurrentUserFirestoreData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
  if (!userDoc.exists()) throw new Error("Usuário não encontrado no Firestore");

  return { id: userDoc.id, ...userDoc.data() };
};

// Função para atualizar o perfil do usuário
export const updateUserProfile = async (userData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Usuário não autenticado");

  await updateDoc(doc(db, "usuarios", currentUser.uid), {
    ...userData,
    dataAtualizacao: Timestamp.now(),
  });
};

// Função para buscar uma milhagem por ID
export const getMilhagemById = async (milhagemId) => {
  const milhagemRef = doc(db, "milhagemComissoes", milhagemId);
  const milhagemDoc = await getDoc(milhagemRef);

  if (!milhagemDoc.exists()) {
    throw new Error("Milhagem não encontrada");
  }

  const data = milhagemDoc.data();

  return {
    id: milhagemDoc.id,
    ...data,
    dataCriacao: data.dataCriacao?.toDate(),
    dataAtualizacao: data.dataAtualizacao?.toDate(),
  };
};

// Estatísticas dos usuários
export const getUserStats = async () => {
  const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
  const usuarios = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const milhagensSnapshot = await getDocs(collection(db, "milhagemComissoes"));
  const milhagens = milhagensSnapshot.docs.map(doc => doc.data());

  const produtorMilhagemMap = {};

  milhagens.forEach((milhagem) => {
    const produtorId = milhagem.produtorUid;
    const premioLiquido = milhagem.premioLiquido || 0;
    const percentualComissao = milhagem.percentualComissao || 0;

    const valorComissao = (percentualComissao / 100) * premioLiquido;

    if (!produtorMilhagemMap[produtorId]) {
      produtorMilhagemMap[produtorId] = 0;
    }

    produtorMilhagemMap[produtorId] += valorComissao;
  });

  const rankingProdutores = usuarios
    .map(user => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      totalMilhagem: produtorMilhagemMap[user.id] || 0,
    }))
    .filter(user => user.totalMilhagem > 0) // opcional: remove zeros
    .sort((a, b) => b.totalMilhagem - a.totalMilhagem);

  return {
    totalSegurados: usuarios.length,
    produtoresAtivos: usuarios.filter(u => u.status === "ativo").length,
    totalMilhagem: Object.values(produtorMilhagemMap).reduce((a, b) => a + b, 0),
    rankingProdutores,
  };
};


// Busca dinâmica de produtores por nome ou e-mail (autocomplete)
export const searchProdutoresByNomeOuEmail = async (termo) => {
  try {
    const produtoresRef = collection(db, "usuarios");

    if (!termo || termo.trim().length < 3) return [];

    // Busca apenas por nome (Firebase não permite OR direto)
    const qNome = query(
      produtoresRef,
      where("tipoUsuario", "==", "produtor"),
      where("nome", ">=", termo),
      where("nome", "<=", termo + "\uf8ff")
    );

    const querySnapshot = await getDocs(qNome);
    const resultadosNome = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // (Opcional) Você poderia adicionar aqui uma segunda query para buscar por email

    return resultadosNome;
  } catch (error) {
    console.error("Erro ao buscar produtores por nome:", error);
    throw error;
  }
};


