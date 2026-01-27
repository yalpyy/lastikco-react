import { supabase } from '../lib/supabaseClient';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }
};
