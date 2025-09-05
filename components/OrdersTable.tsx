import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import Icon from './Icon';

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  isAdmin: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onEditOrder, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
        return orders;
    }
    return orders.filter(order => 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    );
  }, [orders, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-brand-gray-800">Pedidos Recentes</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-brand-gray-300 rounded-lg w-64 focus:ring-brand-blue focus:border-brand-blue"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="h-5 w-5 text-brand-gray-400" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-gray-500">
          <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Pedido ID</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Serviço</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3 text-right">Total</th>
              {isAdmin && <th scope="col" className="px-6 py-3 text-center">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="bg-white border-b hover:bg-brand-gray-50">
                <td className="px-6 py-4 font-medium text-brand-gray-900">#{order.id}</td>
                <td className="px-6 py-4 flex items-center">
                  <img className="h-8 w-8 rounded-full object-cover mr-3 bg-brand-gray-200" src={order.customer_avatar_url || `https://ui-avatars.com/api/?name=${order.customer_name}&background=3B82F6&color=fff`} alt={order.customer_name} />
                  <span className="font-medium text-brand-gray-900">{order.customer_name}</span>
                </td>
                <td className="px-6 py-4">{order.service_type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_price)}</td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => onEditOrder(order)} className="text-brand-blue hover:text-blue-700 p-1 rounded-md hover:bg-blue-100" aria-label={`Editar pedido ${order.id}`}>
                      <Icon name="pencil" className="h-5 w-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredOrders.length === 0 && (
        <div className="text-center py-10 text-brand-gray-500">
            <p className="font-semibold">Nenhum pedido encontrado</p>
            <p className="text-sm">Tente ajustar sua busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
