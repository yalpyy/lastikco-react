import { supabase } from '../lib/supabaseClient';
import type { CarWithAxle } from '../types';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export const createCarWithAxles = async (payload: {
  car_name: string;
  car_model: string;
  axle_count: number;
  created_by?: string | null;
}): Promise<CarWithAxle> => {
  const { data: carData, error: carError } = await supabase
    .from('cars')
    .insert({
      car_name: payload.car_name,
      car_model: payload.car_model,
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

export const listCarsWithAxles = async () => {
  const { data, error } = await supabase.from('car_axle_summary').select('*').order('car_name', { ascending: true });
  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }
  return (data ?? []) as CarWithAxle[];
};

export const getCarWithAxles = async (carId: number) => {
  const { data, error } = await supabase.from('car_axle_summary').select('*').eq('id', carId).single();
  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }
  return data as CarWithAxle;
};
