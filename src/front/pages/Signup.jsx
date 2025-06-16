import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// este componente es para REGISTRAR UN NUEVO USUARIO por primera vez en el aplicativo
const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword]= useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

 const Registrarse = async (e) => {
    e.preventDefault();

      if (password !== confirmPassword) {
         alert("Las contraseñas no coinciden");
         return;
    }

    try {
      const res = await fetch(BASE_URL + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data)
      if (res.ok) {
        alert("Usuario registrado con éxito");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login"); // Si redirige al area privada 
      }

      else alert(data.msg);

    } catch (err) {
      alert("Error en el registro");
      console.log(err)
    }
  };


  return (
    <form onSubmit={Registrarse}
     className="container d-flex justify-content-center align-items-center vh-100">
      
      <div className="w-100" style={{ maxWidth: "400px" }}>
      <h2>Registro</h2>
      <div className="mb-3">
      <input 
         type="email" 
         placeholder="Email"
         value={email} onChange={(e) => setEmail(e.target.value)} required 
      />
      </div>

      <div className="mb-3">
      <input 
         type="password" 
         placeholder="Contraseña"
         value={password} onChange={(e) => setPassword(e.target.value)} required
      />
      </div>

      <div className="mb-3">
      <input 
         type="password" 
         placeholder="Repetir Contraseña"
         value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
      />
      </div>

      <button type="submit">Registrar nuevo usuario</button>
      </div>
    </form>
  )
}

export default Signup