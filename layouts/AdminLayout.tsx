import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import { Order, Stat, OrderStatus } from '../types';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

// Mock data generation for demonstration
const generateMockData = () => {
    const mockOrders: Order[] = [
        { id: 1, customer_name: 'Ana Silva', customer_avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', service: 'Lavagem Completa', status: 'completed', created_at: '2023-10-26T10:00:00Z', total_price: 150.75 },
        { id: 2, customer_name: 'Bruno Costa', customer_avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', service: 'Lavagem a Seco', status: 'processing', created_at: '2023-10-26T11:30:00Z', total_price: 80.00 },
        { id: 3, customer_name: 'Carla Dias', customer_avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', service: 'Higienização Interna', status: 'pending', created_at: '2023-10-27T09:00:00Z', total_price: 250.00 },
    ];

    const mockStats: Stat[] = [
        { title: 'Receita Total', value: 45230.50, change: '+12.5%', changeType: 'increase', iconName: 'currency-dollar' },
        { title: 'Novos Pedidos', value: '235', change: '+5.2%', changeType: 'increase', iconName: 'shopping-bag' },
        { title: 'Clientes Ativos', value: '120', change: '-1.8%', changeType: 'decrease', iconName: 'users' },
        { title: 'Taxa de Conclusão', value: '98.2%', change: '+0.5%', changeType: 'increase', iconName: 'chart-bar' },
    ];
    
    const mockRevenue = [
        { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 }, { name: 'Mar', revenue: 5000 },
        { name: 'Abr', revenue: 4500 }, { name: 'Mai', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
    ];
    
    return { mockOrders, mockStats, mockRevenue };
};

const AdminLayout: React.FC = () => {
    const [activeView, setActiveView] = useState<'dashboard' | 'customers'>('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{name: string, revenue: number}[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        // In a real app, you would fetch this data from a service
        const { mockOrders, mockStats, mockRevenue } = generateMockData();
        setOrders(mockOrders);
        setStats(mockStats);
        setRevenue(mockRevenue);
        setLoading(false);
    }, []);

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleUpdateOrder = () => {
        if (!selectedOrder) return;
        // Logic to update order status
        addToast(`Pedido #${selectedOrder.id} atualizado!`, 'success');
        handleCloseModal();
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Carregando dados do administrador...</div>;
    }

    return (
        <div className="flex h-screen bg-brand-gray-100 font-sans">
            <Sidebar setActiveView={setActiveView} activeView={activeView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-6">
                    {activeView === 'dashboard' && <Dashboard orders={orders} stats={stats} revenue={revenue} onEditOrder={handleEditOrder} />}
                    {/* Placeholder for other views */}
                    {activeView === 'customers' && <div className="bg-white p-6 rounded-lg shadow-md"><h1>Gerenciamento de Clientes</h1></div>}
                </main>
            </div>
            {selectedOrder && (
                 <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Editar Pedido #${selectedOrder.id}`}>
                    <div>
                        <p className="text-sm text-brand-gray-600"><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                        <p className="text-sm text-brand-gray-600"><strong>Serviço:</strong> {selectedOrder.service}</p>
                        <div className="mt-4">
                            <label htmlFor="status" className="block text-sm font-medium text-brand-gray-700">Status</label>
                            <select
                                id="status"
                                name="status"
                                defaultValue={selectedOrder.status}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-brand-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                            >
                                <option value="pending">Pendente</option>
                                <option value="processing">Em Processamento</option>
                                <option value="completed">Concluído</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={handleCloseModal} type="button" className="bg-white py-2 px-4 border border-brand-gray-300 rounded-md shadow-sm text-sm font-medium text-brand-gray-700 hover:bg-brand-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                                Cancelar
                            </button>
                            <button onClick={handleUpdateOrder} type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                 </Modal>
            )}
        </div>
    );
};

export default AdminLayout;
