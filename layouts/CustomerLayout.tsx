// Fix: Provide a valid component implementation for CustomerLayout.tsx to resolve module errors.
import React from 'react';

interface CustomerLayoutProps {
    children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    return (
        <div className="font-sans">
            <header className="p-4 bg-gray-800 text-white">
                <h1>Customer View</h1>
            </header>
            <main className="p-4">
                {children}
            </main>
            <footer className="p-4 bg-gray-200">
                <p>&copy; 2024 LavaPro</p>
            </footer>
        </div>
    );
};

export default CustomerLayout;
