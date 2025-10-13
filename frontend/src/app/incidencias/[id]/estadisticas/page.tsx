"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaChartBar, FaDownload, FaSync } from "react-icons/fa";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "../../../context/AuthContext";

interface Incidencia {
  id_incidencia: number;
  id_evento: number;
  fecha: string;
  hora: string;
  id_corporacion: number;
  id_motivo: number;
  ubicacion: string;
  descripcion: string;
  estatus: string;
  corporacion?: { nombre_corporacion: string };
  motivo?: { nombre_motivo: string };
}

interface Corporacion {
  id_corporacion: number;
  nombre_corporacion: string;
}

interface Motivo {
  id_motivo: number;
  nombre_motivo: string;
}

export default function EstadisticasIncidenciasPage() {
  return (
    <ProtectedRoute>
      <EstadisticasIncidenciasContent />
    </ProtectedRoute>
  );
}

function EstadisticasIncidenciasContent() {
  const params = useParams();
  const router = useRouter();
  const idEvento = params.id as string;

  const { logout } = useAuth();

  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [incidenciasFiltradas, setIncidenciasFiltradas] = useState<Incidencia[]>([]);
  const [corporaciones, setCorporaciones] = useState<Corporacion[]>([]);
  const [motivos, setMotivos] = useState<Motivo[]>([]);
  const [nombreEvento, setNombreEvento] = useState("");
  const [loading, setLoading] = useState(true);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [filtroCorporacion, setFiltroCorporacion] = useState("");
  const [filtroMotivo, setFiltroMotivo] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchIncidencias(),
      fetchCorporaciones(),
      fetchMotivos(),
      fetchEvento(),
    ]).finally(() => setLoading(false));
  }, [idEvento]);

  useEffect(() => {
    setIncidenciasFiltradas(incidencias);
  }, [incidencias]);

  const fetchIncidencias = async () => {
    try {
      const res = await fetch(`http://localhost:3001/incidencias/evento/${idEvento}`, {
        credentials: "include",
      });
      const payload = await res.json();
      const data = payload?.ok ? (payload.data as Incidencia[]) : [];
      setIncidencias(data);
    } catch (error) {
      console.error("Error cargando incidencias:", error);
    }
  };

  const fetchCorporaciones = async () => {
    try {
      const res = await fetch("http://localhost:3001/corporaciones/activas", {
        credentials: "include",
      });
      const payload = await res.json();
      const data = payload?.ok ? (payload.data as Corporacion[]) : [];
      setCorporaciones(data);
    } catch (error) {
      console.error("Error cargando corporaciones:", error);
    }
  };

  const fetchMotivos = async () => {
    try {
      const res = await fetch("http://localhost:3001/motivos/activos", {
        credentials: "include",
      });
      const payload = await res.json();
      const data = payload?.ok ? (payload.data as Motivo[]) : [];
      setMotivos(data);
    } catch (error) {
      console.error("Error cargando motivos:", error);
    }
  };

  const fetchEvento = async () => {
    try {
      const res = await fetch(`http://localhost:3001/eventos/${idEvento}`, {
        credentials: "include",
      });
      const payload = await res.json();
      const data = payload?.ok ? payload.data : null;
      setNombreEvento(data?.nombre_evento || "");
    } catch (error) {
      console.error("Error cargando evento:", error);
    }
  };

  const aplicarFiltros = () => {
    let resultado = [...incidencias];

    if (fechaInicio) {
      resultado = resultado.filter((incidencia) => {
        const fechaIncidencia = incidencia.fecha.split("T")[0];
        return fechaIncidencia >= fechaInicio;
      });
    }

    if (fechaFin) {
      resultado = resultado.filter((incidencia) => {
        const fechaIncidencia = incidencia.fecha.split("T")[0];
        return fechaIncidencia <= fechaFin;
      });
    }

    if (horaInicio) {
      resultado = resultado.filter((incidencia) => {
        const horaIncidencia = incidencia.hora?.substring(0, 5) || "";
        return horaIncidencia >= horaInicio;
      });
    }

    if (horaFin) {
      resultado = resultado.filter((incidencia) => {
        const horaIncidencia = incidencia.hora?.substring(0, 5) || "";
        return horaIncidencia <= horaFin;
      });
    }

    if (filtroCorporacion) {
      resultado = resultado.filter(
        (incidencia) => incidencia.id_corporacion?.toString() === filtroCorporacion
      );
    }

    if (filtroMotivo) {
      resultado = resultado.filter(
        (incidencia) => incidencia.id_motivo?.toString() === filtroMotivo
      );
    }

    setIncidenciasFiltradas(resultado);
  };

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setHoraInicio("");
    setHoraFin("");
    setFiltroCorporacion("");
    setFiltroMotivo("");
    setIncidenciasFiltradas(incidencias);
  };

  const totalIncidencias = incidenciasFiltradas.length;

  const incidenciasPorCorporacion = useMemo(() => {
    const conteo = new Map<number, number>();
    incidenciasFiltradas.forEach((incidencia) => {
      if (!incidencia.id_corporacion) return;
      conteo.set(
        incidencia.id_corporacion,
        (conteo.get(incidencia.id_corporacion) || 0) + 1
      );
    });
    return corporaciones
      .filter((corp) => conteo.has(corp.id_corporacion))
      .map((corp) => ({
        nombre: corp.nombre_corporacion,
        total: conteo.get(corp.id_corporacion) || 0,
      }));
  }, [incidenciasFiltradas, corporaciones]);

  const incidenciasPorMotivo = useMemo(() => {
    const conteo = new Map<number, number>();
    incidenciasFiltradas.forEach((incidencia) => {
      if (!incidencia.id_motivo) return;
      conteo.set(
        incidencia.id_motivo,
        (conteo.get(incidencia.id_motivo) || 0) + 1
      );
    });
    return motivos
      .filter((motivo) => conteo.has(motivo.id_motivo))
      .map((motivo) => ({
        nombre: motivo.nombre_motivo,
        total: conteo.get(motivo.id_motivo) || 0,
      }));
  }, [incidenciasFiltradas, motivos]);

  const generarReporteCSV = () => {
    const encabezados = [
      "ID Incidencia",
      "Fecha",
      "Hora",
      "Corporación",
      "Motivo",
      "Ubicación",
      "Descripción",
      "Estatus",
    ];

    const filas = incidenciasFiltradas.map((incidencia) => {
      const fecha = formatearFechaParaTabla(incidencia.fecha);
      const hora = incidencia.hora ? incidencia.hora.substring(0, 5) : "";
      const corporacion = incidencia.corporacion?.nombre_corporacion || "";
      const motivo = incidencia.motivo?.nombre_motivo || "";
      const { ubicacion, descripcion, estatus } = incidencia;

      return [
        `INC-${String(incidencia.id_incidencia).padStart(3, "0")}`,
        fecha,
        hora,
        sanitizarCSV(corporacion),
        sanitizarCSV(motivo),
        sanitizarCSV(ubicacion),
        sanitizarCSV(descripcion),
        sanitizarCSV(estatus),
      ].join(",");
    });

    const contenido = [encabezados.join(","), ...filas].join("\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_incidencias_evento_${idEvento}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-700">
          <FaSync className="animate-spin" />
          <span>Cargando información de incidencias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="flex items-center gap-4 mb-4">
        
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800">
            Reporte de Incidencias
          </h1>
          <p className="text-gray-600">
            {nombreEvento ? `Evento: ${nombreEvento}` : "Cargando evento..."}
          </p>
        </div>
        <button
          onClick={logout}
          className="hidden"
        >
          Cerrar Sesión
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Filtra las incidencias del evento por rango de fechas, horarios, corporaciones y motivos para generar reportes personalizados.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 text-gray-700">
          <FaChartBar />
          <span className="font-semibold">Filtros del reporte</span>
        </div>
        <div className="px-6 py-4 flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Fecha inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Fecha fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Hora inicio</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Hora fin</label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Corporación</label>
            <select
              value={filtroCorporacion}
              onChange={(e) => setFiltroCorporacion(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white min-w-[16rem]"
            >
              <option value="">Todas las corporaciones</option>
              {corporaciones.map((corp) => (
                <option key={corp.id_corporacion} value={corp.id_corporacion}>
                  {corp.nombre_corporacion}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Motivo</label>
            <select
              value={filtroMotivo}
              onChange={(e) => setFiltroMotivo(e.target.value)}
              className="h-10 px-3 text-sm border border-gray-300 rounded-md shadow-sm text-gray-800 bg-white min-w-[16rem]"
            >
              <option value="">Todos los motivos</option>
              {motivos.map((motivo) => (
                <option key={motivo.id_motivo} value={motivo.id_motivo}>
                  {motivo.nombre_motivo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap gap-3 justify-between">
          <div className="flex gap-3">
            <button
              onClick={aplicarFiltros}
              className="flex items-center gap-2 h-10 px-4 text-sm rounded-md bg-[#1D3557] text-white shadow hover:bg-[#2d4a6f] transition-colors"
            >
              Aplicar filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="flex items-center gap-2 h-10 px-4 text-sm rounded-md bg-gray-500 text-white shadow hover:bg-gray-600 transition-colors"
            >
              Limpiar
            </button>
          </div>

  <div className="flex gap-3">
            <button
              onClick={generarReporteCSV}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-green-600 text-white shadow hover:bg-green-700 transition-colors"
            >
              <FaDownload />
              Descargar reporte (CSV)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Incidencias filtradas</p>
          <p className="text-3xl font-semibold text-[#1D3557]">{totalIncidencias}</p>
          <p className="text-sm text-gray-500 mt-1">
            Resultados según los filtros aplicados
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Corporaciones con más incidencias</p>
          {incidenciasPorCorporacion.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {incidenciasPorCorporacion.slice(0, 4).map((item) => (
                <li key={item.nombre} className="flex justify-between">
                  <span>{item.nombre}</span>
                  <span className="font-semibold">{item.total}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Sin datos para mostrar.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Motivos más recurrentes</p>
          {incidenciasPorMotivo.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {incidenciasPorMotivo.slice(0, 4).map((item) => (
                <li key={item.nombre} className="flex justify-between">
                  <span>{item.nombre}</span>
                  <span className="font-semibold">{item.total}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Sin datos para mostrar.</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-[#1D3557] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Hora</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Corporación</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Motivo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ubicación</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {incidenciasFiltradas.length > 0 ? (
              incidenciasFiltradas.map((incidencia) => (
                <tr key={incidencia.id_incidencia} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-700 font-medium">
                    INC-{String(incidencia.id_incidencia).padStart(3, "0")}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {formatearFechaParaTabla(incidencia.fecha)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {incidencia.hora ? incidencia.hora.substring(0, 5) : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {incidencia.corporacion?.nombre_corporacion || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {incidencia.motivo?.nombre_motivo || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {incidencia.ubicacion}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {incidencia.estatus}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-700">
                  {fechaInicio ||
                  fechaFin ||
                  horaInicio ||
                  horaFin ||
                  filtroCorporacion ||
                  filtroMotivo
                    ? "No se encontraron incidencias con los filtros aplicados."
                    : "No hay incidencias registradas para este evento."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatearFechaParaTabla(fechaISO: string) {
  try {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    return fechaISO;
  }
}

function sanitizarCSV(valor: string) {
  if (!valor) return "";
  const necesitaComillas = /[",\n;]/.test(valor);
  const texto = valor.replace(/"/g, '""');
  return necesitaComillas ? `"${texto}"` : texto;
}
