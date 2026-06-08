import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        let accessToken = localStorage.getItem("accessToken");

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          setLoading(false);
          return;
        }

        try {
          const userData = await authService.getProfile();

          setUser(userData);
        } catch {
          const refreshed = await authService.refreshToken();

          localStorage.setItem("accessToken", refreshed.access);

          const userData = await authService.getProfile();

          setUser(userData);
        }
      } catch (err) {
        console.error(err);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);

    setUser(data.user);
  };

  const register = async (formData) => {
    return await authService.register(formData);
  };

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook (clean usage)
export const useAuth = () => useContext(AuthContext);
