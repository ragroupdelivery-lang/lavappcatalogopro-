import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Order, Stat, Service } from '../types';
import { useUser } from './UserContext';

interface DataContextType {
    orders: Order[];
    stats: Stat[];
    revenue: { name: string; revenue: number }[];
    services: Service[];
    loading: boolean;
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { session, initializationError } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (initializationError) {
            console.warn("MODO DE DEMONSTRAÇÃO: Usando dados de mock para o painel e catálogo.");
            // Mock Services
            const mockServices: Service[] = [
                { id: 1, name: 'Lavagem Completa', description: 'Lavagem e secagem de roupas do dia a dia.', price: 55.00, icon: 'shopping-bag' },
                { id: 2, name: 'Terno e Gravata', description: 'Limpeza a seco especializada para trajes sociais.', price: 80.00, icon: 'sparkles' },
                { id: 3, name: 'Edredom Queen', description: 'Higienização profunda para seu edredom.', price: 75.50, icon: 'inbox' },
                { id: 4, name: 'Tênis (Par)', description: 'Lavagem e revitalização de calçados.', price: 45.00, icon: 'sparkles' },
            ];
            setServices(mockServices);

            // Mock Orders and Stats
            const mockOrders: Order[] = [
                { id: 101, customer_name: 'Ana Silva', service_type: 'Lavagem Completa', order_date: '2024-05-20T10:00:00Z', status: 'Entregue', total_price: 75.50, delivery_type: 'Coleta' },
                { id: 102, customer_name: 'Bruno Costa', service_type: 'Edredom Queen', order_date: '2024-05-21T11:30:00Z', status: 'Pronto para Coleta', total_price: 45.00, delivery_type: 'Coleta' },
                { id: 103, customer_name: 'Carla Dias', service_type: 'Terno e Gravata', order_date: '2024-05-22T09:15:00Z', status: 'Em Preparação', total_price: 60.00, delivery_type: 'Entrega' },
                { id: 104, customer_name: 'Daniel Alves', service_type: 'Cortinas (3 peças)', order_date: '2024-05-23T14:00:00Z', status: 'Pendente', total_price: 120.00, delivery_type: 'Entrega' },
            ];
            
            const totalRevenue = mockOrders.reduce((acc, order) => acc + order.total_price, 0);
            const totalOrders = mockOrders.length;
            
            const mockStats: Stat[] = [
                { title: 'Receita (Mock)', value: totalRevenue, change: '+5.2%', changeType: 'increase', iconName: 'currency-dollar' },
                { title: 'Pedidos (Mock)', value: totalOrders, change: '+2.1%', changeType: 'increase', iconName: 'shopping-bag' },
                { title: 'Clientes (Mock)', value: 4, change: '+10%', changeType: 'increase', iconName: 'users' },
                { title: 'Crescimento (Mock)', value: '15%', change: '-1.0%', changeType: 'decrease', iconName: 'chart-bar' },
            ];
            
            const mockRevenue = [
                { name: 'Jan', revenue: 4100 }, { name: 'Fev', revenue: 3200 },
                { name: 'Mar', revenue: 5300 }, { name: 'Abr', revenue: 4600 },
            ];

            setOrders(mockOrders);
            setStats(mockStats);
            setRevenue(mockRevenue);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            // Fetch public services (requires RLS policy)
            const { data: servicesData, error: servicesError } = await supabase
                .from('services')
                .select('*');

            if (servicesError) console.warn('Could not fetch services. Make sure RLS is configured for public access.');
            if (servicesData) setServices(servicesData as Service[]);

            // Fetch orders (protected)
            if (session) {
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
                  
                  // Stats are now dynamic based on fetched data
                  const dynamicStats: Stat[] = [
                      { title: 'Receita Total', value: totalRevenue, change: '+5.2%', changeType: 'increase', iconName: 'currency-dollar' },
                      { title: 'Total de Pedidos', value: totalOrders, change: '+2.1%', changeType: 'increase', iconName: 'shopping-bag' },
                      // These can be replaced with real data queries later
                      { title: 'Clientes Ativos', value: 25, change: '+10%', changeType: 'increase', iconName: 'users' },
                      { title: 'Crescimento Mensal', value: '15%', change: '-1.0%', changeType: 'decrease', iconName: 'chart-bar' },
                  ];
                  setStats(dynamicStats);
                }
            }
             const mockRevenue = [
                { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 },
                { name: 'Mar', revenue: 5000 }, { name: 'Abr', revenue: 4500 },
            ];
            setRevenue(mockRevenue);

        } catch (error: any) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    }, [initializationError, session]);

    useEffect(() => {
        fetchData();
    }, [session, initializationError, fetchData]);

    const value = {
        orders,
        stats,
        revenue,
        services,
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