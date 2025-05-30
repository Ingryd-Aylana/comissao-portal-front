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
        id: "Yer49kPtryZQ0GHOalV1LUaoSQO2",
        data: {
          nome: "Gabriela Brito De Proença",
          email: "gabi.gbs@hotmail.com",
          cpf: "369.921.618-72",
          celular: "(11) 99677-7502",
          telefone: "(11) 99677-7502",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "QCBnKd27sQgElqAQc7THs4KdsB83",
        data: {
          nome: "Luisela Galão Dias",
          email: "luisela@gmail.com",
          cpf: "927.311.800-30",
          celular: "(11) 98812-4834",
          telefone: "(11) 98812-4834",
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
        id: "milhagem_002",
        milhagem: {
          produtorUid: "QCBnKd27sQgElqAQc7THs4KdsB83",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM002",
          percentualComissao: 2.7,
          valorComissao: 348.03,
          premioLiquido: 12890.09,
          premioBruto: 13841.37,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "CONDOMINIO PALAIS DES SPORTS",
            data: {
              segurado: "CONDOMINIO PALAIS DES SPORTS",
              apolice: "202521160037323",
              endosso: "",
              nossoNumero: "11067",
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
              prLiqParc: 12890.09,
              vlBase: 12890.09,
              vlRepasse: 348.03,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },

      {
        id: "milhagem_003",
        milhagem: {
          produtorUid: "Yer49kPtryZQ0GHOalV1LUaoSQO2",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM003",
          percentualComissao: 2.7,
          valorComissao: 176.62,
          premioLiquido: 6541.40,
          premioBruto: 7024.15,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "CONDOMINIO VIVA BENX NACOES UNIDAS II",
            data: {
              segurado: "CONDOMINIO VIVA BENX NACOES UNIDAS II",
              apolice: "202521160033834",
              endosso: "",
              nossoNumero: "10766",
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
              prLiqParc: 6541.4,
              vlBase: 6541.4,
              vlRepasse: 176.62,
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
