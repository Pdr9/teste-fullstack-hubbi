import { apiClient } from '@/shared/services/apiClient';
import type { 
  Product, CreateProduct
} from '../types';

/**
 * Serviço de produtos para operações CRUD.
 * Gerencia criação, listagem, atualização e exclusão de produtos.
 */
export const productService = {
  /**
   * Busca todos os produtos do usuário logado.
   * Retorna lista completa de produtos.
   */
  async getProducts(): Promise<Product[]> {
    return apiClient.get('/products/my_products/').then(r => r.data);
  },

  /**
   * Cria um novo produto com dados fornecidos.
   * Retorna o produto criado com ID gerado.
   */
  async createProduct(data: CreateProduct): Promise<Product> {
    return apiClient.post('/products/', data).then(r => r.data);
  },

  /**
   * Atualiza produto existente com dados parciais.
   * Permite atualização de campos específicos.
   */
  async updateProduct(id: number, data: Partial<CreateProduct>): Promise<Product> {
    return apiClient.patch(`/products/${id}/`, data).then(r => r.data);
  },

  /**
   * Remove produto do sistema pelo ID.
   * Exclusão permanente sem retorno de dados.
   */
  async deleteProduct(id: number): Promise<void> {
    return apiClient.delete(`/products/${id}/`);
  }
};
