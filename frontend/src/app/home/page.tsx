"use client";

import { FaRegCalendarAlt, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const router = useRouter();
  const { logout, isAdmin } = useAuth();

  return (
    <div className="relative min-h-screen">
      {/* Botón de cerrar sesión */}
      <button
        onClick={logout}
        className="absolute top-6 right-6 z-20 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Cerrar Sesión
      </button>

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/policias.jpg')",
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
        <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-8 mt-6 ${!isAdmin ? 'justify-items-center' : ''}`}>
          {/* Botón Eventos - Visible para todos */}
          <button
            onClick={() => router.push("/event")}
            className="bg-[#1D3557] p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-[250px] 
                       transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#243B6B] focus:outline-none"
          >
            <FaRegCalendarAlt className="text-white text-4xl mb-4" />
            <h2 className="text-xl font-semibold">Eventos</h2>
            <p className="text-sm mt-2">"Consultar historial de eventos"</p>
          </button>

          {/* Botón Gestión de Usuarios - Solo para ADMIN */}
          {isAdmin && (
            <button
              onClick={() => router.push("../admin")}
              className="bg-[#1D3557] p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-[250px] 
                         transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-[#243B6B] focus:outline-none"
            >
              <FaUsers className="text-white text-4xl mb-4" />
              <h2 className="text-xl font-semibold">Gestión de usuarios</h2>
              <p className="text-sm mt-2">
                "Administrar usuarios del sistema"
              </p>
            </button>
          )}
        </div>

        {/* Texto esquina inferior derecha */}
        <div className="absolute bottom-6 right-6 text-xs md:text-sm text-white tracking-wide">
          SECRETARÍA DE SEGURIDAD PÚBLICA
        </div>
      </div>
    </div>
  );
}