import { useState } from "react";
import { api } from "./api";
import { useNavigate, Link } from "react-router-dom";
import styles from "./css/Register.module.css";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/register", form);

      alert("Usuario registrado");
      navigate("/login");
    } catch (err) {
      console.error("ERROR:", err.response?.data || err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* NAVBAR */}
      <div className={styles.navbar}>
        <h1 className={styles.navTitle}>Arepas Python 🫓</h1>

        <Link to="/login" className={styles.navButton}>
          Login
        </Link>
      </div>

      {/* FORM */}
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Registro</h2>

        <form onSubmit={handleSubmit}>
          <input
            className={styles.inputField}
            placeholder="Username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            className={styles.inputField}
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button className={styles.submitBtn}>Registrar</button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} Arepas Python — Hecho con amor y arepas 🫓
      </footer>
    </div>
  );
}
