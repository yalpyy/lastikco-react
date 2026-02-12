import { supabase } from '../lib/supabaseClient';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export interface Aku {
  id: number;
  car_id: number | null;
  aku_marka: string;
  aku_volt: string;
  aku_amper: string;
  aku_durum: string;
  aku_fatura_tarihi: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AkuWithCar extends Aku {
  car_name?: string;
  car_model?: string;
}

// Tüm aküleri listele
export const listAkus = async (options?: {
  inDepot?: boolean; // true = car_id IS NULL
  carId?: number;
  search?: string;
}) => {
  let query = supabase
    .from('aku')
    .select(`
      *,
      cars(car_name, car_model)
    `)
    .order('created_at', { ascending: false });

  if (options?.inDepot === true) {
    query = query.is('car_id', null);
  } else if (options?.inDepot === false) {
    query = query.not('car_id', 'is', null);
  }

  if (options?.carId) {
    query = query.eq('car_id', options.carId);
  }

  if (options?.search) {
    query = query.ilike('aku_marka', `%${options.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  // Transform data to include car info
  return (data ?? []).map((aku: any) => ({
    ...aku,
    car_name: aku.cars?.car_name ?? null,
    car_model: aku.cars?.car_model ?? null,
    cars: undefined,
  })) as AkuWithCar[];
};

// Depodaki aküler
export const listDepotAkus = async (search?: string) => {
  return listAkus({ inDepot: true, search });
};

// Araçtaki aküler
export const listCarAkus = async (carId: number) => {
  return listAkus({ carId });
};

// Tek akü getir
export const getAku = async (akuId: number) => {
  const { data, error } = await supabase
    .from('aku')
    .select(`
      *,
      cars(car_name, car_model)
    `)
    .eq('id', akuId)
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return {
    ...data,
    car_name: data.cars?.car_name ?? null,
    car_model: data.cars?.car_model ?? null,
    cars: undefined,
  } as AkuWithCar;
};

// Yeni akü ekle
export const createAku = async (payload: {
  aku_marka: string;
  aku_volt: string;
  aku_amper: string;
  aku_durum?: string;
  aku_fatura_tarihi?: string | null;
  car_id?: number | null;
  created_by?: string | null;
}) => {
  const { data, error } = await supabase
    .from('aku')
    .insert({
      aku_marka: payload.aku_marka,
      aku_volt: payload.aku_volt,
      aku_amper: payload.aku_amper,
      aku_durum: payload.aku_durum ?? 'İyi',
      aku_fatura_tarihi: payload.aku_fatura_tarihi ?? null,
      car_id: payload.car_id ?? null,
      created_by: payload.created_by ?? null,
    })
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as Aku;
};

// Akü güncelle
export const updateAku = async (
  akuId: number,
  payload: {
    aku_marka?: string;
    aku_volt?: string;
    aku_amper?: string;
    aku_durum?: string;
    aku_fatura_tarihi?: string | null;
    car_id?: number | null;
  }
) => {
  const { data, error } = await supabase
    .from('aku')
    .update(payload)
    .eq('id', akuId)
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as Aku;
};

// Aküyü araca ata
export const assignAkuToCar = async (akuId: number, carId: number) => {
  return updateAku(akuId, { car_id: carId });
};

// Aküyü depoya gönder (araçtan çıkar)
export const sendAkuToDepot = async (akuId: number) => {
  return updateAku(akuId, { car_id: null });
};

// Akü sil
export const deleteAku = async (akuId: number) => {
  const { error } = await supabase.from('aku').delete().eq('id', akuId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};
