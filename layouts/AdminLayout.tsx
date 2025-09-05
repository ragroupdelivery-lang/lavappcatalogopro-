import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  setActiveView: (view: 'dashboard' | 'customers') => void;
  activeView: 'dashboard' | 'customers';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, setActiveView, activeView }) => {
  return (
    <div className="flex h-screen bg-brand-gray-100 font-sans">
      <Sidebar setActiveView={setActiveView} activeView={activeView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
