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
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updatePassword,
} from "firebase/auth";

// Função para verificar se o usuário atual é admin
export const checkAdminPermission = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado");
    }

    const userDoc = await getDoc(doc(db, "usuarios", auth.currentUser.uid));
    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }

    const userData = userDoc.data();
    if (userData.tipoUsuario !== "admin") {
      throw new Error("Acesso não autorizado");
    }

    return true;
  } catch (error) {
    console.error("Erro ao verificar permissões:", error);
    throw error;
  }
};

// Função para obter todos os usuários
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

// Função para criar um novo usuário
export const createUser = async (userData) => {
  try {
    await checkAdminPermission();

    // Criar usuário no Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.senha
    );

    // Preparar dados para o Firestore
    const { senha, ...userDataWithoutPassword } = userData;
    const userDoc = {
      ...userDataWithoutPassword,
      uid: userCredential.user.uid,
      tipoUsuario: userData.tipoUsuario || "produtor",
      status: "ativo",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    };

    // Salvar no Firestore usando setDoc com o uid como ID do documento
    const userRef = doc(db, "usuarios", userCredential.user.uid);
    await setDoc(userRef, userDoc);

    return userCredential.user.uid;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    // Se houver erro, tentar limpar o usuário do Auth
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

// Função para buscar usuário por UID
export const getUserByUid = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "usuarios", uid));
    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }
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

// Função para atualizar um usuário
export const updateUser = async (userId, userData) => {
  try {
    await checkAdminPermission();
    const userDoc = await getDoc(doc(db, "usuarios", userId));
    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }

    const currentData = userDoc.data();

    // Se o email mudou, atualizar no Authentication
    if (userData.email && userData.email !== currentData.email) {
      await updateEmail(auth.currentUser, userData.email);
    }

    // Se a senha foi fornecida, atualizar no Authentication
    if (userData.senha) {
      await updatePassword(auth.currentUser, userData.senha);
    }

    // Preparar dados para atualização no Firestore
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

// Função para deletar um usuário
export const deleteUserById = async (userId) => {
  try {
    await checkAdminPermission();
    const userDoc = await getDoc(doc(db, "usuarios", userId));
    if (!userDoc.exists()) {
      throw new Error("Usuário não encontrado");
    }

    // Deletar usuário do Authentication
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }

    // Deletar do Firestore
    await deleteDoc(doc(db, "usuarios", userId));
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};

// Função para buscar usuários por termo
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

    // Filtrar localmente por nome, CPF ou email
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

// Função para obter estatísticas dos usuários
export const getUserStats = async () => {
  try {
    await checkAdminPermission();
    const usersRef = collection(db, "usuarios");
    const milhagensRef = collection(db, "milhagensComissoes");

    // Buscar todos os usuários
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Buscar todas as milhagens
    const milhagensSnapshot = await getDocs(milhagensRef);
    const milhagens = milhagensSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calcular estatísticas
    const produtoresAtivos = users.filter(
      (user) => user.tipoUsuario === "produtor" && user.status === "ativo"
    ).length;

    const totalSegurados = milhagens.reduce(
      (total, milhagem) => total + (milhagem.quantidadeSegurados || 0),
      0
    );

    const totalMilhagem = milhagens.reduce(
      (total, milhagem) => total + (milhagem.valorComissao || 0),
      0
    );

    // Calcular ranking de produtores
    const produtoresComMilhagem = users
      .filter((user) => user.tipoUsuario === "produtor")
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
      .slice(0, 5); // Top 5 produtores

    return {
      produtoresAtivos,
      totalSegurados,
      totalMilhagem,
      rankingProdutores: produtoresComMilhagem,
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
};
