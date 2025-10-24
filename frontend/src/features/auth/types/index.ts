import type { User } from '@/shared/types/common';

/**
 * Credenciais para autenticação de usuário.
 * Usado no processo de login.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Dados para registro de novo usuário.
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

/**
 * Resposta de autenticação bem-sucedida.
 * Contém tokens de acesso e dados do usuário.
 */
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

/**
 * Dados para refresh de token.
 */
export interface RefreshTokenRequest {
  refresh: string;
}

/**
 * Resposta de refresh de token.
 */
export interface RefreshTokenResponse {
  access: string;
}
