import { Link } from "react-router-dom";
import "../styles/NotFound.css";
import Layout from "../components/Layout/Layout";
import img404 from "../assets/404.png";

const NotFound = () => {
  return (
    <Layout>
      <div className="notFound">
        <img src={img404} alt="404 Not Found"/>
        <h2>Parece que esta página no existe</h2>
        <Link to="/" className="notFound-link">Volver a la página principal</Link>
      </div>
    </Layout>
  );
}

export default NotFound;