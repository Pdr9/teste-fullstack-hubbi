import React from 'react';
import { SimpleChartSkeleton } from './SimpleChartSkeleton';

interface ChartData {
  label: string;
  value: number;
}

interface SimpleChartProps {
  data: ChartData[];
  loading?: boolean;
}

/**
 * Gráfico de barras simples usando CSS puro.
 * Sem dependências externas, responsivo e leve.
 */
export const SimpleChart: React.FC<SimpleChartProps> = ({ data, loading }) => {
  if (loading) {
    return <SimpleChartSkeleton />;
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Geral</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600">{item.label}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` 
                }}
              />
            </div>
            <span className="w-8 text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
