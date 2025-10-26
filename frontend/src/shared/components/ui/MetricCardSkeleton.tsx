import React from 'react';

interface MetricCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton para MetricCard.
 * Simula a estrutura de um card de métrica durante o carregamento.
 */
export const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg border animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  );
};
