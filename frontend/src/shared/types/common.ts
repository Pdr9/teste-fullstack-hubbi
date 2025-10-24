/**
 * Tipos base compartilhados entre todos os módulos.
 * Define estruturas fundamentais da aplicação.
 */

/**
 * Entidade base com campos comuns a todas as entidades.
 */
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Entidade de usuário do sistema.
 * Contém informações básicas de autenticação.
 */
export interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * Resposta padrão da API com dados tipados.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Parâmetros de paginação para listagens.
 */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

/**
 * Configuração de coluna para componente de tabela.
 * Define chave, rótulo e função de renderização personalizada.
 */
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T] | unknown, item: T) => React.ReactNode;
}
