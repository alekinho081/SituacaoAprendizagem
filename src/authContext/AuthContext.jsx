import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica a autenticação do usuário
  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/v1/check-auth', {
        withCredentials: true,
      });
      
      setUser(response.data.user);

      if (response.data.user) {
        localStorage.setItem('userType', response.data.user.type);
        localStorage.setItem('userId', response.data.user.id);
      } else {
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    } finally {
      setLoading(false);
    }
  };

  // Função de login
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/v1/login', credentials, {
        withCredentials: true,
      });
      setUser(response.data.user);
      localStorage.setItem('userType', response.data.user.type);
      localStorage.setItem('userId', response.data.user.id);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/v1/logout', {
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Verifica autenticação a cada 5 minutos
    const interval = setInterval(checkAuth, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      login, 
      logout, 
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};