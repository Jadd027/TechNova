import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc  // ✅ AGREGAR ESTA IMPORTACIÓN QUE FALTABA
} from 'firebase/firestore';
import { db } from '../firebase';  

// Función para manejar errores
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

// 🔄 VERSIÓN HÍBRIDA - Funciona con JSON Server y Firebase
export const serviciosAPI = {
  // Obtener todos los servicios
  getServicios: async () => {
    try {
      // Intenta con Firebase primero
      const querySnapshot = await getDocs(collection(db, "servicios"));
      const servicios = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("✅ Usando Firebase");
      return servicios;
    } catch (firebaseError) {
      console.log("❌ Firebase no disponible, usando JSON Server");
      console.log("ℹ️ Cuando tengas Firebase, esto funcionará automáticamente");
      
      // Fallback a JSON Server
      try {
        const response = await fetch('http://localhost:3001/servicios');
        return await handleResponse(response);
      } catch (jsonError) {
        console.error('Error cargando servicios:', jsonError);
        return [];
      }
    }
  },

  // Obtener un servicio por ID
  getServicio: async (id) => {
    try {
      // Firebase
      const docRef = doc(db, "servicios", id);
      const docSnap = await getDoc(docRef);  // ✅ AHORA getDoc ESTÁ IMPORTADO
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error("Servicio no encontrado");
    } catch (firebaseError) {
      console.log("Usando JSON Server para obtener servicio");
      // Fallback a JSON Server
      const response = await fetch(`http://localhost:3001/servicios/${id}`);
      return await handleResponse(response);
    }
  },

  // Crear nuevo servicio
  createServicio: async (servicio) => {
    try {
      // Firebase
      const docRef = await addDoc(collection(db, "servicios"), servicio);
      return { id: docRef.id, ...servicio };
    } catch (firebaseError) {
      console.log("Usando JSON Server para crear servicio");
      // Fallback a JSON Server
      const response = await fetch('http://localhost:3001/servicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicio),
      });
      return await handleResponse(response);
    }
  },

  // Actualizar servicio
  updateServicio: async (id, servicio) => {
    try {
      // Firebase
      const docRef = doc(db, "servicios", id);
      await updateDoc(docRef, servicio);
      return { id, ...servicio };
    } catch (firebaseError) {
      console.log("Usando JSON Server para actualizar servicio");
      // Fallback a JSON Server
      const response = await fetch(`http://localhost:3001/servicios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicio),
      });
      return await handleResponse(response);
    }
  },

  // Eliminar servicio
  deleteServicio: async (id) => {
    try {
      // Firebase
      await deleteDoc(doc(db, "servicios", id));
      return { id };
    } catch (firebaseError) {
      console.log("Usando JSON Server para eliminar servicio");
      // Fallback a JSON Server
      const response = await fetch(`http://localhost:3001/servicios/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    }
  }
};