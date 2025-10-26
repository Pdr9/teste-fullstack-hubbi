import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/shared/contexts';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { Loading } from '@/shared/components/ui';
import { HomePage } from '@/features/auth/pages/HomePage';
import { ProductsPage } from '@/features/products/pages/ProductsPage';
import { SalesPage } from '@/features/sales/pages/SalesPage';
import { PurchasesPage } from '@/features/purchases/pages/PurchasesPage';
import { DashboardPage } from '@/features/dashboard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import '@/style.css';

/**
 * Componente de rotas da aplicação com controle de autenticação.
 * Gerencia navegação entre páginas e proteção de rotas autenticadas.
 */
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  /**
   * Exibe loading enquanto verifica autenticação do usuário.
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/products" element={
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      } />
      
      <Route path="/sales" element={
        <ProtectedRoute>
          <SalesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/purchases" element={
        <ProtectedRoute>
          <PurchasesPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

/**
 * Componente principal da aplicação.
 * Configura providers de autenticação e roteamento.
 */
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}