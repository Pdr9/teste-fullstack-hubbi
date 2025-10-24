import { apiClient } from '@/shared/services/apiClient';
import type { 
  LoginRequest, AuthResponse, RegisterRequest, RefreshTokenRequest, RefreshTokenResponse
} from '../types';

/**
 * Serviço de autenticação para login de usuários.
 * Gerencia credenciais e tokens de acesso.
 */
export const authService = {
  /**
   * Realiza login do usuário com credenciais fornecidas.
   * Retorna tokens de acesso e dados do usuário.
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/login/', data).then(r => r.data);
  },

  /**
   * Registra novo usuário no sistema.
   * Retorna tokens de acesso e dados do usuário.
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post('/auth/register/', data).then(r => r.data);
  },

  /**
   * Renova token de acesso usando refresh token.
   * Retorna novo token de acesso.
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return apiClient.post('/auth/refresh/', data).then(r => r.data);
  },

  /**
   * Realiza logout do usuário.
   * Remove tokens do servidor.
   */
  async logout(): Promise<void> {
    return apiClient.post('/auth/logout/');
  }
};
