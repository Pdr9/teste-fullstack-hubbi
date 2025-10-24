import { useState } from 'react';

/**
 * Hook para gerenciar listas de itens dinâmicas.
 * Fornece operações básicas de adicionar, remover, atualizar e limpar itens.
 */
export const useItemManager = <T>(initialItems: T[] = []) => {
  const [items, setItems] = useState<T[]>(initialItems);

  /**
   * Adiciona um novo item ao final da lista.
   */
  const addItem = (item: T) => {
    setItems(prev => [...prev, item]);
  };

  /**
   * Remove item da lista pelo índice.
   */
  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Atualiza um campo específico de um item pelo índice.
   */
  const updateItem = (index: number, field: keyof T, value: T[keyof T]) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  /**
   * Limpa todos os itens da lista.
   */
  const clearItems = () => {
    setItems([]);
  };

  return { 
    items, 
    addItem, 
    removeItem, 
    updateItem, 
    clearItems 
  };
};
