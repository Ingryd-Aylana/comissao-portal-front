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
        id: "npjcz1EB8wVVokSGTRcrQhy6Rd72",
        data: {
          nome: "Bruno Cabral Albuquerque",
          email: "brunocabralalbuquerque@gmail.com",
          cpf: "442.658.228-86",
          celular: "(11) 94336-4029",
          telefone: "(11) 94336-4029",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "dUs3LUX87rRLXeY3ItM02z8GwQz2",
        data: {
          nome: "Carolina do Nascimento Santana Aires",
          email: "csa@bbz.com.br",
          cpf: "420.632.508-12",
          celular: "(11) 96816-4746",
          telefone: "(11) 96816-4746",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "G8xBrwcXsYWYjndLYe3jeqWY7Ro2",
        data: {
          nome: "Denise Alves dos Santos",
          email: "denisealvez38@gmail.com",
          cpf: "255.189.868-40",
          celular: "(11) 91415-5457",
          telefone: "(11) 91415-5457",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "OtSCSaVvtKRc8VTiofn4kb04s6w1",
        data: {
          nome: "Gisele Grunspan",
          email: "gru.gisele@gmail.com",
          cpf: "148.400.268-74",
          celular: "(11) 95342-8619",
          telefone: "(11) 95342-8619",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "7r8mBGsILMeatWwdtfbBsJbR9Dy2",
        data: {
          nome: "Karina Fernanda Martins Ribeiro",
          email: "kf@bbz.com.br",
          cpf: "130.037.196-02",
          celular: "(11) 96816-4746",
          telefone: "(11) 96816-4746",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "aZtbhJrxtcZUXcbb53XhdM5dN4n1",
        data: {
          nome: "Daniel dos Santos Junior",
          email: "DSJ@BBZ.COM.BR",
          cpf: "253.880.608-96",
          celular: "(11) 99440-6115",
          telefone: "(11) 99440-6115",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "BpwGGCXJtVYJtmcL4yBflpKMDr53",
        data: {
          nome: "Denys Raul Miquelino da Silva",
          email: "drm@bbz.com.br",
          cpf: "314.521.268-01",
          celular: "(11) 99004-6755",
          telefone: "(11) 99004-6755",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "yvgPUlafThSazDLuHaVOHkniZt12",
        data: {
          nome: "Francine Agatha de Souza Lopes",
          email: "FL@BBZ.COM.BR",
          cpf: "376.899.298-50",
          celular: "(11) 97477-7709",
          telefone: "(11) 97477-7709",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },
        
      {
        id: "EcXDq4QJRjbbiyQW4MzdyOERxQa2",
        data: {
          nome: "Carla Furlan Ajaj",
          email: "carla.ajaj@gmail.com",
          cpf: "088.354.458-09",
          celular: "(11) 99311-3613",
          telefone: "(11) 99311-3613",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "d7MyevzU5dXq9UfwPdiJNZKTSOz1",
        data: {
          nome: "Fernanda Cristina Mantovani de Souza ",
          email: "nanda.c.mantovani@gmail.com",
          cpf: "419.384.718-73",
          celular: "(11) 93380-5079",
          telefone: "(11) 93380-5079",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "DC7UqVnyukMczn4KVUIcZtrB1692",
        data: {
          nome: "Andréa Laudin",
          email: "andrealaudin28@gmail.com",
          cpf: "151.403.298-83",
          celular: "(11) 98938-8655",
          telefone: "(11) 98938-8655",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "zUf9ejgRRxWbDA16stpTo4hAitH3",
        data: {
          nome: "Adriana Conçalves dias",
          email: "driagdias@gmail.com",
          cpf: "286.919.648-20",
          celular: "(11) 94022-3109",
          telefone: "(11) 94022-3109",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "RckId1KuKbMB6xBD7zGrm8uEIcE2",
        data: {
          nome: "Erik Fukamizu Coelho",
          email: "erikfukamizu@gmail.com",
          cpf: "264.799.768-35 ",
          celular: "(11) 94861-1857",
          telefone: "(11) 94861-1857",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "YBjzII4WZ9ecnlEs21hJxAvUpou1",
        data: {
          nome: "Priscila Alcantara de Aguiar",
          email: "priscilaaguiar910@gmail.com",
          cpf: "310.813.838-36",
          celular: "(11) 95242-8194",
          telefone: "(11) 95242-8194",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "LrLLRzK67Nd0cPmGnBZmOQ49A4z1",
        data: {
          nome: "Lays de Souza Rodrigues",
          email: "syal.rodrigues@icloud.com",
          cpf: "350.252.028-33",
          celular: "(11) 91128-8315",
          telefone: "(11) 91128-8315",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "CYgl1GrZuiYFEb6kgeXmzkTGGCD3",
        data: {
          nome: "Rayane Melo",
          email: "rm@bbz.com.br",
          cpf: "452.353.238-90",
          celular: "(11) 98354-9014",
          telefone: "(11) 98354-9014",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "fi1tyAyIatbHOHPFsG5GS07XMrb2",
        data: {
          nome: "Marina Ketterer Coppola",
          email: "mah_kc@hotmail.com",
          cpf: "340.055.138-40",
          celular: "(11) 98559-6464",
          telefone: "(11) 98559-6464",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "VYzTNGi0fGNc6DXEFodhNiNEYk122",
        data: {
          nome: "Karina Ortiz Rodrigues",
          email: "kaa_ortiz@hotmail.com",
          cpf: "360.403.358-66",
          celular: "(11) 98718-2232",
          telefone: "(11) 98718-2232",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "1nSotK3e0MaVFk8ls2Rh5RbLWpH3",
        data: {
          nome: "Ana Cristina dos Santos",
          email: "santosanacristina853@gmail.com",
          cpf: "450.852.898-89",
          celular: "(11) 99950-63602",
          telefone: "(11) 99950-6360",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "azIBXEUFXgNtATjcMnr22KeLqfz1",
        data: {
          nome: "Elza Felipe Cunha da Silva ",
          email: "elzafelipe@yahoo.com.br",
          cpf: "265.581268-93",
          celular: "(11) 94153-5995",
          telefone: "(11) 94153-5995",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "DoYoYMhbZANkpedaNg919LXAPbn2",
        data: {
          nome: "Diandra Scacelas",
          email: "dscacelas@gmail.com",
          cpf: "048.031.583-39",
          celular: "(11) 94080-1700",
          telefone: "(11) 94080-1700",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "vSmI25m1bwTz8Grt3sbJEfVjUkJ3",
        data: {
          nome: "Yago Fernandes",
          email: "yfr@bbzcom.br",
          cpf: "410.518.628-09",
          celular: "(11) 94233-2105",
          telefone: "(11) 94233-2105",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "vSmI25m1bwTz8Grt3sbJEfVjUkJ3",
        data: {
          nome: "Yago Fernandes",
          email: "yfr@bbzcom.br",
          cpf: "410.518.628-09",
          celular: "(11) 94233-2105",
          telefone: "(11) 94233-2105",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "Vbh5iDKdomgEFWDrctXpqMBjVve2",
        data: {
          nome: "Mariana Almeida Rocha",
          email: "mari.a.rocha1307@gmail.com",
          cpf: "368.970.238-09",
          celular: "(13) 99153-2887",
          telefone: "(13) 99153-2887",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "g6aTnJwxAMUI79Qu4zQhkS2F5Ck1",
        data: {
          nome: "Samy Souza",
          email: "sam@bbz.com.br",
          cpf: "354.614.418-07",
          celular: "(11) 98051-2665",
          telefone: "(11) 98051-2665",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "exr9QisGvSRQxHpzFOgcXYTxRox1",
        data: {
          nome: "Denise Cuoghi Kawamura",
          email: "DC@BBZ.COM.BR",
          cpf: "305.331.135-85",
          celular: "(11) 95991-8331 ",
          telefone: "(11) 95991-8331 ",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "j9s3LN4jAIfEnWEjF81BfG4o4Nu2",
        data: {
          nome: "Odair De Souza Mattos",
          email: "odair.mattos88@gmail.com",
          cpf: "352.870.818-00",
          celular: "(11) 99174-1193",
          telefone: "(11) 99174-1193",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },


      {
        id: "FBhVjrIV0uZsydmsLDnEISW0Tdo1",
        data: {
          nome: "Liliane Souza De Melo",
          email: "lilianesouzamelo543@gmail.com",
          cpf: "352.573.528-69",
          celular: "(11) 99291-3634",
          telefone: "(11) 99291-3634",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },


      {
        id: "67igHS0qofQCTCPuyNcQGbuNLtD3",
        data: {
          nome: "Roark Stuart Kelly",
          email: "rsk@bbz.com.br",
          cpf: "305.082.488-33",
          celular: "(11) 98887-5577",
          telefone: "(11) 98887-5577",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "YvDpoxyT2cZCqE2XREYoaMQeB272",
        data: {
          nome: "Mariana Paula Dos Santos",
          email: "mariana_santos1313@hotmail.com",
          cpf: "345.136.248-17",
          celular: "(11) 97984-7943",
          telefone: "(11) 97984-7943s",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "tZJ1voC8Z8Nwht6ygnAwOnSHuao1",
        data: {
          nome: "Washington Luiz Lopes De Souza",
          email: "gerentesetord@bbz.com.br",
          cpf: "391.795.038-37",
          celular: "(11) 96444-2932",
          telefone: "(11) 96444-2932",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "0u2jBAVm6Qb2nJ3lTQnRo3Lazdy2",
        data: {
          nome: "Marcelo Ramos Junior",
          email: "marcelojunior.adm@gmail.com",
          cpf: "437.346.808-75",
          celular: "(11) 96892-7081",
          telefone: "(11) 96892-7081",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "uYFEnPsUtPYrKbWUQr5DzXe07ie2",
        data: {
          nome: "Bruna Costa De Carvalho Maia",
          email: "gerente.villalobos@bbz.com.br",
          cpf: "914.233.413-68",
          celular: "(11) 98786-2100",
          telefone: "(11) 98786-2100",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "EcXDq4QJRjbbiyQW4MzdyOERxQa2",
        data: {
          nome: "Carla Furlan Ajaj",
          email: "carla.ajaj@gmail.com",
          cpf: "088.354.458-09",
          celular: "(11) 99311-3613",
          telefone: "(11) 99311-3613",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "EcXDq4QJRjbbiyQW4MzdyOERxQa2",
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

      {
        id: "TGfplZjdDiR3V0nGk0o5T5woHDs1",
        data: {
          nome: "Nathalia Horacio Ribeiro",
          email: "nr@bbz.com.br",
          cpf: "374.515.808-30",
          celular: "(11) 94004-7857",
          telefone: "(11) 94004-7857",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "hBEa6SmY4cVa7thy63beg4eY0oQ2",
        data: {
          nome: "Leandro Amorim Rodrigues",
          email: "postoavancado@bbz.com.br",
          cpf: "414.180.658-74",
          celular: "(11) 96867-8254",
          telefone: "(11) 96867-8254",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      {
        id: "wtSyCdkvSfXThj1wyLxVofjzT912",
        data: {
          nome: "Priscila Alcantara De Aguiar",
          email: "pa@bbz.com.br",
          cpf: "310.813.838-36",
          celular: "(11)-95242-8194",
          telefone: "(11)-95242-8194",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "nCoMexoSjrbBhGrPml7X6pLk2rB3",
        data: {
          nome: "Catarine Jacomo Fernandes",
          email: "catarine.jacomo@yahoo.com.br",
          cpf: "187.200..68-77",
          celular: "(11) 99678-3386",
          telefone: "(11) 99678-3386",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "gMuKLVApkFUB0YChOpKh019mh6b2",
        data: {
          nome: "Flavia Tamires Da Silva Filgueiras",
          email: "ftf@bbz.com.br",
          cpf: "359.869.898-48",
          celular: "(11) 94733-1794",
          telefone: "(11) 94733-1794",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "EHNHyZI0jwPtN2Fr9Y8xyEAeLb63",
        data: {
          nome: "Ana Gabriela Guimaraes Dos Santos",
          email: "gga@bbz.com.br",
          cpf: "432.289.058-02",
          celular: "(11) 99254-2031",
          telefone: "(11) 99254-2031",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },


      
      {
        id: "UtimstJNxwQRZGSZUeuMjZpq2ti1",
        data: {
          nome: "Izabel Petronilo Roveri",
          email: "izabelpetronilo@bbz.com.br",
          cpf: "365.948.778-36",
          celular: "(11) 96326-7834",
          telefone: "(11) 96326-7834",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "igDHiAyOy1M92EuqiKCHZzDN8I72",
        data: {
          nome: "Elaine Soares Rocha Da Silva",
          email: "esr@bbz.com.br",
          cpf: "382.956.898-35",
          celular: "(11) 95357-3012",
          telefone: "(11) 95357-3012",
          endereco: "",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
          tipoUsuario: "produtor",
          administradoraId: "BBZ",
        },
        
      },

      
      {
        id: "X8WgxQEvJYZR4CZkB49Ywgry0Ij1",
        data: {
          nome: "Adriana De Oliveira Leal",
          email: "drika.leal09@gmail.com",
          cpf: "263.077.048-61",
          celular: "(11) 98883-0707",
          telefone: "(11) 98883-0707",
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
        id: "milhagem_004",
        milhagem: {
          produtorUid: "npjcz1EB8wVVokSGTRcrQhy6Rd72",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM004",
          percentualComissao: 2.7,
          valorComissao: 326.50,
          premioLiquido: 12092.54,
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
            id: "CONDOMINIO SPAZIO SAN TELMO",
            data: {
              segurado: "CONDOMINIO SPAZIO SAN TELMO",
              apolice: "202521160035392",
              endosso: "",
              nossoNumero: "10770",
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
              prLiqParc: 12092.54,
              vlBase: 12092.54,
              vlRepasse: 326.50,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },

      {
        id: "milhagem_005",
        milhagem: {
          produtorUid: "dUs3LUX87rRLXeY3ItM02z8GwQz2",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM005",
          percentualComissao: 2.7,
          valorComissao: 413.40,
          premioLiquido: 15310.95,
          premioBruto: 15310.95,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "CONDOMINIO FABULA SOCORRO",
            data: {
              segurado: "CONDOMINIO FABULA SOCORRO",
              apolice: "0033360",
              endosso: "",
              nossoNumero: "10765",
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
              prLiqParc: 15310.95,
              vlBase: 15310.95,
              vlRepasse: 413.40,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },

      {
        id: "milhagem_006",
        milhagem: {
          produtorUid: "G8xBrwcXsYWYjndLYe3jeqWY7Ro2",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM006",
          percentualComissao: 2.7,
          valorComissao: 444.36,
          premioLiquido: 16457.90,
          premioBruto: 16457.90,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "CONDOMINIO Z PINHEIROS",
            data: {
              segurado: "CONDOMINIO Z PINHEIROS",
              apolice: "160032927",
              endosso: "",
              nossoNumero: "10568",
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
              prLiqParc: 16457.90,
              vlBase: 16457.90,
              vlRepasse: 444.36,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },

      {
        id: "milhagem_007",
        milhagem: {
          produtorUid: "OtSCSaVvtKRc8VTiofn4kb04s6w1",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM007",
          percentualComissao: 2.7,
          valorComissao: 74.68,
          premioLiquido: 2766.05,
          premioBruto: 2766.05,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "RESIDENCIAL VILLA NOVA TIJUCO PRETO",
            data: {
              segurado: "RESIDENCIAL VILLA NOVA TIJUCO PRETO",
              apolice: "229000380",
              endosso: "",
              nossoNumero: "10338",
              ramo: "COND",
              seguradora: "HDI",
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
              prLiqParc: 2766.05,
              vlBase: 2766.05,
              vlRepasse: 74.68,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },

      {
        id: "milhagem_008",
        milhagem: {
          produtorUid: "7r8mBGsILMeatWwdtfbBsJbR9Dy2",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM008",
          percentualComissao: 2.7,
          valorComissao: 139.96,
          premioLiquido: 5138.78,
          premioBruto: 5138.78,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "CONDOMINIO ED GREEN SOLARIUM RESIDENCE",
            data: {
              segurado: "CONDOMINIO ED GREEN SOLARIUM RESIDENCE",
              apolice: "202521160036199",
              endosso: "",
              nossoNumero: "10767",
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
              prLiqParc: 5138.78,
              vlBase: 5138.78,
              vlRepasse: 139.96,
              canceladoSegurado: false,
              obsSegurado: "",
              userImportou: "BBZ",
            },
          },
        ],
      },

      {
        id: "milhagem_009",
        milhagem: {
          produtorUid: "gca4S8yckTZrF7VErm9LA5yKgJw2",
          administradoraId: "BBZ",
          numeroMilhagem: "MILHAGEM009",
          percentualComissao: 2.7,
          valorComissao: 71.36,
          premioLiquido: 2643.14,
          premioBruto: 2643.14,
          descontoComissao: 0.0,
          quantidadeSegurados: 1,
          obs: "Comissão Maio",
          dataCriacao: Timestamp.now(),
          dataAtualizacao: Timestamp.now(),
          status: "A",
        },
        segurados: [
          {
            id: "MORADORES DO JARDIM DAS PERDIZES",
            data: {
              segurado: "MORADORES DO JARDIM DAS PERDIZES",
              apolice: "1100001168",
              endosso: "",
              nossoNumero: "10940",
              ramo: "RCP",
              seguradora: "CHUB",
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
              prLiqParc: 2643.14,
              vlBase: 2643.14,
              vlRepasse: 71.36,
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
