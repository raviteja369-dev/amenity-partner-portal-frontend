import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = unauth, object = auth
  const [bootstrapping, setBootstrapping] = useState(true);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("pp_token");
    if (!token) {
      setUser(null);
      setBootstrapping(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      localStorage.setItem("pp_user", JSON.stringify(data));
    } catch {
      setUser(null);
      localStorage.removeItem("pp_token");
      localStorage.removeItem("pp_user");
    } finally {
      setBootstrapping(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("pp_token", data.token);
    localStorage.setItem("pp_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) { /* ignore */ }
    localStorage.removeItem("pp_token");
    localStorage.removeItem("pp_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, bootstrapping, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
