import Layout from "../components/Layout/Layout";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !surname || !email || !password || !role) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "usuarios", user.uid), {
        name,
        surname,
        email,
        role
      });

      setName("");
      setSurname("");
      setEmail("");
      setPassword("");
      setRole("");

      setTimeout(() => {
        setSuccessMessage("Registro exitoso. Bienvenido!");
        navigate("/");
      }, 3000);

    } catch (err) {
      setError("Hubo un error al registrar el usuario: " + err.message);
    }
  };

  return (
    <Layout>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Completá con tus datos y Registrate</h2>

        <div className="register-form-group">
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" required onChange={ (e) => setName(e.target.value) } />
        </div>

        <div className="register-form-group">
          <label htmlFor="surname">Apellido:</label>
          <input type="text" id="surname" required onChange={ (e) => setSurname(e.target.value) } />
        </div>

        <div className="register-form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" required onChange={ (e) => setEmail(e.target.value) } />
        </div>

        <div className="register-form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" required onChange={ (e) => setPassword(e.target.value) } />
        </div>

        <div className="register-form-group user-role-group">
          <label>Tipo de usuario:</label>
          <div className="role-options">
            <label>
              <input type="radio" name="role" value="cliente" required onChange={ (e) => setRole(e.target.value) } />
              Cliente
            </label>
            <label>
              <input type="radio" name="role" value="admin" required onChange={ (e) => setRole(e.target.value) } />
              Administrador
            </label>
          </div>
        </div>

        <button type="submit" className="register-button">Registrarse</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </Layout>
  );
};

export default Register;
