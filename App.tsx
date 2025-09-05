import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useUser } from './contexts/UserContext';
import { useToast } from './contexts/ToastContext';
import { Order, Stat, Customer, OrderStatus } from './types';

import Auth from './components/Auth';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import Dashboard from './components/Dashboard';
import Modal from './components/Modal';

const App: React.FC = () => {
    const { session, profile, loading } = useUser();
    const [activeView, setActiveView] = useState<'dashboard' | 'customers'>('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { addToast } = useToast();

    const fetchDashboardData = async () => {
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select(`
                *,
                profiles (
                    full_name,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false });

        if (ordersError) {
            addToast('Erro ao buscar pedidos', 'error');
            console.error('Error fetching orders:', ordersError);
        } else if (ordersData) {
             const formattedOrders: Order[] = ordersData.map((o: any) => ({
                id: o.id,
                customer_name: o.profiles?.full_name || 'Cliente desconhecido',
                customer_avatar_url: o.profiles?.avatar_url || '',
                service_type: o.service_type,
                status: o.status,
                created_at: o.created_at,
                total_price: o.total_price,
                user_id: o.user_id
            }));
            setOrders(formattedOrders);
        }

        // Mocking stats and revenue for demonstration as these tables might not exist.
        setStats([
            { title: 'Receita Total', value: 25750.80, change: '+12.5%', changeType: 'increase', iconName: 'currency-dollar' },
            { title: 'Novos Pedidos', value: '350', change: '+5.2%', changeType: 'increase', iconName: 'shopping-bag' },
            { title: 'Novos Clientes', value: '42', change: '-1.8%', changeType: 'decrease', iconName: 'users' },
            { title: 'Taxa de Conclusão', value: '98.2%', change: '+0.5%', changeType: 'increase', iconName: 'chart-bar' },
        ]);

        setRevenue([
            { name: 'Jan', revenue: 4000 },
            { name: 'Fev', revenue: 3000 },
            { name: 'Mar', revenue: 5000 },
            { name: 'Abr', revenue: 4500 },
            { name: 'Mai', revenue: 6000 },
            { name: 'Jun', revenue: 5500 },
        ]);
    };

    useEffect(() => {
        if (session) {
            fetchDashboardData();
        }
    }, [session]);

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };
    
    const handleUpdateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedOrder) return;

        const formData = new FormData(e.currentTarget);
        const newStatus = formData.get('status') as OrderStatus;
        
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', selectedOrder.id);
        
        if (error) {
            addToast('Erro ao atualizar o pedido', 'error');
        } else {
            addToast('Pedido atualizado com sucesso!', 'success');
            setIsEditModalOpen(false);
            setSelectedOrder(null);
            fetchDashboardData(); // Refetch data to show update
        }
    };
    
    if (loading) {
        return <div className="flex h-screen items-center justify-center text-brand-gray-500">Carregando...</div>;
    }

    if (!session) {
        return <Auth />;
    }

    const isAdmin = profile?.role === 'admin';

    return (
        <>
            {isAdmin ? (
                <AdminLayout activeView={activeView} setActiveView={setActiveView}>
                    {activeView === 'dashboard' && (
                        <Dashboard orders={orders} stats={stats} revenue={revenue} onEditOrder={handleEditOrder} />
                    )}
                    {activeView === 'customers' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                           <h1 className="text-2xl font-semibold text-brand-gray-800">Clientes</h1>
                           <p className="mt-2 text-brand-gray-500">A gestão de clientes será implementada aqui.</p>
                        </div>
                    )}
                </AdminLayout>
            ) : (
                <CustomerLayout orders={orders.filter(o => o.user_id === profile?.id)} />
            )}
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Editar Pedido #${selectedOrder?.id}`}>
                {selectedOrder && (
                     <form onSubmit={handleUpdateOrder}>
                        <div className="mb-4 space-y-1 text-sm text-brand-gray-700">
                            <p><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                            <p><strong>Serviço:</strong> {selectedOrder.service_type}</p>
                            <p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total_price)}</p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="status" className="block text-sm font-medium text-brand-gray-700 mb-1">
                                Status do Pedido
                            </label>
                            <select
                                id="status"
                                name="status"
                                defaultValue={selectedOrder.status}
                                className="w-full px-3 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                            >
                                <option value="pending">Pendente</option>
                                <option value="processing">Processando</option>
                                <option value="completed">Concluído</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-brand-gray-200 text-brand-gray-800 rounded-lg hover:bg-brand-gray-300 font-medium">
                                Cancelar
                            </button>
                            <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 font-medium">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}

export default App;
