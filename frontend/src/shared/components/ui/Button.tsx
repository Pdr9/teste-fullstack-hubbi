import React from 'react';

/**
 * Botão padrão com estilo azul e estados de hover/disabled.
 * Suporta todas as props nativas de botão HTML.
 */
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Indicador de carregamento com spinner animado.
 * Exibe texto "Carregando..." com animação de rotação.
 */
export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Carregando...</span>
    </div>
  );
};

/**
 * Exibição de erro com fundo vermelho e borda.
 * Renderiza apenas quando há erro, senão retorna null.
 */
export const ErrorDisplay: React.FC<{ error: string | null }> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <span className="text-sm text-red-600 font-medium">Erro: {error}</span>
    </div>
  );
};
