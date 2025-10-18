"use client";
import { FaCalendarCheck, FaCalendarTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function EventosPage() {
  return (
    <ProtectedRoute>
      <EventosContent />
    </ProtectedRoute>
  );
}

function EventosContent() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Seleccione un Evento</h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">Elija entre eventos activos o pasados para continuar</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
        {/* Card - Eventos Activos */}
        <div
          onClick={() => router.push("/active_event")}
          className="bg-[#1D3557] text-white rounded-2xl p-8 text-center cursor-pointer
                     transform transition-all duration-300
                     shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                     hover:-translate-y-3
                     hover:shadow-[0_20px_60px_rgba(29,53,87,0.45)]
                     border border-transparent relative overflow-hidden group w-full max-w-[420px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                <FaCalendarCheck className="text-white text-5xl" />
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">Eventos activos</h2>
            <p className="text-sm md:text-base text-white/90">Vea los eventos que están actualmente en curso o por comenzar</p>
          </div>
        </div>

        {/* Card - Eventos Pasados */}
        <div
          onClick={() => router.push("/eventos-pasados")}
          className="bg-[#1D3557] text-white rounded-2xl p-8 text-center cursor-pointer
                     transform transition-all duration-300
                     shadow-[0_10px_40px_rgba(0,0,0,0.25)]
                     hover:-translate-y-3
                     hover:shadow-[0_20px_60px_rgba(29,53,87,0.45)]
                     border border-transparent relative overflow-hidden group w-full max-w-[420px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors duration-300">
                <FaCalendarTimes className="text-white text-5xl" />
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">Eventos pasados</h2>
            <p className="text-sm md:text-base text-white/90">Explore el archivo de eventos que ya han finalizado</p>
          </div>
        </div>
      </div>
    </div>
  );
}

