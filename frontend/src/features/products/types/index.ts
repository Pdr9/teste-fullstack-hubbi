import type { BaseEntity } from '@/shared/types/common';

/**
 * Entidade principal de produto do sistema.
 * Representa um item que pode ser vendido ou comprado.
 */
export interface Product extends BaseEntity {
  name: string;
  price: number;
  user: number;
  username: string;
}

/**
 * Dados necessários para criar um novo produto.
 * Contém apenas campos obrigatórios para criação.
 */
export interface CreateProduct {
  name: string;
  price: number;
}

/**
 * Dados para atualizar um produto existente.
 */
export interface UpdateProduct extends Partial<CreateProduct> {
  id: number;
}

/**
 * Filtros para busca de produtos.
 */
export interface ProductFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  userId?: number;
}
