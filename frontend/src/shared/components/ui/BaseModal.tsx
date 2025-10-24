import React from 'react';
import { H4 } from './Typography';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modal base reutilizável com diferentes tamanhos.
 * Renderiza overlay escuro e conteúdo centralizado.
 */
export const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  if (!isOpen) return null;

  /**
   * Classes CSS para diferentes tamanhos de modal.
   */
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 top-[-1.5rem]">
      <div className={`bg-white rounded-lg p-6 w-full ${sizeClasses[size]} mx-4`}>
        <div className="flex justify-between items-center mb-4">
          <H4>{title}</H4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
