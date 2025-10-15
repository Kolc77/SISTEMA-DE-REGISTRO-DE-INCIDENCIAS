"use client";

import { useEffect, useState } from "react";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";

interface Corporacion {
  id_corporacion: number;
  nombre_corporacion: string;
  estatus: string;
}

export default function CorporacionesTab() {
  const [corporaciones, setCorporaciones] = useState<Corporacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Corporacion | null>(null);
  const [form, setForm] = useState({ nombre_corporacion: "", estatus: "ACTIVO" });

  const API_URL = "http://localhost:3001/corporaciones";

  const fetchCorporaciones = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const payload = await res.json();
      if (payload?.ok && Array.isArray(payload.data)) setCorporaciones(payload.data as Corporacion[]);
      else setCorporaciones([]);
    } catch (error) {
      console.error("Error cargando corporaciones:", error);
      setCorporaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorporaciones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editando ? "PUT" : "POST";
      const url = editando ? `${API_URL}/${editando.id_corporacion}` : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setModalOpen(false);
      setEditando(null);
      setForm({ nombre_corporacion: "", estatus: "ACTIVO" });
      fetchCorporaciones();
    } catch (error) {
      console.error("Error guardando corporación:", error);
      alert("Error al guardar corporación");
    }
  };

  const handleEdit = (c: Corporacion) => {
    setEditando(c);
    setForm({ nombre_corporacion: c.nombre_corporacion, estatus: c.estatus });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta corporación?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const detalle = await res.text();
        let mensaje = "Error al eliminar corporación";
        if (detalle) {
          try {
            const data = JSON.parse(detalle);
            mensaje = data?.message || detalle;
          } catch {
            mensaje = detalle;
          }
        }
        alert(mensaje);
        return;
      }

      fetchCorporaciones();
    } catch (error) {
      console.error("Error eliminando corporación:", error);
      alert("Error al eliminar corporación");
    }
  };

  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1D3557]">Corporaciones</h2>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditando(null);
            setForm({ nombre_corporacion: "", estatus: "ACTIVO" });
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Nueva Corporación
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
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Estatus</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {corporaciones.map((c) => (
                <tr key={c.id_corporacion} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-[#1D3557]">
                    COR-{String(c.id_corporacion).padStart(3, "0")}
                  </td>
                  <td className="p-3">{c.nombre_corporacion}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        c.estatus === "ACTIVO"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {c.estatus}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <FaPen
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => handleEdit(c)}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleDelete(c.id_corporacion)}
                    />
                  </td>
                </tr>
              ))}
              {!corporaciones.length && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">
                    No hay corporaciones registradas.
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
              {editando ? "Editar Corporación" : "Nueva Corporación"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre de la Corporación"
                value={form.nombre_corporacion}
                onChange={(e) =>
                  setForm({ ...form, nombre_corporacion: e.target.value })
                }
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
                required
              />
              <select
                value={form.estatus}
                onChange={(e) =>
                  setForm({ ...form, estatus: e.target.value })
                }
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
