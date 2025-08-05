// src/views/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/ProductForm.css";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "../services/productService";

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  // Si estamos editando, traemos el producto de la API
  useEffect(() => {
    if (!isEditing) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const product = await getProductById(id);
        setForm({
          name:        product.name,
          description: product.description,
          price:       product.price.toString(),
          stock:       product.stock.toString(),
          imageUrl:    product.imageUrl,
        });
      } catch (e) {
        setError("Producto no encontrado: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditing]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (form.name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      setError("El precio debe ser un número positivo");
      return;
    }
    const stock = parseInt(form.stock, 10);
    if (isNaN(stock) || stock < 0) {
      setError("El stock debe ser un entero mayor o igual a 0");
      return;
    }
    if (!form.imageUrl.trim()) {
      setError("La URL de la imagen es obligatoria");
      return;
    }

    const payload = {
      name:        form.name,
      description: form.description,
      price,
      stock,
      imageUrl:    form.imageUrl,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/dashboard");
    } catch (e) {
      setError("Error al guardar el producto: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>{isEditing ? "Editar producto" : "Agregar producto"}</h2>
        {loading && <p>Cargando...</p>}
        {error   && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="product-form">
          <label>
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Descripción
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </label>
          <label>
            Precio
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Stock
            <input
              name="stock"
              type="number"
              value={form.stock}
              min="0"
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Imagen (URL)
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {isEditing ? "Guardar cambios" : "Crear producto"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
          >
            Cancelar
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProductForm;
