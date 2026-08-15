"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, getAuthToken, getAuthUser, setAuthToken, setAuthUser, clearAuth } from "./api";
import type { User } from "./types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const cachedUser = getAuthUser<User>();

      if (token && cachedUser) {
        setUser(cachedUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    const { token, user: userData } = response.data;
    setAuthToken(token);
    setAuthUser(userData);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation: password,
      phone,
    });
    const { token, user: userData } = response.data;
    setAuthToken(token);
    setAuthUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Ignore logout API errors
    }
    clearAuth();
    setUser(null);
    window.location.href = "/";
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/me");
      const userData = response.data.user;
      setUser(userData);
      setAuthUser(userData);
    } catch {
      clearAuth();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}