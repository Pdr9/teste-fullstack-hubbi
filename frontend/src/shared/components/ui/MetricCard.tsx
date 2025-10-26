import React from 'react';
import { MetricCardSkeleton } from './MetricCardSkeleton';

interface MetricCardProps {
  title: string;
  value: string | number;
  loading?: boolean;
}

/**
 * Card simples para exibir métricas.
 * Segue princípios KISS e DRY - apenas o essencial.
 */
export const MetricCard: React.FC<MetricCardProps> = ({ title, value, loading }) => {
  if (loading) {
    return <MetricCardSkeleton />;
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};
