import React from "react";
import img1 from "../assets/img/seguridad_web.jpg";
import img2 from "../assets/img/Asesoria.jpg";
import img3 from "../assets/img/consultoria.jpg";
import img4 from "../assets/img/paginasWeb.jpg";


import "../assets/css/slider.css"; 

const Slider = () => {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={img1} className="d-block w-100 slider-img" alt="Imagen 1" />
        </div>
        <div className="carousel-item">
          <img src={img2} className="d-block w-100 slider-img" alt="Imagen 2" />
        </div>
        <div className="carousel-item">
          <img src={img3} className="d-block w-100 slider-img" alt="Imagen 3" />
        </div>
         <div className="carousel-item">
          <img src={img4} className="d-block w-100 slider-img" alt="Imagen 3" />
        </div>
      </div>

      {/* Controles */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default Slider;
