/**
 * Formata valor numérico como moeda brasileira.
 * Utiliza Intl.NumberFormat para formatação padrão do Brasil.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata string de data para formato brasileiro.
 * Converte para formato DD/MM/AAAA usando Intl.DateTimeFormat.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

/**
 * Trata erros de forma segura extraindo mensagem.
 * Suporta diferentes tipos de erro e propriedades comuns.
 */
export const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  
  if (typeof err === 'object' && err !== null) {
    if ('message' in err && typeof err.message === 'string') {
      return err.message;
    }
    if ('error' in err && typeof err.error === 'string') {
      return err.error;
    }
  }
  
  return 'Erro desconhecido';
};

/**
 * Extrai mensagem de erro de resposta HTTP do Axios.
 * Prioriza mensagem do backend sobre erro genérico.
 */
export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err?.response?.data?.message) {
    return err.response.data.message;
  }
  return 'Erro desconhecido';
};

/**
 * Valida se campo obrigatório foi preenchido.
 * Retorna mensagem de erro ou null se válido.
 */
export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!value || value === '') {
    return `${fieldName} é obrigatório`;
  }
  return null;
};