import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Order, Stat, Customer, Service, NewOrder } from '../types'; // Import NewOrder
import { useUser } from './UserContext';
import { supabase } from '../supabaseClient';

interface DataContextType {
  orders: Order[];
  stats: Stat[];
  revenue: { name: string; revenue: number }[];
  customers: Customer[];
  services: Service[];
  loading: boolean;
  addOrder: (order: NewOrder) => Promise<void>; // Add addOrder to the type
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
    if (userLoading) return;

    setLoading(true);
    try {
      const tenantId = tenant?.id;

      let servicesQuery = supabase.from('services').select('*');
      if (tenantId) {
        servicesQuery = servicesQuery.eq('tenant_id', tenantId);
      }
      
      const { data: servicesData, error: servicesError } = await servicesQuery;
      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      if (tenantId) {
        // Fetch orders, customers, etc.
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, services(*), customers(*)') // Join with services and customers
          .eq('tenant_id', tenantId);
        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .eq('tenant_id', tenantId);
        if (customersError) throw customersError;
        setCustomers(customersData || []);
        
        // Mock stats and revenue
        const totalRevenue = (ordersData || []).reduce((sum, order) => sum + (order.services?.price || 0), 0);
        const totalOrders = (ordersData || []).length;
        const totalCustomers = (customersData || []).length;
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats([
          { title: 'Receita Total', value: totalRevenue, change: '+12.5%', changeType: 'increase', iconName: 'currency-dollar', format: 'currency' },
          { title: 'Total de Pedidos', value: totalOrders, change: '+5.2%', changeType: 'increase', iconName: 'shopping-bag' },
          { title: 'Clientes', value: totalCustomers, change: '+2', changeType: 'increase', iconName: 'users' },
          { title: 'Ticket Médio', value: averageTicket, change: '+3.1%', changeType: 'increase', iconName: 'chart-bar', format: 'currency' },
        ]);

        setRevenue([
            { name: 'Jan', revenue: 4100 }, { name: 'Fev', revenue: 3200 }, { name: 'Mar', revenue: 5300 },
            { name: 'Abr', revenue: 4600 }, { name: 'Mai', revenue: 6400 }, { name: 'Jun', revenue: 5800 },
            { name: 'Jul', revenue: 7100 },
        ]);
      } else {
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

  const addOrder = useCallback(async (order: NewOrder) => {
    if (!tenant) throw new Error("No tenant available to associate the order with.");

    const service = services.find(s => s.id === order.service_id);
    if (!service) throw new Error("Service not found for the order.");

    const newOrderPayload = {
      ...order,
      tenant_id: tenant.id,
      total_price: service.price,
    };

    const { error } = await supabase.from('orders').insert([newOrderPayload]);
    if (error) {
      console.error("Error adding order:", error);
      throw error;
    } else {
      // Refresh data to show the new order and update stats
      await fetchData();
    }
  }, [tenant, services, fetchData]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = { orders, stats, revenue, customers, services, loading, addOrder, refreshData: fetchData };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};