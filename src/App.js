import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import MenuAdmin from "./components/MenuAdmin";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";
import PanelAdmin from "./pages/PanelAdmin";
import Login from "./pages/Login"; 

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      {/* Menú según tipo de usuario */}
      {isAdmin ? (
        <MenuAdmin setIsAdmin={setIsAdmin} />
      ) : (
        <Menu setIsAdmin={setIsAdmin} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<Servicios />} />
        
        {/* Ruta de Login */}
        <Route 
          path="/login" 
          element={<Login setIsAdmin={setIsAdmin} />} 
        />

        {/* SOLO PanelAdmin - crear/editar están integrados */}
        <Route
          path="/paneladmin"
          element={
            <PanelAdmin setIsAdmin={setIsAdmin} />
          }
        />
        
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;