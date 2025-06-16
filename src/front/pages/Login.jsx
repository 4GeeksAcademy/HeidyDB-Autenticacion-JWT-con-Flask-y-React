
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; //sin llaves pues se exporto useGlobalReducer

const Login = () => { // este componente es para AUTENTICAR un usuario 

     const navigate = useNavigate();
   //  const { store, dispatch } = useGlobalReducer();
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const BASE_URL = import.meta.env.VITE_BACKEND_URL; // esta variable esta en .env

   const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
       console.log("Respuesta del backend:", data);
      if (res.ok) {
        localStorage.setItem("token", data.token); //guardo el token y el usuario
        localStorage.setItem("user", data.user);
        navigate("/private");
      } else {
        console.error(data.msg);
      }
    } catch (err) {
       console.error("ERROR DE FETCH:", err);
       alert("Error al iniciar sesión");
    }
  };
  

  return (
      <form onSubmit={handleLogin} 
      className="container d-flex justify-content-center align-items-center vh-100">
      
      <div className="w-100" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>

      <div className="mb-3">
      <input 
        type="email" 
        placeholder="Email" 
        value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="mb-3">
      <input 
         type="password" 
         placeholder="Contraseña"
         value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <button type="submit">Iniciar sesión</button>
      <div>
      <span>Do you want to register now? </span>
      <div>
       <Link ClassName = "text-red text-align-center" to="/signup"> Register here</Link>
       </div>
      </div>
      </div>
    </form>
  )
}

export default Login