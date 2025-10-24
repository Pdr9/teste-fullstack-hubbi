import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/features/auth/services/authService';
import type { User, LoginRequest } from '@/features/auth/types';

/**
 * Interface que define o tipo do contexto de autenticação.
 * Contém estado do usuário e funções de login/logout.
 */
interface AuthContextType {
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook para acessar o contexto de autenticação.
 * Valida se está sendo usado dentro do AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de contexto de autenticação para toda a aplicação.
 * Gerencia estado do usuário, tokens e persistência no localStorage.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verifica se há dados de usuário salvos no localStorage.
   * Restaura sessão se tokens e dados de usuário estiverem válidos.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');
    
    if (savedUser && accessToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    
    setLoading(false);
  }, []);

  /**
   * Realiza login do usuário e salva tokens no localStorage.
   * Atualiza estado do usuário após autenticação bem-sucedida.
   */
  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Realiza logout removendo todos os dados do localStorage.
   * Limpa estado do usuário e tokens de autenticação.
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Valor do contexto contendo estado e funções de autenticação.
   */
  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
