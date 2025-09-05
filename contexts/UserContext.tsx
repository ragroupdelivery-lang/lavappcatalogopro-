import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, initializationError } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '../types';

interface UserContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CORREÇÃO: Se o Supabase falhou ao inicializar, interrompa aqui.
    // A UI principal (App.tsx) cuidará de mostrar a mensagem de erro.
    if (initializationError) {
      setLoading(false);
      return;
    }

    const fetchSessionAndProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if(sessionError) {
          console.error("Error getting session:", sessionError);
          setLoading(false);
          return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        await fetchProfile(session.user.id);
        setLoading(false);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`*, role`) // Assuming role is a column in profiles table
            .eq('id', userId)
            .single();

        if (error) throw error;
        
        if (data) {
            setProfile(data as UserProfile);
        }
    } catch (error) {
        console.warn('Error fetching profile:', error);
        setProfile(null);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
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
    logout,
  };

  return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
