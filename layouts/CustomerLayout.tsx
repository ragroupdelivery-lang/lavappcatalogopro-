import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import OrdersTable from '../components/OrdersTable';
import type { Order } from '../types';
import { useUser } from '../contexts/UserContext';

// Mock data for demonstration
const generateMockCustomerOrders = (userId: string | undefined): Order[] => {
    if (!userId) return [];
    return [
        { id: 101, customer_name: 'Meu Pedido', customer_avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', service: 'Lavagem Completa', status: 'completed', created_at: '2023-10-20T10:00:00Z', total_price: 150.75 },
        { id: 102, customer_name: 'Meu Pedido', customer_avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', service: 'Lavagem a Seco', status: 'processing', created_at: '2023-10-25T11:30:00Z', total_price: 80.00 },
    ];
};

const CustomerLayout: React.FC = () => {
    const { user } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would fetch this data from Supabase for the current user
        const customerOrders = generateMockCustomerOrders(user?.id);
        setOrders(customerOrders);
        setLoading(false);
    }, [user]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Carregando seus dados...</div>;
    }

    return (
        <div className="min-h-screen bg-brand-gray-100 font-sans">
            <Header />
            <main className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-brand-gray-800 mb-6">Meus Pedidos</h1>
                    <OrdersTable 
                        orders={orders} 
                        onEditOrder={() => {}} // No edit functionality for customers in this view
                        isAdmin={false}
                        title="Histórico de Pedidos"
                    />
                </div>
            </main>
        </div>
    );
};

export default CustomerLayout;
