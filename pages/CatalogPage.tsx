import React from 'react';
import { useData } from '../contexts/DataProvider';
import Icon from '../components/Icon';
import { Service } from '../types';

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-start">
        <div className="p-3 rounded-full bg-brand-gray-100 mb-4">
            <Icon name={service.icon} className="h-7 w-7 text-brand-blue" />
        </div>
        <h3 className="text-lg font-bold text-brand-gray-800">{service.name}</h3>
        <p className="text-brand-gray-500 mt-2 flex-grow">{service.description}</p>
        <div className="mt-4 pt-4 border-t border-brand-gray-200 w-full flex justify-between items-center">
            <span className="text-xl font-bold text-brand-blue">
                {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
        </div>
    </div>
);


const CatalogPage: React.FC = () => {
    const { services, loading } = useData();
    
    return (
        <div className="min-h-screen bg-brand-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                         <div className="flex items-center">
                            <Icon name="shield-check" className="h-8 w-8 text-brand-blue" />
                            <span className="ml-2 text-2xl font-bold text-brand-gray-800">LavaPro</span>
                        </div>
                        <a 
                            href="/login" 
                            className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Acessar Painel
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-gray-900 sm:text-5xl">Nossos Serviços</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-gray-500">
                        Qualidade e cuidado que suas roupas merecem. Confira nossas especialidades.
                    </p>
                </div>

                {loading ? (
                    <p className="text-center">Carregando serviços...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map(service => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}
            </main>
             {/* Footer */}
            <footer className="bg-white mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-brand-gray-500">
                    <p>&copy; {new Date().getFullYear()} LavaPro. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default CatalogPage;