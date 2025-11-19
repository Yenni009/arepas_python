import { useState } from "react";
import { api } from "./api";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Username" 
        onChange={e => setForm({ ...form, username: e.target.value })} 
      />
      
      <input 
        type="password" 
        placeholder="Password" 
        onChange={e => setForm({ ...form, password: e.target.value })} 
      />

      <button>Login</button>
    </form>
  );
}
