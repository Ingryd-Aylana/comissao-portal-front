// firestoreSeed.js
import { db } from "./config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function seedFirestore() {
  try {
    const userRef = await addDoc(collection(db, "usuarios"), {
      nome: "João Silva",
      cpf: "12345678900",
      email: "joao@email.com",
      telefone: "(21) 99999-9999",
      endereco: "Rua A, 123",
      tipo: "comum",
      status: "A",
    });

    const adminRef = await addDoc(collection(db, "administradoras"), {
      razao: "Admin Seguros LTDA",
      cnpj: "12345678000100",
      responsavel: "Maria Oliveira",
      email: "admin@email.com",
      telefone: "(21) 98888-8888",
      endereco: "Av. Central, 321",
      status: "A",
    });

    const produtorRef = await addDoc(collection(db, "produtores"), {
      nome: "Carlos Andrade",
      cpf: "11122233344",
      email: "carlos@email.com",
      telefone: "(21) 91234-5678",
      status: "A",
      usuarioId: userRef.id, // <<< vínculo correto
    });

    await addDoc(collection(db, "comissoes"), {
      produtorId: produtorRef.id,
      administradoraId: adminRef.id,
      valor: 1000,
      mes: "2024-05",
      status: "pendente",
    });
  } catch (error) {
    console.error("Erro ao popular banco de dados:", error);
  }
}
