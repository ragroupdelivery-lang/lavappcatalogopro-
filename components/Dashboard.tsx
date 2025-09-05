import React from 'react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import OrdersTable from './OrdersTable';
import { Order, Stat } from '../types';

interface DashboardProps {
    orders: Order[];
    stats: Stat[];
    revenue: { name: string; revenue: number }[];
    onEditOrder: (order: Order) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, stats, revenue, onEditOrder }) => {
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
                <OrdersTable orders={orders} onEditOrder={onEditOrder} isAdmin={true} />
            </div>
        </div>
    );
};

export default Dashboard;
