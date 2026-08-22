import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi, userApi } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gt_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gt_token');
    if (!token) {
      setLoading(false);
      return;
    }
    userApi
      .me()
      .then((u) => setUser(u))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const persist = ({ token, user: u }) => {
    localStorage.setItem('gt_token', token);
    localStorage.setItem('gt_user', JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, password) => persist(await authApi.login({ email, password }));
  const signup = async (name, email, password) => persist(await authApi.signup({ name, email, password }));

  function logout() {
    localStorage.removeItem('gt_token');
    localStorage.removeItem('gt_user');
    setUser(null);
  }

  const updateUser = useCallback((u) => {
    localStorage.setItem('gt_user', JSON.stringify(u));
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
