import React from 'react';
import { Button } from './Button';

/**
 * Rodapé padrão para modais com botões de ação.
 * Inclui botão de cancelar e botão de submit personalizável.
 */
export const ModalFooter: React.FC<{
  onCancel: () => void;
  submitLabel: string;
}> = ({ onCancel, submitLabel }) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <Button type="submit">{submitLabel}</Button>
    </div>
  );
};
