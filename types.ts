// Fix: Provide definitions for types used throughout the application.
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
  | 'inbox';

export interface Stat {
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  iconName: IconName;
}

export enum OrderStatus {
  Completed = 'Concluído',
  Processing = 'Processando',
  Cancelled = 'Cancelado',
}

export interface Order {
  id: number;
  customerName: string;
  customerAvatar: string;
  created_at: string;
  amount: number;
  status: OrderStatus;
}
