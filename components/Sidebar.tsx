import React from 'react';
import Icon from './Icon';
import { IconName } from '../types';

interface NavLink {
    href: string;
    label: string;
    icon: IconName;
}

interface SidebarProps {
    navLinks: NavLink[];
}

const Sidebar: React.FC<SidebarProps> = ({ navLinks }) => {
    // In a real app, use a router like React Router to get the current path
    const activePath = '/'; 

    return (
        <aside className="w-64 bg-white flex flex-col border-r border-brand-gray-200">
            <div className="flex items-center justify-center h-20 border-b border-brand-gray-200">
                <Icon name="shield-check" className="h-8 w-8 text-brand-blue" />
                <span className="ml-2 text-2xl font-bold text-brand-gray-800">LavaPro</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            activePath === link.href
                                ? 'bg-brand-blue text-white'
                                : 'text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900'
                        }`}
                    >
                        <Icon name={link.icon} className="h-5 w-5 mr-3" />
                        {link.label}
                    </a>
                ))}
            </nav>
            <div className="p-4 border-t border-brand-gray-200">
                <a href="/settings" className="flex items-center px-4 py-2.5 text-sm font-medium text-brand-gray-600 hover:bg-brand-gray-100 rounded-lg">
                    <Icon name="cog" className="h-5 w-5 mr-3" />
                    Configurações
                </a>
                <a href="/help" className="flex items-center px-4 py-2.5 text-sm font-medium text-brand-gray-600 hover:bg-brand-gray-100 rounded-lg mt-1">
                    <Icon name="question-mark-circle" className="h-5 w-5 mr-3" />
                    Ajuda
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
