// firestoreSeed.js
import { db } from "./firebase.js";
import {
  Timestamp,
  writeBatch,
  collection,
  doc,
} from "firebase/firestore";

async function seedNovosDados() {
  console.log("Iniciando seed de novos dados...");

  const batch = writeBatch(db);

  try {
    // ---------- Usuários ----------
    const novosUsuarios = [
      {
        id: "umRTXDDDhJe5Bdrui4Cd68eRzmJ3",
        data: {
          nome: "Jeferson Janes da Silva Bezerra",
          email: "jefersonjsb31@gmail.com",
          cpf: "427.317.768-46",
          celular: "(13) 99796-1307",
          telefone: "(13) 99796-1307",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
      },

      // ...adicione outros usuários aqui...
    ];

    for (const { id, data } of novosUsuarios) {
      const usuariosCollection = collection(db, "usuarios");

      // Se tiver ID, usa. Se vier vazio (""), gera ID automático.
      const userRef =
        id && id.trim() !== ""
          ? doc(usuariosCollection, id)
          : doc(usuariosCollection);

      batch.set(userRef, data);
    }

    // ---------- Milhagem + Segurados ----------
    const novasMilhagens = [

        {
        id: "milhagem_082",
        milhagem: {
          produtorUid: "LrLLRzK67Nd0cPmGnBZmOQ49A4z1",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM082",
          percentualComissao: 2.7,
          valorComissao: 85.98,
          premioLiquido: 3419.65,
          premioBruto: 3184.62,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Fevereiro",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "LrLLRzK67Nd0cPmGnBZmOQ49A4z1",
            data: {
              segurado: "CONDOMINIO EDIFICIO RIO DOURADO",
              apolice: "202521160096906",
              endosso: "",
              nossoNumero: "17292",
              ramo: "COND",
              seguradora: "ALLIANZ",
              tipo: "N",
              statusSegurado: "A",
              statusDoc: "Ativo",
              dtProposta: Timestamp.fromDate(
                new Date("2025-05-28T21:00:00")
              ),
              dtPrev: Timestamp.fromDate(
                new Date("2025-05-28T21:00:00")
              ),
              inicioVig: Timestamp.fromDate(
                new Date("2025-05-28T21:00:00")
              ),
              fimVig: Timestamp.fromDate(
                new Date("2026-05-28T21:00:00")
              ),
              parc: "1/6",
              baseRepasse: "liquido",
              percentParticipacao: 100,
              percentRepasse: 2.7,
              prLiqParc: 85.98,
              vlBase: 3184.62,
              vlRepasse: 3184.62,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },


        {
        id: "milhagem_083",
        milhagem: {
          produtorUid: "X8WgxQEvJYZR4CZkB49Ywgry0Ij1",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM083",
          percentualComissao: 2.7,
          valorComissao: 264.15,
          premioLiquido: 9783.30,
          premioBruto: 10505.31,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Fevereiro",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "X8WgxQEvJYZR4CZkB49Ywgry0Ij1",
            data: {
              segurado: "CONDOMINIO ESPACO SAO PAULO 2",
              apolice: "202621160010349",
              endosso: "",
              nossoNumero: "19008",
              ramo: "COND",
              seguradora: "ALLIANZ",
              tipo: "N",
              statusSegurado: "A",
              statusDoc: "Ativo",
              dtProposta: Timestamp.fromDate(
                new Date("2025-05-28T21:00:00")
              ),
              dtPrev: Timestamp.fromDate(
                new Date("2025-05-28T21:00:00")
              ),
              inicioVig: Timestamp.fromDate(
                new Date("2025-05-28T21:00:00")
              ),
              fimVig: Timestamp.fromDate(
                new Date("2026-05-28T21:00:00")
              ),
              parc: "1/6",
              baseRepasse: "liquido",
              percentParticipacao: 100,
              percentRepasse: 2.7,
              prLiqParc: 264.15,
              vlBase: 9783.30,
              vlRepasse: 9783.30,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },
      // ...adicione outras milhagens aqui...
    ];

    for (const { id, milhagem, segurados } of novasMilhagens) {
      const milhagemRef = doc(
        collection(db, "milhagemComissoes"),
        id
      );
      batch.set(milhagemRef, milhagem);

      for (const { id: segId, data } of segurados) {
        const seguradosCollection = collection(
          milhagemRef,
          "segurados"
        );
        const segRef = doc(seguradosCollection, segId);
        batch.set(segRef, data);
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
