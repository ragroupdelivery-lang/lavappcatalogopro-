import React, { useState } from 'react';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';

const Header: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
    const { profile, signOut } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="h-20 bg-white flex items-center justify-between px-8 border-b border-brand-gray-200">
            <h1 className="text-2xl font-semibold text-brand-gray-800">{pageTitle}</h1>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        className="w-64 pl-10 pr-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="search" className="h-5 w-5 text-brand-gray-400" />
                    </div>
                </div>
                <button className="relative text-brand-gray-500 hover:text-brand-gray-700">
                    <Icon name="bell" className="h-6 w-6" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                        <img
                            className="h-9 w-9 rounded-full object-cover"
                            src={`https://ui-avatars.com/api/?name=${profile?.username || 'User'}&background=random`}
                            alt="Avatar do usuário"
                        />
                        <span className="hidden md:block font-medium text-brand-gray-700">{profile?.username}</span>
                        <Icon name="chevron-down" className="h-4 w-4 text-brand-gray-500" />
                    </button>
                    {dropdownOpen && (
                        <div onMouseLeave={() => setDropdownOpen(false)} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <a href="#profile" className="block px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100">Meu Perfil</a>
                            <a href="#settings" className="block px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100">Configurações</a>
                            <div className="border-t border-brand-gray-100 my-1"></div>
                            <button
                                onClick={signOut}
                                className="block w-full text-left px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-gray-100"
                            >
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
