import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!');
  console.error('Please configure the following in your .env file:');
  console.error('- EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co');
  console.error('- EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
}

// Créer un client Supabase avec gestion d'erreur
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'facturation-simple-app',
      },
    },
  }
);

// Fonction pour vérifier la connexion Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase not configured - using offline mode');
    return false;
  }

  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Network error connecting to Supabase:', error);
    return false;
  }
};