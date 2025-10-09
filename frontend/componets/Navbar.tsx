"use client";

import { useRouter } from "next/navigation";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../src/app/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const nombreCompleto = loading ? "Cargando..." : user?.nombre ?? "Usuario";

  return (
    <nav
      className="w-full flex items-center justify-between px-6 py-2 shadow-md"
      style={{ backgroundColor: "#1D3557" }}
    >
      {/* Botón regresar y logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-gray-300 focus:outline-none"
          title="Regresar"
        >
          <FaArrowLeft size={22} />
        </button>
        <button
          onClick={() => router.push("/home")}
          className="focus:outline-none"
          title="Ir a inicio"
        >
          <img
            src="/logo-durango.png"
            alt="Logo Durango"
            className="h-10 w-auto"
          />
        </button>
      </div>

      {/* Usuario derecha */}
      <div className="flex items-center space-x-3 text-white">
        <span className="font-medium">{nombreCompleto}</span>
        <FaUserCircle size={28} />
      </div>
    </nav>
  );
}
