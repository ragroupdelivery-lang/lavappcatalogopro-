import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const adminNavLinks = [
    { href: '/dashboard/overview', label: 'Dashboard', icon: 'view-grid' as const },
    { href: '/dashboard/pedidos', label: 'Pedidos', icon: 'shopping-bag' as const },
    { href: '/dashboard/clientes', label: 'Clientes', icon: 'user-group' as const },
    { href: '/dashboard/relatorios', label: 'Relatórios', icon: 'document-report' as const },
    { href: '/dashboard/configuracoes', label: 'Configurações', icon: 'briefcase' as const},
];

const getPageTitle = (pathname: string): string => {
    // Lógica aprimorada para lidar com a rota raiz do dashboard
    if (pathname === '/dashboard' || pathname === '/dashboard/overview') {
        return 'Dashboard';
    }
    const link = adminNavLinks.find(l => pathname.startsWith(l.href));
    return link ? link.label : 'Painel Administrativo';
}

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className="flex h-screen bg-brand-gray-50">
            <Sidebar navLinks={adminNavLinks} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageTitle={pageTitle} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-50 p-8">
                    {/* O Outlet agora renderiza o conteúdo da página filha, como OrdersPage */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;