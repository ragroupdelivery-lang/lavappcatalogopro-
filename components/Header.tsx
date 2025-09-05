import React from 'react';
import Icon from './Icon';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b">
      <div className="flex items-center">
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
          <input
            type="text"
            placeholder="Buscar por pedidos, clientes..."
            className="w-96 py-2 pl-10 pr-4 bg-brand-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-dark focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button
          aria-label="Ver notificações"
          className="relative text-brand-gray-500 hover:text-brand-gray-800"
        >
          <Icon name="bell" className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://picsum.photos/id/237/100/100"
            alt="User avatar"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-brand-gray-800">John Doe</p>
            <p className="text-xs text-brand-gray-500">Administrador</p>
          </div>
          <button
            aria-label="Menu do usuário"
            className="ml-4 text-brand-gray-500 hover:text-brand-gray-800"
          >
            <Icon name="chevron-down" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;