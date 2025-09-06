import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { DataProvider } from './contexts/DataProvider';

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
import SettingsPage from './pages/SettingsPage';

const LoadingScreen: React.FC = () => (
    <div className="h-screen w-screen flex items-center justify-center bg-brand-gray-50">
        <p className="text-lg text-brand-gray-600 animate-pulse">Carregando Sistema...</p>
    </div>
);

// Componente que decide o layout com base na função do usuário
const RoleBasedRedirect: React.FC = () => {
    const { profile, loading } = useUser();

    if (loading) {
        return <LoadingScreen />;
    }

    // A lógica foi estendida para incluir o entregador.
    if (profile?.role === 'owner' || profile?.role === 'staff') {
        return <AdminLayout />;
    }
    
    // Supondo que o perfil de entregador tenha a role 'delivery'
    if (profile?.role === 'delivery') {
        return <DeliveryLayout />;
    }

    // Para qualquer outro caso (cliente ou perfil indefinido), renderiza o layout do cliente.
    return <CustomerLayout />;
};

// Rota protegida que garante que o usuário esteja logado para acessar o dashboard
const ProtectedRoute: React.FC = () => {
    const { session, loading } = useUser();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // DataProvider envolve todas as rotas protegidas
    return (
        <DataProvider>
            <Outlet />
        </DataProvider>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <UserProvider>
                <Router>
                    <Routes>
                        {/* Rotas Públicas */}
                        <Route path="/" element={<DataProvider><CatalogPage /></DataProvider>} />
                        <Route path="/login" element={<Auth />} />

                        {/* Rota Protegida para o Dashboard */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<RoleBasedRedirect />}>
                                {/* Sub-rotas para Admin */}
                                <Route index element={<Navigate to="overview" replace />} />
                                <Route path="overview" element={<Dashboard />} />
                                <Route path="pedidos" element={<OrdersPage />} />
                                <Route path="clientes" element={<CustomersPage />} />
                                <Route path="relatorios" element={<ReportsPage />} />
                                <Route path="configuracoes" element={<SettingsPage />} />
                                
                                {/* Sub-rotas para Cliente */}
                                <Route path="meus-pedidos" element={<CustomerOrders />} />

                                {/* A rota para entregas será a raiz do DeliveryLayout */}
                                {/* O KanbanBoard será renderizado diretamente pelo DeliveryLayout */}
                            </Route>
                        </Route>
                        
                        {/* Rota de fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </UserProvider>
        </ToastProvider>
    );
};

export default App;