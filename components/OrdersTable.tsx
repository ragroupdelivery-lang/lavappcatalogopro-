import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrdersTableProps {
  orders: Order[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Concluído</span>;
    case OrderStatus.Processing:
      return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Processando</span>;
    case OrderStatus.Cancelled:
      return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Cancelado</span>;
    default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Desconhecido</span>;
  }
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-brand-gray-800 mb-4">Pedidos Recentes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-gray-200">
          <thead className="bg-brand-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                ID do Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-brand-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-blue-dark">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={order.customerAvatar} alt={order.customerName} />
                          </div>
                          <div className="ml-4">
                              <div className="text-sm font-medium text-brand-gray-900">{order.customerName}</div>
                          </div>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-900 font-medium">{formatCurrency(order.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(order.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-brand-gray-500">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;