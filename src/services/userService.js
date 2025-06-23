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
  try {
    await checkAdminPermission();

    const usersRef = collection(db, "usuarios");
    const milhagensRef = collection(db, "milhagensComissoes");

    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const milhagensSnapshot = await getDocs(milhagensRef);
    const milhagens = milhagensSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Total de produtores ativos (status === ativo)
    const produtoresAtivos = users.filter(
      (user) => user.tipoUsuario === "produtor" && user.status === "ativo"
    ).length;

    // Total de produtores cadastrados (para o card "TOTAL DE PRODUTORES")
    const totalSegurados = users.filter((user) => user.tipoUsuario === "produtor").length;

    // Total de milhagem (soma das comissões)
    const totalMilhagem = milhagens.reduce(
      (total, m) => total + (m.valorComissao || 0),
      0
    );

    // Ranking de produtores baseado em comissões
    const produtoresComMilhagem = users
      .filter((u) => u.tipoUsuario === "produtor")
      .map((produtor) => {
        const milhagemProdutor = milhagens
          .filter((m) => m.produtorUid === produtor.uid)
          .reduce((total, m) => total + (m.valorComissao || 0), 0);

        return {
          id: produtor.id,
          nome: produtor.nome,
          email: produtor.email,
          totalMilhagem: milhagemProdutor,
        };
      })
      .sort((a, b) => b.totalMilhagem - a.totalMilhagem)
      .slice(0, 5); // Top 5

    return {
      produtoresAtivos,
      totalSegurados, // usado no front como "Total de Produtores"
      totalMilhagem,
      rankingProdutores: produtoresComMilhagem,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
};


