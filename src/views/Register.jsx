import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/Register.css";
import shenglongBg from "../assets/shenglong.png";
import { register as registerApi } from "../services/authService";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!email || !password) {
      setError("Por favor completá email y contraseña.");
      return;
    }
    try {
      const { user, token } = await registerApi({ email, password });
      localStorage.setItem("token", token);
      setUserData({ id: user.id, email: user.email, roles: ["client"] });
      setSuccessMessage("Registro exitoso. Bienvenido!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Error al registrar: " + err.message);
    }
  };

  return (
    <Layout>
      <div
        className="register-background"
        style={{ backgroundImage: `url(${shenglongBg})` }}
      >
        <div className="register-container">
          <div className="register-info">
            <h2 className="register-title">Registrate</h2>
          </div>
          <div className="register-form-col">
            <form onSubmit={handleSubmit}>
              <div className="register-form-group">
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="password">Contraseña:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="register-actions">
                <button type="submit" className="btn-primary">
                  Registrarse
                </button>
              </div>
            </form>
            {error && <p className="register-error">{error}</p>}
            {successMessage && <p className="register-success">{successMessage}</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
