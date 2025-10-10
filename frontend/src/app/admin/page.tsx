"use client";
import { useState } from "react";
import UsuariosAdminTab from "./components/UsuariosAdminTab";
import MotivosTab from "./components/MotivosTab";
import CorporacionesTab from "./components/CorporacionesTab";

export default function AdminPage() {
  const [tab, setTab] = useState<"usuarios" | "motivos" | "corporaciones">("usuarios");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#1D3557]">Panel de Administración</h1>

      <div className="flex gap-2 bg-white p-2 rounded-xl shadow mb-6">
        <button
          className={`px-4 py-2 rounded-xl ${
            tab === "usuarios"
              ? "bg-[#1D3557] text-white"
              : "hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTab("usuarios")}
        >
          Usuarios 
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            tab === "motivos"
              ? "bg-[#1D3557] text-white"
              : "hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTab("motivos")}
        >
          Motivos
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            tab === "corporaciones"
              ? "bg-[#1D3557] text-white"
              : "hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTab("corporaciones")}
        >
          Corporaciones
        </button>
      </div>

      {tab === "usuarios" && <UsuariosAdminTab />}
      {tab === "motivos" && <MotivosTab />}
      {tab === "corporaciones" && <CorporacionesTab />}
    </div>
  );
}
