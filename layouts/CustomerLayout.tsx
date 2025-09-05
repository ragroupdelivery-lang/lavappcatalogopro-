import React from 'react';
import Header from '../components/Header';
import OrdersTable from '../components/OrdersTable';
import { Order } from '../types';
import { useToast } from '../contexts/ToastContext';

interface CustomerLayoutProps {
    orders: Order[];
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ orders }) => {
  const { addToast } = useToast();

  const handleViewOrder = (order: Order) => {
    addToast(`Visualizando detalhes do pedido #${order.id}`, 'info');
  };

  return (
    <div className="flex h-screen bg-brand-gray-100 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-6 lg:p-8">
          <h1 className="text-2xl font-semibold text-brand-gray-800 mb-6">Meus Pedidos</h1>
          <OrdersTable orders={orders} onEditOrder={handleViewOrder} isAdmin={false} />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
