import { supabase } from '../lib/supabaseClient';
import type { CarWithAxle } from '../types';
import { mapSupabaseError, UserFacingError } from './errorMapper';

// Araç oluşturma
export const createCarWithAxles = async (payload: {
  car_name: string;
  car_model: string;
  axle_count: number;
  bolge_id?: number | null;
  created_by?: string | null;
}): Promise<CarWithAxle> => {
  const { data: carData, error: carError } = await supabase
    .from('cars')
    .insert({
      car_name: payload.car_name,
      car_model: payload.car_model,
      bolge_id: payload.bolge_id ?? null,
      status: 'aktif',
      created_by: payload.created_by ?? null,
    })
    .select('*')
    .single();

  if (carError) {
    throw new UserFacingError(mapSupabaseError(carError));
  }

  const { error: axleError } = await supabase.from('axles').upsert({
    car_id: carData.id,
    axle_count: payload.axle_count,
  });

  if (axleError) {
    throw new UserFacingError(mapSupabaseError(axleError));
  }

  return { ...carData, axle_count: payload.axle_count };
};

// Araç arama
export const searchCarByName = async (name: string) => {
  const { data, error } = await supabase
    .from('car_axle_summary')
    .select('*')
    .ilike('car_name', `%${name}%`);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return (data ?? []) as CarWithAxle[];
};

// Tüm araçları listele (with pagination)
export const listCarsWithAxles = async (options?: {
  status?: 'aktif' | 'pasif';
  limit?: number;
  offset?: number;
  search?: string;
}) => {
  let query = supabase.from('car_axle_summary').select('*', { count: 'exact' });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.search) {
    query = query.or(`car_name.ilike.%${options.search}%,car_model.ilike.%${options.search}%`);
  }

  query = query.order('car_name', { ascending: true });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return {
    data: (data ?? []) as CarWithAxle[],
    total: count ?? 0,
  };
};

// Aktif araçları listele
export const listActiveCars = async (search?: string) => {
  return listCarsWithAxles({ status: 'aktif', search });
};

// Pasif araçları listele
export const listPassiveCars = async (search?: string) => {
  return listCarsWithAxles({ status: 'pasif', search });
};

// Tek araç getir
export const getCarWithAxles = async (carId: number) => {
  const { data, error } = await supabase.from('car_axle_summary').select('*').eq('id', carId).single();
  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }
  return data as CarWithAxle;
};

// Araç güncelle
export const updateCar = async (
  carId: number,
  payload: {
    car_name?: string;
    car_model?: string;
    bolge_id?: number | null;
    status?: 'aktif' | 'pasif';
  }
) => {
  const { data, error } = await supabase
    .from('cars')
    .update(payload)
    .eq('id', carId)
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data;
};

// Aracı pasife al
export const deactivateCar = async (carId: number) => {
  return updateCar(carId, { status: 'pasif' });
};

// Aracı aktife al
export const activateCar = async (carId: number) => {
  return updateCar(carId, { status: 'aktif' });
};

// Araç sil
export const deleteCar = async (carId: number) => {
  const { error } = await supabase.from('cars').delete().eq('id', carId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};

// Araç bölgesini güncelle
export const updateCarRegion = async (carId: number, bolgeId: number | null) => {
  return updateCar(carId, { bolge_id: bolgeId });
};

// Araç geçmişini getir
export const getCarHistory = async (carId: number) => {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('car_id', carId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data ?? [];
};

// Log ekle
export const addCarLog = async (carId: number, message: string) => {
  const { error } = await supabase.from('logs').insert({
    car_id: carId,
    message,
  });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};
