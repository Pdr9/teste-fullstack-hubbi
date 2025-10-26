import React, { useEffect, useCallback } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { PageTemplate, Table, ModalFooter, ItemForm, ErrorDisplay, ActionButtons, TableSkeleton, EmptyState } from '@/shared/components/ui';
import { Modal } from '@/shared/components/forms/Form';
import { useCrudPage, useDataLoader, useItemManager, useModal, usePageTitle } from '@/shared/hooks';
import { saleService } from '../services/saleService';
import { productService } from '@/features/products/services/productService';
import { formatCurrency, formatDate } from '@/shared/utils';
import { Currency, Id, Caption, Body, H4 } from '@/shared/components/ui/Typography';
import type { CreateSale, CreateItem, Sale } from '../types';

export const SalesPage: React.FC = () => {
  // Hook para título da página
  usePageTitle('Vendas - Hubbi');

  // Funções estáveis para evitar re-renders desnecessários
  const getSalesWithStatus = useCallback(() => saleService.getSales(true), []);
  const getProducts = useCallback(() => productService.getProducts(), []);
  
  // Hook para carregar vendas com status
  const { data: sales, loading, error, load: loadSales } = useDataLoader(getSalesWithStatus);
  
  // Hook para criação de vendas
  const { modal, openModal, closeModal, handleSubmit } = useCrudPage<Sale, CreateSale>({
    getAll: saleService.getSales,
    create: saleService.createSale
  }, { items: [] });

  // Carregar produtos separadamente 
  const { data: products, load: loadProducts } = useDataLoader(getProducts);
  const { items: saleItems, addItem, removeItem, updateItem, clearItems } = useItemManager<CreateItem>([]);

  // Modal para detalhes usando useModal
  const detailsModal = useModal<{ sale: Sale | null; errors: string }>({ sale: null, errors: '' });

  // Garantir que sales seja sempre um array
  const salesList = sales ?? [];

  // Carregar dados quando o componente monta
  useEffect(() => {
    loadProducts();
    loadSales();
  }, [loadProducts, loadSales]);

  const handleSaleSubmit = (e: React.FormEvent) => {
    // Criar venda com itens e recarregar lista após sucesso
    handleSubmit(e, { items: saleItems }, () => {
      clearItems();
      loadSales();
    });
  };

  return (
    <Layout>
      <PageTemplate
        title="Vendas"
        description="Gerencie suas vendas"
        actionLabel="Nova Venda"
        onAction={() => openModal()}
        loading={false}
        error={error}
      >
        {loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : salesList.length > 0 ? (
        <Table
          data={salesList}
          columns={[
            {
              key: 'id',
              label: 'ID',
              render: (value: unknown) => (
                <Id>#{value as number}</Id>
              )
            },
            {
              key: 'date',
              label: 'Data',
              render: (value: unknown) => (
                <Caption>
                  {formatDate(value as string)}
                </Caption>
              )
            },
            {
              key: 'username',
              label: 'Usuário',
              render: (value: unknown) => (
                <Caption>{value as string}</Caption>
              )
            },
            {
              key: 'total_value',
              label: 'Valor',
              render: (_: unknown, sale: Sale) => (
                <div className="flex flex-col gap-1">
                  <Currency className="font-semibold">
                    {formatCurrency(sale.total_value)}
                  </Currency>
                  <Caption className="text-gray-500 text-xs">
                    {sale.total_items} itens
                  </Caption>
                </div>
              )
            },
            {
              key: 'purchase_status',
              label: 'Status',
              render: (_: unknown, sale: Sale) => {
                const status = sale.purchase_status;
                return (
                  <div className="flex items-center gap-2">
                    {status ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              status.is_fully_purchased ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(status.purchase_progress, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          status.is_fully_purchased ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {status.purchase_progress.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        Sem status
                      </span>
                    )}
                  </div>
                );
              }
            },
            {
              key: 'actions',
              label: 'Ações',
              render: (_: unknown, sale: Sale) => (
                <ActionButtons
                  onView={() => {
                    detailsModal.openModal();
                    detailsModal.setModalData({ sale });
                  }}
                />
              )
            }
          ]}
        />
        ) : (
          <EmptyState
            title="Nenhuma venda encontrada"
            description="Comece criando sua primeira venda."
            actionLabel="Criar Primeira Venda"
            onAction={() => openModal()}
          />
        )}

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title="Nova Venda"
      >
        <form onSubmit={handleSaleSubmit} className="space-y-4">
          <ErrorDisplay error={modal.errors} />

          <ItemForm
            items={saleItems}
            products={products || []}
            onAddItem={() => addItem({ product_id: 0, quantity: 1 })}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
          />

          <ModalFooter
            onCancel={closeModal}
            submitLabel="Criar Venda"
          />
        </form>
      </Modal>

      {/* Modal de detalhes da venda */}
      {detailsModal.modal.data.sale && (
        <Modal 
          isOpen={detailsModal.modal.isOpen} 
          onClose={() => {
            detailsModal.closeModal();
            detailsModal.setModalData({ sale: null });
          }} 
          title="Detalhes da Venda"
        >
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Caption className="text-gray-500">ID da Venda</Caption>
                  <div><Id className="text-blue-600">#{detailsModal.modal.data.sale.id}</Id></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Data</Caption>
                  <div><Body>{formatDate(detailsModal.modal.data.sale.date)}</Body></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Usuário</Caption>
                  <div><Body>{detailsModal.modal.data.sale.username}</Body></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Total de Itens</Caption>
                  <div><Body>{detailsModal.modal.data.sale.total_items} itens</Body></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Valor Total</Caption>
                  <div><Currency className="!text-lg !font-bold">{formatCurrency(detailsModal.modal.data.sale.total_value)}</Currency></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Status de Compra</Caption>
                  <div>
                    {detailsModal.modal.data.sale.purchase_status ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              detailsModal.modal.data.sale.purchase_status.is_fully_purchased ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(detailsModal.modal.data.sale.purchase_status.purchase_progress, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          detailsModal.modal.data.sale.purchase_status.is_fully_purchased ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {detailsModal.modal.data.sale.purchase_status.purchase_progress.toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        Sem status
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Itens */}
            <div>
              <H4 className="mb-3">Itens</H4>
              <div className="space-y-2">
                {detailsModal.modal.data.sale.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <Body className="font-medium">{item.product.name}</Body>
                      <Caption className="text-gray-500 text-xs">
                        Quantidade: {item.quantity}
                      </Caption>
                    </div>
                    <div className="text-right">
                      <Currency className="font-semibold text-blue-600">
                        {formatCurrency(item.subtotal)}
                      </Currency>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
      </PageTemplate>
    </Layout>
  );
};
