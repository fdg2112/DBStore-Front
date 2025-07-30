// src/views/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/Dashboard.css";
import { db } from "../config/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const productsCol = collection(db, "products");
  const [showModal, setShowModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(productsCol);
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setProducts(items);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los productos: " + e.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "products", toDeleteId));
      setProducts(products.filter(p => p.id !== toDeleteId));
    } catch (e) {
      console.error(e);
      setError("Error al eliminar producto: " + e.message);
    } finally {
      cancelDelete();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(p.id)}>Editar</button>
                    <button className="delete-btn" onClick={() => confirmDelete(p.id)}>Eliminar</button>
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
