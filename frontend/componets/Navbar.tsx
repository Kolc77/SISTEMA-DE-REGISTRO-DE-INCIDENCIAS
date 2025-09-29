"use client";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // Ícono de usuario

export default function Navbar() {
  const [nombreCompleto, setNombreCompleto] = useState("Cargando...");

  // Simulación de obtener usuario de la BD (API)
  useEffect(() => {
    // Aquí harías la petición a tu backend (NestJS)
    // Ejemplo con fetch a /api/usuario
    const fetchUsuario = async () => {
      try {
        const res = await fetch("/api/usuario"); // endpoint backend
        const data = await res.json();
        setNombreCompleto(data.nombreCompleto); 
      } catch (error) {
        console.error("Error al traer usuario:", error);
        setNombreCompleto("Usuario");
      }
    };

    fetchUsuario();
  }, []);

  return (
    <nav
      className="w-full flex items-center justify-between px-6 py-2 shadow-md"
      style={{ backgroundColor: "#1D3557" }}
    >
      {/* Logo izquierda */}
      <div className="flex items-center">
        <img
          src="/logo-durango.png"
          alt="Logo Durango"
          className="h-10 w-auto"
        />
      </div>

      {/* Usuario derecha */}
      <div className="flex items-center space-x-3 text-white">
        <span className="font-medium">{nombreCompleto}</span>
        <FaUserCircle size={28} />
      </div>
    </nav>
  );
}
