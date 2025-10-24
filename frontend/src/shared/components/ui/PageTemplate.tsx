import React from 'react';
import { Loading, ErrorDisplay, Button } from './Button';
import { H1, Body } from './Typography';

interface PageTemplateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

/**
 * Template padrão para páginas da aplicação.
 * Inclui cabeçalho, botão de ação, estados de loading/erro e conteúdo.
 */
export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  loading,
  error,
  children
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <H1>{title}</H1>
          <Body className="mt-2 text-gray-600">{description}</Body>
        </div>
        {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
      
      {loading && <Loading />}
      <ErrorDisplay error={error} />
      
      {children}
    </div>
  );
};
