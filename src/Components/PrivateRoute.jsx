import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../authContext/AuthContext';

const PrivateRoute = ({ children, tipoUsuarioRequerido }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redireciona se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redireciona se não tiver o tipo de usuário necessário
  if (tipoUsuarioRequerido && user.type !== tipoUsuarioRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;  