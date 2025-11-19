import { useEffect, useState } from "react";
import { api } from "./api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
    getUsers(); // actualizar lista
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} - {u.email}
            <button onClick={() => deleteUser(u.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
