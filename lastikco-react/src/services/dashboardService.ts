import { supabase } from '../lib/supabaseClient';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export interface DashboardStats {
  totalCars: number;
  totalTires: number;
  alertCount: number; // Dış derinlik < 8
  faultyTires: number; // Arızalı lastikler
  totalBatteries: number;
  depotTires: number; // car_id IS NULL
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Paralel sorgular için Promise.all kullanıyoruz
    const [
      carsResult,
      tiresResult,
      alertResult,
      faultyResult,
      batteriesResult,
      depotResult,
    ] = await Promise.all([
      // Toplam araç sayısı
      supabase.from('cars').select('id', { count: 'exact', head: true }),

      // Toplam lastik sayısı
      supabase.from('tires').select('id', { count: 'exact', head: true }),

      // Alert: Dış derinlik < 8 olan lastikler
      supabase
        .from('tire_details')
        .select('id', { count: 'exact', head: true })
        .lt('tire_disderinligi', 8),

      // Arızalı lastikler
      supabase
        .from('tire_details')
        .select('id', { count: 'exact', head: true })
        .eq('tire_durum', 'Arızalı'),

      // Toplam akü sayısı
      supabase.from('aku').select('id', { count: 'exact', head: true }),

      // Depodaki lastikler (car_id IS NULL)
      supabase
        .from('tires')
        .select('id', { count: 'exact', head: true })
        .is('car_id', null),
    ]);

    // Hata kontrolü
    if (carsResult.error) throw new UserFacingError(mapSupabaseError(carsResult.error));
    if (tiresResult.error) throw new UserFacingError(mapSupabaseError(tiresResult.error));
    if (alertResult.error) throw new UserFacingError(mapSupabaseError(alertResult.error));
    if (faultyResult.error) throw new UserFacingError(mapSupabaseError(faultyResult.error));
    if (batteriesResult.error) throw new UserFacingError(mapSupabaseError(batteriesResult.error));
    if (depotResult.error) throw new UserFacingError(mapSupabaseError(depotResult.error));

    return {
      totalCars: carsResult.count ?? 0,
      totalTires: tiresResult.count ?? 0,
      alertCount: alertResult.count ?? 0,
      faultyTires: faultyResult.count ?? 0,
      totalBatteries: batteriesResult.count ?? 0,
      depotTires: depotResult.count ?? 0,
    };
  } catch (error) {
    if (error instanceof UserFacingError) throw error;
    console.error('Dashboard stats error:', error);
    throw new UserFacingError('Dashboard verileri yüklenirken bir hata oluştu.');
  }
};
