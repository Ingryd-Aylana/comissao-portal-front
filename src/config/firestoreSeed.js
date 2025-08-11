import { db } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";

async function seedNovosDados() {
  console.log("Iniciando seed de novos dados...");

  const batch = writeBatch(db);

  try {
    // ---------- Usuários ----------
    const novosUsuarios = [
      {
        // Só para subir no banco
        id: "0qhdh5HjxNUCky8A6kpTjefKgEn1",
        data: {
          nome: "ERIC SOUZA BEDA ",
          email: "eric.sza71@gmail.com",
          cpf: "360.709.898-05",
          celular: "(11) 96408-6939",
          telefone: "(11) 96408-6939",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
      },
    
      {
        // Só para subir no banco
        id: "cW1699q1L9eeSGvsVSoiH4bQnsH3",
        data: {
          nome: "KATIA DA SILVA REIS ",
          email: "correa.katia85@gmail.com",
          cpf: "327.189.148-66",
          celular: "(11) 95335-9178",
          telefone: "(11) 95335-9178",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
      },
   
      // adicione outros usuários aqui...
    ];

    for (const { id, data } of novosUsuarios) {
      const userRef = doc(collection(db, "usuarios"), id);
      batch.set(userRef, data);
    }

    // ---------- Milhagem + Segurados ----------
    const novasMilhagens = [
    
      {
        id: "milhagem_044",
        milhagem: {
          produtorUid: "1nSotK3e0MaVFk8ls2Rh5RbLWpH3",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM044",
          percentualComissao: 2.7,
          valorComissao: 345.36,
          premioLiquido: 12790.96,
          premioBruto: 12790.96,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Julho",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "1nSotK3e0MaVFk8ls2Rh5RbLWpH3",
            data: {
              segurado: "CONDOMINIO LINDENBERG GROENLANDIA 77",
              apolice: "202521160051339",
              endosso: "",
              nossoNumero: "12439",
              ramo: "COND",
              seguradora: "ALLI",
              tipo: "N",
              statusSegurado: "A",
              statusDoc: "Ativo",
              dtProposta: Timestamp.fromDate(new Date("2025-05-28T21:00:00")),
              dtPrev: Timestamp.fromDate(new Date("2025-05-28T21:00:00")),
              inicioVig: Timestamp.fromDate(new Date("2025-05-28T21:00:00")),
              fimVig: Timestamp.fromDate(new Date("2026-05-28T21:00:00")),
              parc: "1/6",
              baseRepasse: "liquido",
              percentParticipacao: 100,
              percentRepasse: 2.7,
              prLiqParc:  12790.96,
              vlBase:  12790.96,
              vlRepasse: 345.36,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },
      // adicione outras milhagens aqui...
    ];

    for (const { id, milhagem, segurados } of novasMilhagens) {
      const milhagemRef = doc(collection(db, "milhagemComissoes"), id);
      batch.set(milhagemRef, milhagem);

      for (const { id: segId, data } of segurados) {
        const segRef = doc(collection(milhagemRef, "segurados"), segId);
        await setDoc(segRef, data);
      }
    }

    await batch.commit();
    console.log("Novos dados inseridos com sucesso.");
  } catch (error) {
    console.error("Erro ao inserir novos dados:", error);
  } finally {
    process.exit();
  }
}

seedNovosDados();
