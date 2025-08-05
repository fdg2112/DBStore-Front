// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logoDB from "../../assets/logo.png";
import radarIcon from "../../assets/radar.png";   // ← importás el radar
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const isAdmin = userData?.roles?.includes("admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/");
  };

  return (
    <header className="header">
      <nav className="header-nav">
        {/* 1. Logo + Título */}
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <img src={logoDB} alt="Logo" className="header-logo-image" />
          </Link>
          <h1 className="header-title">Dragon Ball Store</h1>
        </div>

        {/* 2. Buscador */}
        <div className="header-search">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="header-search-input"
          />
          <button className="header-search-button">
            <img src={radarIcon} alt="Buscar" className="search-icon" />
          </button>
        </div>

        {/* 3. Menú */}
        <ul className="header-menu">
          {userData ? (
            isAdmin ? (
              <>
                <li className="header-menu-item">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="header-menu-item" onClick={handleLogout}>
                  Cerrar Sesión
                </li>
              </>
            ) : (
              <>
                <li className="header-menu-item">
                  <Link to="/perfil">Perfil</Link>
                </li>
                <li className="header-menu-item">
                  <Link to="/carrito">Carrito</Link>
                </li>
                <li className="header-menu-item" onClick={handleLogout}>
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
