import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../views/Home.jsx";
import Register from "../views/Register.jsx";
import Login from "../views/Login.jsx";
import NotFound from "../views/NotFound.jsx";
import ProductDetails from "../views/ProductDetails.jsx";
import Dashboard from "../views/Dashboard.jsx";
import ProductForm from "../views/ProductForm.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/add" element={<ProductForm />} />
        <Route path="/dashboard/edit/:id" element={<ProductForm />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export { Router }