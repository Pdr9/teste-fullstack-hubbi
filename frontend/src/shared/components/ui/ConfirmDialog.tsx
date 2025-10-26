import React from 'react';
import { BaseModal } from './BaseModal';
import { Body } from './Typography';

/**
 * Diálogo de confirmação para ações destrutivas.
 * Exibe mensagem e botões de cancelar e confirmar.
 */
export const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <Body className="text-gray-600 mb-4">{message}</Body>
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 w-full sm:w-auto"
        >
          Cancelar
        </button>
        <button 
          onClick={onConfirm} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full sm:w-auto"
        >
          Confirmar
        </button>
      </div>
    </BaseModal>
  );
};
