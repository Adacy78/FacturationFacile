import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, checkSupabaseConnection } from '@/lib/supabase';
import { Database } from '@/types/database';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Database['public']['Tables']['users']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Vérifier la connexion Supabase
    checkSupabaseConnection().then(setIsOnline);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      setMounted(false);
    };
  }, [mounted]);

  const fetchUserProfile = async (userId: string) => {
    if (!mounted) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (mounted) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isOnline) {
      return { 
        data: null, 
        error: new Error('Connexion Supabase non disponible. Vérifiez votre configuration.') 
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    if (!isOnline) {
      return { 
        data: null, 
        error: new Error('Connexion Supabase non disponible. Vérifiez votre configuration.') 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    // Le trigger handle_new_user() créera automatiquement l'entrée dans la table users
    // Si le trigger échoue, on essaie de créer l'utilisateur manuellement
    if (data.user && !error) {
      // Attendre un peu pour laisser le trigger s'exécuter
      setTimeout(async () => {
        try {
          // Vérifier si l'utilisateur a été créé par le trigger
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', data.user!.id)
            .single();

          // Si l'utilisateur n'existe pas, le créer manuellement (fallback)
          if (!existingUser) {
            await supabase
              .from('users')
              .insert({
                id: data.user!.id,
                email: data.user!.email || email,
              });
          }
        } catch (fallbackError) {
          console.log('Fallback user creation handled by trigger or already exists');
        }
      }, 1000);
    }
    
    return { data, error };
  };

  const signOut = async () => {
    if (!isOnline) {
      // Permettre la déconnexion locale même hors ligne
      if (mounted) {
        setSession(null);
        setUser(null);
        setUserProfile(null);
      }
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    if (!error && mounted) {
      setUserProfile(null);
    }
    return { error };
  };

  return {
    session,
    user,
    userProfile,
    loading,
    isOnline,
    signIn,
    signUp,
    signOut,
  };
}