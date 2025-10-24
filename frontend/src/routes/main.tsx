import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Ponto de entrada da aplicação React.
 * Renderiza o componente App na div root do HTML.
 * StrictMode removido para evitar requisições duplicadas em desenvolvimento.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);