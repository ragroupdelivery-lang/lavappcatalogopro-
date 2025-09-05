// Fix: Provide content for DeliveryLayout.tsx.
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import OrdersTable from '../components/OrdersTable';
import { supabase } from '../supabaseClient';
import type { Order } from '../types';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';

const DeliveryLayout: React.FC = () => {
  const { user } = useUser();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryOrders = async () => {
      if (!user?.full_name) {
          setLoading(false);
          return;
      };

      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('delivery_person', user.full_name)
        .in('status', ['Aguardando Coleta', 'Em Trânsito']);

      if (error) {
        console.error('Error fetching delivery orders:', error);
        addToast('Falha ao buscar suas entregas.', 'error');
      } else {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchDeliveryOrders();
  }, [user, addToast]);

  const handleUpdateStatus = async (order: Order) => {
    // Logic to cycle through delivery statuses
    const newStatus = order.status === 'Aguardando Coleta' ? 'Em Trânsito' : 'Entregue';
    
    const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

    if (error) {
        addToast(`Erro ao atualizar pedido #${order.id}`, 'error');
    } else {
        addToast(`Pedido #${order.id} atualizado para ${newStatus}!`, 'success');
        // Remove delivered orders from the list
        setOrders(prevOrders => prevOrders.filter(o => o.id !== order.id));
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando entregas...</div>;
  }

  return (
    <div className="flex h-screen bg-brand-gray-100 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-semibold text-brand-gray-800">Minhas Entregas</h1>
          </div>
          <OrdersTable orders={orders} onEditOrder={handleUpdateStatus} isAdmin={false} />
        </main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
