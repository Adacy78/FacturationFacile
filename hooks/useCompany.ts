import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { useAuth } from './useAuth';

type Company = Database['public']['Tables']['companies']['Row'];

export function useCompany() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompany(null);
      setLoading(false);
      return;
    }

    fetchCompany();
  }, [user]);

  const fetchCompany = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company:', error);
        return;
      }

      setCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: Database['public']['Tables']['companies']['Insert']) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      // Vérifier que l'utilisateur existe dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // L'utilisateur n'existe pas dans la table users, le créer
        const { error: insertUserError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
          });

        if (insertUserError) {
          console.error('Error creating user profile:', insertUserError);
          return { error: insertUserError };
        }
      }

      const { data, error } = await supabase
        .from('companies')
        .insert({
          ...companyData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        return { error };
      }

      setCompany(data);
      return { data, error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateCompany = async (updates: Database['public']['Tables']['companies']['Update']) => {
    if (!user || !company) return { error: new Error('User or company not found') };

    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id)
        .select()
        .single();

      if (error) {
        return { error };
      }

      setCompany(data);
      return { data, error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    company,
    loading,
    createCompany,
    updateCompany,
    refetch: fetchCompany,
  };
}