import React from 'react';
import { Order, OrderStatus } from '../types';
import Icon from './Icon';

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  isAdmin: boolean;
}

const statusColors: Record<OrderStatus, string> = {
    'Pendente': 'bg-yellow-100 text-yellow-800',
    'Em Preparação': 'bg-blue-100 text-blue-800',
    'Pronto para Coleta': 'bg-indigo-100 text-indigo-800',
    'Entregue': 'bg-green-100 text-green-800',
    'Cancelado': 'bg-red-100 text-red-800',
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onEditOrder, isAdmin }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-brand-gray-800 mb-4">Pedidos Recentes</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-gray-500">
          <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID do Pedido</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Total</th>
              {isAdmin && <th scope="col" className="px-6 py-3">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-brand-gray-50">
                <td className="px-6 py-4 font-medium text-brand-gray-900">#{order.id}</td>
                <td className="px-6 py-4">{order.customer_name}</td>
                <td className="px-6 py-4">{new Date(order.order_date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {order.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4">
                    <button onClick={() => onEditOrder(order)} className="text-brand-blue hover:underline">
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
