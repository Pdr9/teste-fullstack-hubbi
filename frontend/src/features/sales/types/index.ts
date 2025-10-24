import type { BaseEntity } from '@/shared/types/common';
import type { Product } from '@/features/products/types';

/**
 * Item específico de uma venda com produto e cálculos.
 * Contém informações detalhadas do produto vendido.
 */
export interface SaleItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: number;
}

/**
 * Status de compra de uma venda.
 * Indica progresso e completude das compras.
 */
export interface PurchaseStatus {
  is_fully_purchased: boolean;
  purchase_progress: number;
}

/**
 * Entidade de venda com itens e cálculos automáticos.
 * Inclui status de compra para controle de estoque.
 */
export interface Sale extends BaseEntity {
  user: number;
  username: string;
  date: string;
  items: SaleItem[];
  total_value: number;
  total_items: number;
  purchase_status?: PurchaseStatus;
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
 * Dados para criar uma nova venda.
 * Contém lista de itens a serem vendidos.
 */
export interface CreateSale {
  items: CreateItem[];
}

/**
 * Status detalhado de um item específico.
 * Define se está completo, faltando ou em excesso.
 */
export interface ItemStatus {
  type: 'complete' | 'missing' | 'excess';
  required_quantity: number;
  purchased_quantity: number;
  missing_quantity?: number;
}
