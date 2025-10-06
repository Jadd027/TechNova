import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; 
const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Contáctanos a la izquierda */}
        <h5 className="mb-0">Contáctanos</h5>

        {/* Íconos a la derecha */}
        <div>
          <a href="#" className="text-white mx-2">
            <i className="bi bi-facebook fs-4"></i>
          </a>
          <a href="#" className="text-white mx-2">
            <i className="bi bi-twitter fs-4"></i>
          </a>
          <a href="#" className="text-white mx-2">
            <i className="bi bi-whatsapp fs-4"></i>
          </a>
          <a href="#" className="text-white mx-2">
            <i className="bi bi-linkedin fs-4"></i>
          </a>
          <a href="#" className="text-white mx-2">
            <i className="bi bi-github fs-4"></i>
          </a>
        </div>
      </div>

      </footer>
  );
};

export default Footer;
