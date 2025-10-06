import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

const MenuAdmin = ({ setIsAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Verificar que setIsAdmin sea una función antes de usarla
    if (typeof setIsAdmin === 'function') {
      // Resetear estado de admin a false
      setIsAdmin(false);
    }
    // Redirigir al inicio
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm p-3">
      <Link className="navbar-brand d-flex align-items-center ms-auto" to="/paneladmin">
        <img
          src={logo}
          alt="TechNova"
          style={{ height: "30px", marginRight: "8px" }}
        />
        <span>TechNova Admin</span>
      </Link>

      <div className="container d-flex align-items-center">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAdmin"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavAdmin"
        >
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <Link className="nav-link" to="/paneladmin">
                <i className="fas fa-table me-1"></i>
                Contenido
              </Link>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link text-light"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuAdmin;