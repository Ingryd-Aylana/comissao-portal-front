import express from "express";
import { db } from "../firebase.js";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { produtorId, dados } = req.body;

  if (!produtorId || !dados || dados.length === 0) {
    return res.status(400).json({ error: "Dados incompletos." });
  }

  try {
    // Consolidar valores totais
    let totalPremio = 0;
    let totalComissao = 0;

    const segurados = dados.map((linha) => {
      const premio = parseFloat(linha["Prêmio Líquido"]) || 0;
      const comissao = parseFloat(linha["Com. Produtores"]) || 0;
      const inicioVig = linha["Dt. Proposta"] || "";

      totalPremio += premio;
      totalComissao += comissao;

      return {
        seguradora: linha["Seg."],
        apolice: linha["Nº Apólice"],
        inicioVig: inicioVig,
        prLiqParc: premio,
        vlRepasse: comissao,
      };
    });

    // Criar milhagem
    const novaMilhagem = {
      produtorId,
      nomeProdutor: dados[0]["Produtor"] || "Produtor",
      dataCriacao: new Date().toISOString(),
      premio: totalPremio,
      valorComissao: totalComissao,
    };

    const milhagemRef = await addDoc(collection(db, "milhagens"), novaMilhagem);

    // Subcoleção de segurados
    const seguradosRef = collection(db, "milhagens", milhagemRef.id, "segurados");

    for (const s of segurados) {
      await addDoc(seguradosRef, s);
    }

    return res.status(200).json({
      message: "Comissão importada com sucesso.",
      milhagemId: milhagemRef.id,
    });
  } catch (err) {
    console.error("Erro ao salvar dados:", err);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default router;
