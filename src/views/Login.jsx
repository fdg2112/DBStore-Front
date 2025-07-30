import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase";
import Layout from "../components/Layout/Layout";
import "../styles/Login.css";
import googleIcon from "../assets/google-icon.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch {
      setError("Error al iniciar sesión. Verificá tus datos.");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <Layout>
      <div className="login-container">
        <div className="login-info">
          <h2 className="login-title">Ingresá tu e-mail o teléfono para iniciar sesión</h2>
        </div>
        <div className="login-form-col">
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="email">E-mail o teléfono</label>
              <input type="text" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary">Continuar</button>
            <button type="button" className="btn-secondary" onClick={goToRegister}>Crear cuenta</button>
          </form>

          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

          <div className="login-divider"><span>o</span></div>

          <button type="button" className="btn-google">
            <img src={googleIcon} alt="Google icon" />
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
