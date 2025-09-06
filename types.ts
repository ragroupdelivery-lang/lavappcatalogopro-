// types.ts

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
  | 'plus'
  | 'sparkles'
  | 'briefcase';

// Representa uma empresa (lavanderia) que assina o serviço SaaS.
export interface Tenant {
  id: string; // UUID
  name: string;
  created_at: string;
  subscription_status: SubscriptionStatus;
}

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled';

// Representa um usuário da plataforma SaaS (dono ou funcionário da lavanderia).
export interface UserProfile {
  id: string; // UUID, FK to auth.users
  tenant_id: string; // UUID, FK to tenants
  full_name: string;
  role: 'owner' | 'staff' | 'delivery'; // Papéis dentro da empresa
}

// Representa um cliente final da lavanderia.
export interface Customer {
  id: string; // UUID
  tenant_id: string; // UUID, FK to tenants
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

// Representa um serviço oferecido por uma lavanderia específica.
export interface Service {
  id: number;
  tenant_id: string; // UUID, FK to tenants
  name: string;
  description: string;
  price: number;
  icon: IconName;
}

export type OrderStatus = 'Pendente' | 'Em Preparação' | 'Pronto para Coleta' | 'Entregue' | 'Cancelado';

// Representa um pedido feito por um cliente de uma lavanderia.
export interface Order {
  id: number;
  tenant_id: string; // UUID, FK to tenants
  customer_id: string; // UUID, FK to customers
  customer_name: string; // Denormalized for quick display
  order_date: string;
  status: OrderStatus;
  total_price: number;
  delivery_type: 'Coleta' | 'Entrega';
}

// --- Tipos para UI ---

export interface Stat {
  title: string;
  value: number | string;
  change: string;
  changeType: 'increase' | 'decrease';
  iconName: IconName;
}