import React from 'react';

interface IconProps {
  className?: string;
}

/**
 * Ícone de logout/sair simples usando SVG.
 * Responsivo e acessível.
 */
export const LogoutIcon: React.FC<IconProps> = ({ className = '' }) => {
  return (
    <svg 
      className={`w-5 h-5 ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
      />
    </svg>
  );
};
