// firestoreSeed.js
// Certifique-se de que este arquivo está em 'src/config/'
import { db } from "./firebase.js"; // Ajuste o caminho se necessário (ex: './firebase.js' se estiver na mesma pasta)
import {
  collection,
  addDoc,
  doc,
  setDoc,
  Timestamp,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";

async function seedFirestore() {
  console.log("Iniciando a população do Firestore...");

  const batch = writeBatch(db);

  try {
    // --- Dados de Referência ---

    // 1. Popular a coleção 'tiposUsuarios'
    console.log("Adicionando tipos de usuários...");
    const tiposUsuariosRef = collection(db, "tiposUsuarios");

    const tipoAdminDocRef = doc(tiposUsuariosRef, "admin");
    batch.set(tipoAdminDocRef, { nome: "Administrador", status: "A" });

    const tipoProdutorDocRef = doc(tiposUsuariosRef, "produtor");
    batch.set(tipoProdutorDocRef, { nome: "produtor", status: "A" });

    const tipoadministradoraDocRef = doc(tiposUsuariosRef, "administradora");
    batch.set(tipoadministradoraDocRef, {
      nome: "administradora",
      status: "A",
    });

    const tipoFedcorpDocRef = doc(tiposUsuariosRef, "F");
    batch.set(tipoFedcorpDocRef, { nome: "fedcorp", status: "A" });

    // 2. Popular a coleção 'administradoras'
    console.log("Adicionando administradoras...");
    const administradorasRef = collection(db, "administradoras");

    const admin1Id = "0000000001";
    const admin1DocRef = doc(administradorasRef, admin1Id);
    batch.set(admin1DocRef, {
      nome: "BBZ",
      cpfCnpj: "111.111.111-11",
      responsavel: "Carlos Silva",
      email: "carlos.silva@admin.com",
      telefone: "9999-1111",
      endereco: "Rua A, 100",
      status: "A",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    });

    const admin2Id = "0000000002"; // CORRIGIDO: ID ÚNICO
    const admin2DocRef = doc(administradorasRef, admin2Id);
    batch.set(admin2DocRef, {
      nome: "Zirtaeb",
      cpfCnpj: "222.222.222-22",
      responsavel: "Mariana Costa",
      email: "mariana.costa@admin.com",
      telefone: "9999-2222",
      endereco: "Av. B, 200",
      status: "A",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    });

    // --- Dados Principais da Aplicação ---

    // 3. Popular a coleção 'usuarios'
    console.log("Adicionando usuários...");
    const usuariosRef = collection(db, "usuarios");

    // Supondo que "joao.teste@user.com" e "maria.exemplo@user.com" são os emails de autenticação
    // Para um seed, você pode preencher o UID manualmente, mas na prática, ele viria do Auth
    // Aqui estou usando IDs de exemplo, mas na vida real, se o UID do Auth for o ID do doc, seria melhor.
    const usuario1Uid = "user1FirebaseUID"; // Exemplo de UID do Auth
    const usuario1DocRef = doc(usuariosRef, usuario1Uid);
    batch.set(usuario1DocRef, {
      cpf: "333.333.333-33",
      nome: "João Teste",
      email: "joao.teste@user.com", // Chave de ligação com Auth
      celular: "98765-4321",
      telefone: "3210-9876",
      endereco: "Rua C, 300",
      nomeAdministradora: "BBZ", // Desnormalizado
      tipoUsuarioRef: tipoProdutorDocRef.path,
      status: "A",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    });

    const usuario2Uid = "user2FirebaseUID"; // Exemplo de UID do Auth
    const usuario2DocRef = doc(usuariosRef, usuario2Uid);
    batch.set(usuario2DocRef, {
      cpf: "444.444.444-44",
      nome: "Maria Exemplo",
      email: "maria.exemplo@user.com", // Chave de ligação com Auth
      celular: "98765-1234",
      telefone: "3210-5678",
      endereco: "Av. D, 400",
      nomeAdministradora: "BBZ", // Desnormalizado
      tipoUsuarioRef: tipoProdutorDocRef.path,
      status: "A",
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    });

    // 4. Popular a subcoleção 'usuarios/{idUsuario}/administradorasAssociados'
    console.log("Adicionando associações de administradoras aos usuários...");
    const adminAssociadoUsuario1DocRef = doc(
      collection(usuario1DocRef, "administradorasAssociados"),
      admin1Id
    );
    batch.set(adminAssociadoUsuario1DocRef, {
      nomeAdministradora: "BBZ", // Desnormalizado
      dataAssociacao: Timestamp.now(),
    });

    const adminAssociadoUsuario2DocRef = doc(
      collection(usuario2DocRef, "administradorasAssociados"),
      admin1Id // Associe a administradora BBZ a Maria
    );
    batch.set(adminAssociadoUsuario2DocRef, {
      nomeAdministradora: "BBZ", // Desnormalizado
      dataAssociacao: Timestamp.now(),
    });

    // 5. Popular a coleção 'milhagensComissoes' com a nova estrutura e subcoleção 'segurados'
    console.log("Adicionando milhagens e comissões com segurados...");
    const milhagensComissoesRef = collection(db, "milhagensComissoes");

    // Milhagem 1 (associada ao João Teste, produtorEmail e produtorUid)
    const milhagem1DocRef = doc(milhagensComissoesRef); // Firestore gera o ID
    batch.set(milhagem1DocRef, {
      numeroMilhagem: "MILHAGEM001",
      favorecido: "Maria Exemplo", // Nome do favorecido
      administradora: "BBZ", // Nome da administradora
      quantidadeSegurados: 10,
      premioBruto: 500.75,
      premioLiquido: 450.0,
      percentualComissao: 5.5,
      descontoComissao: 10.0,
      valorComissao: 500.75,
      obs: "Comissão de viagem de janeiro.",
      status: "A",
      produtorEmail: "joao.teste@user.com", // Email do produtor (para ligação com Auth)
      produtorUid: usuario1Uid, // UID do produtor (para segurança)
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    });

    // Adicionar segurados para MILHAGEM001 como subcoleção
    const seguradosMilhagem1Ref = collection(milhagem1DocRef, "segurados");

    batch.set(doc(seguradosMilhagem1Ref), {
      segurado: "Cliente A",
      nossoNumero: "N1-12345",
      dtProposta: Timestamp.fromDate(new Date("2024-01-10")),
      seguradora: "Seguradora X",
      ramo: "Auto",
      apolice: "APOLICE001",
      endosso: "ENDOSSO001",
      statusDoc: "Ativo",
      tipo: "P",
      inicioVig: Timestamp.fromDate(new Date("2024-01-15")),
      fimVig: Timestamp.fromDate(new Date("2025-01-15")),
      parc: "1/12",
      prLiqParc: 50.0,
      dtPrev: Timestamp.fromDate(new Date("2024-02-15")),
      percentParticipacao: 5.0,
      baseRepasse: "Bruto",
      vlBase: 1000.0,
      percentRepasse: 2.0,
      vlRepasse: 20.0,
      obsSegurado: "Seguro novo.",
      canceladoSegurado: false,
      userImportou: usuario1Uid, // ID do usuário que importou
      statusSegurado: "A",
    });

    batch.set(doc(seguradosMilhagem1Ref), {
      segurado: "Cliente B",
      nossoNumero: "N1-67890",
      dtProposta: Timestamp.fromDate(new Date("2024-01-12")),
      seguradora: "Seguradora Y",
      ramo: "Vida",
      apolice: "APOLICE002",
      endosso: "ENDOSSO002",
      statusDoc: "Ativo",
      tipo: "R",
      inicioVig: Timestamp.fromDate(new Date("2024-01-20")),
      fimVig: Timestamp.fromDate(new Date("2025-01-20")),
      parc: "2/12",
      prLiqParc: 75.0,
      dtPrev: Timestamp.fromDate(new Date("2024-02-20")),
      percentParticipacao: 7.0,
      baseRepasse: "Líquido",
      vlBase: 1500.0,
      percentRepasse: 3.0,
      vlRepasse: 45.0,
      obsSegurado: "Renovação anual.",
      canceladoSegurado: false,
      userImportou: usuario1Uid,
      statusSegurado: "A",
    });

    // Milhagem 2 (associada à Maria Exemplo, produtorEmail e produtorUid)
    const milhagem2DocRef = doc(milhagensComissoesRef); // Firestore gera o ID
    batch.set(milhagem2DocRef, {
      numeroMilhagem: "MILHAGEM002",
      favorecido: "João Teste", // Nome do favorecido
      administradora: "BBZ", // Nome da administradora
      quantidadeSegurados: 5,
      premioBruto: 300.0,
      premioLiquido: 280.0,
      percentualComissao: 7.0,
      descontoComissao: 5.0,
      valorComissao: 295.0,
      obs: "Comissão de hospedagem de março.",
      status: "A",
      produtorEmail: "maria.exemplo@user.com", // Email do produtor
      produtorUid: usuario2Uid, // UID do produtor
      dataCriacao: Timestamp.now(),
      dataAtualizacao: Timestamp.now(),
    });

    // Adicionar segurados para MILHAGEM002 como subcoleção
    const seguradosMilhagem2Ref = collection(milhagem2DocRef, "segurados");

    batch.set(doc(seguradosMilhagem2Ref), {
      segurado: "Cliente C",
      nossoNumero: "N2-11223",
      dtProposta: Timestamp.fromDate(new Date("2024-03-01")),
      seguradora: "Seguradora Z",
      ramo: "Saúde",
      apolice: "APOLICE003",
      endosso: "ENDOSSO003",
      statusDoc: "Ativo",
      tipo: "N",
      inicioVig: Timestamp.fromDate(new Date("2024-03-05")),
      fimVig: Timestamp.fromDate(new Date("2025-03-05")),
      parc: "1/6",
      prLiqParc: 100.0,
      dtPrev: Timestamp.fromDate(new Date("2024-04-05")),
      percentParticipacao: 8.0,
      baseRepasse: "Bruto",
      vlBase: 2000.0,
      percentRepasse: 4.0,
      vlRepasse: 80.0,
      obsSegurado: "Novo cliente.",
      canceladoSegurado: false,
      userImportou: usuario2Uid,
      statusSegurado: "A",
    });

    // Commit todas as operações do batch
    await batch.commit();
    console.log("Firestore populado com sucesso!");
  } catch (error) {
    console.error("Erro ao popular o Firestore:", error);
  } finally {
    process.exit();
  }
}

seedFirestore();
