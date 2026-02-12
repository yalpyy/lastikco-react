import { supabase } from '../lib/supabaseClient';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export interface Bolge {
  id: number;
  bolge_adi: string;
  created_at: string;
}

// Tüm bölgeleri listele
export const listBolges = async () => {
  const { data, error } = await supabase
    .from('bolge')
    .select('*')
    .order('bolge_adi', { ascending: true });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return (data ?? []) as Bolge[];
};

// Tek bölge getir
export const getBolge = async (bolgeId: number) => {
  const { data, error } = await supabase
    .from('bolge')
    .select('*')
    .eq('id', bolgeId)
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as Bolge;
};

// Yeni bölge ekle
export const createBolge = async (bolgeAdi: string) => {
  const { data, error } = await supabase
    .from('bolge')
    .insert({ bolge_adi: bolgeAdi })
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as Bolge;
};

// Bölge güncelle
export const updateBolge = async (bolgeId: number, bolgeAdi: string) => {
  const { data, error } = await supabase
    .from('bolge')
    .update({ bolge_adi: bolgeAdi })
    .eq('id', bolgeId)
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as Bolge;
};

// Bölge sil
export const deleteBolge = async (bolgeId: number) => {
  const { error } = await supabase.from('bolge').delete().eq('id', bolgeId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};

// Bölgeye ait araçları getir
export const getCarsInBolge = async (bolgeId: number) => {
  const { data, error } = await supabase
    .from('car_axle_summary')
    .select('*')
    .eq('bolge_id', bolgeId)
    .order('car_name', { ascending: true });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data ?? [];
};
