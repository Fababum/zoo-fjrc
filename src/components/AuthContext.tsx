import React, { createContext, useContext, useEffect, useState } from "react";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user?: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("authToken");
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("authUser");
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (token) localStorage.setItem("authToken", token);
      else localStorage.removeItem("authToken");
      if (user) localStorage.setItem("authUser", JSON.stringify(user));
      else localStorage.removeItem("authUser");
    } catch {}
  }, [token, user]);

  const login = (newToken: string, newUser?: AuthUser | null) => {
    setToken(newToken);
    if (newUser !== undefined) setUser(newUser);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
