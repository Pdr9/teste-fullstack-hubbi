import React, { useEffect } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { H1, Body, MetricCard, SimpleChart } from '@/shared/components/ui';
import { usePageTitle } from '@/shared/hooks';
import { useDataLoader } from '@/shared/hooks';
import { saleService } from '@/features/sales/services/saleService';
import { productService } from '@/features/products/services/productService';
import { purchaseService } from '@/features/purchases/services/purchaseService';

export const DashboardPage: React.FC = () => {
  // Hook para título da página
  usePageTitle('Dashboard - Hubbi');

  // Carregar dados para métricas
  const { data: sales, loading: salesLoading, load: loadSales } = useDataLoader(saleService.getSales);
  const { data: products, loading: productsLoading, load: loadProducts } = useDataLoader(productService.getProducts);
  const { data: purchases, loading: purchasesLoading, load: loadPurchases } = useDataLoader(purchaseService.getPurchases);

  // Carregar dados quando o componente monta
  useEffect(() => {
    loadSales();
    loadProducts();
    loadPurchases();
  }, [loadSales, loadProducts, loadPurchases]);

  // Calcular métricas
  const totalSales = sales?.length || 0;
  const totalProducts = products?.length || 0;
  const totalPurchases = purchases?.length || 0;

  const loading = salesLoading || productsLoading || purchasesLoading;

  // Dados para o gráfico
  const chartData = [
    { label: 'Produtos', value: totalProducts },
    { label: 'Compras', value: totalPurchases },
    { label: 'Vendas', value: totalSales }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <H1>Dashboard</H1>
          <Body className="mt-2 text-gray-600">Visão geral do sistema</Body>
        </div>
        
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Produtos Cadastrados" 
            value={totalProducts} 
            loading={loading} 
          />
          <MetricCard 
            title="Total de Compras" 
            value={totalPurchases} 
            loading={loading} 
          />
          <MetricCard 
            title="Total de Vendas" 
            value={totalSales} 
            loading={loading} 
          />
        </div>

        {/* Gráfico */}
        <SimpleChart data={chartData} loading={loading} />
      </div>
    </Layout>
  );
};
