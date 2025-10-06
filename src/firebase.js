// firebase.js - VERSIÓN ACTUALIZADA
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ NUEVA IMPORTACIÓN

// ✅ TUS CREDENCIALES
const firebaseConfig = {
  apiKey: "AIzaSyCZFQdDXqJsPCvYbFZ8My4G7fDOlzSU7ro",
  authDomain: "technova-app-82fa7.firebaseapp.com",
  projectId: "technova-app-82fa7",
  storageBucket: "technova-app-82fa7.firebasestorage.app", // ✅ YA TIENES ESTE CAMPO
  messagingSenderId: "1046299044233",
  appId: "1:1046299044233:web:c406585985db54625ad958"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ INICIALIZAR FIRESTORE
const db = getFirestore(app);

// ✅ INICIALIZAR STORAGE (NUEVO)
const storage = getStorage(app);

// ✅ EXPORTAR TODO
export { db, storage }; // ✅ AGREGAR storage
export default app;

console.log("✅ Firebase configurado correctamente");
console.log("✅ Firebase Storage listo para usar");