import axios from 'axios';
import type { AxiosInstance } from 'axios';

/**
 * Configurações da API para comunicação com o backend.
 * Define URL base, timeout e tipo de conteúdo das requisições.
 */
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 10000,
  CONTENT_TYPE: 'application/json'
} as const;

/**
 * Cliente HTTP configurado com interceptors para autenticação.
 * Adiciona automaticamente token JWT e trata erros de autenticação.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': API_CONFIG.CONTENT_TYPE,
  },
});

/**
 * Interceptor de requisição para adicionar token JWT automaticamente.
 * Busca token no localStorage e inclui no header Authorization.
 */
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Interceptor de resposta para tratar erros de autenticação.
 * Redireciona para login quando recebe erro 401 (não autorizado).
 */
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
