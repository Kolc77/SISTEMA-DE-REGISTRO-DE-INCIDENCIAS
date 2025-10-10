"use client";

import { useEffect, useState } from "react";
import { FaEye, FaPen, FaTrash, FaTimes } from "react-icons/fa";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

interface Evento {
  id_evento: number;
  nombre_evento: string;
  fecha_inicio: string;
  fecha_fin?: string | null;
  ubicacion?: string;
  descripcion?: string;
  estatus: string;
}

export default function EventosPasadosPage() {
  return (
    <ProtectedRoute>
      <EventosPasados />
    </ProtectedRoute>
  );
}

function EventosPasados() {
  const { isAdmin, logout } = useAuth();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Evento | null>(null);
  const [verDetalle, setVerDetalle] = useState<Evento | null>(null);

  const [filtroId, setFiltroId] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/eventos/inactivos", {
        credentials: "include",
      });
      const data = await res.json();
      setEventos(data);
      setEventosFiltrados(data);
    } catch (error) {
      console.error("Error cargando eventos pasados:", error);
      alert("Error al cargar los eventos pasados");
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...eventos];

    if (filtroId) {
      resultado = resultado.filter((evento) =>
        evento.id_evento.toString().includes(filtroId)
      );
    }

    if (filtroEvento) {
      resultado = resultado.filter((evento) =>
        evento.nombre_evento.toLowerCase().includes(filtroEvento.toLowerCase())
      );
    }

    if (filtroFechaInicio) {
      resultado = resultado.filter((evento) => {
        const fecha = evento.fecha_inicio.split("T")[0];
        return fecha === filtroFechaInicio;
      });
    }

    if (filtroFechaFin) {
      resultado = resultado.filter((evento) => {
        const fecha = (evento.fecha_fin || "").split("T")[0];
        return fecha === filtroFechaFin;
      });
    }

    setEventosFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setFiltroId("");
    setFiltroEvento("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setEventosFiltrados(eventos);
  };

  const eliminarEvento = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;

    try {
      const res = await fetch(`http://localhost:3001/eventos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Evento eliminado correctamente");
        fetchEventos();
      }
    } catch (error) {
      console.error("Error eliminando evento:", error);
      alert("Error al eliminar el evento");
    }
  };

  const guardarEdicion = async () => {
    if (!editando || !editando.nombre_evento || !editando.fecha_inicio) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/eventos/${editando.id_evento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editando),
      });

      if (res.ok) {
        const actualizado: Evento = await res.json();
        alert("Evento actualizado correctamente");
        setEditando(null);
        if (actualizado.estatus === "ACTIVO") {
          setEventos((prev) => prev.filter((e) => e.id_evento !== actualizado.id_evento));
          setEventosFiltrados((prev) => prev.filter((e) => e.id_evento !== actualizado.id_evento));
        } else {
          setEventos((prev) =>
            prev.map((e) => (e.id_evento === actualizado.id_evento ? actualizado : e))
          );
          setEventosFiltrados((prev) =>
            prev.map((e) => (e.id_evento === actualizado.id_evento ? actualizado : e))
          );
        }
        await fetchEventos();
      }
    } catch (error) {
      console.error("Error actualizando evento:", error);
      alert("Error al actualizar el evento");
    }
  };

  const formatearFechaParaTabla = (fecha?: string) => {
    if (!fecha) return "N/A";
    const [year, month, day] = fecha.split("T")[0].split("-");
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    ).toLocaleDateString("es-MX");
  };

  const obtenerClasesEstatus = (estatus: string) => {
    if (estatus === "ACTIVO") {
      return "bg-green-100 text-green-800";
    }
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Eventos Pasados
          </h1>
          <p className="text-sm text-gray-600">
            Consulta el historial de eventos finalizados. Como administrador puedes editarlos o reactivarlos.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por ID"
          value={filtroId}
          onChange={(e) => setFiltroId(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-gray-800"
        />
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filtroEvento}
          onChange={(e) => setFiltroEvento(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-gray-800"
        />
        <input
          type="date"
          value={filtroFechaInicio}
          onChange={(e) => setFiltroFechaInicio(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-gray-800"
        />
        <input
          type="date"
          value={filtroFechaFin}
          onChange={(e) => setFiltroFechaFin(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-gray-800"
        />
      </div>

      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={aplicarFiltros}
          className="px-4 py-2 rounded-md bg-[#1D3557] text-white hover:bg-[#2d4a6f] transition-colors"
        >
          Aplicar filtros
        </button>
        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
        >
          Limpiar
        </button>
      </div>

  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#1D3557] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Evento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Fecha inicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Fecha fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-700">
                  Cargando eventos...
                </td>
              </tr>
            ) : eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr key={evento.id_evento} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {evento.id_evento}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {evento.nombre_evento}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {formatearFechaParaTabla(evento.fecha_inicio)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {formatearFechaParaTabla(evento.fecha_fin || undefined)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {evento.ubicacion || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <FaEye
                        className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                        onClick={() => setVerDetalle(evento)}
                        title="Ver detalles"
                      />
                      {isAdmin && (
                        <>
                          <FaPen
                            className="text-green-600 cursor-pointer hover:text-green-700 transition-colors"
                            onClick={() => setEditando(evento)}
                            title="Editar"
                          />
                          <FaTrash
                            className="text-red-600 cursor-pointer hover:text-red-700 transition-colors"
                            onClick={() => eliminarEvento(evento.id_evento)}
                            title="Eliminar"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-600">
                  No hay eventos pasados que coincidan con tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editando && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Editar evento
              </h2>
              <FaTimes
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setEditando(null)}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del evento *
                </label>
                <input
                  type="text"
                  value={editando.nombre_evento}
                  onChange={(e) =>
                    setEditando({ ...editando, nombre_evento: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha inicio *
                  </label>
                  <input
                    type="date"
                    value={editando.fecha_inicio.split("T")[0]}
                    onChange={(e) =>
                      setEditando({ ...editando, fecha_inicio: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={(editando.fecha_fin || "").split("T")[0]}
                    onChange={(e) =>
                      setEditando({ ...editando, fecha_fin: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={editando.ubicacion || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, ubicacion: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editando.descripcion || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, descripcion: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800 min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estatus
                </label>
                <select
                  value={editando.estatus}
                  onChange={(e) =>
                    setEditando({ ...editando, estatus: e.target.value as Evento["estatus"] })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                >
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="ACTIVO">ACTIVO</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Cambia a ACTIVO para reactivar el evento y enviarlo a la lista de eventos activos.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditando(null)}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                className="px-5 py-2 rounded bg-[#1D3557] text-white hover:bg-[#2d4a6f] transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {verDetalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Detalles del evento</h2>
              <FaTimes
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setVerDetalle(null)}
              />
            </div>

            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">ID del evento</p>
                <p className="text-lg font-medium text-gray-800">{verDetalle.id_evento}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="text-lg font-medium text-gray-800">{verDetalle.nombre_evento}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Fecha inicio</p>
                  <p className="text-base text-gray-800">
                    {formatearFechaParaTabla(verDetalle.fecha_inicio)}
                  </p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Fecha fin</p>
                  <p className="text-base text-gray-800">
                    {formatearFechaParaTabla(verDetalle.fecha_fin || undefined)}
                  </p>
                </div>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-base text-gray-800">{verDetalle.ubicacion || "No especificada"}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-base text-gray-800">{verDetalle.descripcion || "Sin descripción"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Estatus</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${obtenerClasesEstatus(verDetalle.estatus)}`}
                >
                  {verDetalle.estatus}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setVerDetalle(null)}
                className="px-5 py-2 rounded bg-[#1D3557] text-white hover:bg-[#2d4a6f] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
