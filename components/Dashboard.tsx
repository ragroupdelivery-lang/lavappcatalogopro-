import React from 'react';
import { useOutletContext } from 'react-router-dom';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import OrdersTable from './OrdersTable';
import { useData } from '../contexts/DataProvider';
import { Order } from '../types';

interface DashboardContext {
    handleEditOrder: (order: Order) => void;
}

const Dashboard: React.FC = () => {
    // FIX: The 'revenue' property is now available in the useData context.
    const { orders, stats, revenue, loading } = useData();
    const { handleEditOrder } = useOutletContext<DashboardContext>();

    if (loading) {
        return <p>Carregando dashboard...</p>
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-gray-800 mb-4">Visão Geral da Receita</h2>
                <RevenueChart data={revenue} />
            </div>

            <div className="mt-8">
                <OrdersTable orders={orders} onEditOrder={handleEditOrder} isAdmin={true} />
            </div>
        </div>
    );
};

export default Dashboard;