// Fix: Provide content for OrdersTable.tsx.
import React from 'react';
import Icon from './Icon';
import type { Order, OrderStatus } from '../types';

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  isAdmin: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  Pendente: 'bg-yellow-100 text-yellow-800',
  'Em Preparo': 'bg-blue-100 text-blue-800',
  'Aguardando Coleta': 'bg-indigo-100 text-indigo-800',
  'Em Trânsito': 'bg-purple-100 text-purple-800',
  Entregue: 'bg-green-100 text-green-800',
  Cancelado: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onEditOrder, isAdmin }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-gray-500">
          <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Pedido ID</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Serviço</th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Total</th>
              {isAdmin && <th scope="col" className="px-6 py-3">Entregador</th>}
              <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-brand-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-brand-gray-900 whitespace-nowrap">
                  #{order.id}
                </th>
                <td className="px-6 py-4">{order.customer_name}</td>
                <td className="px-6 py-4">{order.service}</td>
                <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-brand-gray-900">{formatCurrency(order.total)}</td>
                {isAdmin && <td className="px-6 py-4">{order.delivery_person || 'N/A'}</td>}
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onEditOrder(order)} className="font-medium text-brand-blue hover:underline">
                    {isAdmin ? 'Editar' : 'Detalhes'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
