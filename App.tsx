import React from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { ToastProvider } from './contexts/ToastContext';
import Auth from './components/Auth';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import { initializationError } from './supabaseClient';

const AppContainer: React.FC = () => {
  const { session, profile, loading } = useUser();

  if (initializationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Erro de Configuração</h1>
          <p className="text-red-600">{initializationError.message}</p>
          <p className="mt-4 text-sm text-gray-600">
            Por favor, verifique suas variáveis de ambiente.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-brand-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (profile?.role === 'admin') {
    return <AdminLayout />;
  }
  
  // Default to customer layout if role is not admin or not set
  return <CustomerLayout />;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <UserProvider>
        <AppContainer />
      </UserProvider>
    </ToastProvider>
  );
};

export default App;
