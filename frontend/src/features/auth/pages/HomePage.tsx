import React from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { H1, H2, Body } from '@/shared/components/ui/Typography';
import { usePageTitle } from '@/shared/hooks';

export const HomePage: React.FC = () => {
  // Hook para título da página
  usePageTitle('Dashboard - Hubbi');

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <H1>Django + React</H1>
          <Body className="mt-2 text-gray-600">Sistema de gestão empresarial</Body>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <H2 className="mb-4">Bem-vindo ao Sistema</H2>
          <Body className="text-gray-600">
            Use o menu de navegação para acessar as funcionalidades do sistema:
          </Body>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• <strong>Produtos:</strong> Gerencie seu catálogo de produtos</li>
            <li>• <strong>Vendas:</strong> Registre e acompanhe suas vendas</li>
            <li>• <strong>Compras:</strong> Gerencie compras para atender vendas</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
