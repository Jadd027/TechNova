import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { db } from "../firebase";
import ImageUploader from "../components/ImageUploader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PanelAdmin = ({ setIsAdmin }) => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    detalles: "",
    precio: 0,
    promocion: false,
    imagen: ""
  });

  // Estado para manejar imágenes cargadas
  const [imagenesCargadas, setImagenesCargadas] = useState({});

  // Configuración de toast
  const mostrarExito = (mensaje) => {
    toast.success(mensaje, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const mostrarError = (mensaje) => {
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Función para normalizar datos de servicio
  const normalizarServicio = (servicio) => {
    return {
      ...servicio,
      precio: typeof servicio.precio === 'string' ? Number(servicio.precio) : servicio.precio,
      promocion: Boolean(servicio.promocion)
    };
  };

  // Cargar servicios desde Firebase
  const cargarServicios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "servicios"));
      const serviciosData = [];
      querySnapshot.forEach((doc) => {
        serviciosData.push(normalizarServicio({ id: doc.id, ...doc.data() }));
      });
      setServicios(serviciosData);
      setCargando(false);
    } catch (error) {
      console.error("Error cargando servicios:", error);
      mostrarError("Error al cargar los servicios");
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  // Manejar carga exitosa de imágenes
  const handleImageLoad = (servicioId) => {
    setImagenesCargadas(prev => ({
      ...prev,
      [servicioId]: true
    }));
  };

  // Manejar error en carga de imágenes
  const handleImageError = (servicioId) => {
    setImagenesCargadas(prev => ({
      ...prev,
      [servicioId]: false
    }));
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setServicioEditando(null);
    setFormData({
      titulo: "",
      descripcion: "",
      detalles: "",
      precio: 0,
      promocion: false,
      imagen: ""
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const handleEdit = (servicio) => {
    setServicioEditando(servicio);
    setFormData({
      titulo: servicio.titulo,
      descripcion: servicio.descripcion,
      detalles: servicio.detalles,
      precio: Number(servicio.precio) || 0,
      promocion: servicio.promocion,
      imagen: servicio.imagen
    });
    setModalAbierto(true);
  };

  // Eliminar servicio
  const handleDelete = async (servicio) => {
    if (window.confirm(`¿Estás seguro de eliminar "${servicio.titulo}"?`)) {
      try {
        await deleteDoc(doc(db, "servicios", servicio.id));
        await cargarServicios();
        mostrarExito(`Servicio "${servicio.titulo}" eliminado correctamente`);
      } catch (error) {
        console.error("Error eliminando servicio:", error);
        mostrarError("Error al eliminar el servicio");
      }
    }
  };

  // Guardar servicio (crear o actualizar)
  const guardarServicio = async () => {
    try {
      // Asegurar que el precio sea número antes de guardar
      const datosParaGuardar = {
        ...formData,
        precio: Number(formData.precio)
      };

      if (servicioEditando) {
        await updateDoc(doc(db, "servicios", servicioEditando.id), datosParaGuardar);
        mostrarExito(`Servicio "${formData.titulo}" actualizado correctamente`);
      } else {
        await addDoc(collection(db, "servicios"), datosParaGuardar);
        mostrarExito(`Servicio "${formData.titulo}" creado correctamente`);
      }
      
      setModalAbierto(false);
      await cargarServicios();
    } catch (error) {
      console.error("Error guardando servicio:", error);
      mostrarError("Error al guardar el servicio");
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'precio' ? Number(value) : // ← Conversión explícita a número
              value
    }));
  };

  // FUNCIÓN PARA MANEJAR IMAGEN SUBIDA
  const handleImageUpload = (imageUrl) => {
    console.log("📸 Imagen subida:", imageUrl);
    setFormData(prev => ({ ...prev, imagen: imageUrl }));
  };

  // Función para formatear el precio
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

  // Función para mostrar "Sí" o "No" dependiendo de la promoción
  const getPromocionText = (promocion) => {
    return promocion ? "Sí" : "No";
  };

  if (cargando) {
    return (
      <div className="container-fluid mt-4 px-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="ms-3">Cargando servicios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-5">
      {/* Container de Toast */}
      <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración</h1>
      </div>

      {/* Card principal que contiene la tabla */}
      <div className="card shadow">
        <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
          <span className="fw-bold fs-5">Servicios ({servicios.length})</span>
          <button
            className="btn btn-outline-success"
            onClick={handleCreate}
          >
            + Crear Servicio
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark position-sticky top-0">
                <tr style={{ height: "60px" }}>
                  <th className="text-center align-middle px-4" style={{ minWidth: "150px" }}>
                    Título
                  </th>
                  <th className="text-center align-middle px-4" style={{ minWidth: "200px" }}>
                    Descripción
                  </th>
                  <th className="text-center align-middle px-4" style={{ minWidth: "250px" }}>
                    Detalles
                  </th>
                  <th className="text-center align-middle px-4" style={{ minWidth: "120px" }}>
                    Precio
                  </th>
                  <th className="text-center align-middle px-4" style={{ minWidth: "120px" }}>
                    Promoción
                  </th>
                  <th className="text-center align-middle px-4" style={{ minWidth: "120px" }}>
                    Imagen
                  </th>
                  <th className="text-center align-middle px-4" style={{ minWidth: "180px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {servicios.map((servicio) => (
                  <tr key={servicio.id}>
                    <td className="text-center align-middle px-4">
                      <strong>{servicio.titulo}</strong>
                    </td>
                    <td className="text-center align-middle px-4">
                      {servicio.descripcion}
                    </td>
                    <td className="text-center align-middle px-4">
                      <small className="text-muted">{servicio.detalles}</small>
                    </td>
                    <td className="text-center align-middle px-4">
                      <span className="fw-bold text-primary">
                        {formatPrecio(servicio.precio)}
                      </span>
                    </td>
                    <td className="text-center align-middle px-4">
                      <span className={`badge ${servicio.promocion ? "bg-success" : "bg-secondary"}`}>
                        {getPromocionText(servicio.promocion)}
                      </span>
                    </td>
                    <td className="text-center align-middle px-4">
                      <div className="d-flex justify-content-center">
                        <img
                          src={servicio.imagen || "https://via.placeholder.com/60"}
                          alt={servicio.titulo}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            backgroundColor: "#f8f9fa",
                            transition: "opacity 0.3s ease"
                          }}
                          onLoad={() => handleImageLoad(servicio.id)}
                          onError={(e) => {
                            handleImageError(servicio.id);
                            e.target.src = "https://via.placeholder.com/60?text=Sin+Imagen";
                          }}
                        />
                      </div>
                    </td>
                    <td className="text-center align-middle px-4">
                      <div className="d-flex gap-3 justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(servicio)}
                          style={{ minWidth: "80px" }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(servicio)}
                          style={{ minWidth: "80px" }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <br/>
      <br/>

      {/* MODAL con ImageUploader */}
      {modalAbierto && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {servicioEditando ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setModalAbierto(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Nombre del servicio"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <input
                      type="text"
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Descripción breve del servicio"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Detalles</label>
                    <textarea
                      className="form-control"
                      name="detalles"
                      value={formData.detalles}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Descripción detallada del servicio..."
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Precio (COP)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="0"
                    />
                    <div className="form-text">
                      El valor ingresado se formateará automáticamente con separadores de miles y símbolo de moneda.
                    </div>
                  </div>
                  
                  {/* IMAGE UPLOADER */}
                  <div className="col-12">
                    <label className="form-label">Imagen del Servicio</label>
                    <ImageUploader 
                      onImageUpload={handleImageUpload}
                      currentImage={formData.imagen}
                    />
                    {!formData.imagen && (
                      <div className="text-danger mt-2">
                        <small>⚠️ Debes subir una imagen para el servicio</small>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="promocion"
                        checked={formData.promocion}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">
                        ¿En promoción?
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={guardarServicio}
                  disabled={!formData.imagen}
                >
                  {servicioEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdmin;