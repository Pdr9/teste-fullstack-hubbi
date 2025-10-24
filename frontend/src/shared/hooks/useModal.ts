import { useState } from 'react';

/**
 * Interface para estado do modal de formulário.
 * Contém informações sobre abertura, edição e dados do formulário.
 */
interface ModalState<T> {
  isOpen: boolean;
  editing: T | null;
  data: T;
  errors: string;
}

/**
 * Interface para itens que podem ser excluídos.
 * Define estrutura mínima para confirmação de exclusão.
 */
interface DeleteableItem {
  id: number;
  name: string;
}

/**
 * Interface para estado do diálogo de confirmação de exclusão.
 * Armazena informações do item a ser excluído.
 */
interface DeleteConfirmState {
  isOpen: boolean;
  itemId: number;
  itemName: string;
}

/**
 * Hook para gerenciar modais de formulário e confirmação de exclusão.
 * Centraliza estado e operações de abertura/fechamento de modais.
 */
export const useModal = <T>(initialData: T) => {
  const [modal, setModal] = useState<ModalState<T>>({
    isOpen: false,
    editing: null,
    data: initialData,
    errors: ''
  });

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    itemId: 0,
    itemName: ''
  });

  /**
   * Abre modal para criação ou edição de item.
   * Se editing for fornecido, carrega dados do item para edição.
   */
  const openModal = (editing: T | null = null) => {
    setModal({
      isOpen: true,
      editing,
      data: editing ? { ...editing } : initialData,
      errors: ''
    });
  };

  /**
   * Fecha modal de formulário mantendo outros estados.
   */
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  /**
   * Atualiza dados do formulário no modal.
   */
  const setModalData = (data: Partial<T>) => {
    setModal(prev => ({ ...prev, data: { ...prev.data, ...data } }));
  };

  /**
   * Define mensagens de erro no modal.
   */
  const setModalErrors = (errors: string) => {
    setModal(prev => ({ ...prev, errors }));
  };

  /**
   * Abre diálogo de confirmação para exclusão de item.
   */
  const openDeleteConfirm = (item: DeleteableItem) => {
    setDeleteConfirm({
      isOpen: true,
      itemId: item.id,
      itemName: item.name
    });
  };

  /**
   * Confirma exclusão executando callback e fechando diálogo.
   */
  const confirmDelete = (onDelete: (id: number) => void) => {
    onDelete(deleteConfirm.itemId);
    setDeleteConfirm({ isOpen: false, itemId: 0, itemName: '' });
  };

  /**
   * Fecha diálogo de confirmação sem executar exclusão.
   */
  const closeConfirm = () => {
    setDeleteConfirm({ isOpen: false, itemId: 0, itemName: '' });
  };

  return {
    modal,
    openModal,
    closeModal,
    setModalData,
    setModalErrors,
    deleteConfirm,
    openDeleteConfirm,
    confirmDelete,
    closeConfirm
  };
};
