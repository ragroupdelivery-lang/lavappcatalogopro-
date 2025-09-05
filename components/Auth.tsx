import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Icon from './Icon';

const Auth: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        if (isLoginView) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3B82F6&color=fff`
                    }
                }
            });
            if (error) {
                setError(error.message);
            } else {
                setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-gray-50">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <div className="flex flex-col items-center space-y-2">
                    <Icon name="shield-check" className="h-12 w-12 text-brand-blue" />
                    <h1 className="text-2xl font-bold text-brand-gray-800">
                        {isLoginView ? 'Acessar LavaPro' : 'Criar Conta'}
                    </h1>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-brand-gray-700">Nome Completo</label>
                            <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700">E-mail</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-brand-gray-700">Senha</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                    
                    {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                    {message && <p className="text-xs text-green-600 text-center">{message}</p>}

                    <div className="pt-2">
                         <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-brand-gray-300">
                            {loading ? 'Processando...' : (isLoginView ? 'Entrar' : 'Cadastrar-se')}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-brand-gray-600">
                    {isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(null); setMessage(null); }} className="font-medium text-brand-blue hover:text-brand-blue-dark ml-1">
                        {isLoginView ? "Cadastre-se" : "Faça login"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
