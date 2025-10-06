// components/ImageUploader.jsx
import React, { useState, useEffect } from 'react';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  //  Sincronizar con la imagen actual
  useEffect(() => {
    if (currentImage) {
      setImageUrl(currentImage);
      console.log("ImageUploader cargó imagen existente:", currentImage);
    }
  }, [currentImage]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validaciones...
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 2MB permitido.');
      return;
    }

    setUploading(true);
    try {
      console.log('Subiendo imagen a ImgBB...', file.name);
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://api.imgbb.com/1/upload?key=f1982abc289277bc7d828023b00812b8', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Error en la subida a ImgBB');
      }
      
      const data = await response.json();
      const downloadURL = data.data.url;
      
      // Actualizar estados y notificar al padre
      setImageUrl(downloadURL);
      onImageUpload(downloadURL);
      
      console.log('Imagen subida correctamente:', downloadURL);
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error subiendo imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <div className="mb-2">
        <label className="form-label">
          {uploading ? 'Subiendo imagen...' : 'Seleccionar imagen'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="form-control"
        />
      </div>
      
      {uploading && (
        <div className="text-info mb-2">
          <div className="spinner-border spinner-border-sm me-2"></div>
          <small>Subiendo imagen a la nube...</small>
        </div>
      )}
      
      {/* MOSTRAR IMAGEN ACTUAL O NUEVA */}
      {imageUrl && !uploading && (
        <div className="mt-2">
          <p>
            <small>
              <strong>
                {currentImage === imageUrl ? 'Imagen actual:' : 'Nueva imagen:'}
              </strong>
            </small>
          </p>
          <img 
            src={imageUrl} 
            alt="Vista previa" 
            style={{ 
              width: '120px', 
              height: '120px', 
              objectFit: 'cover',
              borderRadius: '8px',
              border: currentImage === imageUrl ? '2px solid #6c757d' : '2px solid #28a745'
            }}
            className="img-thumbnail"
          />
          <div className="mt-1">
            <small className={currentImage === imageUrl ? "text-secondary" : "text-success"}>
              {currentImage === imageUrl ? 'Imagen actual del servicio' : 'Nueva imagen lista para guardar'}
            </small>
          </div>
        </div>
      )}

      {/* MOSTRAR SI NO HAY IMAGEN */}
      {!imageUrl && !uploading && currentImage && (
        <div className="mt-2">
          <small className="text-warning">
            ⚠️ Este servicio tiene una imagen, pero no se está mostrando
          </small>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;