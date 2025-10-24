import React from 'react';

/**
 * Componentes de tipografia padronizados para toda a aplicação.
 * Mantém consistência visual e facilita manutenção de estilos.
 */
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Título principal da página com tamanho grande e peso bold.
 */
export const H1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold text-gray-900 ${className}`}>{children}</h1>
);

/**
 * Título secundário com tamanho médio e peso semibold.
 */
export const H2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

/**
 * Título terciário com tamanho pequeno e peso medium.
 */
export const H4: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h4 className={`text-lg font-medium text-gray-900 ${className}`}>{children}</h4>
);

/**
 * Texto de corpo padrão com tamanho pequeno e cor cinza.
 */
export const Body: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-700 ${className}`}>{children}</p>
);

/**
 * Label para formulários com peso medium.
 */
export const Label: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`}>{children}</label>
);

/**
 * Texto de legenda com tamanho extra pequeno e cor cinza clara.
 */
export const Caption: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-xs text-gray-500 ${className}`}>{children}</span>
);

/**
 * Exibição de valores monetários com cor azul e peso semibold.
 */
export const Currency: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-sm font-semibold text-blue-600 ${className}`}>{children}</span>
);

/**
 * Exibição de IDs com peso medium e cor padrão.
 */
export const Id: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-sm font-medium text-gray-900 ${className}`}>{children}</span>
);
