import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "./Header.css";
import logoDB from "../../assets/dragon.png";
import radarIcon from "../../assets/radar.png";
import { UserContext } from "../../context/UserContext";
import useDebounce from "../../hooks/useDebounce";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData } = useContext(UserContext);
  const isAdmin = userData?.roles?.includes("admin");

  const [term, setTerm] = useState("");
  const debounced = useDebounce(term, 350);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") || "";
    setTerm(q);
  }, [location.search]);

  useEffect(() => {
    if (!isHome) return;
    const t = debounced.trim();
    const targetUrl = t ? `/?q=${encodeURIComponent(t)}` : `/`;
    const currentUrl = `${location.pathname}${location.search}`;
    if (targetUrl !== currentUrl) navigate(targetUrl, { replace: true });
  }, [debounced, isHome, navigate, location.pathname, location.search]);

  const targetUrl = (t) => {
    const q = (t ?? term).trim();
    return q ? `/?q=${encodeURIComponent(q)}` : `/`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/");
  };

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <img src={logoDB} alt="Logo" className="header-logo-image" />
          </Link>
          <Link to="/" className="header-title">Dragon Ball Store</Link>
        </div>

        <div className="header-search">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="header-search-input"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (window.location.href = targetUrl(term))}
          />
          <Link to={targetUrl(term)} className="header-search-button" aria-label="Buscar">
            <img src={radarIcon} alt="" className="search-icon" />
          </Link>
        </div>

        <ul className="header-menu">
          {userData ? (
            isAdmin ? (
              <>
                <li className="header-menu-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="header-menu-item" onClick={handleLogout}>Cerrar Sesión</li>
              </>
            ) : (
              <>
                <li className="header-menu-item"><Link to="/profile">Perfil</Link></li>
                <li className="header-menu-item"><Link to="/carrito">Carrito</Link></li>
                <li className="header-menu-item" onClick={handleLogout}>Cerrar Sesión</li>
              </>
            )
          ) : (
            <>
              <li className="header-menu-item"><Link to="/login">Iniciar Sesión</Link></li>
              <li className="header-menu-item"><Link to="/register">Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
