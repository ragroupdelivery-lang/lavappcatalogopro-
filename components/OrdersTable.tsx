import React from 'react';
import type { Order, OrderStatus } from '../types';
import Icon from './Icon';

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  isAdmin: boolean;
  title?: string;
}

const statusStyles: Record<OrderStatus, string> = {
  completed: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onEditOrder, isAdmin, title = "Pedidos Recentes" }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-brand-gray-800">{title}</h2>
        {isAdmin && (
            <button className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-blue-dark transition-colors text-sm font-medium">
                <Icon name="plus" className="h-4 w-4 mr-2" />
                <span>Novo Pedido</span>
            </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-gray-500">
          <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Serviço</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3 text-right">Total</th>
              {isAdmin && <th scope="col" className="px-6 py-3"><span className="sr-only">Editar</span></th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-brand-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-brand-gray-900 whitespace-nowrap flex items-center">
                  <img className="w-8 h-8 rounded-full mr-3 object-cover" src={order.customer_avatar} alt={`${order.customer_name} avatar`} />
                  {order.customer_name}
                </th>
                <td className="px-6 py-4">{order.service}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4 font-semibold text-right">{formatCurrency(order.total_price)}</td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onEditOrder(order)} className="text-brand-blue hover:text-brand-blue-dark">
                      <Icon name="pencil" className="h-5 w-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
