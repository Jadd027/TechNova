import React, { useState, useEffect } from "react";
import "../assets/css/servicios.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate de tener tu configuración de Firebase

const Servicios = () => {
  // Estado para guardar todos los servicios desde Firebase
  const [servicios, setServicios] = useState([]);
  // Estado para guardar el servicio seleccionado en el modal
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  // Estado para mostrar u ocultar el modal
  const [showModal, setShowModal] = useState(false);
  // Estado para loading
  const [cargando, setCargando] = useState(true);

  // Cargar los servicios desde Firebase en tiempo real
  useEffect(() => {
    setCargando(true);
    
    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(
      collection(db, "servicios"),
      (querySnapshot) => {
        const serviciosData = [];
        querySnapshot.forEach((doc) => {
          const servicio = doc.data();
          // Normalizar datos como en el PanelAdmin
          serviciosData.push({ 
            id: doc.id, 
            ...servicio,
            precio: typeof servicio.precio === 'string' ? Number(servicio.precio) : servicio.precio
          });
        });
        setServicios(serviciosData);
        setCargando(false);
        console.log("🔄 Servicios actualizados en tiempo real:", serviciosData);
      },
      (error) => {
        console.error("Error cargando servicios:", error);
        setCargando(false);
      }
    );

    // Limpiar suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  // Función para formatear el precio (igual que en PanelAdmin)
  const formatPrecio = (precio) => {
    const precioNumero = Number(precio);
    
    if (isNaN(precioNumero)) {
      return "$0";
    }
    
    return precioNumero.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  // Abrir modal con el detalle de un servicio
  const verDetalle = (servicio) => {
    setServicioSeleccionado(servicio);
    setShowModal(true);
  };

  // Cerrar modal y limpiar selección
  const cerrarModal = () => {
    setShowModal(false);
    setServicioSeleccionado(null);
  };

  // Contactar por WhatsApp con mensaje prellenado
  const contactarWhatsApp = () => {
    if (!servicioSeleccionado) return;
    
    const mensaje = `Hola, estoy interesado en el servicio: ${servicioSeleccionado.titulo}`;
    const url = `https://wa.me/1234567890?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    cerrarModal();
  };

  // Mostrar loading mientras carga
  if (cargando) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando servicios...</span>
          </div>
          <span className="ms-3">Cargando servicios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Listado de servicios</h1>

      {/* Mostrar mensaje si no hay servicios */}
      {servicios.length === 0 && !cargando && (
        <div className="alert alert-info text-center">
          No hay servicios disponibles en este momento.
        </div>
      )}

      {/* Listado de tarjetas de servicios */}
      <div className="row">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="col-md-4 mb-4">
            <div className="card servicio-card h-100">
              {/* Imagen del servicio desde Firebase/ImgBB */}
              <img
                src={servicio.imagen || `${process.env.PUBLIC_URL}/Servicios/placeholder.jpg`}
                className="card-img-top"
                alt={servicio.titulo}
                style={{ 
                  height: "200px", 
                  objectFit: "cover",
                  backgroundColor: "#f8f9fa"
                }}
                onError={(e) => {
                  e.target.src = `${process.env.PUBLIC_URL}/Servicios/placeholder.jpg`;
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{servicio.titulo}</h5>
                <p className="card-text flex-grow-1">
                  {servicio.descripcion}
                </p>
                
                {/* Precio y promoción */}
                <div className="mb-2">
                  <p className="card-price fw-bold text-primary">
                    {formatPrecio(servicio.precio)}
                  </p>
                  {servicio.promocion && (
                    <span className="badge bg-success">¡En Promoción!</span>
                  )}
                </div>
                
                {/* Botón para abrir modal */}
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => verDetalle(servicio)}
                >
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles del servicio */}
      {showModal && servicioSeleccionado && (
        <div className="modal-backdrop-solid">
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                {/* Header del modal */}
                <div className="modal-header">
                  <h5 className="modal-title">Detalles del Servicio</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={cerrarModal}
                  ></button>
                </div>

                {/* Cuerpo del modal */}
                <div className="modal-body">
                  {/* Imagen grande */}
                  <div className="text-center mb-4">
                    <img
                      src={servicioSeleccionado.imagen || `${process.env.PUBLIC_URL}/Servicios/placeholder.jpg`}
                      className="modal-imagen-grande"
                      alt={servicioSeleccionado.titulo}
                      style={{ 
                        maxHeight: "300px", 
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                      onError={(e) => {
                        e.target.src = `${process.env.PUBLIC_URL}/Servicios/placeholder.jpg`;
                      }}
                    />
                  </div>

                  {/* Nombre del servicio */}
                  <h4 className="text-center mb-3">
                    {servicioSeleccionado.titulo}
                  </h4>

                  {/* Precio destacado */}
                  <div className="text-center mb-4">
                    <span className="precio-modal text-primary fs-3 fw-bold">
                      {formatPrecio(servicioSeleccionado.precio)}
                    </span>
                  </div>

                  {/* Detalles + Promoción */}
                  <div className="detalles-promocion-container mb-4">
                    <div className="row align-items-center">
                      {/* Texto de detalles */}
                      <div
                        className={
                          servicioSeleccionado.promocion
                            ? "col-md-8"
                            : "col-12"
                        }
                      >
                        <div className="detalles-content">
                          <p className="detalles-texto">
                            {servicioSeleccionado.detalles}
                          </p>
                        </div>
                      </div>

                      {/* Badge de promoción si aplica */}
                      {servicioSeleccionado.promocion && (
                        <div className="col-md-4 text-center">
                          <span className="badge bg-success promocion-badge-grande fs-6">
                            ¡EN PROMOCIÓN!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones del modal */}
                  <div className="d-flex gap-3 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-secondary btn-modal"
                      onClick={cerrarModal}
                    >
                      Volver al listado
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-modal"
                      onClick={contactarWhatsApp}
                    >
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicios;