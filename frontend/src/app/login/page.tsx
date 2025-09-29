"use client";

import { useState } from "react";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Usuario:", usuario);
    console.log("Contraseña:", contrasena);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Contenedor principal con círculos en las esquinas */}
      <div className="relative w-full max-w-[900px] h-auto md:h-[550px] bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Círculos decorativos en las esquinas - Ocultos en móvil */}
        <div className="hidden md:block absolute top-4 left-4 w-5 h-5 border-2 border-gray-300 rounded-full"></div>
        <div className="hidden md:block absolute top-4 right-4 w-5 h-5 border-2 border-gray-300 rounded-full"></div>
        <div className="hidden md:block absolute bottom-4 left-4 w-5 h-5 border-2 border-gray-300 rounded-full"></div>
        <div className="hidden md:block absolute bottom-4 right-4 w-5 h-5 border-2 border-gray-300 rounded-full"></div>

        {/* Contenedor flex para las dos secciones */}
        <div className="relative h-full flex flex-col md:flex-row">
          {/* Sección Izquierda (Blanca con Logo) - Desktop */}
          <div
            className="hidden md:flex absolute left-0 top-0 h-full bg-white items-center justify-center"
            style={{
              width: '60%',
              clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
              zIndex: 2
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

          {/* Sección Logo - Mobile (arriba) */}
          <div className="md:hidden w-full bg-white flex items-center justify-center py-8">
            <img
              src="/logo-durango.png" 
              alt="Logo Durango - Gobierno del Estado"
              className="max-w-[250px] h-auto"
            />
          </div>

          {/* Sección Derecha (Azul con Formulario) - Desktop */}
          <div
            className="hidden md:flex absolute right-0 top-0 h-full flex-col justify-center items-center"
            style={{
              width: '48%',
              backgroundColor: '#1e3a5f',
              clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
              zIndex: 1,
              paddingLeft: '90px',
              paddingRight: '50px',
              paddingTop: '60px',
              paddingBottom: '60px'
            }}
          >
            {/* Título */}
            <h1 className="text-white text-4xl font-light mb-10 tracking-wide text-center w-full">
              Iniciar sesión
            </h1>

            {/* Formulario */}
            <div className="flex flex-col space-y-6 w-full">
              {/* Campo Usuario */}
              <div className="w-full">
                <label htmlFor="usuario" className="block text-white text-lg font-light mb-2">
                  Usuario
                </label>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-gray-800 text-base outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                  required
                />
              </div>

              {/* Campo Contraseña */}
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
                />
              </div>

              {/* Botón de Iniciar Sesión */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-md mt-4 text-base font-medium transition-all duration-300 hover:opacity-90 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
                style={{
                  backgroundColor: '#c8d948',
                  color: '#1e3a5f'
                }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>

          {/* Sección Formulario - Mobile (abajo) */}
          <div 
            className="md:hidden w-full flex flex-col justify-center items-center px-6 py-8"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            {/* Título */}
            <h1 className="text-white text-3xl font-light mb-8 tracking-wide text-center w-full">
              Iniciar sesión
            </h1>

            {/* Formulario */}
            <div className="flex flex-col space-y-6 w-full max-w-md">
              {/* Campo Usuario */}
              <div className="w-full">
                <label htmlFor="usuario-mobile" className="block text-white text-lg font-light mb-2">
                  Usuario
                </label>
                <input
                  id="usuario-mobile"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-gray-800 text-base outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div className="w-full">
                <label htmlFor="contrasena-mobile" className="block text-white text-lg font-light mb-2">
                  Contraseña
                </label>
                <input
                  id="contrasena-mobile"
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full p-3 rounded-md bg-white text-gray-800 text-base outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30"
                  required
                />
              </div>

              {/* Botón de Iniciar Sesión */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-md mt-4 text-base font-medium transition-all duration-300 hover:opacity-90 active:translate-y-0"
                style={{
                  backgroundColor: '#c8d948',
                  color: '#1e3a5f'
                }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
