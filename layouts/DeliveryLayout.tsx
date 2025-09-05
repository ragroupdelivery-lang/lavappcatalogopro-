import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import KanbanBoard from '../components/KanbanBoard';
import { useData } from '../contexts/DataProvider';

const DeliveryLayout: React.FC = () => {
    const { orders, loading } = useData();

    const deliveryNavLinks = [
        { href: '#', label: 'Entregas', icon: 'inbox' as const },
        { href: '#', label: 'Mapa', icon: 'view-grid' as const },
        { href: '#', label: 'Histórico', icon: 'document-report' as const },
    ];

    return (
        <div className="flex h-screen bg-brand-gray-50">
            <Sidebar navLinks={deliveryNavLinks} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Painel de Entregas" />
                <main className="flex-1 overflow-x-auto bg-brand-gray-50 p-8">
                    {loading ? <p>Carregando entregas...</p> : <KanbanBoard initialOrders={orders} />}
                </main>
            </div>
        </div>
    );
};

export default DeliveryLayout;
