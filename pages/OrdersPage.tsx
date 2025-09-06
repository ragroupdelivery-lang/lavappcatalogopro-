import React from 'react';
import { useOutletContext } from 'react-router-dom';
import OrdersTable from '../components/OrdersTable';
import { useData } from '../contexts/DataProvider';
import { Order } from '../types';

interface OrdersContext {
    handleEditOrder: (order: Order) => void;
}

const OrdersPage: React.FC = () => {
    const { orders, loading } = useData();
    const { handleEditOrder } = useOutletContext<OrdersContext>();

    if (loading) {
        return <p>Carregando pedidos...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-brand-gray-900 mb-6">Todos os Pedidos</h1>
            <OrdersTable orders={orders} onEditOrder={handleEditOrder} isAdmin={true} />
        </div>
    );
};

export default OrdersPage;
