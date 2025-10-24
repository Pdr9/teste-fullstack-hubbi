import React from 'react';
import { BaseModal } from '../ui/BaseModal';

/**
 * Modal simples para formulários com tamanho médio.
 * Wrapper do BaseModal com configuração padrão para formulários.
 */
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
    >
      {children}
    </BaseModal>
  );
};

/**
 * Input de texto com estilização padrão.
 * Aplica classes CSS consistentes e suporte a props nativas.
 */
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

/**
 * Select dropdown com estilização padrão.
 * Aplica classes CSS consistentes e suporte a props nativas.
 */
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <select
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
