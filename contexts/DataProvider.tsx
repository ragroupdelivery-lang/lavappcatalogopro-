import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Order, Stat } from '../types';
import { useUser } from './UserContext';

interface DataContextType {
    orders: Order[];
    stats: Stat[];
    revenue: { name: string; revenue: number }[];
    loading: boolean;
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { session } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: ordersData, error: ordersError } = await supabase
              .from('orders')
              .select('*')
              .limit(10)
              .order('order_date', { ascending: false });

            if (ordersError) throw ordersError;
            
            if (ordersData) {
              setOrders(ordersData as Order[]);
              const totalRevenue = ordersData.reduce((acc, order) => acc + order.total_price, 0);
              const totalOrders = ordersData.length;
              
              const mockStats: Stat[] = [
                  { title: 'Receita Total', value: totalRevenue, change: '+5.2%', changeType: 'increase', iconName: 'currency-dollar' },
                  { title: 'Total de Pedidos', value: totalOrders, change: '+2.1%', changeType: 'increase', iconName: 'shopping-bag' },
                  { title: 'Novos Clientes', value: '15', change: '-1.8%', changeType: 'decrease', iconName: 'users' },
                  { title: 'Ticket Médio', value: totalOrders > 0 ? totalRevenue / totalOrders : 0, change: '+3.1%', changeType: 'increase', iconName: 'chart-bar' },
              ];
              setStats(mockStats);
            }

            const mockRevenue = [
                { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 },
                { name: 'Mar', revenue: 5000 }, { name: 'Abr', revenue: 4500 },
                { name: 'Mai', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
                { name: 'Jul', revenue: 7000 },
            ];
            setRevenue(mockRevenue);

        } catch (error: any) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) { // Only fetch data if user is logged in
            fetchData();
        } else {
            setLoading(false); // If no session, stop loading
            setOrders([]); // Clear data
            setStats([]);
            setRevenue([]);
        }
    }, [session, fetchData]);

    const value = {
        orders,
        stats,
        revenue,
        loading,
        refreshData: fetchData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
