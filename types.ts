// Fix: Added full type definitions to make this file a valid module.
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
  value: number | string;
  change: string;
  changeType: 'increase' | 'decrease';
  iconName: IconName;
}

export type OrderStatus = 'Pendente' | 'Em Preparação' | 'Pronto para Coleta' | 'Entregue' | 'Cancelado';

export interface Order {
  id: number;
  customer_name: string;
  service_type: string;
  order_date: string;
  status: OrderStatus;
  total_price: number;
  delivery_type: 'Coleta' | 'Entrega';
}

export interface UserProfile {
    id: string;
    username: string;
    role: 'admin' | 'customer' | 'delivery';
}
