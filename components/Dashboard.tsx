import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import OrdersTable from './OrdersTable';
import { supabase, initializationError } from '../supabaseClient';
import { Order, Stat, OrderStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [revenue, setRevenue] = useState<{ name: string; revenue: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);

    useEffect(() => {
        if (initializationError) {
            setError(initializationError.message);
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data, error: dbError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (dbError) {
                    throw new Error('Falha ao buscar os pedidos do banco de dados.');
                }
                
                if (data) {
                    setOrders(data);
                    calculateDashboardMetrics(data);
                }
            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const calculateDashboardMetrics = (liveOrders: Order[]) => {
        const completedOrders = liveOrders.filter(o => o.status === OrderStatus.Completed);

        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);
        const totalOrders = liveOrders.length;
        const uniqueCustomers = new Set(liveOrders.map(order => order.customerName)).size;
        const averageTicket = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

        const newStats: Stat[] = [
            { title: 'Receita Total', value: totalRevenue, change: 'real-time', changeType: 'increase', iconName: 'currency-dollar' },
            { title: 'Total de Pedidos', value: totalOrders.toString(), change: 'real-time', changeType: 'increase', iconName: 'shopping-bag' },
            { title: 'Clientes Atendidos', value: uniqueCustomers.toString(), change: 'real-time', changeType: 'increase', iconName: 'users' },
            { title: 'Ticket Médio', value: averageTicket, change: 'real-time', changeType: 'decrease', iconName: 'chart-bar' }
        ];
        setStats(newStats);

        const monthlyRevenue: { [key: string]: number } = {};
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        
        completedOrders.forEach(order => {
            const monthIndex = new Date(order.created_at).getMonth();
            const monthName = monthNames[monthIndex];
            monthlyRevenue[monthName] = (monthlyRevenue[monthName] || 0) + order.amount;
        });

        const revenueData = monthNames.map(month => ({
            name: month,
            revenue: monthlyRevenue[month] || 0
        }));
        setRevenue(revenueData);
    };

    const fetchSummary = async () => {
        setLoadingSummary(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const dashboardData = { stats, orders: orders.slice(0, 5), revenue };
            const prompt = `Analise os seguintes dados do painel de uma lavanderia e forneça um breve resumo (2-3 frases) dos principais insights. Responda em Português do Brasil. Dados: ${JSON.stringify(dashboardData)}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setSummary(response.text);
        } catch (error) {
            console.error("Error fetching summary from Gemini API:", error);
            setSummary("Não foi possível carregar o resumo. Verifique a chave da API Gemini.");
        } finally {
            setLoadingSummary(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><p className="text-lg text-brand-gray-600">Carregando dados do painel...</p></div>;
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
                <p className="font-bold">Erro de Configuração</p>
                <p>{error} Verifique se as chaves estão configuradas corretamente no ambiente de deploy.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-brand-gray-800 mb-4">Visão Geral da Receita</h2>
                    <RevenueChart data={revenue} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-brand-gray-800">Resumo IA</h2>
                        <button 
                            onClick={fetchSummary}
                            disabled={loadingSummary}
                            className="px-3 py-1 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-dark disabled:bg-brand-gray-300 transition-colors"
                        >
                            {loadingSummary ? 'Gerando...' : 'Gerar Resumo'}
                        </button>
                    </div>
                    {loadingSummary ? (
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ) : (
                         <p className="text-sm text-brand-gray-600 whitespace-pre-wrap">{summary || 'Clique em "Gerar Resumo" para obter insights da IA sobre seus dados.'}</p>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <OrdersTable orders={orders} />
            </div>
        </div>
    );
};

export default Dashboard;
