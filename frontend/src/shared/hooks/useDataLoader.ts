import { useState, useCallback } from 'react';
import { extractErrorMessage } from '../utils';

/**
 * Hook para carregamento assíncrono de dados.
 * Gerencia estados de loading, erro e dados com função de recarregamento.
 */
export const useDataLoader = <T>(service: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para carregar dados do serviço.
   * Gerencia estados de loading e erro automaticamente.
   */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service();
      setData(result);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [service]);

  return { data, loading, error, load };
};
