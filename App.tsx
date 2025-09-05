// Fix: Provide content for App.tsx. This component will handle authentication and role-based routing.
import React from 'react';
import { useUser } from './contexts/UserContext';
import Auth from './components/Auth';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import DeliveryLayout from './layouts/DeliveryLayout';
import { supabase } from './supabaseClient';
import type { Order } from './types';

// This function fetches orders for a specific customer.
async function getCustomerOrders(userId: string): Promise<Order[]> {
    // Assuming a 'customer_id' column on the 'orders' table that is a foreign key to 'profiles.id'
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching customer orders:", error);
        return [];
    }
    return data as Order[];
}


const App: React.FC = () => {
  const { session, user, loading } = useUser();
  const [customerOrders, setCustomerOrders] = React.useState<Order[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = React.useState(true);

  React.useEffect(() => {
    if (user?.role === 'customer' && user.id) {
      setIsFetchingOrders(true);
      getCustomerOrders(user.id)
        .then(setCustomerOrders)
        .finally(() => setIsFetchingOrders(false));
    } else {
      setIsFetchingOrders(false);
    }
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando sessão...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  // Render layout based on user role
  switch (user?.role) {
    case 'admin':
      return <AdminLayout />;
    case 'customer':
      if(isFetchingOrders) {
        return <div className="flex items-center justify-center h-screen">Carregando pedidos...</div>;
      }
      return <CustomerLayout orders={customerOrders} />;
    case 'delivery':
      return <DeliveryLayout />;
    default:
        // Fallback for authenticated user without a role or while role is being fetched
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p>Verificando sua conta...</p>
                <p className="text-sm text-gray-500 mt-2">Se esta mensagem persistir, entre em contato com o suporte.</p>
            </div>
        );
  }
};

export default App;
