"use client";

import { useEffect, useState } from "react";
import { FaPen, FaTrash, FaPlus, FaRedo } from "react-icons/fa";

interface Motivo {
  id_motivo: number;
  nombre_motivo: string;
  estatus: string;
}

export default function MotivosTab() {
  const [motivos, setMotivos] = useState<Motivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Motivo | null>(null);
  const [form, setForm] = useState({ nombre_motivo: "", estatus: "ACTIVO" });

  const API_URL = "http://localhost:3001/motivos";

  const fetchMotivos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const payload = await res.json();
      if (payload?.ok && Array.isArray(payload.data)) setMotivos(payload.data as Motivo[]);
      else setMotivos([]);
    } catch (error) {
      console.error("Error cargando motivos:", error);
      setMotivos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editando ? "PUT" : "POST";
      const url = editando ? `${API_URL}/${editando.id_motivo}` : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setModalOpen(false);
      setEditando(null);
      setForm({ nombre_motivo: "", estatus: "ACTIVO" });
      fetchMotivos();
    } catch (error) {
      console.error("Error guardando motivo:", error);
      alert("Error al guardar motivo");
    }
  };

  const handleEdit = (m: Motivo) => {
    setEditando(m);
    setForm({ nombre_motivo: m.nombre_motivo, estatus: m.estatus });
    setModalOpen(true);
  };

  const handleToggle = async (id: number) => {
    await fetch(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    fetchMotivos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este motivo?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchMotivos();
  };

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1D3557]">Motivos</h2>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditando(null);
            setForm({ nombre_motivo: "", estatus: "ACTIVO" });
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Nuevo Motivo
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-[#1D3557] text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre del Motivo</th>
                <th className="p-3 text-left">Estatus</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {motivos.map((m) => (
                <tr
                  key={m.id_motivo}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-semibold text-[#1D3557]">
                    MOT-{String(m.id_motivo).padStart(3, "0")}
                  </td>
                  <td className="p-3">{m.nombre_motivo}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        m.estatus === "ACTIVO"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {m.estatus}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <FaPen
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => handleEdit(m)}
                    />
                    <FaRedo
                      className="text-orange-600 cursor-pointer hover:text-orange-800"
                      onClick={() => handleToggle(m.id_motivo)}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleDelete(m.id_motivo)}
                    />
                  </td>
                </tr>
              ))}
              {!motivos.length && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No hay motivos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-[#1D3557]">
              {editando ? "Editar Motivo" : "Nuevo Motivo"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del Motivo"
                value={form.nombre_motivo}
                onChange={(e) =>
                  setForm({ ...form, nombre_motivo: e.target.value })
                }
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
                required
              />
              <select
                value={form.estatus}
                onChange={(e) => setForm({ ...form, estatus: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1D3557] text-white hover:bg-[#2d4a6f] rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
