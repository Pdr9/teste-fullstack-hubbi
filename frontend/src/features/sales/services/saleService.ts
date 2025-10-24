import { apiClient } from '@/shared/services/apiClient';
import type { 
  Sale, CreateSale
} from '../types';

/**
 * Serviço de vendas para operações de criação e listagem.
 * Gerencia vendas e status de compra dos itens.
 */
export const saleService = {
  /**
   * Busca vendas com ou sem status de compra.
   * Parâmetro withStatus determina se inclui informações de compra.
   */
  async getSales(withStatus = false): Promise<Sale[]> {
    const endpoint = withStatus ? '/sales/with_status/' : '/sales/';
    return apiClient.get(endpoint).then(r => r.data);
  },

  /**
   * Cria nova venda com lista de itens.
   * Retorna venda criada com cálculos automáticos.
   */
  async createSale(data: CreateSale): Promise<Sale> {
    return apiClient.post('/sales/', data).then(r => r.data);
  }
};
