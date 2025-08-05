// src/views/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/Dashboard.css";
import {
  getProducts,
  deleteProduct
} from "../services/productService";

const Dashboard = () => {
  const [products, setProducts]   = useState([]);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const navigate = useNavigate();

  // 1) Traer todos los productos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const items = await getProducts();
      setProducts(items);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los productos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    navigate("/dashboard/add");
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit/${id}`);
  };

  const confirmDelete = (id) => {
    setToDeleteId(id);
    setShowModal(true);
  };

  const cancelDelete = () => {
    setToDeleteId(null);
    setShowModal(false);
  };

  // 2) Eliminar producto vía API
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(toDeleteId);
      // Actualizo la lista en memoria sin volver a fetch
      setProducts(products.filter(p => p.id !== toDeleteId));
    } catch (e) {
      console.error(e);
      setError("Error al eliminar producto: " + e.message);
    } finally {
      setLoading(false);
      cancelDelete();
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Bienvenido al Dashboard</h1>
        <p className="dashboard-description">
          Acá podés gestionar tus productos.
        </p>

        <button className="add-btn" onClick={handleAdd}>
          Agregar producto
        </button>

        {error   && <p className="error-message">{error}</p>}
        {loading && <p>Cargando productos...</p>}

        {!loading && (
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(p.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => confirmDelete(p.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro que querés eliminar este producto?</p>
            <div className="modal-buttons">
              <button onClick={cancelDelete}>Cancelar</button>
              <button className="delete-btn" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
