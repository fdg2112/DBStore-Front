// src/views/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/Register.css";
import { register as registerApi } from "../services/authService";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [error, setError]           = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const navigate                    = useNavigate();
  const { setUserData }             = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Por favor completá email y contraseña.");
      return;
    }

    try {
      // Llamamos a tu API .NET
      const { user, token } = await registerApi({ email, password });

      // Guardamos token y user en localStorage / contexto
      localStorage.setItem("token", token);
      setUserData({
        id:    user.id,
        email: user.email,
        roles: ["client"]      // el backend siempre asigna 'client'
      });

      setSuccessMessage("Registro exitoso. Bienvenido!");
      // Redirigimos al home o al dashboard
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Error al registrar: " + err.message);
    }
  };

  return (
    <Layout>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Registrate</h2>

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

        <button type="submit" className="register-button">
          Registrarse
        </button>

        {error          && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
      </form>
    </Layout>
  );
};

export default Register;
