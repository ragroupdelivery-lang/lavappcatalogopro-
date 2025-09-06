import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Order, Stat, Customer, Service } from '../types';
import { useUser } from './UserContext';
import { supabase } from '../supabaseClient';

interface DataContextType {
  orders: Order[];
  stats: Stat[];
  revenue: { name: string; revenue: number }[];
  customers: Customer[];
  services: Service[];
  loading: boolean;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tenant, loading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    // If user is still loading, wait.
    if (userLoading) return;

    setLoading(true);
    try {
      const tenantId = tenant?.id;

      // Build services query conditionally to fix the syntax error
      let servicesQuery = supabase.from('services').select('*');
      if (tenantId) {
        servicesQuery = servicesQuery.eq('tenant_id', tenantId);
      }
      
      const { data: servicesData, error: servicesError } = await servicesQuery;
      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Fetch tenant-specific data only if a tenant exists
      if (tenantId) {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('tenant_id', tenantId);
        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .eq('tenant_id', tenantId);
        if (customersError) throw customersError;
        setCustomers(customersData || []);
        
        // Mock stats and revenue for demonstration as this logic is usually complex
        const totalRevenue = (ordersData || []).reduce((sum, order) => sum + order.total_price, 0);
        const totalOrders = (ordersData || []).length;
        const totalCustomers = (customersData || []).length;

        setStats([
          { title: 'Receita Total', value: totalRevenue, change: '+12.5%', changeType: 'increase', iconName: 'currency-dollar' },
          { title: 'Total de Pedidos', value: totalOrders, change: '+5.2%', changeType: 'increase', iconName: 'shopping-bag' },
          { title: 'Clientes', value: totalCustomers, change: '+2', changeType: 'increase', iconName: 'users' },
          { title: 'Ticket Médio', value: totalOrders > 0 ? totalRevenue / totalOrders : 0, change: '+3.1%', changeType: 'increase', iconName: 'chart-bar' },
        ]);

        setRevenue([
            { name: 'Jan', revenue: 4100 }, { name: 'Fev', revenue: 3200 }, { name: 'Mar', revenue: 5300 },
            { name: 'Abr', revenue: 4600 }, { name: 'Mai', revenue: 6400 }, { name: 'Jun', revenue: 5800 },
            { name: 'Jul', revenue: 7100 },
        ]);
      } else {
        // Clear tenant-specific data if no tenant
        setOrders([]);
        setCustomers([]);
        setStats([]);
        setRevenue([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [tenant, userLoading]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = { orders, stats, revenue, customers, services, loading, refreshData: fetchData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};