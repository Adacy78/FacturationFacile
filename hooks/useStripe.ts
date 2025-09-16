import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCompany } from './useCompany';

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const { company, updateCompany } = useCompany();

  const createStripeAccount = async () => {
    if (!company) {
      throw new Error('Aucune société trouvée');
    }

    setLoading(true);
    try {
      // Appeler la fonction Edge pour créer le compte Stripe
      const { data, error } = await supabase.functions.invoke('stripe-create-account', {
        body: {
          companyData: {
            name: company.name,
            email: company.email,
            siren: company.siren,
            address: company.address,
            city: company.city,
            postal_code: company.postal_code,
            website: company.website,
          }
        }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la création du compte Stripe');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la création du compte Stripe');
      }

      // Mettre à jour la société avec l'ID du compte Stripe
      const updateResult = await updateCompany({
        stripe_account_id: data.accountId,
        is_stripe_connected: false, // Pas encore configuré complètement
      });

      if (updateResult.error) {
        throw new Error('Erreur lors de la mise à jour de la société');
      }

      return { accountId: data.accountId, account: data.account };
    } finally {
      setLoading(false);
    }
  };

  const createAccountLink = async (accountId: string, returnUrl?: string, refreshUrl?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-account-link', {
        body: {
          accountId,
          returnUrl,
          refreshUrl,
        }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la création du lien d\'onboarding');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la création du lien d\'onboarding');
      }

      return { url: data.url };
    } finally {
      setLoading(false);
    }
  };

  const getAccountStatus = async (accountId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-account-status', {
        body: { accountId }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la récupération du statut');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la récupération du statut');
      }

      return data.account;
    } finally {
      setLoading(false);
    }
  };

  const updateStripeConnectionStatus = async (isConnected: boolean) => {
    if (!company) return;

    const updateResult = await updateCompany({
      is_stripe_connected: isConnected,
    });

    return updateResult;
  };

  return {
    loading,
    createStripeAccount,
    createAccountLink,
    getAccountStatus,
    updateStripeConnectionStatus,
  };
}