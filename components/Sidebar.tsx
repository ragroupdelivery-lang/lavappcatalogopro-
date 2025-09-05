import React from 'react';
import Icon from './Icon';
import type { IconName } from '../types';
import { useUser } from '../contexts/UserContext';

interface NavLinkProps {
  iconName: IconName;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ iconName, label, active = false, onClick }) => {
  return (
    <a
      href="#"
      onClick={onClick}
      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
        active
          ? 'bg-brand-blue text-white shadow-lg'
          : 'text-brand-gray-500 hover:bg-brand-gray-200 hover:text-brand-gray-800'
      }`}
    >
      <Icon name={iconName} className="h-5 w-5" />
      <span className="ml-4 font-medium">{label}</span>
    </a>
  );
};

interface SidebarProps {
    setActiveView: (view: 'dashboard' | 'customers') => void;
    activeView: 'dashboard' | 'customers';
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveView, activeView }) => {
  const { logout } = useUser();
  return (
    <div className="flex flex-col w-64 bg-white shadow-xl">
      <div className="flex items-center justify-center h-20 border-b">
        <Icon name="shield-check" className="h-8 w-8 text-brand-blue" />
        <h1 className="text-2xl font-bold text-brand-gray-800 ml-2">LavaPro</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          <p className="px-4 text-xs font-semibold text-brand-gray-400 uppercase tracking-wider">Menu</p>
          <NavLink iconName="view-grid" label="Painel" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavLink iconName="user-group" label="Clientes" active={activeView === 'customers'} onClick={() => setActiveView('customers')} />
          
          <p className="px-4 pt-4 text-xs font-semibold text-brand-gray-400 uppercase tracking-wider">Conta</p>
          <NavLink iconName="cog" label="Configurações" />
        </nav>
      </div>
      <div className="p-4 border-t">
        <NavLink iconName="logout" label="Sair" onClick={logout} />
      </div>
    </div>
  );
};

export default Sidebar;
