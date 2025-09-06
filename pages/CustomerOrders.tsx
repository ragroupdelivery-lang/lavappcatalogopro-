import React from 'react';
import OrdersTable from '../components/OrdersTable';
import { useData } from '../contexts/DataProvider';

const CustomerOrders: React.FC = () => {
    const { orders, loading } = useData();

    if (loading) {
        return <p>Carregando seus pedidos...</p>;
    }

    return (
        <OrdersTable orders={orders} onEditOrder={() => {}} isAdmin={false} />
    );
};

export default CustomerOrders;
