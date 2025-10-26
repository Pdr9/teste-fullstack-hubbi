import React from 'react';

interface SimpleChartSkeletonProps {
  className?: string;
}

/**
 * Skeleton para SimpleChart.
 * Simula a estrutura de um gráfico de barras durante o carregamento.
 */
export const SimpleChartSkeleton: React.FC<SimpleChartSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg border animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            <div className="w-8 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
