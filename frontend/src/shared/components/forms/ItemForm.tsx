import React from 'react';
import { Select } from '@/shared/components/forms/Form';
import { formatCurrency } from '@/shared/utils';

/**
 * Formulário para gerenciar itens de vendas/compras.
 * Permite adicionar, remover e editar produtos com quantidades.
 */
export const ItemForm: React.FC<{
  items: Array<{ product_id: number; quantity: number }>;
  products: Array<{ id: number; name: string; price: number }>;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: 'product_id' | 'quantity', value: number) => void;
  addButtonDisabled?: boolean;
  getMaxQuantity?: (productId: number) => number;
}> = ({ 
  items, 
  products, 
  onAddItem, 
  onRemoveItem, 
  onUpdateItem,
  addButtonDisabled = false,
  getMaxQuantity
}) => {
  return (
    <>
      <div className="space-y-3">
        {items.map((item, index) => {
          // Filtrar produtos já selecionados em outros itens (exceto o item atual)
          const selectedProductIds = items
            .map((otherItem, otherIndex) => otherIndex !== index ? otherItem.product_id : null)
            .filter(id => id !== null && id !== 0);
          
          const availableProducts = products?.filter(product => 
            !selectedProductIds.includes(product.id)
          ) || [];

          return (
            <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-md">
              <Select
                value={item.product_id}
                onChange={(e) => onUpdateItem(index, 'product_id', parseInt(e.target.value))}
                className="flex-1 min-w-0"
              >
                <option value={0}>Selecione um produto</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.price)}
                  </option>
                ))}
              </Select>

            <div className="flex flex-col items-center gap-1">
              <input
                type="number"
                min="1"
                max={getMaxQuantity ? getMaxQuantity(item.product_id) : undefined}
                value={item.quantity}
                onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0 text-center"
              />
              {getMaxQuantity && item.product_id !== 0 && (
                <span className="text-xs text-gray-500">
                  Máx: {getMaxQuantity(item.product_id)}
                </span>
              )}
            </div>

            <button
              type="button"
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex-shrink-0"
              onClick={() => onRemoveItem(index)}
            >
              ✕
            </button>
          </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
          onClick={onAddItem}
          disabled={addButtonDisabled}
        >
          Adicionar Item
        </button>
      </div>
    </>
  );
};
