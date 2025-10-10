"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: number;
  role: 'ADMIN' | 'CAPTURISTA';
  nombre?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCapturista: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setSessionUser: (payload: { userId: number; role: User['role']; nombre?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('authUser');
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
        setLoading(false);
      } catch (error) {
        sessionStorage.removeItem('authUser');
      }
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3001/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setUser({
            userId: data.userId,
            role: data.role,
            nombre: data.nombre,
          });
          sessionStorage.setItem('authUser', JSON.stringify({
            userId: data.userId,
            role: data.role,
            nombre: data.nombre,
          }));
        } else {
          setUser(null);
          sessionStorage.removeItem('authUser');
        }
      } else {
        setUser(null);
        sessionStorage.removeItem('authUser');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      sessionStorage.removeItem('authUser');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ELIMINAR ESTE useEffect SI EXISTE - es el que causa el bucle
  // useEffect(() => {
  //   if (!loading && !user && pathname !== '/login') {
  //     router.push('/login');
  //   }
  // }, [user, loading, pathname, router]);

  const logout = async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error logout:', error);
    } finally {
      setUser(null);
      sessionStorage.removeItem('authUser');
      router.push('/login');
    }
  };

  const setSessionUser = (payload: { userId: number; role: User['role']; nombre?: string }) => {
    setUser({
      userId: payload.userId,
      role: payload.role,
      nombre: payload.nombre,
    });
    setLoading(false);
    sessionStorage.setItem('authUser', JSON.stringify({
      userId: payload.userId,
      role: payload.role,
      nombre: payload.nombre,
    }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isCapturista: user?.role === 'CAPTURISTA',
    logout,
    refreshUser: fetchUser,
    setSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
