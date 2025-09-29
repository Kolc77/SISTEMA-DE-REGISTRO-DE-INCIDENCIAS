"use client";

import { FaRegCalendarAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/policias.jpg')", // asegúrate que esté en /public/policias.jpg
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-6">
        {/* Texto principal */}
        <h1 className="text-2xl md:text-4xl font-bold text-center leading-snug mb-12 max-w-3xl">
          Registra y da seguimiento a tus incidencias de manera rápida y segura
        </h1>

        {/* Tarjetas como botones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Botón Eventos */}
          <button
            className="bg-[#1D3557] p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-[250px] 
                       transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#243B6B] focus:outline-none"
          >
            <FaRegCalendarAlt className="text-white text-4xl mb-4" />
            <h2 className="text-xl font-semibold">Eventos</h2>
            <p className="text-sm mt-2">"Consultar historial de eventos"</p>
          </button>

          {/* Botón Crear Evento */}
          <button
            className="bg-[#1D3557] p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-[250px] 
                       transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#243B6B] focus:outline-none"
          >
            <FaRegEdit className="text-white text-4xl mb-4" />
            <h2 className="text-xl font-semibold">Crear evento</h2>
            <p className="text-sm mt-2">
              "Haz clic aquí para registrar un nuevo evento."
            </p>
          </button>
        </div>

        {/* Texto esquina inferior derecha */}
        <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white tracking-wide">
          SECRETARÍA DE SEGURIDAD PÚBLICA
        </div>
      </div>
    </div>
  );
}
