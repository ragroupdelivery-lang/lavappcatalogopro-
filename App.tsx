import React from 'react';
import { ToastProvider } from './contexts/ToastContext';
import { UserProvider, useUser } from './contexts/UserContext';
import Auth from './components/Auth';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import DeliveryLayout from './layouts/DeliveryLayout';
import { DataProvider } from './contexts/DataProvider';
import { supabase } from './supabaseClient';

const AppContent: React.FC = () => {
    const { session, profile, loading } = useUser();

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center">Carregando...</div>;
    }

    if (!session || !profile) {
        return <Auth />;
    }

    switch (profile.role) {
        case 'admin':
            return <AdminLayout />;
        case 'customer':
            return <CustomerLayout />;
        case 'delivery':
            return <DeliveryLayout />;
        default:
            return (
                <div className="h-screen w-screen flex flex-col items-center justify-center">
                    <p>Não foi possível determinar sua função. Por favor, entre em contato com o suporte.</p>
                    <button onClick={() => supabase.auth.signOut()} className="mt-4 text-brand-blue">Sair</button>
                </div>
            );
    }
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <UserProvider>
                <DataProvider>
                    <AppContent />
                </DataProvider>
            </UserProvider>
        </ToastProvider>
    );
};

export default App;
