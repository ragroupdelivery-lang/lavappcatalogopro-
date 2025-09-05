// Fix: Provide content for AdminLayout.tsx.
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import { supabase } from '../supabaseClient';
import type { Order, Stat } from '../types';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

// Mock Customers Component for demonstration to avoid import errors
const Customers: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-brand-gray-800">Gerenciamento de Clientes</h2>
        <p className="mt-2 text-brand-gray-600">Esta funcionalidade está em desenvolvimento.</p>
    </div>
);

const AdminLayout: React.FC = () => {
    const [activeView, setActiveView] = useState<'dashboard' | 'customers'>('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch orders
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (ordersError) {
                console.error('Error fetching orders:', ordersError);
                addToast('Falha ao buscar pedidos', 'error');
            } else {
                setOrders(ordersData as Order[]);
            }

            // Mocking stats and revenue data as there are no tables for them
            setStats([
                { title: 'Receita Total', value: 71897, change: '+12.5%', changeType: 'increase', iconName: 'currency-dollar' },
                { title: 'Novos Pedidos', value: '3,241', change: '+5.2%', changeType: 'increase', iconName: 'shopping-bag' },
                { title: 'Novos Clientes', value: '1,204', change: '-1.8%', changeType: 'decrease', iconName: 'users' },
                { title: 'Crescimento', value: '25.5%', change: '+7.3%', changeType: 'increase', iconName: 'chart-bar' },
            ]);
            setRevenue([
                { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
                { name: 'Abr', revenue: 4500 }, { name: 'Mai', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
                { name: 'Jul', revenue: 7000 },
            ]);

            setLoading(false);
        };
        fetchData();
    }, [addToast]);

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleUpdateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedOrder) return;
    
        const formData = new FormData(e.currentTarget);
        const updatedStatus = formData.get('status') as Order['status'];
    
        const { error } = await supabase
          .from('orders')
          .update({ status: updatedStatus })
          .eq('id', selectedOrder.id);
    
        if (error) {
            addToast(`Erro ao atualizar pedido #${selectedOrder.id}`, 'error');
            console.error(error);
        } else {
            addToast(`Pedido #${selectedOrder.id} atualizado com sucesso!`, 'success');
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: updatedStatus } : o));
            handleCloseModal();
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Carregando painel de administração...</div>
    }

    return (
        <div className="flex h-screen bg-brand-gray-100 font-sans">
            <Sidebar setActiveView={setActiveView} activeView={activeView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-6 lg:p-8">
                    {activeView === 'dashboard' && <Dashboard orders={orders} stats={stats} revenue={revenue} onEditOrder={handleEditOrder} />}
                    {activeView === 'customers' && <Customers />}
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Editar Pedido #${selectedOrder?.id}`}>
                {selectedOrder && (
                    <form onSubmit={handleUpdateOrder}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-brand-gray-700">Cliente</label>
                            <p className="mt-1 text-brand-gray-900">{selectedOrder.customer_name}</p>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-medium text-brand-gray-700">Status do Pedido</label>
                            <select
                                id="status"
                                name="status"
                                defaultValue={selectedOrder.status}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-brand-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                            >
                                <option>Pendente</option>
                                <option>Em Preparo</option>
                                <option>Aguardando Coleta</option>
                                <option>Em Trânsito</option>
                                <option>Entregue</option>
                                <option>Cancelado</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-brand-gray-200 text-brand-gray-800 rounded-lg hover:bg-brand-gray-300">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600">Salvar</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default AdminLayout;
