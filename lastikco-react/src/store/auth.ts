import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

type AuthState = {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  setLoading: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
  setLoading: (state) => set({ loading: state }),
}));
