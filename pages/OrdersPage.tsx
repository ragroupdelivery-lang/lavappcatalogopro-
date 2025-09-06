import React, { useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import { useData } from '../contexts/DataProvider';
import { Order, OrderStatus } from '../types';
import Modal from '../components/Modal';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';

// Mapeamento de status para exibição
const statusTranslations: { [key in OrderStatus]: string } = {
    pending: 'Pendente',
    in_progress: 'Em Preparação',
    ready: 'Pronto para Coleta',
    delivered: 'Entregue',
    canceled: 'Cancelado',
};

const OrderEditForm: React.FC<{ order: Order; onClose: () => void; onSave: (updatedOrder: Order) => void }> = ({ order, onClose, onSave }) => {
    const [status, setStatus] = useState<OrderStatus>(order.status);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...order, status });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <p><strong>Pedido:</strong> #{order.id}</p>
                {/* Use os dados join para mostrar o nome do cliente */}
                <p><strong>Cliente:</strong> {order.customers?.name || 'Cliente não encontrado'}</p>
                 <p><strong>Serviço:</strong> {order.services?.name || 'Serviço não encontrado'}</p>
            </div>
            <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-brand-gray-700 mb-1">
                    Status do Pedido
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                >
                    {/* Mapeie as chaves do objeto de tradução para criar as opções */}
                    {Object.entries(statusTranslations).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-brand-gray-200 text-brand-gray-800 rounded-lg hover:bg-brand-gray-300">
                    Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600">
                    Salvar Alterações
                </button>
            </div>
        </form>
    );
};

const OrdersPage: React.FC = () => {
    const { orders, loading, refreshData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { addToast } = useToast();

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleSaveOrder = async (updatedOrder: Order) => {
        if (!selectedOrder) return;
        
        const { error } = await supabase
            .from('orders')
            .update({ status: updatedOrder.status })
            .eq('id', selectedOrder.id);
        
        if (error) {
            addToast(`Erro ao atualizar pedido: ${error.message}`, 'error');
        } else {
            addToast('Pedido atualizado com sucesso!', 'success');
            refreshData();
        }
        handleCloseModal();
    };


    if (loading) {
        return <p className="text-center">Carregando pedidos...</p>;
    }

    return (
        <div>
            <OrdersTable orders={orders} onEditOrder={handleEditOrder} isAdmin={true} />
             {selectedOrder && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Editar Pedido #${selectedOrder.id}`}>
                    <OrderEditForm order={selectedOrder} onClose={handleCloseModal} onSave={handleSaveOrder} />
                </Modal>
            )}
        </div>
    );
};

export default OrdersPage;
