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

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  customer_name: string;
  customer_avatar_url: string;
  service_type: string;
  status: OrderStatus;
  created_at: string;
  total_price: number;
  user_id: string;
}

export interface Stat {
    title: string;
    value: string | number;
    change: string;
    changeType: 'increase' | 'decrease';
    iconName: IconName;
}

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'admin' | 'customer';
}

export interface Customer {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string;
    created_at: string;
    total_orders: number;
    total_spent: number;
}
