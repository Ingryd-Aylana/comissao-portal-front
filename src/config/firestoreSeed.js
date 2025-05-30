// firestoreSeed.js - Estrutura nova ideal
import { db } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

async function seedFirestore() {
  console.log("Iniciando seed no Firestore...");
  const batch = writeBatch(db);

  try {
    // Administradoras
    const adminRef = doc(collection(db, "administradoras"), "adm_001");
    batch.set(adminRef, {
      nome: "BBZ",
      cpfCnpj: "12345678000199",
      responsavel: "Carlos Silva",
      email: "carlos.silva@admin.com",
      telefone: "9999-1111",
      endereco: "Rua A, 100",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
      status: "A",
    });

    // Usuários
    const userRef = doc(collection(db, "usuarios"), "user_001");
    batch.set(userRef, {
      nome: "Ingryd Aylana",
      email: "ingrydaylana@gmail.com",
      cpf: "33333333333",
      celular: "98765-4321",
      telefone: "3210-9876",
      endereco: "Rua C, 300",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
      status: "A",
      tipoUsuario: "produtor",
      administradoraId: "adm_001",
    });

    // Milhagem com subcoleção de segurados
    const milhagemRef = doc(
      collection(db, "milhagemComissoes"),
      "milhagem_001"
    );
    batch.set(milhagemRef, {
      produtorUid: "user_001",
      administradoraId: "adm_001",
      numeroMilhagem: "MILHAGEM002",
      percentualComissao: 2.7,
      valorComissao: 295.0,
      premioLiquido: 280.0,
      premioBruto: 300.0,
      descontoComissao: 5.0,
      quantidadeSegurados: 1,
      obs: "Comissão de hospedagem de março.",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
      status: "A",
    });

    await batch.commit();
    console.log("Batch principal finalizado.");

    // Inserção fora do batch: subcoleção 'segurados'
    const seguradoRef = doc(
      collection(milhagemRef, "segurados"),
      "segurado_001"
    );
    await setDoc(seguradoRef, {
      segurado: "Cliente C",
      apolice: "APOLICE003",
      endosso: "ENDOSSO003",
      nossoNumero: "N2-11223",
      ramo: "Saúde",
      seguradora: "Seguradora Z",
      tipo: "N",
      statusSegurado: "A",
      statusDoc: "Ativo",
      dtProposta: Timestamp.fromDate(new Date("2024-02-29T21:00:00")),
      dtPrev: Timestamp.fromDate(new Date("2024-04-04T21:00:00")),
      inicioVig: Timestamp.fromDate(new Date("2024-03-04T21:00:00")),
      fimVig: Timestamp.fromDate(new Date("2025-03-04T21:00:00")),
      parc: "1/6",
      baseRepasse: "Bruto",
      percentParticipacao: 8,
      percentRepasse: 4,
      prLiqParc: 100,
      vlBase: 2000,
      vlRepasse: 80,
      canceladoSegurado: false,
      obsSegurado: "Novo cliente.",
      userImportou: "user_001",
    });

    console.log("Segurado adicionado com sucesso.");
  } catch (error) {
    console.error("Erro durante o seed:", error);
  } finally {
    process.exit();
  }
}

seedFirestore();
