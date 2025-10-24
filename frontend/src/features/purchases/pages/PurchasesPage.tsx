import React, { useEffect, useCallback } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { PageTemplate, Table, ModalFooter, ItemForm, ErrorDisplay, ActionButtons } from '@/shared/components/ui';
import { Modal } from '@/shared/components/forms/Form';
import { Select } from '@/shared/components/forms/Form';
import { useDataLoader } from '@/shared/hooks';
import { useItemManager } from '@/shared/hooks';
import { useModal } from '@/shared/hooks';
import { purchaseService } from '../services/purchaseService';
import { saleService } from '@/features/sales/services/saleService';
import { productService } from '@/features/products/services/productService';
import { formatCurrency, formatDate, extractErrorMessage } from '@/shared/utils';
import { Body, Currency, Id, Caption, Label, H4 } from '@/shared/components/ui/Typography';
import type { CreateItem, Purchase } from '../types';
import type { Sale } from '@/features/sales/types';

export const PurchasesPage: React.FC = () => {
  const { data: purchases, loading, error, load: loadPurchases } = useDataLoader(purchaseService.getPurchases);
  const { data: sales, load: loadSales } = useDataLoader(saleService.getSales);
  const { data: products, load: loadProducts } = useDataLoader(productService.getProducts);
  const { items: purchaseItems, addItem, removeItem, updateItem, clearItems } = useItemManager<CreateItem>([]);
  
  // Modal para criação de compras
  const createModal = useModal<{ selectedSale: Sale | null; errors: string }>({ selectedSale: null, errors: '' });
  
  // Modal para detalhes de compras
  const detailsModal = useModal<{ purchase: Purchase | null; errors: string }>({ purchase: null, errors: '' });

  // Carregar dados quando o componente monta
  useEffect(() => {
    loadPurchases();
    loadSales();
    loadProducts();
  }, [loadPurchases, loadSales, loadProducts]);

  const addPurchaseItem = () => {
    if (!createModal.modal.data.selectedSale) return;
    
    // Produtos da venda que ainda não foram adicionados
    const saleProductIds = createModal.modal.data.selectedSale.items.map((item: any) => item.product.id);
    const saleProducts = products?.filter(p => saleProductIds.includes(p.id)) || [];
    const addedProductIds = purchaseItems.map(item => item.product_id);
    const availableProducts = saleProducts.filter(p => !addedProductIds.includes(p.id));
    
    if (availableProducts.length > 0) {
      addItem({ 
        product_id: availableProducts[0].id, 
        quantity: 1 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Backend já valida venda selecionada, items obrigatórios e quantidades
    try {
      await purchaseService.createPurchase({ 
        sale_id: createModal.modal.data.selectedSale!.id, 
        items: purchaseItems 
      });
      createModal.closeModal();
      clearItems();
      loadPurchases();
    } catch (err) {
      createModal.setModalErrors(extractErrorMessage(err));
    }
  };

  // Funções inline para produtos (KISS - Keep It Simple)
  const getSaleProducts = () => {
    if (!createModal.modal.data.selectedSale || !products) return [];
    const saleProductIds = createModal.modal.data.selectedSale.items.map((item: any) => item.product.id);
    return products.filter(p => saleProductIds.includes(p.id));
  };

  const getAvailableProductsToAdd = () => {
    const saleProducts = getSaleProducts();
    const addedProductIds = purchaseItems.map(item => item.product_id);
    return saleProducts.filter(p => !addedProductIds.includes(p.id));
  };

  const getAvailableQuantity = useCallback((productId: number) => {
    if (!createModal.modal.data.selectedSale || !purchases) return 0;
    
    // Buscar quantidade necessária na venda
    const saleItem = createModal.modal.data.selectedSale.items.find((item: any) => item.product.id === productId);
    if (!saleItem) return 0;
    
    const requiredQuantity = saleItem.quantity;
    
    // Calcular quantidade já comprada
    let purchasedQuantity = 0;
    purchases.forEach(purchase => {
      if (purchase.sale === createModal.modal.data.selectedSale!.id) {
        purchase.items.forEach(item => {
          if (item.product.id === productId) {
            purchasedQuantity += item.quantity;
          }
        });
      }
    });
    
    return Math.max(0, requiredQuantity - purchasedQuantity);
  }, [createModal.modal.data.selectedSale, purchases]);


  return (
    <Layout>
      <PageTemplate
        title="Compras"
        description="Gerencie suas compras para atender vendas"
        actionLabel="Nova Compra"
        onAction={() => createModal.openModal()}
        loading={loading}
        error={error}
      >
      {purchases && purchases.length > 0 && (
        <Table
          data={purchases}
          columns={[
            {
              key: 'id',
              label: 'ID',
              render: (value) => (
                <Id>#{value as number}</Id>
              )
            },
            {
              key: 'date',
              label: 'Data',
              render: (value) => (
                <Caption>
                  {formatDate(value as string)}
                </Caption>
              )
            },
            {
              key: 'username',
              label: 'Usuário',
              render: (value) => (
                <Caption>{value as string}</Caption>
              )
            },
            {
              key: 'sale',
              label: 'Para Venda',
              render: (value) => (
                <Id className="text-blue-600">
                  #{value as number}
                </Id>
              )
            },
            {
              key: 'total_value',
              label: 'Valor',
              render: (_, purchase) => (
                <div className="flex flex-col gap-1">
                  <Currency className="font-semibold text-blue-600">
                    {formatCurrency(purchase.total_value)}
                  </Currency>
                  <Caption className="text-gray-500 text-xs">
                    {purchase.total_items} itens
                  </Caption>
                </div>
              )
            },
            {
              key: 'actions',
              label: 'Ações',
              render: (_, purchase) => (
                <ActionButtons
                  onView={() => {
                    detailsModal.openModal();
                    detailsModal.setModalData({ purchase });
                  }}
                />
              )
            }
          ]}
        />
      )}

      <Modal
        isOpen={createModal.modal.isOpen}
        onClose={createModal.closeModal}
        title="Nova Compra"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorDisplay error={createModal.modal.errors} />

          <div>
            <Label className="block mb-1">
              Venda
            </Label>
            <Select
              value={createModal.modal.data.selectedSale?.id || 0}
              onChange={(e) => {
                const saleId = parseInt(e.target.value);
                const sale = sales?.find(s => s.id === saleId);
                createModal.setModalData({ 
                  selectedSale: sale || null, 
                  errors: '' 
                });
                clearItems();
              }}
            >
              <option value={0}>Selecione uma venda</option>
              {sales?.map((sale) => (
                <option key={sale.id} value={sale.id}>
                  Venda #{sale.id} - {formatCurrency(sale.total_value)}
                </option>
              ))}
            </Select>
          </div>

          {createModal.modal.data.selectedSale && (
            <div className="bg-gray-50 p-3 rounded-md">
              <H4 className="mb-2">Itens da Venda:</H4>
              <div className="space-y-1">
                {createModal.modal.data.selectedSale.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <Body>{item.product.name}</Body>
                    <Caption>x{item.quantity}</Caption>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ItemForm
            items={purchaseItems}
            products={getSaleProducts()}
            onAddItem={addPurchaseItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
            addButtonDisabled={!createModal.modal.data.selectedSale || getAvailableProductsToAdd().length === 0}
            getMaxQuantity={getAvailableQuantity}
          />

          <ModalFooter
            onCancel={createModal.closeModal}
            submitLabel="Criar Compra"
          />
        </form>
      </Modal>

      {detailsModal.modal.data.purchase && (
        <Modal 
          isOpen={detailsModal.modal.isOpen} 
          onClose={() => {
            detailsModal.closeModal();
            detailsModal.setModalData({ purchase: null });
          }} 
          title="Detalhes da Compra"
        >
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Caption className="text-gray-500">ID da Compra</Caption>
                  <div><Id className="text-blue-600">#{detailsModal.modal.data.purchase.id}</Id></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Data</Caption>
                  <div><Body>{formatDate(detailsModal.modal.data.purchase.date)}</Body></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Usuário</Caption>
                  <div><Body>{detailsModal.modal.data.purchase.username}</Body></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Para Venda</Caption>
                  <div><Id className="text-green-600">#{detailsModal.modal.data.purchase.sale}</Id></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Total de Itens</Caption>
                  <div><Body>{detailsModal.modal.data.purchase.total_items} itens</Body></div>
                </div>
                <div>
                  <Caption className="text-gray-500">Valor Total</Caption>
                  <div><Currency className="!text-lg !font-bold">{formatCurrency(detailsModal.modal.data.purchase.total_value)}</Currency></div>
                </div>
              </div>
            </div>

            {/* Itens */}
            <div>
              <H4 className="mb-3">Itens</H4>
              <div className="space-y-2">
                {detailsModal.modal.data.purchase.items.map((item) => (
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
