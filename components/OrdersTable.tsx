import React from 'react';
import { Order, OrderStatus } from '../types';
import Icon from './Icon';

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  isAdmin: boolean;
}

// Mapeamento de status para cores de fundo e texto (usando as chaves em inglês)
const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    ready: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
};

// Mapeamento de status para exibição em português
const statusTranslations: { [key in OrderStatus]: string } = {
    pending: 'Pendente',
    in_progress: 'Em Preparação',
    ready: 'Pronto para Coleta',
    delivered: 'Entregue',
    canceled: 'Cancelado',
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
              <th scope="col" className="px-6 py-3">Serviço</th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Total</th>
              {isAdmin && <th scope="col" className="px-6 py-3">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {(orders || []).map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-brand-gray-50">
                <td className="px-6 py-4 font-medium text-brand-gray-900">#{order.id}</td>
                {/* Use os dados aninhados para cliente e serviço */}
                <td className="px-6 py-4">{order.customers?.name || 'N/A'}</td>
                <td className="px-6 py-4">{order.services?.name || 'N/A'}</td>
                {/* Use created_at para a data */}
                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">
                  {/* Use order.status para a cor e a tradução para o texto */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusTranslations[order.status] || order.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {(order.services?.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
