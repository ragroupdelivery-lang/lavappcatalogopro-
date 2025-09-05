import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import OrdersTable from '../components/OrdersTable';
import { useData } from '../contexts/DataProvider';
import { useUser } from '../contexts/UserContext';
import Icon from '../components/Icon';

const CustomerLayout: React.FC = () => {
    const { orders, loading } = useData();
    const { profile } = useUser();

    const customerNavLinks = [
        { href: '#', label: 'Meus Pedidos', icon: 'shopping-bag' as const },
        { href: '#', label: 'Novo Pedido', icon: 'plus' as const },
        { href: '#', label: 'Meu Perfil', icon: 'users' as const },
    ];
    
    // In a real app, you would filter orders for the current user ID
    const customerOrders = orders; 

    return (
        <div className="flex h-screen bg-brand-gray-50">
            <Sidebar navLinks={customerNavLinks} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle={`Bem-vindo, ${profile?.username || 'Cliente'}`} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-50 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-brand-gray-800">Seus Pedidos Recentes</h2>
                        <button className="flex items-center bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
                            <Icon name="plus" className="h-5 w-5 mr-2" />
                            Fazer Novo Pedido
                        </button>
                    </div>
                    {loading ? (
                        <p>Carregando pedidos...</p>
                    ) : (
                        <OrdersTable orders={customerOrders} onEditOrder={() => {}} isAdmin={false} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
