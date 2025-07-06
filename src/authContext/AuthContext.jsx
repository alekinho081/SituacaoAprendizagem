import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Adicionando estado de loading

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/v1/check-auth', {
        withCredentials: true,
      });
      setUser(res.data.user);
      // Sincroniza com localStorage
      if (res.data.user) {
        localStorage.setItem('tipo', res.data.user.tipo);
        localStorage.setItem('id', res.data.user.id);
      } else {
        localStorage.removeItem('tipo');
        localStorage.removeItem('id');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('tipo');
      localStorage.removeItem('id');
    } finally {
      setLoading(false);
    }
  };

  // Função para login que atualiza o contexto
  const login = async (credentials) => {
    try {
      const res = await axios.post('http://localhost:5000/v1/login', credentials, {
        withCredentials: true,
      });
      setUser(res.data.user);
      localStorage.setItem('tipo', res.data.user.tipo);
      localStorage.setItem('id', res.data.user.id);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // Função para logout que limpa o contexto
  const logout = async () => {
    try {
      await axios.get('http://localhost:5000/v1/logout', {
        withCredentials: true,
      });
      setUser(null);
      localStorage.removeItem('tipo');
      localStorage.removeItem('id');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Verifica autenticação periodicamente (opcional)
    const interval = setInterval(checkAuth, 300000); // 5 minutos
    
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