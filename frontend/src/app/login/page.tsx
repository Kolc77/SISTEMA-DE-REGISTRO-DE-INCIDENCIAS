"use client";

import { useState } from "react";



type LoginResponse = {
  ok: boolean;
  role?: "ADMIN" | "USER";
  nombre?: string;
  message?: string;
};

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // ← importante para cookies httpOnly
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: usuario,        // el back espera email
          password: contrasena,  // y password
        }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.ok) {
        setErr(data?.message || "Correo o contraseña incorrectos");
        return;
      }

      // Redirige siempre a /home tras login exitoso
      window.location.href = "/home";
    } catch {
      setErr("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="relative w-full max-w-[900px] h-auto md:h-[550px] bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Esquinas decorativas */}
        <div className="hidden md:block absolute top-4 left-4 w-5 h-5 border-2 border-gray-300 rounded-full" />
        <div className="hidden md:block absolute top-4 right-4 w-5 h-5 border-2 border-gray-300 rounded-full" />
        <div className="hidden md:block absolute bottom-4 left-4 w-5 h-5 border-2 border-gray-300 rounded-full" />
        <div className="hidden md:block absolute bottom-4 right-4 w-5 h-5 border-2 border-gray-300 rounded-full" />

        <div className="relative h-full flex flex-col md:flex-row">
          {/* Izquierda (logo) desktop */}
          <div
            className="hidden md:flex absolute left-0 top-0 h-full bg-white items-center justify-center"
            style={{
              width: "60%",
              clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
              zIndex: 2,
            }}
          >
            <div className="flex flex-col items-center justify-center p-4">
              <img
                src="/logo-durango.png"
                alt="Logo Durango - Gobierno del Estado"
                className="max-w-[350px] h-auto"
              />
            </div>
          </div>

          {/* Logo mobile */}
          <div className="md:hidden w-full bg-white flex items-center justify-center py-8">
            <img
              src="/logo-durango.png"
              alt="Logo Durango - Gobierno del Estado"
              className="max-w-[250px] h-auto"
            />
          </div>

          {/* Derecha (form) desktop */}
          <div
            className="hidden md:flex absolute right-0 top-0 h-full flex-col justify-center items-center"
            style={{
              width: "48%",
              backgroundColor: "#1e3a5f",
              clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
              zIndex: 1,
              paddingLeft: "90px",
              paddingRight: "50px",
              paddingTop: "60px",
              paddingBottom: "60px",
            }}
          >
            <h1 className="text-white text-4xl font-light mb-6 tracking-wide text-center w-full">
              Iniciar sesión
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 w-full">
              <div className="w-full">
                <label htmlFor="usuario" className="block text-white text-lg font-light mb-2">
                  Usuario (correo)
                </label>
                <input
                  id="usuario"
                  type="email"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-gray-800 text-base outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="w-full">
                <label htmlFor="contrasena" className="block text-white text-lg font-light mb-2">
                  Contraseña
                </label>
                <input
                  id="contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-gray-800 text-base outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                  required
                  autoComplete="current-password"
                />
              </div>

              {err && <p className="text-sm text-red-200">{err}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-md mt-2 text-base font-medium transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 disabled:opacity-60"
                style={{ backgroundColor: "#c8d948", color: "#1e3a5f" }}
              >
                {loading ? "Entrando…" : "Iniciar sesión"}
              </button>
            </form>
          </div>

          {/* (Opcional) Form en mobile: si quieres que también se pueda loguear en móvil,
              duplica el mismo <form> aquí debajo del logo cuando md:hidden */}
        </div>
      </div>
    </div>
  );
}
