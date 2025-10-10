"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPen, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';


interface Evento {
  id_evento: number;
  nombre_evento: string;
  fecha_inicio: string;
  fecha_fin?: string;
  ubicacion?: string;
  descripcion?: string;
  estatus: string;
}

export default function EventosActivosPage() {
  return (
    <ProtectedRoute>
      <EventosActivos />
    </ProtectedRoute>
  );
}

function EventosActivos() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Evento | null>(null);
  const [verDetalle, setVerDetalle] = useState<Evento | null>(null);
  const [creando, setCreando] = useState(false);
  const { isAdmin, logout } = useAuth();
  
  // Estados para filtros
  const [filtroId, setFiltroId] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // Nuevo evento para crear
  const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
    nombre_evento: "",
    fecha_inicio: "",
    fecha_fin: "",
    ubicacion: "",
    descripcion: "",
    estatus: "ACTIVO"
  });

  // Cargar eventos desde backend
  const fetchEventos = async () => {
    try {
      const res = await fetch("http://localhost:3001/eventos/activos");
      const data = await res.json();
      setEventos(data);
      setEventosFiltrados(data);
    } catch (error) {
      console.error("Error cargando eventos:", error);
      alert("Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Aplicar filtros
  const aplicarFiltros = () => {
    let resultado = [...eventos];

    if (filtroId) {
      resultado = resultado.filter(e => 
        e.id_evento.toString().includes(filtroId)
      );
    }

    if (filtroEvento) {
      resultado = resultado.filter(e =>
        e.nombre_evento.toLowerCase().includes(filtroEvento.toLowerCase())
      );
    }

    if (filtroFecha) {
      resultado = resultado.filter(e => {
        const fechaEvento = new Date(e.fecha_inicio).toISOString().split('T')[0];
        return fechaEvento === filtroFecha;
      });
    }

    setEventosFiltrados(resultado);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroId("");
    setFiltroEvento("");
    setFiltroFecha("");
    setEventosFiltrados(eventos);
  };

  // Crear evento
  const crearEvento = async () => {
    if (!nuevoEvento.nombre_evento || !nuevoEvento.fecha_inicio) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEvento),
      });
      
      if (res.ok) {
        alert("Evento creado exitosamente");
        setCreando(false);
        setNuevoEvento({
          nombre_evento: "",
          fecha_inicio: "",
          fecha_fin: "",
          ubicacion: "",
          descripcion: "",
          estatus: "ACTIVO"
        });
        fetchEventos();
      }
    } catch (error) {
      console.error("Error creando evento:", error);
      alert("Error al crear evento");
    }
  };

  // Eliminar evento
  const eliminarEvento = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;

    try {
      const res = await fetch(`http://localhost:3001/eventos/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        alert("Evento eliminado exitosamente");
        fetchEventos();
      }
    } catch (error) {
      console.error("Error eliminando evento:", error);
      alert("Error al eliminar evento");
    }
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!editando || !editando.nombre_evento || !editando.fecha_inicio) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/eventos/${editando.id_evento}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editando),
      });
      
      if (res.ok) {
        alert("Evento actualizado exitosamente");
        setEditando(null);
        fetchEventos();
      }
    } catch (error) {
      console.error("Error actualizando evento:", error);
      alert("Error al actualizar evento");
    }
  };

  // Formatear fecha para input date
  const formatearFechaParaInput = (fecha: string) => {
    if (!fecha) return "";
    return fecha.split('T')[0];
  };

  // Formatear fecha para mostrar en tabla (sin conversión de zona horaria)
  const formatearFechaParaTabla = (fecha: string) => {
    if (!fecha) return 'N/A';
    const [year, month, day] = fecha.split('T')[0].split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('es-MX');
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Eventos Activos
          </h1>
          <p className="text-gray-600">
            Consulte y gestione el historial de eventos activos
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por ID"
          value={filtroId}
          onChange={(e) => setFiltroId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-52 text-gray-800"
        />
        <input
          type="text"
          placeholder="Filtrar por nombre de evento"
          value={filtroEvento}
          onChange={(e) => setFiltroEvento(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-64 text-gray-800"
        />
        <input
          type="date"
          placeholder="Filtrar por fecha"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-52 text-gray-800"
        />
        <button 
          onClick={aplicarFiltros}
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-[#1D3557] text-white shadow hover:bg-[#2d4a6f] transition-colors"
        >
          Aplicar filtros
        </button>
        <button 
          onClick={limpiarFiltros}
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-gray-500 text-white shadow hover:bg-gray-600 transition-colors"
        >
          Limpiar
        </button>
        {isAdmin && (
          <button
            onClick={() => setCreando(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-green-600 text-white shadow hover:bg-green-700 transition-colors"
          >
            + Crear evento
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-[#1D3557] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                EVENTO
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                FECHA INICIO
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                UBICACIÓN
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-700">
                  Cargando eventos...
                </td>
              </tr>
            ) : eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <tr
                  key={evento.id_evento}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
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
                    {evento.ubicacion || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <FaEye
                        className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                        onClick={() => router.push(`/incidencias/${evento.id_evento}`)}
                        title="Ver incidencias"
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
                <td colSpan={5} className="text-center py-6 text-gray-700">
                  {filtroId || filtroEvento || filtroFecha 
                    ? "No se encontraron eventos con los filtros aplicados" 
                    : "No hay eventos activos"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Creación */}
      {creando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Crear Nuevo Evento</h2>
              <FaTimes 
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setCreando(false)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  value={nuevoEvento.nombre_evento}
                  onChange={(e) =>
                    setNuevoEvento({ ...nuevoEvento, nombre_evento: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  placeholder="Ej: Conferencia Anual 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={nuevoEvento.fecha_inicio}
                    onChange={(e) =>
                      setNuevoEvento({ ...nuevoEvento, fecha_inicio: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={nuevoEvento.fecha_fin}
                    onChange={(e) =>
                      setNuevoEvento({ ...nuevoEvento, fecha_fin: e.target.value })
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
                  value={nuevoEvento.ubicacion}
                  onChange={(e) =>
                    setNuevoEvento({ ...nuevoEvento, ubicacion: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  placeholder="Ej: Auditorio Principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={nuevoEvento.descripcion}
                  onChange={(e) =>
                    setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800 min-h-[100px]"
                  placeholder="Descripción del evento..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCreando(false)}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={crearEvento}
                className="px-5 py-2 rounded bg-[#1D3557] text-white hover:bg-[#2d4a6f] transition-colors"
              >
                Crear Evento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {editando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Editar Evento</h2>
              <FaTimes 
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setEditando(null)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Evento *
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
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={formatearFechaParaInput(editando.fecha_inicio)}
                    onChange={(e) =>
                      setEditando({ ...editando, fecha_inicio: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={formatearFechaParaInput(editando.fecha_fin || "")}
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
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Ver Detalle */}
      {verDetalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Detalles del Evento</h2>
              <FaTimes 
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setVerDetalle(null)}
              />
            </div>
            
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">ID del Evento</p>
                <p className="text-lg font-medium text-gray-800">{verDetalle.id_evento}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="text-lg font-medium text-gray-800">{verDetalle.nombre_evento}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Fecha Inicio</p>
                  <p className="text-base text-gray-800">
                    {formatearFechaParaTabla(verDetalle.fecha_inicio)}
                  </p>
                </div>
                
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Fecha Fin</p>
                  <p className="text-base text-gray-800">
                    {verDetalle.fecha_fin 
                      ? formatearFechaParaTabla(verDetalle.fecha_fin)
                      : 'No especificada'}
                  </p>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-base text-gray-800">{verDetalle.ubicacion || 'No especificada'}</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-base text-gray-800">{verDetalle.descripcion || 'Sin descripción'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Estatus</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
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
