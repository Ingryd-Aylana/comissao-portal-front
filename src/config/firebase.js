import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCV6F7hiyegTZ5iG4Ejn3rWqKQVAex_1UY",
  authDomain: "portal-comissao-produtor.firebaseapp.com",
  projectId: "portal-comissao-produtor",
  storageBucket: "portal-comissao-produtor.firebasestorage.app",
  messagingSenderId: "9456320082",
  appId: "1:9456320082:web:dd62509ea72b1214cea98b",
  measurementId: "G-1BF681R6ML",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };


// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export {db };



