import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import "../assets/css/login.css";
import data from "../data/DataBase.json";

const Menu = ({ setIsAdmin }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const usuarioValido = data.login.find(
      user => user.email === email && user.contrasena === password
    );

    if (usuarioValido) {
      
      // Actualizar estado global para mostrar MenuAdmin
      setIsAdmin(true);
      
      // Redirigir al panel de administración
      navigate("/paneladmin");
      
      // Cerrar modal y limpiar campos
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
    } else {
      setError("Email o contraseña incorrectos");
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm p-3">
        <Link className="navbar-brand d-flex align-items-center ms-auto" to="/">
          <img
            src={logo}
            alt="TechNova"
            style={{ height: "30px", marginRight: "8px" }}
          />
          <span>TechNova</span>
        </Link>

        <div className="container d-flex align-items-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item me-3">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item me-3">
                <Link className="nav-link" to="/servicios">Servicios</Link>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link login-btn"
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-backdrop-solid">
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <img
                      src={logo}
                      alt="TechNova"
                      style={{ height: "30px", marginRight: "8px" }}
                    />
                    <span>TechNova</span>
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                  ></button>
                </div>
                
                <div className="modal-body">
                  <form onSubmit={handleLogin}>
                    <div className="text-center mb-4">
                      <h4 className="login-title">Login Administrador</h4>
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ingresa tu email"
                        required
                      />
                    </div>
                    
                    <br/>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                      />
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-ingresar"
                      >
                        Ingresar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;