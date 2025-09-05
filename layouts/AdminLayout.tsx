// Fix: Provide a valid component implementation for AdminLayout.tsx to resolve module errors.
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-brand-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
