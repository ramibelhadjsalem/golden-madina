import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useTranslate } from '@/hooks/use-translate';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslate();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Update user role in the users table
      if (data.user) {
        const { error: updateError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            last_login: new Date().toISOString(),
          }, { onConflict: 'id' });
        
        if (updateError) {
          console.error('Error updating user data:', updateError);
        }
      }
      
      return data;
    } catch (error) {
      toast({
        title: t('loginFailed'),
        description: (error as Error).message,
        variant: 'destructive',
      });
      return { user: null, session: null };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: t('error'),
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return data.role;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
    getUserRole,
  };
}
