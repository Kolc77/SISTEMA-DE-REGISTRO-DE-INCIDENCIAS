"use client";

import { useEffect, useState } from "react";
import { FaPen, FaTrash, FaPlus, FaRedo } from "react-icons/fa";

interface UsuarioAdmin {
  idUsuario: number; // ← CAMBIAR de id_usuario_admin si tu backend lo maneja así
  nombre: string;
  correo: string;
  rol: string;
  estatus: string;
}

export default function UsuariosAdminTab() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<UsuarioAdmin | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "CAPTURISTA",
    estatus: "ACTIVO",
  });

  const API_URL = "http://localhost:3001/usuarios-admin";

  // === Cargar usuarios ===
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, { credentials: "include" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsuarios(data);
      } else if (Array.isArray(data.data)) {
        setUsuarios(data.data);
      } else {
        console.error("Respuesta inesperada del servidor:", data);
        setUsuarios([]); // prevenir error
      }
    } catch (error) {
      console.error("Error cargando usuarios admin:", error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // === Crear o Editar ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      correo: form.correo,
      password: form.password || undefined,
      rol: form.rol,
      estatus: form.estatus,
    };

    try {
      if (editando) {
        await fetch(`${API_URL}/${editando.idUsuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      setEditando(null);
      setForm({
        nombre: "",
        correo: "",
        password: "",
        rol: "CAPTURISTA",
        estatus: "ACTIVO",
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Error al guardar usuario");
    }
  };

  // === Acciones ===
  const handleEdit = (u: UsuarioAdmin) => {
    setEditando(u);
    setForm({
      nombre: u.nombre,
      correo: u.correo,
      password: "",
      rol: u.rol,
      estatus: u.estatus,
    });
    setModalOpen(true);
  };

  const handleToggle = async (id: number) => {
    await fetch(`${API_URL}/${id}/toggle`, {
      method: "PATCH",
      credentials: "include",
    });
    fetchUsuarios();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este usuario admin?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
    fetchUsuarios();
  };

  // === Render ===
  return (
    <div className="space-y-6 text-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1D3557]">
          Usuarios 
        </h2>
        <button
          onClick={() => {
            setModalOpen(true);
            setEditando(null);
            setForm({
              nombre: "",
              correo: "",
              password: "",
              rol: "CAPTURISTA",
              estatus: "ACTIVO",
            });
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        >
          <FaPlus /> Nuevo Usuario
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
                <th className="p-3 text-left">Correo</th>
                <th className="p-3 text-left">Rol</th>
                <th className="p-3 text-left">Estatus</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr
                  key={u.idUsuario}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-semibold text-[#1D3557]">
                    ADM-{String(u.idUsuario).padStart(3, "0")}
                  </td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.correo}</td>
                  <td className="p-3">{u.rol}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        u.estatus === "ACTIVO"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {u.estatus}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <FaPen
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => handleEdit(u)}
                      title="Editar"
                    />
                    <FaRedo
                      className="text-orange-600 cursor-pointer hover:text-orange-800"
                      onClick={() => handleToggle(u.idUsuario)}
                      title="Activar / Desactivar"
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleDelete(u.idUsuario)}
                      title="Eliminar"
                    />
                  </td>
                </tr>
              ))}
              {!usuarios.length && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* === MODAL === */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-[#1D3557]">
              {editando ? "Editar Usuario Admin" : "Nuevo Usuario Admin"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
                required
              />
              <input
                type="email"
                placeholder="Correo"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
                required
              />
              <input
                type="password"
                placeholder={
                  editando ? "Nueva contraseña (opcional)" : "Contraseña"
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
                required={!editando}
              />
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full border border-gray-300 rounded p-2 text-gray-800"
              >
                <option value="CAPTURISTA">CAPTURISTA</option>
                <option value="ADMIN">ADMIN</option>
              </select>
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
