// pages/SettingsPage.tsx
import React from 'react';
import { useUser } from '../contexts/UserContext';
import Icon from '../components/Icon';

const statusBadge: Record<string, string> = {
    trialing: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    past_due: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800',
};

const statusText: Record<string, string> = {
    trialing: 'Período de Teste',
    active: 'Ativa',
    past_due: 'Pendente',
    canceled: 'Cancelada',
};

const InfoCard: React.FC<{ label: string; value: React.ReactNode; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-brand-gray-100 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-brand-gray-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-brand-gray-900">{value}</p>
        </div>
    </div>
);


const SettingsPage: React.FC = () => {
    const { tenant, profile, loading } = useUser();

    if (loading || !tenant || !profile) {
        return <p>Carregando configurações...</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-brand-gray-900 mb-6">Configurações da Empresa</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-gray-800 mb-6 border-b pb-4">Minhas Informações</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoCard 
                        label="Nome da Empresa"
                        value={tenant.name}
                        icon={<Icon name="briefcase" className="h-6 w-6 text-brand-blue" />}
                    />
                     <InfoCard 
                        label="Seu Nome"
                        value={profile.full_name}
                        icon={<Icon name="users" className="h-6 w-6 text-brand-blue" />}
                    />
                    <InfoCard 
                        label="Sua Função"
                        value={profile.role === 'owner' ? 'Proprietário' : 'Funcionário'}
                        icon={<Icon name="shield-check" className="h-6 w-6 text-brand-blue" />}
                    />
                    <InfoCard 
                        label="Status da Assinatura"
                        value={
                            <span className={`px-2.5 py-1 rounded-full text-sm font-medium ${statusBadge[tenant.subscription_status]}`}>
                                {statusText[tenant.subscription_status]}
                            </span>
                        }
                        icon={<Icon name="currency-dollar" className="h-6 w-6 text-brand-blue" />}
                    />
                </div>

                <div className="mt-8 border-t pt-6 flex justify-end">
                    <button className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50" disabled>
                        Gerenciar Assinatura
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
