import { supabase } from '../lib/supabaseClient';
import type { Tire, TireDetail, TireInput } from '../types';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export const createTireWithDetails = async (carId: number, payload: TireInput) => {
  const { data: tireData, error: tireError } = await supabase
    .from('tires')
    .insert({
      car_id: carId,
      axle_number: payload.axle_number,
      tire_position: payload.tire_position,
    })
    .select('*')
    .single();

  if (tireError) {
    throw new UserFacingError(mapSupabaseError(tireError));
  }

  const { error: detailError } = await supabase.from('tire_details').insert({
    tire_id: tireData.id,
    tire_serino: payload.tire_serino ?? null,
    tire_marka: payload.tire_marka ?? null,
    tire_desen: payload.tire_desen ?? null,
    tire_olcu: payload.tire_olcu ?? null,
    tire_disderinligi: payload.tire_disderinligi ?? null,
    tire_durum: payload.tire_durum ?? null,
    tire_olcumtarihi: payload.tire_olcumtarihi ?? null,
    tire_olcumkm: payload.tire_olcumkm ?? null,
  });

  if (detailError) {
    throw new UserFacingError(mapSupabaseError(detailError));
  }

  return tireData as Tire;
};

export const listTiresByCar = async (carId: number) => {
  const { data, error } = await supabase
    .from('tire_details')
    .select('*, tires!inner(car_id, axle_number, tire_position)')
    .eq('tires.car_id', carId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as (TireDetail & { tires: Tire })[];
};
