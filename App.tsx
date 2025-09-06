import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
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
import Dashboard from './components/Dashboard';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import CustomerOrders from './pages/CustomerOrders';

const LoadingScreen: React.FC = () => (
    <div className="h-screen w-screen flex items-center justify-center bg-brand-gray-50">
        <p className="text-lg text-brand-gray-600">Carregando...</p>
    </div>
);

const RoleBasedLayout: React.FC = () => {
    const { profile, signOut } = useUser();
    
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
                    <button onClick={signOut} className="mt-4 text-brand-blue">Sair</button>
                </div>
            );
    }
};

const ProtectedRoute: React.FC = () => {
    const { session, loading, profile } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !session) {
            navigate('/login');
        }
    }, [session, loading, navigate]);

    if (loading || !profile) {
        return <LoadingScreen />;
    }

    return <RoleBasedLayout />;
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
                            <Route path="/dashboard" element={<ProtectedRoute />}>
                                {/* Admin Routes */}
                                <Route path="" element={<Navigate to="overview" replace />} />
                                <Route path="overview" element={<Dashboard />} />
                                <Route path="pedidos" element={<OrdersPage />} />
                                <Route path="clientes" element={<CustomersPage />} />
                                <Route path="relatorios" element={<ReportsPage />} />
                                {/* Customer Routes */}
                                <Route path="meus-pedidos" element={<CustomerOrders />} />
                            </Route>
                        </Routes>
                    </Router>
                </DataProvider>
            </UserProvider>
        </ToastProvider>
    );
};

export default App;