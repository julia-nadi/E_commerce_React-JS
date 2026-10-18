import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, getAuthUser } from "../api/auth";
import { setToken, clearToken, getToken } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a stored token, restore the session.
  useEffect(() => {
    async function restore() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getAuthUser();
        setUser(me);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  async function login(credentials) {
    const data = await apiLogin(credentials);
    // DummyJSON may return the token as `accessToken` or legacy `token`.
    const token = data.accessToken || data.token;
    setToken(token);
    // The login response already carries the user fields alongside the tokens;
    // keep only the profile data in state.
    const userData = { ...data };
    delete userData.accessToken;
    delete userData.refreshToken;
    delete userData.token;
    setUser(userData);
    return userData;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, logout, setUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
