import React, { useState } from 'react';
import { useData } from '../contexts/DataProvider';
import Icon from '../components/Icon';
import { Service } from '../types';
import Modal from '../components/Modal';

const ServiceCard: React.FC<{ service: Service, onOrder: (service: Service) => void }> = ({ service, onOrder }) => (
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
            <button 
                onClick={() => onOrder(service)}
                className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Solicitar Serviço
            </button>
        </div>
    </div>
);


const CatalogPage: React.FC = () => {
    const { services, loading, addOrder } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const handleOrderClick = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleConfirmOrder = async () => {
        if (selectedService) {
            // Here you would typically collect more customer data
            // For now, we'll create a basic order
            const newOrder = {
                // In a real app, this would be the logged-in user's ID
                customer_id: 'd46a0e1c-c0c3-4246-a45e-16a4c251a7d4', 
                service_id: selectedService.id,
                status: 'pending',
                created_at: new Date().toISOString(),
                // These would be collected from a form
                delivery_address: 'Rua Exemplo, 123', 
            };
            await addOrder(newOrder);
            setIsModalOpen(false);
            setSelectedService(null);
            // You might want to show a toast notification here
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };
    
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
                            <ServiceCard key={service.id} service={service} onOrder={handleOrderClick} />
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
            
            {/* Order Confirmation Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Confirmar Pedido">
                {selectedService && (
                    <div>
                        <p className="text-brand-gray-600 mb-4">
                            Você está prestes a solicitar o serviço de <span className="font-bold">{selectedService.name}</span>.
                        </p>
                        <div className="bg-brand-gray-100 p-4 rounded-lg mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-brand-gray-800">Serviço:</span>
                                <span className="font-semibold text-brand-gray-900">{selectedService.name}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-brand-gray-800">Preço:</span>
                                <span className="font-semibold text-brand-blue">
                                    {selectedService.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-brand-gray-500 mb-6">
                            Um de nossos atendentes entrará em contato para confirmar os detalhes e agendar a coleta.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-brand-gray-200 text-brand-gray-800 rounded-lg hover:bg-brand-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmOrder}
                                className="px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-blue-600"
                            >
                                Confirmar Pedido
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CatalogPage;
