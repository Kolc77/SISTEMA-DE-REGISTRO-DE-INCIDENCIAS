"use client";

import { FaRegCalendarAlt, FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

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
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-6">
        {/* Texto principal */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center leading-snug mb-12 max-w-3xl">
          Registra y da seguimiento a tus incidencias de manera rápida y segura
        </h1>

        {/* Tarjetas como botones (azules, mismo tamaño que Event) */}
        <div
          className={`w-full max-w-4xl grid grid-cols-1 ${isAdmin ? "md:grid-cols-2" : "md:grid-cols-1"} gap-12 mt-6 justify-items-center`}
        >
          {/* Botón Eventos - Visible para todos */}
          <button
            onClick={() => router.push("/event")}
            className="bg-[#1D3557] text-white rounded-2xl p-8 text-center cursor-pointer
                       transform transition-all duration-300
                       shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                       hover:-translate-y-3
                       hover:shadow-[0_20px_60px_rgba(29,53,87,0.45)]
                       border border-transparent relative overflow-hidden group
                       w-full max-w-[420px] focus:outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                  <FaRegCalendarAlt className="text-white text-5xl" />
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">Eventos</h2>
              <p className="text-sm md:text-base text-white/90">Consultar historial de eventos</p>
            </div>
          </button>

          {/* Botón Gestión de usuarios - Solo para ADMIN */}
          {isAdmin && (
            <button
              onClick={() => router.push("../admin")}
              className="bg-[#1D3557] text-white rounded-2xl p-8 text-center cursor-pointer
                         transform transition-all duration-300
                         shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                         hover:-translate-y-3
                         hover:shadow-[0_20px_60px_rgba(29,53,87,0.45)]
                         border border-transparent relative overflow-hidden group
                         w-full max-w-[420px] focus:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                    <FaUsers className="text-white text-5xl" />
                  </div>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">Gestión de usuarios</h2>
                <p className="text-sm md:text-base text-white/90">Administrar usuarios del sistema</p>
              </div>
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

