import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/contexts';
import { extractErrorMessage } from '@/shared/utils';

/**
 * Hook para gerenciar formulário de login.
 * Centraliza estado, validação e lógica de autenticação.
 */
export const useLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Executa processo de login com credenciais fornecidas.
   * Redireciona para home em caso de sucesso.
   */
  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handler para submit do formulário.
   * Previne comportamento padrão e executa login.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return {
    // Estados
    username,
    password,
    loading,
    error,
    
    // Setters
    setUsername,
    setPassword,
    
    // Handlers
    handleSubmit,
    handleLogin
  };
};
