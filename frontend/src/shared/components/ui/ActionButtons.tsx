import React from 'react';

/**
 * Botões de ação para editar, visualizar e excluir itens.
 * Renderiza ícones com cores diferenciadas e suporte a ações opcionais.
 */
export const ActionButtons: React.FC<{
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
}> = ({ onEdit, onView, onDelete }) => {
  return (
    <div className="flex space-x-2">
      {onView && (
        <button
          className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
          onClick={onView}
          title="Visualizar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
      {onEdit && (
        <button
          className="p-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition-colors"
          onClick={onEdit}
          title="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          onClick={onDelete}
          title="Excluir"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};
