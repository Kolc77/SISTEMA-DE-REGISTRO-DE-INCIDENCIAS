"use client";
import { FaCalendarCheck, FaCalendarTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ProtectedRoute from '../components/ProtectedRoute';

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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12">
      {/* Título */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Seleccione un Evento
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Elija entre eventos activos o pasados para continuar
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
        {/* Card - Eventos Activos */}
        <div
          onClick={() => router.push("/active_event")}
          className="bg-white rounded-2xl p-8 text-center cursor-pointer 
          transform transition-all duration-300 
          shadow-[0_10px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]
          hover:-translate-y-3 
          hover:shadow-[0_20px_60px_rgba(34,197,94,0.3),0_0_0_2px_rgba(34,197,94,0.2)]
          border border-gray-100
          relative
          overflow-hidden
          group"
        >
          {/* Efecto de brillo al hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors duration-300">
                <FaCalendarCheck className="text-green-500 text-5xl" />
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Eventos activos
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Vea los eventos que están actualmente en curso o por comenzar
            </p>
          </div>
        </div>

        {/* Card - Eventos Pasados */}
        <div
          onClick={() => router.push("/eventos-pasados")}
          className="bg-white rounded-2xl p-8 text-center cursor-pointer 
          transform transition-all duration-300 
          shadow-[0_10px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]
          hover:-translate-y-3 
          hover:shadow-[0_20px_60px_rgba(239,68,68,0.3),0_0_0_2px_rgba(239,68,68,0.2)]
          border border-gray-100
          relative
          overflow-hidden
          group"
        >
          {/* Efecto de brillo al hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors duration-300">
                <FaCalendarTimes className="text-red-500 text-5xl" />
              </div>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Eventos pasados
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Explore el archivo de eventos que ya han finalizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}