import { useEffect, useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";
import styles from "./css/Dashboard.module.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const getUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    getUsers();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirige al login
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.page}>
      
      {/* 🌟 NAVBAR */}
      <nav className={styles.navbar}>
        <h2 className={styles.brand}>Arepas Python 🫓</h2>
        <button className={styles.logoutBtn} onClick={logout}>
          Cerrar Sesión
        </button>
      </nav>

      <h1 className={styles.title}>Panel de Usuarios</h1>

      {/* 🔍 BUSCADOR */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className={styles.icon}>🔍</span>

          <input
            type="text"
            placeholder="Buscar usuario..."
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className={styles.btnBuscar}>Buscar</button>
        </div>
      </div>

      {/* 📄 LISTA DE USUARIOS */}
      <div className={styles.userList}>
        {filteredUsers.map((u) => (
          <div className={styles.card} key={u.id}>
            <div className={styles.userInfo}>
              <strong>{u.username}</strong> — {u.email}
            </div>

            <button
              className={styles.deleteBtn}
              onClick={() => deleteUser(u.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} Arepas Python — Dashboard 🫓✨
      </footer>
    </div>
  );
}

