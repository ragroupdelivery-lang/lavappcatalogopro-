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

export interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  iconName: IconName;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  customer_name: string;
  customer_avatar: string;
  service: string;
  status: OrderStatus;
  created_at: string;
  total_price: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  role: 'admin' | 'customer';
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    total_spent: number;
    last_order: string;
}
