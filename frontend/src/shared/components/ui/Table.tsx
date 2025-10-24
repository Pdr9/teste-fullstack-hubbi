import { Caption, Body } from './Typography';
import type { TableColumn } from '@/shared/types/common';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
}

/**
 * Tabela genérica para exibir dados em formato tabular.
 * Suporta renderização customizada de colunas e estilização responsiva.
 */
export const Table = <T,>({ data, columns, className = '' }: TableProps<T>) => {
  return (
    <div className={`bg-white rounded-lg border overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={`header-${index}`}
                className="px-6 py-3 text-left"
              >
                <Caption className="uppercase tracking-wider">{column.label}</Caption>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => {
                const value = column.key === 'details' || column.key === 'total_value' || column.key === 'purchase_status' 
                  ? undefined 
                  : item[column.key as keyof T];
                
                return (
                  <td
                    key={`cell-${index}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.render 
                      ? column.render(value, item)
                      : <Body>{String(value || '')}</Body>
                    }
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
