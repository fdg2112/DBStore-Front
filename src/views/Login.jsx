import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/Login.css";
import googleIcon from "../assets/google-icon.png";
import shenglongBg from "../assets/shenglong.png";
import { login as loginApi } from "../services/authService";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { user, token } = await loginApi({ email, password });
      localStorage.setItem("token", token);
      setUserData({ id: user.id, email: user.email, roles: user.roles || [] });
      navigate("/");
    } catch {
      setError("Error al iniciar sesión. Verificá tus credenciales.");
    }
  };

  const goToRegister = () => navigate("/register");

  return (
    <Layout>
      <div
        className="login-background"
        style={{ backgroundImage: `url(${shenglongBg})` }}
      >
        <div className="login-container">
          <div className="login-info">
            <h2 className="login-title">
              Ingresá tu e-mail para iniciar sesión
            </h2>
          </div>
          <div className="login-form-col">
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="login-actions">
                <button type="submit" className="btn-primary">
                  Continuar
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={goToRegister}
                >
                  Crear cuenta
                </button>
              </div>
            </form>
            {error && <p className="login-error">{error}</p>}
            <div className="login-divider"><span>o</span></div>
            <button type="button" className="btn-google">
              <img src={googleIcon} alt="Google icon" />
              Iniciar sesión con Google
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
