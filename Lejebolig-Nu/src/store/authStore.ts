import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { mockUser } from '../mockData';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, type: 'tenant' | 'landlord') => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,  // Setting initial state to null (logged out)
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      // For testing, just set the mock user
      set({ user: mockUser, error: null });
      return;

      /*
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        set({ user: data.user as User, error: null });
      }
      */
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, name: string, type: 'tenant' | 'landlord') => {
    set({ loading: true });
    try {
      // For testing, just set the mock user
      set({ user: mockUser, error: null });
      return;

      /*
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            type,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        set({ user: data.user as User, error: null });
      }
      */
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ user: null, error: null });
      return;
      /*
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, error: null });
      */
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));