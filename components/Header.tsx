// Fix: Provide content for Header.tsx.
import React, { useState } from 'react';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { user, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b">
      <div className="flex items-center">
        <div className="relative">
          <Icon name="search" className="absolute w-5 h-5 text-brand-gray-400 top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar pedidos, clientes..."
            className="w-full max-w-xs py-2 pl-10 pr-4 text-brand-gray-700 bg-brand-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative text-brand-gray-500 hover:text-brand-blue">
          <Icon name="bell" className="w-6 h-6" />
          <span className="absolute top-0 right-0 block h-2 w-2 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img
              className="w-10 h-10 rounded-full"
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=3B82F6&color=fff`}
              alt="User avatar"
            />
            <div>
              <p className="font-semibold text-brand-gray-800 text-sm">{user?.full_name || user?.email}</p>
              <p className="text-xs text-brand-gray-500 capitalize">{user?.role}</p>
            </div>
            <Icon name="chevron-down" className={`w-4 h-4 text-brand-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1">
              <a href="#" className="flex items-center px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100">
                <Icon name="cog" className="w-4 h-4 mr-2" />
                Configurações
              </a>
              <button
                onClick={logout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
              >
                <Icon name="logout" className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
