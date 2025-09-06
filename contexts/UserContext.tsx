import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, supabaseInitializationError } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from '../types';

interface UserContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initializationError: Error | null;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<Error | null>(supabaseInitializationError);

  useEffect(() => {
    // Se o supabase não estiver configurado, cria uma sessão mock para modo de demonstração.
    if (initializationError) {
      console.warn("MODO DE DEMONSTRAÇÃO: A configuração do Supabase está ausente. Usando dados mockados. Edite `supabaseClient.ts` para conectar ao seu projeto.");
      
      const mockUser: User = {
        id: 'mock-user-id',
        app_metadata: { provider: 'email' },
        user_metadata: { name: 'Admin de Teste' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: 'admin@lavapro.com'
      };
      
      const mockProfile: UserProfile = {
          id: 'mock-user-id',
          username: 'Admin de Teste',
          role: 'admin'
      };

      const mockSession: Session = {
          access_token: 'mock-access-token',
          token_type: 'bearer',
          user: mockUser,
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600
      };

      setSession(mockSession);
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initializationError]);

  useEffect(() => {
    if (user && !loading && !initializationError) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
        } else {
          setProfile(data as UserProfile | null);
        }
      };
      fetchProfile();
    } else if (!user) {
      setProfile(null);
    }
  }, [user, loading, initializationError]);

  const signOut = () => {
    if (!initializationError) {
      supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const value = {
    session,
    user,
    profile,
    loading,
    initializationError,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};