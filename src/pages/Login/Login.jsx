import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Autenticar com Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar dados do usuário no Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado no Firestore.");
      }

      const userData = userDoc.data();

      // Redirecionar com base no tipo de usuário
      if (userData.tipoUsuario === "admin") {
        navigate("/master/DashboardMaster");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      setError("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles["gradient-bg"]}></div>

      <div className={styles["login-wrapper"]}>
        <div className={styles["loginContainer"]}>
          <div className={styles["loginBox"]}>
            {/* Logo */}
            <img
              src="/images/logo.png"
              alt="Fedcorp Logo"
              className={styles.logoImg}
            />

            <h2 className={styles.titlePortal}>Portal do Produtor</h2>
            <p className={styles.pPortal}>
              Insira seus dados para acessar a plataforma
            </p>

            {/* Exibir erro de autenticação */}
            {error && <p className={styles.error}>{error}</p>}

            {/* Formulário de login */}
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Senha:</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Botão de login */}
              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
