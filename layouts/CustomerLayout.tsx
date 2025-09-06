import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';
import Icon from '../components/Icon';
import { useToast } from '../contexts/ToastContext';

const customerNavLinks = [
    { href: '/dashboard/meus-pedidos', label: 'Meus Pedidos', icon: 'shopping-bag' as const },
    // Adicionar aqui o link para 'Meu Perfil' quando a página for criada
    // { href: '/dashboard/meu-perfil', label: 'Meu Perfil', icon: 'users' as const },
];

const CustomerLayout: React.FC = () => {
    const { profile } = useUser();
    const { addToast } = useToast();

    // A página inicial padrão para um cliente é 'meus-pedidos'.
    // Esta verificação garante que se ele chegar em '/dashboard', seja redirecionado.
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
        return <Navigate to="/dashboard/meus-pedidos" replace />;
    }

    const handleNewOrderClick = () => {
        addToast('Funcionalidade de novo pedido em desenvolvimento!', 'info');
    };

    return (
        <div className="flex h-screen bg-brand-gray-50">
            <Sidebar navLinks={customerNavLinks} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle={`Bem-vindo, ${profile?.full_name || 'Cliente'}`} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-50 p-8">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-brand-gray-800">Seus Pedidos</h2>
                        <button 
                            onClick={handleNewOrderClick}
                            className="flex items-center bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Icon name="plus" className="h-5 w-5 mr-2" />
                            Fazer Novo Pedido
                        </button>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
