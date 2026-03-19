import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { apiClient, applyAuthToken, clearStoredSession } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      applyAuthToken(token);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const message = (data as { message?: string } | undefined)?.message ?? (data ? JSON.stringify(data) : undefined);
      return `(${status}) ${message ?? error.message}`;
    }

    return (error as Error).message || 'Unknown error';
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { correo: email, password });
      const { token, usuario } = response.data;
      const userPayload: User = { id: usuario.id, username: usuario.nombre, email: usuario.correo };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userPayload));
      applyAuthToken(token);
      setUser(userPayload);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await apiClient.post('/auth/register', { nombre: username, correo: email, password });
      await login(email, password);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
