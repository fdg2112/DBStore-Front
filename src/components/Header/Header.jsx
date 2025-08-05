// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logoDB from "../../assets/logo.png";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);

  const handleLogout = () => {
    // 1) Borra el token
    localStorage.removeItem("token");
    // 2) Limpia el contexto de usuario
    setUserData(null);
    // 3) Redirige al home
    navigate("/");
  };

  // Detecta si es admin
  const isAdmin = userData?.roles?.includes("admin");

  return (
    <header className="header">
      <nav className="header-nav">
        <Link to="/" className="header-logo">
          <img
            src={logoDB}
            alt="Logo Dragon Ball Store"
            className="header-logo-image"
          />
        </Link>

        <div className="header-search">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="header-search-input"
          />
          <button className="header-search-button">🔍</button>
        </div>

        <ul className="header-menu">
          {userData ? (
            isAdmin ? (
              <>
                <li className="header-menu-item">
                  <Link to="/dashboard">📊 Dashboard</Link>
                </li>
                <li
                  className="header-menu-item"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Cerrar Sesión
                </li>
              </>
            ) : (
              <>
                <li className="header-menu-item">
                  <Link to="/perfil">🚹 Perfil</Link>
                </li>
                <li className="header-menu-item">
                  <Link to="/carrito">🛒 Carrito</Link>
                </li>
                <li
                  className="header-menu-item"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  Cerrar Sesión
                </li>
              </>
            )
          ) : (
            <>
              <li className="header-menu-item">
                <Link to="/login">Iniciar Sesión</Link>
              </li>
              <li className="header-menu-item">
                <Link to="/register">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
