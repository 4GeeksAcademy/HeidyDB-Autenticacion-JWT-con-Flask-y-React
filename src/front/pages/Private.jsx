import React, { useEffect, useState } from "react";

const Private = () => {
  const [message, setMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL; // importo la variable q esta en .env

  useEffect(() => {
      getPrivateData();
  }, []);


    const getPrivateData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(BASE_URL + "/private", {
          method: "GET",
          headers: {
            
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setMessage(data.msg);
        } else {
          setMessage("Acceso denegado");
        }
      } catch (err) {
        setMessage("Error al acceder al área privada");
      }
    };
 

  return (
    <div ClassName = "text-center" >
      <h2>Bienvenido a tu Área Privada</h2>
      <p>{message}</p>
      <img class="iryo__logo" src="/auth/resources/heubd/login/ilsa/img/iryo-logo.svg" alt="Iryo"></img>
    </div>
  );
};

export default Private;