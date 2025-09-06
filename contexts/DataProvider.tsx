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
    const { session, profile, initializationError } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (initializationError) {
            console.warn("MODO DE DEMONSTRAÇÃO: Usando dados de mock para o painel e catálogo.");
            // Mock data setup
            const mockServices: Service[] = [
                { id: 1, name: 'Lavagem Completa', description: 'Lavagem e secagem de roupas do dia a dia.', price: 55.00, icon: 'shopping-bag' },
                { id: 2, name: 'Terno e Gravata', description: 'Limpeza a seco especializada para trajes sociais.', price: 80.00, icon: 'sparkles' },
                { id: 3, name: 'Edredom Queen', description: 'Higienização profunda para seu edredom.', price: 75.50, icon: 'inbox' },
                { id: 4, name: 'Tênis (Par)', description: 'Lavagem e revitalização de calçados.', price: 45.00, icon: 'sparkles' },
            ];
            setServices(mockServices);

            const mockOrders: Order[] = [
                { id: 101, customer_name: 'Ana Silva', service_type: 'Lavagem Completa', order_date: '2024-05-20T10:00:00Z', status: 'Entregue', total_price: 75.50, delivery_type: 'Coleta' },
                { id: 102, customer_name: 'Bruno Costa', service_type: 'Edredom Queen', order_date: '2024-05-21T11:30:00Z', status: 'Pronto para Coleta', total_price: 45.00, delivery_type: 'Coleta' },
                { id: 103, customer_name: 'Carla Dias', service_type: 'Terno e Gravata', order_date: '2024-05-22T09:15:00Z', status: 'Em Preparação', total_price: 60.00, delivery_type: 'Entrega' },
                { id: 104, customer_name: 'Daniel Alves', service_type: 'Cortinas (3 peças)', order_date: '2024-05-23T14:00:00Z', status: 'Pendente', total_price: 120.00, delivery_type: 'Entrega' },
            ];
            
            const totalRevenue = mockOrders.reduce((acc, order) => acc + order.total_price, 0);
            
            setOrders(mockOrders);
            setStats([
                { title: 'Receita (Mock)', value: totalRevenue, change: '+5.2%', changeType: 'increase', iconName: 'currency-dollar' },
                { title: 'Pedidos (Mock)', value: mockOrders.length, change: '+2.1%', changeType: 'increase', iconName: 'shopping-bag' },
            ]);
            setRevenue([ { name: 'Jan', revenue: 4100 }, { name: 'Fev', revenue: 3200 }, { name: 'Mar', revenue: 5300 }, { name: 'Abr', revenue: 4600 }]);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const { data: servicesData, error: servicesError } = await supabase.from('services').select('*');
            if (servicesError) console.warn('Não foi possível buscar serviços. Verifique as políticas RLS.');
            else setServices(servicesData as Service[]);

            if (session && profile) {
                let query = supabase.from('orders').select('*');
                
                // CRITICAL SECURITY FIX: Customers can only see their own orders.
                if (profile.role === 'customer') {
                    query = query.eq('user_id', profile.id);
                }

                const { data: ordersData, error: ordersError } = await query.order('order_date', { ascending: false }).limit(20);

                if (ordersError) throw ordersError;
                
                if (ordersData) {
                    setOrders(ordersData as Order[]);
                    if (profile.role === 'admin') {
                        const totalRevenue = ordersData.reduce((acc, order) => acc + order.total_price, 0);
                        setStats([
                            { title: 'Receita Total', value: totalRevenue, change: '+5.2%', changeType: 'increase', iconName: 'currency-dollar' },
                            { title: 'Total de Pedidos', value: ordersData.length, change: '+2.1%', changeType: 'increase', iconName: 'shopping-bag' },
                            { title: 'Clientes Ativos', value: 25, change: '+10%', changeType: 'increase', iconName: 'users' },
                            { title: 'Crescimento Mensal', value: '15%', change: '-1.0%', changeType: 'decrease', iconName: 'chart-bar' },
                        ]);
                    }
                }
            }
             setRevenue([ { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 }, { name: 'Mar', revenue: 5000 }, { name: 'Abr', revenue: 4500 }]);

        } catch (error: any) {
            console.error("Erro ao buscar dados:", error.message);
        } finally {
            setLoading(false);
        }
    }, [initializationError, session, profile]);

    useEffect(() => {
        if (session || initializationError) {
             fetchData();
        }
    }, [session, initializationError, fetchData]);

    const value = { orders, stats, revenue, services, loading, refreshData: fetchData };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};