import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = authService.getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      setUser(response.user);
    } catch {
      authService.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    authService.saveToken(response.token);
    setUser(response.user);
    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    authService.saveToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
