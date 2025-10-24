import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Loading } from '@/shared/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas autenticadas.
 * Redireciona para login se usuário não estiver autenticado.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  /**
   * Redireciona para login se usuário não estiver autenticado.
   */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /**
   * Renderiza o conteúdo protegido se usuário estiver autenticado.
   */
  return <>{children}</>;
};
