import React from 'react';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';

const Header: React.FC = () => {
  const { profile } = useUser();

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b">
      <div className="flex items-center">
        {/* Placeholder for future search functionality */}
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
            className="h-10 w-10 rounded-full object-cover bg-brand-gray-200"
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'A'}&background=3B82F6&color=fff`}
            alt="User avatar"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-brand-gray-800">{profile?.full_name || 'Usuário'}</p>
            <p className="text-xs text-brand-gray-500 capitalize">{profile?.role || 'Função'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
