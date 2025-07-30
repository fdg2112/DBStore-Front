// src/views/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import "../styles/ProductForm.css";
import { db } from "../config/Firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const ProductForm = () => {
  const { id }      = useParams();
  const isEditing   = Boolean(id);
  const navigate    = useNavigate();

  const [form, setForm] = useState({
    title:       "",
    price:       "",
    description: "",
    image:       "",
    category:    "",
    stock: ""
  });

  const [error, setError]   = useState(null);
  const [loading, setLoading] = useState(false);

  const productsRef = collection(db, "products");

  const createProduct = async (productData) => {
    try {
      const productRef = await addDoc(productsRef, productData);
      return productRef.id;
    } catch (err) {
      console.error("Error al crear el producto:", err);
      throw new Error("Error al crear el producto");
    }
  };

  const updateProduct = async (docId, productData) => {
    try {
      const docRef = doc(db, "products", docId);
      await updateDoc(docRef, productData);
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
      throw new Error("Error al actualizar el producto");
    }
  };

  // Si estamos editando, traigo del Firestore
  useEffect(() => {
    if (!isEditing) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const docRef  = doc(db, "products", id);
        const snap    = await getDoc(docRef);
        if (!snap.exists()) {
          throw new Error("Producto no encontrado");
        }
        setForm(snap.data());
      } catch (err) {
        setError(err.message);
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

    // validaciones
    if (!form.sku || !form.title || !form.price || !form.category) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }
    if (isNaN(form.price) || parseFloat(form.price) <= 0) {
      setError("El precio debe ser un número positivo");
      return;
    }
    if (form.sku.length < 3) {
      setError("El sku del producto debe tener al menos 3 caracteres");
      return;
    }
    if (form.title.length < 3) {
      setError("El nombre del producto debe tener al menos 3 caracteres");
      return;
    }
    if (isNaN(form.stock) || parseInt(form.stock) < 0) {
      setError("El stock debe ser un número entero ≥ 0");
      return;
    }

    // Preparo el objeto que voy a mandar a Firestore
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      updatedAt: new Date().toISOString(),
      ...( !isEditing && { createdAt: new Date().toISOString() })
    };

    setLoading(true);
    try {
      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-container">
        <h2>{ isEditing ? "Editar producto" : "Agregar producto" }</h2>
        { loading && <p>Cargando...</p> }
        { error   && <p className="error-msg">{error}</p> }

        <form onSubmit={handleSubmit} className="product-form">
          <label>
            SKU
          <input name="sku" value={form.sku} onChange={handleChange} required />
          </label>
          <label>
            Nombre
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Categoría
            <input name="category" value={form.category} onChange={handleChange} required />
          </label>
          <label>
            Precio
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required/>
          </label>
          <label>
            Stock
            <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" required />
          </label>
          <label>
            Descripción
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          </label>
          <label>
            Imagen (URL)
            <input name="image" value={form.image} onChange={handleChange} />
          </label>
          <button type="submit" disabled={loading}>{ isEditing ? "Guardar cambios" : "Crear producto" }</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/dashboard")}>Cancelar</button>
        </form>
      </div>
    </Layout>
  );
};

export default ProductForm;
