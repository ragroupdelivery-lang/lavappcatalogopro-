import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';
import Icon from './Icon';
import { useUser } from '../contexts/UserContext';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { addToast } = useToast();
  const { session } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });

    if (error) {
      addToast(error.message, 'error');
    } else {
      addToast('Verifique seu e-mail para o link de login!', 'info');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-gray-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
            <a href="/" className="flex justify-center mb-6">
                <Icon name="shield-check" className="h-12 w-12 text-brand-blue" />
            </a>
            <h1 className="text-3xl font-bold text-center text-brand-gray-800 mb-2">Acesse seu Painel</h1>
            <p className="text-center text-brand-gray-500 mb-8">Faça login para gerenciar seus pedidos.</p>

            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700 mb-1">
                        Endereço de e-mail
                    </label>
                    <input
                        id="email"
                        className="w-full px-4 py-2 border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition-shadow"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-brand-blue text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={loading || !email}
                >
                    {loading ? 'Enviando...' : 'Enviar link mágico'}
                </button>
            </form>
        </div>
    </div>
  );
};

export default Auth;