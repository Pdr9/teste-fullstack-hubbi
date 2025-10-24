import { useDataLoader } from './useDataLoader';
import { useModal } from './useModal';
import { validateRequired, extractErrorMessage } from '../utils';

/**
 * Interface para entidades que podem ser editadas.
 * Define que toda entidade editável deve ter um ID numérico.
 */
interface EntityWithId {
  id: number;
}

/**
 * Interface para dados de edição que incluem ID.
 * Estende EntityWithId com propriedades adicionais flexíveis.
 */
interface EditingData extends EntityWithId {
  [key: string]: unknown;
}

/**
 * Hook principal para operações CRUD em páginas.
 * Centraliza lógica de listagem, criação, edição e exclusão de dados.
 */
export const useCrudPage = <T extends EntityWithId, CreateT>(
  service: {
    getAll: () => Promise<T[]>;
    create: (data: CreateT) => Promise<T>;
    update?: (id: number, data: Partial<CreateT>) => Promise<T>;
    delete?: (id: number) => Promise<void>;
  },
  initialData: CreateT
) => {
  const { data, loading, error, load } = useDataLoader(service.getAll);
  const { 
    modal, 
    openModal, 
    closeModal, 
    setModalData, 
    setModalErrors,
    deleteConfirm,
    openDeleteConfirm,
    confirmDelete,
    closeConfirm
  } = useModal(initialData);

  /**
   * Handler para exclusão de itens.
   * Remove item do servidor e recarrega a lista de dados.
   */
  const handleDelete = async (id: number) => {
    try {
      await service.delete!(id);
      load();
    } catch (err) {
      // Backend retorna erro apropriado
    }
  };

  /**
   * Função genérica de submit para formulários.
   * Suporta criação e edição com dados customizados e callback de sucesso.
   */
  const handleSubmit = async (
    e: React.FormEvent,
    customData?: Partial<CreateT>,
    onSuccess?: () => void
  ) => {
    e.preventDefault();
    
    const dataToSubmit = { ...modal.data, ...customData };

    try {
      if (modal.editing) {
        await service.update!((modal.editing as unknown as EditingData).id, dataToSubmit);
      } else {
        await service.create(dataToSubmit);
      }
      
      closeModal();
      load();
      onSuccess?.();
    } catch (err) {
      setModalErrors(extractErrorMessage(err));
    }
  };

  return {
    // Dados
    data,
    loading,
    error,
    load,
    
    // Modal
    modal,
    openModal,
    closeModal,
    setModalData,
    setModalErrors,
    
    // Handlers
    handleDelete,
    handleSubmit,
    
    // Confirmação de exclusão
    confirmDialog: deleteConfirm,
    openDeleteConfirm,
    confirmDelete: () => confirmDelete(handleDelete),
    closeConfirm,
    
    // Validação
    validateRequired
  };
};
