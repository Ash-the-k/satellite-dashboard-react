import { createContext, useContext, useState, useEffect } from 'react';
import { api, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Use sessionStorage - persists during browser session, clears on tab close
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Centralized logout
  const forceLogout = () => {
    setToken(null);
    setUser(null);
  };

  // Auto-logout on any 401 from API
  useEffect(() => {
    setUnauthorizedHandler(() => {
      forceLogout();
    });
  }, []);

  // Sync token with sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      sessionStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Sync user with sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  // Validate token on startup if it exists
  useEffect(() => {
    const validateStartupToken = async () => {
      if (token) {
        try {
          await api.get('/validate-token');
          // Token is valid, keep user logged in
        } catch (error) {
          // Token is invalid, clear everything
          console.log('Startup token validation failed:', error.message);
          forceLogout();
        }
      }
      setIsLoading(false);
    };

    validateStartupToken();
  }, []);

  // Proactive token validation on focus and on interval
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const validate = async () => {
      try {
        await api.get('/validate-token');
      } catch (_) {
        if (!cancelled) forceLogout();
      }
    };

    // Validate when window gains focus
    const onFocus = () => validate();
    window.addEventListener('focus', onFocus);

    // Heartbeat every 60s to catch backend restarts while idle
    const intervalId = setInterval(validate, 60000);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      clearInterval(intervalId);
    };
  }, [token]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };
  
  const logout = async () => {
    try {
      if (token) {
        await api.post('/logout');
      }
    } catch (_) {
      // ignore
    } finally {
      forceLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 