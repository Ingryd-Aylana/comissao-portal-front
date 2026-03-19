import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCV6F7hiyegTZ5iG4Ejn3rWqKQVAex_1UY",
  authDomain: "portal-comissao-produtor.firebaseapp.com",
  projectId: "portal-comissao-produtor",
  storageBucket: "portal-comissao-produtor.firebasestorage.app",
  messagingSenderId: "9456320082",
  appId: "1:9456320082:web:dd62509ea72b1214cea98b",
  measurementId: "G-1BF681R6ML",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error) => {
      console.warn("Analytics não suportado neste ambiente:", error);
    });
}

export { app, auth, db, analytics };

// INSERIR NOVOS DADOS NO BANCO
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db, Timestamp };



