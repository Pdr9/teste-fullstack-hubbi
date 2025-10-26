import React from 'react';
import { Button } from './Button';

/**
 * Rodapé padrão para modais com botões de ação.
 * Inclui botão de cancelar e botão de submit personalizável.
 */
export const ModalFooter: React.FC<{
  onCancel: () => void;
  submitLabel: string;
  submitDisabled?: boolean;
}> = ({ onCancel, submitLabel, submitDisabled = false }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
      <button
        type="button"
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full sm:w-auto"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <Button type="submit" disabled={submitDisabled} className="w-full sm:w-auto">{submitLabel}</Button>
    </div>
  );
};
