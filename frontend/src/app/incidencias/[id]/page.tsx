"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaPen, FaTrash, FaEye, FaUpload, FaTimes, FaFile, FaDownload } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Evidencia {
  id_evidencia: number;
  ruta_archivo: string;
  tipo_archivo: string;
  fecha_subida: string;
}

interface Incidencia {
  id_incidencia: number;
  id_evento: number;
  fecha: string;
  hora: string;
  id_corporacion: number;
  id_motivo: number;
  ubicacion: string;
  descripcion: string;
  usuario_crea: number;
  usuario_cierra?: number;
  fecha_cierre?: string;
  estatus: string;
  corporacion?: { nombre_corporacion: string };
  motivo?: { nombre_motivo: string };
  evento?: { nombre_evento: string };
  evidencias?: Evidencia[];
}

interface Corporacion {
  id_corporacion: number;
  nombre_corporacion: string;
}

interface Motivo {
  id_motivo: number;
  nombre_motivo: string;
}

export default function GestionIncidenciasPage() {
  return (
    <ProtectedRoute>
      <GestionIncidenciasContent />
    </ProtectedRoute>
  );
}

function GestionIncidenciasContent() {
  const params = useParams();
  const idEvento = params.id as string;

  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [incidenciasFiltradas, setIncidenciasFiltradas] = useState<Incidencia[]>([]);
  const [corporaciones, setCorporaciones] = useState<Corporacion[]>([]);
  const [motivos, setMotivos] = useState<Motivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombreEvento, setNombreEvento] = useState("");

  const [editando, setEditando] = useState<Incidencia | null>(null);
  const [verDetalle, setVerDetalle] = useState<Incidencia | null>(null);
  const [creando, setCreando] = useState(false);
  const [subiendoEvidencia, setSubiendoEvidencia] = useState(false);

  const [filtroId, setFiltroId] = useState("");
  const [filtroDescripcion, setFiltroDescripcion] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  const { user, isAdmin, logout } = useAuth();

  const [archivosEvidencia, setArchivosEvidencia] = useState<File[]>([]);
  const [incidenciaParaEvidencia, setIncidenciaParaEvidencia] = useState<number | null>(null);

  const [nuevaIncidencia, setNuevaIncidencia] = useState<Partial<Incidencia>>({
    id_evento: parseInt(idEvento),
    fecha: "",
    hora: "",
    id_corporacion: 0,
    id_motivo: 0,
    ubicacion: "",
    descripcion: "",
    usuario_crea: user?.userId || 0,
    estatus: "ABIERTA",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchIncidencias(),
        fetchCorporaciones(),
        fetchMotivos(),
        fetchEvento(),
      ]);
    };
    loadData();
  }, [idEvento]);

  const fetchIncidencias = async () => {
    try {
      const res = await fetch(`http://localhost:3001/incidencias/evento/${idEvento}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setIncidencias(data);
      setIncidenciasFiltradas(data);
    } catch (error) {
      console.error("Error cargando incidencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCorporaciones = async () => {
    try {
      const res = await fetch("http://localhost:3001/corporaciones/activas", {
        credentials: 'include',
      });
      const data = await res.json();
      setCorporaciones(data);
    } catch (error) {
      console.error("Error cargando corporaciones:", error);
    }
  };

  const fetchMotivos = async () => {
    try {
      const res = await fetch("http://localhost:3001/motivos/activos", {
        credentials: 'include',
      });
      const data = await res.json();
      setMotivos(data);
    } catch (error) {
      console.error("Error cargando motivos:", error);
    }
  };

  const fetchEvento = async () => {
    try {
      const res = await fetch(`http://localhost:3001/eventos/${idEvento}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setNombreEvento(data.nombre_evento);
    } catch (error) {
      console.error("Error cargando evento:", error);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...incidencias];
    if (filtroId) {
      resultado = resultado.filter((i) =>
        i.id_incidencia.toString().includes(filtroId)
      );
    }
    if (filtroDescripcion) {
      resultado = resultado.filter((i) =>
        i.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase())
      );
    }
    if (filtroFecha) {
      resultado = resultado.filter((i) => {
        const fechaIncidencia = i.fecha.split("T")[0];
        return fechaIncidencia === filtroFecha;
      });
    }
    setIncidenciasFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setFiltroId("");
    setFiltroDescripcion("");
    setFiltroFecha("");
    setIncidenciasFiltradas(incidencias);
  };

  const crearIncidencia = async () => {
  if (
    !nuevaIncidencia.fecha ||
    !nuevaIncidencia.hora ||
    !nuevaIncidencia.id_corporacion ||
    !nuevaIncidencia.id_motivo ||
    !nuevaIncidencia.ubicacion ||
    !nuevaIncidencia.descripcion
  ) {
    alert("Por favor completa todos los campos obligatorios");
    return;
  }

  if (archivosEvidencia.length === 0) {
    alert("Debes subir al menos una evidencia (foto o PDF)");
    return;
  }

  // 👇 AQUI agregamos el log para depurar
  console.log("Payload incidencia a enviar:", nuevaIncidencia);

  try {
    const res = await fetch("http://localhost:3001/incidencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // ← IMPORTANTE
      body: JSON.stringify(nuevaIncidencia),
    });


      if (!res.ok) throw new Error("Error al crear incidencia");

      const incidenciaCreada = await res.json();

      const promesasEvidencias = archivosEvidencia.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_incidencia", incidenciaCreada.id_incidencia.toString());
        formData.append("usuario_subio", "1");

        return fetch("http://localhost:3001/evidencias/upload", {
          method: "POST",
          body: formData,
        });
      });

      await Promise.all(promesasEvidencias);

      alert("Incidencia creada exitosamente con evidencias");
      setCreando(false);
      setArchivosEvidencia([]);
      setNuevaIncidencia({
        id_evento: parseInt(idEvento),
        fecha: "",
        hora: "",
        id_corporacion: 0,
        id_motivo: 0,
        ubicacion: "",
        descripcion: "",
        usuario_crea: user?.userId || 0,
        estatus: "ABIERTA",
      });
      fetchIncidencias();
    } catch (error) {
      console.error("Error creando incidencia:", error);
      alert("Error al crear incidencia");
    }
  };

  const subirEvidenciasAdicionales = async () => {
    if (!incidenciaParaEvidencia || archivosEvidencia.length === 0) {
      alert("Selecciona al menos un archivo");
      return;
    }

    setSubiendoEvidencia(true);

    try {
      const promesas = archivosEvidencia.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_incidencia", incidenciaParaEvidencia.toString());
        formData.append("usuario_subio", "1");

        return fetch("http://localhost:3001/evidencias/upload", {
          method: "POST",
          body: formData,
        });
      });

      await Promise.all(promesas);
      alert("Evidencias subidas exitosamente");
      setIncidenciaParaEvidencia(null);
      setArchivosEvidencia([]);
      fetchIncidencias();
    } catch (error) {
      console.error("Error subiendo evidencias:", error);
      alert("Error al subir evidencias");
    } finally {
      setSubiendoEvidencia(false);
    }
  };

  const eliminarIncidencia = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta incidencia?")) return;

    try {
      const res = await fetch(`http://localhost:3001/incidencias/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (res.ok) {
        alert("Incidencia eliminada exitosamente");
        fetchIncidencias();
      }
    } catch (error) {
      console.error("Error eliminando incidencia:", error);
      alert("Error al eliminar incidencia");
    }
  };

  const guardarEdicion = async () => {
  if (!editando) return;

  // ✅ Filtrar solo campos simples
  const incidenciaPayload = {
    fecha: editando.fecha,
    hora: editando.hora.length === 5 ? `${editando.hora}:00` : editando.hora, // asegurar formato HH:mm:ss
    id_corporacion: editando.id_corporacion,
    id_motivo: editando.id_motivo,
    ubicacion: editando.ubicacion,
    descripcion: editando.descripcion,
    estatus: editando.estatus,
  };

  try {
    const res = await fetch(
      `http://localhost:3001/incidencias/${editando.id_incidencia}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(incidenciaPayload), // ✅ Solo campos válidos
      }
    );

    if (res.ok) {
      alert("Incidencia actualizada exitosamente");
      setEditando(null);
      fetchIncidencias();
    } else {
      const errorText = await res.text();
      console.error("Error en respuesta:", errorText);
      alert("Error al actualizar incidencia");
    }
  } catch (error) {
    console.error("Error actualizando incidencia:", error);
    alert("Error al actualizar incidencia");
  }
};

  const descargarEvidencia = async (idEvidencia: number) => {
    window.open(`http://localhost:3001/evidencias/${idEvidencia}/descargar`, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivosEvidencia(Array.from(e.target.files));
    }
  };

  const formatearFechaParaInput = (fecha: string) => {
    if (!fecha) return "";
    return fecha.split("T")[0];
  };

  const formatearFechaParaTabla = (fecha: string) => {
    if (!fecha) return "N/A";
    const [year, month, day] = fecha.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800">
            Gestión de Incidencias
          </h1>
          <p className="text-gray-600">
            {nombreEvento ? `Evento: ${nombreEvento}` : "Cargando evento..."}
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Consulte el historial de incidencias por evento o cree un nuevo
      </p>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por id, descripción..."
          value={filtroId || filtroDescripcion}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d+$/.test(val) || val === "") {
              setFiltroId(val);
              setFiltroDescripcion("");
            } else {
              setFiltroDescripcion(val);
              setFiltroId("");
            }
          }}
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
          ⚡ Aplicar filtros
        </button>

        <button
          onClick={limpiarFiltros}
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-gray-500 text-white shadow hover:bg-gray-600 transition-colors"
        >
          Limpiar
        </button>

        <button
          onClick={() => setCreando(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-green-600 text-white shadow hover:bg-green-700 transition-colors ml-auto"
        >
          + Crear incidencia
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-[#1D3557] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID INCIDENCIA</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">HORA</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">INCIDENCIA</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">UBICACIÓN</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">DESCRIPCIÓN</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">FECHA</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">CORPORACIÓN</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">EVIDENCIAS</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-700">
                  Cargando incidencias...
                </td>
              </tr>
            ) : incidenciasFiltradas.length > 0 ? (
              incidenciasFiltradas.map((incidencia) => (
                <tr
                  key={incidencia.id_incidencia}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    INC-{String(incidencia.id_incidencia).padStart(3, "0")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {incidencia.hora.substring(0, 5)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 uppercase">
                    {incidencia.motivo?.nombre_motivo || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {incidencia.ubicacion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {incidencia.descripcion.length > 50
                      ? incidencia.descripcion.substring(0, 50) + "..."
                      : incidencia.descripcion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {formatearFechaParaTabla(incidencia.fecha)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {incidencia.corporacion?.nombre_corporacion || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${(incidencia.evidencias?.length || 0) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {incidencia.evidencias?.length || 0}
                      </span>
                      <button
                        onClick={() => {
                          setIncidenciaParaEvidencia(incidencia.id_incidencia);
                          setArchivosEvidencia([]);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Subir evidencia"
                      >
                        <FaUpload />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4">
                      <FaEye
                        className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                        onClick={() => setVerDetalle(incidencia)}
                        title="Ver detalles"
                      />
                      {(isAdmin || incidencia.usuario_crea === user?.userId) && (
                        <FaPen
                          className="text-green-600 cursor-pointer hover:text-green-700 transition-colors"
                          onClick={() => setEditando(incidencia)}
                          title="Editar"
                        />
                      )}
                      {isAdmin && (
                        <FaTrash
                          className="text-red-600 cursor-pointer hover:text-red-700 transition-colors"
                          onClick={() => eliminarIncidencia(incidencia.id_incidencia)}
                          title="Eliminar"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-700">
                  {filtroId || filtroDescripcion || filtroFecha
                    ? "No se encontraron incidencias con los filtros aplicados"
                    : "No hay incidencias registradas para este evento"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Creación */}
      {creando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Crear Nueva Incidencia
              </h2>
              <FaTimes
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => {
                  setCreando(false);
                  setArchivosEvidencia([]);
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={nuevaIncidencia.fecha}
                  onChange={(e) =>
                    setNuevaIncidencia({ ...nuevaIncidencia, fecha: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  value={nuevaIncidencia.hora}
                  onChange={(e) =>
                    setNuevaIncidencia({ ...nuevaIncidencia, hora: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corporación *
                </label>
                <select
                  value={nuevaIncidencia.id_corporacion}
                  onChange={(e) =>
                    setNuevaIncidencia({
                      ...nuevaIncidencia,
                      id_corporacion: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                >
                  <option value={0}>Seleccione una corporación</option>
                  {corporaciones.map((corp) => (
                    <option key={corp.id_corporacion} value={corp.id_corporacion}>
                      {corp.nombre_corporacion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo/Incidencia *
                </label>
                <select
                  value={nuevaIncidencia.id_motivo}
                  onChange={(e) =>
                    setNuevaIncidencia({
                      ...nuevaIncidencia,
                      id_motivo: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                >
                  <option value={0}>Seleccione un motivo</option>
                  {motivos.map((motivo) => (
                    <option key={motivo.id_motivo} value={motivo.id_motivo}>
                      {motivo.nombre_motivo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={nuevaIncidencia.ubicacion}
                  onChange={(e) =>
                    setNuevaIncidencia({
                      ...nuevaIncidencia,
                      ubicacion: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                  placeholder="Ej: El salto, La virgen, etc."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={nuevaIncidencia.descripcion}
                  onChange={(e) =>
                    setNuevaIncidencia({
                      ...nuevaIncidencia,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800 min-h-[100px]"
                  placeholder="Describa la incidencia..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Evidencias (Fotos o PDF) *
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
                {archivosEvidencia.length > 0 && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      {archivosEvidencia.length} archivo(s) seleccionado(s):
                    </p>
                    <ul className="text-xs text-green-700 space-y-1">
                      {archivosEvidencia.map((file, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <FaFile /> {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setCreando(false);
                  setArchivosEvidencia([]);
                }}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={crearIncidencia}
                className="px-5 py-2 rounded bg-[#1D3557] text-white hover:bg-[#2d4a6f] transition-colors"
              >
                Crear Incidencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Subir Evidencias Adicionales */}
      {incidenciaParaEvidencia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Subir Evidencias
              </h2>
              <FaTimes
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => {
                  setIncidenciaParaEvidencia(null);
                  setArchivosEvidencia([]);
                }}
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Incidencia: <span className="font-semibold">INC-{String(incidenciaParaEvidencia).padStart(3, "0")}</span>
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded text-gray-800"
              />
              {archivosEvidencia.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    {archivosEvidencia.length} archivo(s) seleccionado(s):
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {archivosEvidencia.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <FaFile /> {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIncidenciaParaEvidencia(null);
                  setArchivosEvidencia([]);
                }}
                className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={subirEvidenciasAdicionales}
                disabled={subiendoEvidencia}
                className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {subiendoEvidencia ? "Subiendo..." : "Subir Evidencias"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {editando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Editar Incidencia
              </h2>
              <FaTimes
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setEditando(null)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formatearFechaParaInput(editando.fecha)}
                  onChange={(e) =>
                    setEditando({ ...editando, fecha: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  value={editando.hora}
                  onChange={(e) =>
                    setEditando({ ...editando, hora: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corporación *
                </label>
                <select
                  value={editando.id_corporacion}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      id_corporacion: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                >
                  {corporaciones.map((corp) => (
                    <option key={corp.id_corporacion} value={corp.id_corporacion}>
                      {corp.nombre_corporacion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo/Incidencia *
                </label>
                <select
                  value={editando.id_motivo}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      id_motivo: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                >
                  {motivos.map((motivo) => (
                    <option key={motivo.id_motivo} value={motivo.id_motivo}>
                      {motivo.nombre_motivo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={editando.ubicacion}
                  onChange={(e) =>
                    setEditando({ ...editando, ubicacion: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={editando.descripcion}
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
                    setEditando({ ...editando, estatus: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded text-gray-800"
                >
                  <option value="ABIERTA">ABIERTA</option>
                  <option value="EN ATENCION">EN ATENCIÓN</option>
                  <option value="CERRADA">CERRADA</option>
                </select>
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Detalles de la Incidencia
              </h2>
              <FaTimes
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => setVerDetalle(null)}
              />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">ID Incidencia</p>
                  <p className="text-lg font-medium text-gray-800">
                    INC-{String(verDetalle.id_incidencia).padStart(3, "0")}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Estatus</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      verDetalle.estatus === "ABIERTA"
                        ? "bg-red-100 text-red-800"
                        : verDetalle.estatus === "EN ATENCION"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {verDetalle.estatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="text-base text-gray-800">
                    {formatearFechaParaTabla(verDetalle.fecha)}
                  </p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Hora</p>
                  <p className="text-base text-gray-800">
                    {verDetalle.hora.substring(0, 5)}
                  </p>
                </div>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Motivo/Incidencia</p>
                <p className="text-base text-gray-800 uppercase">
                  {verDetalle.motivo?.nombre_motivo || "N/A"}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Corporación</p>
                <p className="text-base text-gray-800">
                  {verDetalle.corporacion?.nombre_corporacion || "N/A"}
                </p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="text-base text-gray-800">{verDetalle.ubicacion}</p>
              </div>

              <div className="border-b pb-2">
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-base text-gray-800">{verDetalle.descripcion}</p>
              </div>

              {/* Sección de Evidencias */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Evidencias ({verDetalle.evidencias?.length || 0})
                </p>
                {verDetalle.evidencias && verDetalle.evidencias.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {verDetalle.evidencias.map((evidencia) => (
                      <div
                        key={evidencia.id_evidencia}
                        className="border border-gray-200 rounded p-3 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <FaFile className={`text-${evidencia.tipo_archivo === 'PDF' ? 'red' : 'blue'}-600`} />
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {evidencia.tipo_archivo}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(evidencia.fecha_subida).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => descargarEvidencia(evidencia.id_evidencia)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Descargar"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No hay evidencias registradas para esta incidencia
                  </p>
                )}
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
