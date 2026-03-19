import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { ROLES } from "../constants/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);

        if (!firebaseUser) {
          setUser(null);
          setUserData(null);
          setLoading(false);
          return;
        }

        setUser(firebaseUser);

        const userRef = doc(db, "usuarios", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário autenticado:", error);
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const role = userData?.tipoUsuario || null;

  const isAdmin = role === "admin" || role === ROLES.ADMIN;
  const isProducer =
    role === "produtor" ||
    role === "producer" ||
    role === ROLES.PRODUTOR;

  const value = useMemo(
    () => ({
      user,
      userData,
      role,
      loading,
      isAdmin,
      isProducer,
      logout,
    }),
    [user, userData, role, loading, isAdmin, isProducer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}