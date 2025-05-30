import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { getCurrentUserFirestoreData } from "../services/comissaoService";

export const useAdminProtection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUserFirestoreData();

        if (!userData || userData.tipoUsuario !== "admin") {
          navigate("/");
          return;
        }

        setError(null);
      } catch (err) {
        console.error("Erro ao verificar permissões:", err);
        setError("Acesso não autorizado");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      checkAdminAccess();
    });

    return () => unsubscribe();
  }, [navigate]);

  return { loading, error };
};
