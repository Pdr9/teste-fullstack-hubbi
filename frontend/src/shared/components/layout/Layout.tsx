import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/contexts';
import { Button } from '../ui/Button';
import { Navigation } from './Navigation';
import { H2, Caption } from '../ui/Typography';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal da aplicação com header e navegação.
 * Inclui menu de navegação e informações do usuário logado.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  /**
   * Itens do menu de navegação principal.
   */
  const navigationItems = [
    { name: 'Produtos', href: '/products' },
    { name: 'Vendas', href: '/sales' },
    { name: 'Compras', href: '/purchases' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <a href="/">
              <H2>Django + React</H2>
            </a>
            
            <div className="flex items-center space-x-8">
              <Navigation items={navigationItems} currentPath={location.pathname} />

              <div className="flex items-center space-x-4">
                <Caption>Olá, {user?.username}</Caption>
                <Button onClick={logout}>
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};
