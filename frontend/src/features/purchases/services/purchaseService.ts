import { apiClient } from '@/shared/services/apiClient';
import type { 
  Purchase, CreatePurchase
} from '../types';

/**
 * Serviço de compras para operações de criação e listagem.
 * Gerencia compras baseadas em vendas existentes.
 */
export const purchaseService = {
  /**
   * Busca todas as compras realizadas pelo usuário.
   * Retorna lista completa de compras com detalhes.
   */
  async getPurchases(): Promise<Purchase[]> {
    return apiClient.get('/purchases/').then(r => r.data);
  },

  /**
   * Cria nova compra baseada em venda existente.
   * Transforma dados para formato esperado pelo backend.
   */
  async createPurchase(data: CreatePurchase): Promise<Purchase> {
    return apiClient.post('/purchases/', {
      sale: data.sale_id,
      items: data.items
    }).then(r => r.data);
  }
};
