import React from 'react';

interface EmptyStateProps {
  /** Título principal do estado vazio */
  title: string;
  /** Descrição explicativa */
  description: string;
  /** Texto do botão de ação */
  actionLabel?: string;
  /** Função executada ao clicar no botão */
  onAction?: () => void;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente para exibir estados vazios de forma consistente.
 * Usado quando não há dados para exibir em listas ou tabelas.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-4 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
