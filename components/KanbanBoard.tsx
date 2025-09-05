import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

interface KanbanBoardProps {
  initialOrders: Order[];
}

const statusColumns: OrderStatus[] = ['Pendente', 'Em Preparação', 'Pronto para Coleta', 'Entregue'];

const KanbanColumn: React.FC<{ title: string; orders: Order[] }> = ({ title, orders }) => {
  return (
    <div className="bg-brand-gray-100 rounded-lg p-3 flex-shrink-0 w-80">
      <h3 className="font-semibold text-brand-gray-700 mb-4 px-1">{title} ({orders.length})</h3>
      <div className="space-y-3 overflow-y-auto h-[calc(100vh-250px)]">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-md shadow-sm border">
            <p className="font-semibold text-brand-gray-800">Pedido #{order.id}</p>
            <p className="text-sm text-brand-gray-600 mt-1">{order.customer_name}</p>
            <p className="text-sm text-brand-gray-500 mt-2">{order.service_type}</p>
            <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-sm font-bold text-brand-blue">
                    {order.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                    {order.delivery_type}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialOrders }) => {
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, Order[]>>({});

  useEffect(() => {
    const groupedOrders = statusColumns.reduce((acc, status) => {
        acc[status] = [];
        return acc;
    }, {} as Record<string, Order[]>);

    initialOrders.forEach(order => {
        if (groupedOrders[order.status]) {
            groupedOrders[order.status].push(order);
        }
    });

    setOrdersByStatus(groupedOrders);
  }, [initialOrders]);
  
  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {statusColumns.map(status => (
        <KanbanColumn key={status} title={status} orders={ordersByStatus[status] || []} />
      ))}
    </div>
  );
};

export default KanbanBoard;
