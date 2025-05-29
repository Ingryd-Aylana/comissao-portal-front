import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Falha no login. Por favor, verifique suas credenciais.");
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className={styles["gradient-bg"]}></div>

      <div className={styles["login-wrapper"]}>
        <div className={styles["loginContainer"]}>
          <div className={styles["loginBox"]}>
            <img
              src="/images/logo.png"
              alt="Fedcorp Logo"
              className={styles.logoImg}
            />

            <h2 className={styles.titlePortal}>Portal do Produtor</h2>
            <p className={styles.pPortal}>
              Insira seus dados para acessar a plataforma
            </p>

            {error && <p className={styles.error}>{error}</p>}

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
                />
              </div>

              <button type="submit" className={styles.loginButton}>
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
