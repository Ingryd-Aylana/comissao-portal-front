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
        id: "",
        data: {
          nome: "",
          email: "",
          cpf: "",
          celular: "",
          telefone: "",
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
        id: "milhagem_013",
        milhagem: {
          produtorUid: "",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM013",
          percentualComissao: 2.7,
          valorComissao: 501.64,
          premioLiquido: 18579.33,
          premioBruto: 19950.48,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "",
            data: {
              segurado: "",
              apolice: "",
              endosso: "",
              nossoNumero: "",
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
              prLiqParc: 18579.33,
              vlBase: 18579.33,
              vlRepasse: 501.64,
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
