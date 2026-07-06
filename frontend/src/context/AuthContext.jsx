import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiUrl, registerAuthLogout } from "../config/api.js";

const AuthContext = createContext();

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeParse(localStorage.getItem("user")) || null);

  useEffect(() => {
    const saved = safeParse(localStorage.getItem("user"));
    if (saved) {
      setUser(saved);
      console.log("Loaded user role from storage:", saved.role);
    }
  }, []);

  const login = async (userData) => {
    const cleanUser = {
      uid: userData?.uid,
      username: userData?.username,
      email: userData?.email,
      role: userData?.role || "STUDENT",
      token: userData?.token || null,
      refreshToken: userData?.refreshToken || null,
    };

    console.log("Logged in user role:", cleanUser.role);
    setUser(cleanUser);
    localStorage.setItem("user", JSON.stringify(cleanUser));
    return cleanUser;
  };

  const logout = useCallback(async () => {
    const saved = safeParse(localStorage.getItem("user"));
    const accessToken = saved?.token || null;
    const storedRefreshToken = saved?.refreshToken || null;

    try {
      if (accessToken || storedRefreshToken) {
        await fetch(apiUrl("/api/auth/logout"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            refreshToken: storedRefreshToken,
          }),
        });
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
  }, []);

  useEffect(() => {
    registerAuthLogout(logout);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
