import {Routes, Route } from "react-router-dom";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  return (
    <Routes>

      {/* Página de registro */}
      <Route path="/register" element={<Register />} />

      {/* Página de login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard (protegido más adelante si quieres) */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Register />} />

      </Routes>
  );
}
