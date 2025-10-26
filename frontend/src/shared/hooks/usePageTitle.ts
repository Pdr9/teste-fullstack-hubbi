import { useEffect } from 'react';

/**
 * Hook para definir o título da página.
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
