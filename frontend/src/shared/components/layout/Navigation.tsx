import React from 'react';
import { Link } from 'react-router-dom';
import { Body } from '../ui/Typography';

interface NavigationItem {
  name: string;
  href: string;
}

/**
 * Componente de navegação com links do menu principal.
 * Destaca o item ativo baseado na rota atual.
 */
export const Navigation: React.FC<{
  items: NavigationItem[];
  currentPath: string;
}> = ({ items, currentPath }) => {
  return (
    <nav className="flex space-x-2 sm:space-x-8">
      {items.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`px-2 sm:px-3 py-2 rounded-md font-medium transition-colors ${
            currentPath === item.href
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Body>{item.name}</Body>
        </Link>
      ))}
    </nav>
  );
};
