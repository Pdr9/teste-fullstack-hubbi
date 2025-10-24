import type { BaseEntity } from '@/shared/types/common';
import type { Product } from '@/features/products/types';

/**
 * Item específico de uma compra com produto e cálculos.
 * Contém informações detalhadas do produto comprado.
 */
export interface PurchaseItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

/**
 * Entidade de compra baseada em venda existente.
 * Representa aquisição de produtos para estoque.
 */
export interface Purchase extends BaseEntity {
  user: number;
  username: string;
  sale: number;
  date: string;
  items: PurchaseItem[];
  total_value: number;
  total_items: number;
}

/**
 * Item genérico para vendas e compras.
 * Define produto e quantidade para operações.
 */
export interface CreateItem {
  product_id: number;
  quantity: number;
}

/**
 * Dados para criar uma nova compra.
 * Referencia venda existente e itens a comprar.
 */
export interface CreatePurchase {
  sale_id: number;
  items: CreateItem[];
}
