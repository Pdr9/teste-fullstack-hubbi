import React from 'react';

interface TableSkeletonProps {
  /** Número de linhas a serem exibidas no skeleton */
  rows?: number;
  /** Número de colunas a serem exibidas no skeleton */
  columns?: number;
  /** Classes CSS adicionais para customização */
  className?: string;
}

/**
 * Componente de skeleton para tabelas.
 * Simula a estrutura de uma tabela durante o carregamento de dados.
 */
export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Cabeçalho do skeleton */}
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={`skeleton-header-${index}`} className="px-3 sm:px-6 py-3 text-left">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Corpo do skeleton */}
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`skeleton-row-${rowIndex}`}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
