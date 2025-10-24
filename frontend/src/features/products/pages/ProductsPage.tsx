import React, { useEffect } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { PageTemplate, Table, ConfirmDialog, ActionButtons, ModalFooter, ErrorDisplay } from '@/shared/components/ui';
import { Modal, Input } from '@/shared/components/forms/Form';
import { useCrudPage } from '@/shared/hooks';
import { productService } from '../services/productService';
import { formatCurrency, formatDate } from '@/shared/utils';
import { Body, Currency, Id, Caption, Label } from '@/shared/components/ui/Typography';
import type { Product } from '../types';

export const ProductsPage: React.FC = () => {
  // Hook CRUD
  const {
    data: products,
    loading,
    error,
    load,
    modal,
    openModal,
    closeModal,
    setModalData,
    handleSubmit,
    confirmDialog,
    openDeleteConfirm,
    confirmDelete,
    closeConfirm
  } = useCrudPage({
    getAll: productService.getProducts,
    create: productService.createProduct,
    update: productService.updateProduct,
    delete: productService.deleteProduct
  }, { name: '', price: 0 });

  // Carrega os dados quando o componente monta
  useEffect(() => {
    load();
  }, [load]);



  return (
    <Layout>
      <PageTemplate
        title="Produtos"
        description="Gerencie seu catálogo de produtos"
        actionLabel="Novo Produto"
        onAction={() => openModal()}
        loading={loading}
        error={error}
      >
        {products && products.length > 0 && (
          <Table
            data={products}
            columns={[
              {
                key: 'id',
                label: 'ID',
                render: (value: unknown) => (
                  <Id>#{value as number}</Id>
                )
              },
              {
                key: 'name',
                label: 'Nome',
                render: (value: unknown) => (
                  <Body className="font-medium">{value as string}</Body>
                )
              },
              {
                key: 'price',
                label: 'Preço',
                render: (value: unknown) => (
                  <Currency>
                    {formatCurrency(value as number)}
                  </Currency>
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
                key: 'created_at',
                label: 'Criado em',
                render: (value: unknown) => (
                  <Caption>{formatDate(value as string)}</Caption>
                )
              },
              {
                key: 'actions',
                label: 'Ações',
                render: (_: unknown, product: Product) => (
                  <ActionButtons
                    onEdit={() => openModal(product)}
                    onDelete={() => openDeleteConfirm(product)}
                  />
                )
              }
            ]}
          />
        )}

        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.editing ? 'Editar Produto' : 'Novo Produto'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorDisplay error={modal.errors} />

            <div>
              <Label className="block mb-1">
                Nome
              </Label>
              <Input
                value={modal.data.name}
                onChange={(e) => setModalData({ name: e.target.value })}
                placeholder="Nome do produto"
                required
              />
            </div>

            <div>
              <Label className="block mb-1">
                Preço
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={modal.data.price}
                onChange={(e) => setModalData({ price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>

            <ModalFooter
              onCancel={closeModal}
              submitLabel={modal.editing ? 'Atualizar' : 'Criar'}
            />
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirm}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o produto "${confirmDialog.itemName}"?`}
        />
      </PageTemplate>
    </Layout>
  );
};
