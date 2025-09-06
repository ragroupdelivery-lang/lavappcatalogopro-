import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { DataProvider } from './contexts/DataProvider';
import { supabase } from './supabaseClient';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import DeliveryLayout from './layouts/DeliveryLayout';

// Pages
import Auth from './components/Auth';
import CatalogPage from './pages/CatalogPage';

const LoadingScreen: React.FC = () => (
    <div className="h-screen w-screen flex items-center justify-center">Carregando...</div>
);

const DashboardController: React.FC = () => {
    const { profile } = useUser();
    
    switch (profile?.role) {
        case 'admin':
            return <AdminLayout />;
        case 'customer':
            return <CustomerLayout />;
        case 'delivery':
            return <DeliveryLayout />;
        default:
            return (
                <div className="h-screen w-screen flex flex-col items-center justify-center">
                    <p>Função de usuário desconhecida. Redirecionando...</p>
                    <button onClick={() => supabase.auth.signOut()} className="mt-4 text-brand-blue">Sair</button>
                </div>
            );
    }
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !session) {
            navigate('/login');
        }
    }, [session, loading, navigate]);

    if (loading || !session) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <UserProvider>
                <DataProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<CatalogPage />} />
                            <Route path="/login" element={<Auth />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <DashboardController />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </Router>
                </DataProvider>
            </UserProvider>
        </ToastProvider>
    );
};

export default App;