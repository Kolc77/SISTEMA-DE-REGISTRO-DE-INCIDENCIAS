
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../../componets/Navbar';
import { AuthProvider } from "./context/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="es">
      <head>
        <title>Sistema de Incidencias</title>
        <meta name="description" content="Gestión de eventos e incidencias" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {pathname !== "/login" && <Navbar />}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}