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
        id: "l4VYEXWSchVkFWzYgaljuvfiNgy2",
        data: {
          nome: "Fernanda Bertusso",
          email: "fab@bbz.com.br",
          cpf: "319.739.838-69",
          celular: "(11)996473696",
          telefone: "(11)996473696",
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
        id: "milhagem_001",
        milhagem: {
          produtorUid: "l4VYEXWSchVkFWzYgaljuvfiNgy2",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM001",
          percentualComissao: 2.7,
          valorComissao: 607.65,
          premioLiquido: 22505.57,
          premioBruto: 24166.48,
          descontoComissao: 0.0,
          quantidadeSegurados: 2,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "CONDOMINIO JARDINS DO BRASIL",
            data: {
              segurado: "CONDOMINIO JARDINS DO BRASIL",
              apolice: "202521160033841",
              endosso: "",
              nossoNumero: "10768",
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
              prLiqParc: 11532.92,
              vlBase: 11532.92,
              vlRepasse: 311.39,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
          {
            id: "COND JARDINS DO BRASIL - ATLANTICA",
            data: {
              segurado: "COND JARDINS DO BRASIL - ATLANTICA",
              apolice: "202521160035393",
              endosso: "",
              nossoNumero: "10906",
              ramo: "COND",
              seguradora: "ALLI",
              tipo: "N",
              statusSegurado: "A",
              statusDoc: "Ativo",
              dtProposta: Timestamp.fromDate(new Date("2025-05-29T21:00:00")),
              dtPrev: Timestamp.fromDate(new Date("2025-05-29T21:00:00")),
              inicioVig: Timestamp.fromDate(new Date("2025-05-29T21:00:00")),
              fimVig: Timestamp.fromDate(new Date("2026-05-29T21:00:00")),
              parc: "1/6",
              baseRepasse: "liquido",
              percentParticipacao: 100,
              percentRepasse: 2.7,
              prLiqParc: 10972.65,
              vlBase: 10972.65,
              vlRepasse: 296.26,
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
