import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";
import styles from "./css/Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error("ERROR:", err.response?.data || err);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className={styles.page}>
      
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Arepas Python🫓</h2>
        <button
          className={styles.sidebarBtn}
          onClick={() => navigate("/register")}
        >
          Registro
        </button>
      </aside>

      {/* Contenedor principal */}
      <div className={styles.centerBox}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Iniciar Sesión</h1>

          <input
            className={styles.input}
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className={styles.button}>Ingresar</button>
        </form>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        © 2025 Arepas Python — Todos los derechos reservados
      </footer>
    </div>
  );
}

