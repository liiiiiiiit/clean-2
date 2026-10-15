import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== '' && supabaseAnonKey !== '';
};
