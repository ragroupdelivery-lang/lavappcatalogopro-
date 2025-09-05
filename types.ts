// Fix: Provide content for types.ts, defining all shared types for the application.
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Based on components/Icon.tsx
export type IconName =
  | 'currency-dollar'
  | 'shopping-bag'
  | 'users'
  | 'chart-bar'
  | 'arrow-up'
  | 'arrow-down'
  | 'search'
  | 'bell'
  | 'chevron-down'
  | 'logout'
  | 'cog'
  | 'question-mark-circle'
  | 'shield-check'
  | 'view-grid'
  | 'document-report'
  | 'user-group'
  | 'inbox'
  | 'pencil'
  | 'plus';

// Based on components/StatCard.tsx
export interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  iconName: IconName;
}

// User Profile, extending Supabase user with app-specific fields
export interface UserProfile {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    role: 'admin' | 'customer' | 'delivery';
}

export type User = SupabaseUser & UserProfile;

// Based on components/Dashboard.tsx and components/OrdersTable.tsx
export type OrderStatus = 'Pendente' | 'Em Preparo' | 'Aguardando Coleta' | 'Em Trânsito' | 'Entregue' | 'Cancelado';

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface Order {
  id: number;
  customer_id: string;
  customer_name: string;
  service: string;
  created_at: string;
  status: OrderStatus;
  total: number;
  delivery_person?: string;
}
