
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navbar = () => {
	 const location = useLocation();
 	 const navigate = useNavigate();

	 const token = localStorage.getItem("token");
     const user = localStorage.getItem("user.email");

	 const isAuthenticated = !!token;
	 const handleLogout = () => {
          localStorage.removeItem("token");
          navigate("/login");
       };

	return (
		<nav className="navbar navbar-red bg-red">
			 <div className="container d-flex justify-content-between">
				<div className="container">
				
				    {token && location.pathname === "/private" ? (
           			 <>
              		 <span className="me-2">👤 {user}</span>
             		 <button className="btn btn-danger" onClick={handleLogout}>
              		  Logout
              		 </button>
           			 </>
         		   ) : (
           			 <Link to="/login">
             		 <button className="btn btn-ligth">
              		  Iniciar sesión
              		</button>
           			 </Link>
          		  )}			
				</div>
			</div>
		</nav>
	);
};

