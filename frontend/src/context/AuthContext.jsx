import { createContext, useContext, useState, useEffect } from "react";

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
  const [user, setUser] = useState(null);

  // Load user once on app start
  useEffect(() => {
    const saved = safeParse(localStorage.getItem("user"));
    if (saved) setUser(saved);
  }, []);

  const login = async (userData) => {
    // Ensure only clean values go into storage
    const cleanUser = {
      uid: userData.uid,
      username: userData.username,
      email: userData.email
    };

    setUser(cleanUser);
    localStorage.setItem("user", JSON.stringify(cleanUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
