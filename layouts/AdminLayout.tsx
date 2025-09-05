import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Modal from '../components/Modal';
import { useData } from '../contexts/DataProvider';
import { Order } from '../types';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../supabaseClient';

const AdminLayout: React.FC = () => {
    const { stats, revenue, orders, loading, refreshData } = useData();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const adminNavLinks = [
        { href: '#', label: 'Dashboard', icon: 'view-grid' as const },
        { href: '#', label: 'Pedidos', icon: 'shopping-bag' as const },
        { href: '#', label: 'Clientes', icon: 'user-group' as const },
        { href: '#', label: 'Relatórios', icon: 'document-report' as const },
        { href: '#', label: 'Integrações', icon: 'inbox' as const },
    ];
    
    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;
        setIsSaving(true);
        const { error } = await supabase
            .from('orders')
            .update({ status: selectedOrder.status })
            .eq('id', selectedOrder.id);
            
        setIsSaving(false);

        if (error) {
            addToast(`Erro ao atualizar pedido: ${error.message}`, 'error');
        } else {
            addToast('Pedido atualizado com sucesso!', 'success');
            handleCloseModal();
            refreshData(); // Re-fetch data to update UI
        }
    };

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center">Carregando dados...</div>;
    }

    return (
        <div className="flex h-screen bg-brand-gray-50">
            <Sidebar navLinks={adminNavLinks} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle="Dashboard" />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-50 p-8">
                    <Dashboard
                        stats={stats}
                        revenue={revenue}
                        orders={orders}
                        onEditOrder={handleEditOrder}
                    />
                </main>
            </div>
            {selectedOrder && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Editar Pedido #${selectedOrder.id}`}>
                    <div>
                        <p><strong>Cliente:</strong> {selectedOrder.customer_name}</p>
                        <div className="mt-4">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status do Pedido</label>
                            <select
                                id="status"
                                name="status"
                                value={selectedOrder.status}
                                onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value as Order['status'] })}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option>Pendente</option>
                                <option>Em Preparação</option>
                                <option>Pronto para Coleta</option>
                                <option>Entregue</option>
                                <option>Cancelado</option>
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={handleCloseModal} type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">Cancelar</button>
                            <button onClick={handleUpdateOrder} disabled={isSaving} type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 focus:outline-none disabled:opacity-50">
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdminLayout;
