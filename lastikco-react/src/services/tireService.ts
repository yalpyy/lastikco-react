import { supabase } from '../lib/supabaseClient';
import type { Tire, TireDetail, TireInput } from '../types';
import { mapSupabaseError, UserFacingError } from './errorMapper';

export interface TireWithDetails {
  id: number;
  car_id: number | null;
  axle_number: number;
  tire_position: string;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_disderinligi: number | null;
  tire_durum: string | null;
  tire_olcumtarihi: string | null;
  tire_olcumkm: number | null;
  tire_firma: string | null;
  tire_resim: string | null;
  car_name?: string;
  car_model?: string;
}

// Lastik oluştur (detaylarıyla birlikte)
export const createTireWithDetails = async (carId: number | null, payload: TireInput) => {
  const { data: tireData, error: tireError } = await supabase
    .from('tires')
    .insert({
      car_id: carId,
      axle_number: payload.axle_number ?? 1,
      tire_position: payload.tire_position ?? 'on_sol_dis',
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
    tire_durum: payload.tire_durum ?? 'Normal',
    tire_olcumtarihi: payload.tire_olcumtarihi ?? null,
    tire_olcumkm: payload.tire_olcumkm ?? null,
  });

  if (detailError) {
    throw new UserFacingError(mapSupabaseError(detailError));
  }

  // Log kaydı oluştur
  const location = carId ? 'araca takılı olarak' : 'depoya';
  await supabase.from('logs').insert({
    tire_id: tireData.id,
    message: `Yeni lastik oluşturuldu (${payload.tire_serino || 'Seri no yok'}) ve ${location} eklendi.`,
  });

  return tireData as Tire;
};

// Araçtaki lastikleri listele
export const listTiresByCar = async (carId: number) => {
  const { data, error } = await supabase
    .from('tire_details')
    .select('*, tires!inner(id, car_id, axle_number, tire_position)')
    .eq('tires.car_id', carId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as (TireDetail & { tires: Tire })[];
};

// Depodaki lastikleri listele (car_id IS NULL)
export const listDepotTires = async (search?: string) => {
  const { data, error } = await supabase
    .from('tires')
    .select(`
      id,
      car_id,
      axle_number,
      tire_position,
      tire_details(*)
    `)
    .is('car_id', null);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  // Flatten the data
  const result = (data ?? []).map((tire: any) => {
    const details = tire.tire_details?.[0] ?? {};
    return {
      id: tire.id,
      car_id: tire.car_id,
      axle_number: tire.axle_number,
      tire_position: tire.tire_position,
      ...details,
    };
  });

  // Apply search filter if provided
  if (search) {
    const searchLower = search.toLowerCase();
    return result.filter(
      (t: any) =>
        t.tire_serino?.toLowerCase().includes(searchLower) ||
        t.tire_marka?.toLowerCase().includes(searchLower)
    );
  }

  return result as TireWithDetails[];
};

// Servisteki lastikleri listele (tire_durum = 'Serviste')
export const listServiceTires = async () => {
  const { data, error } = await supabase
    .from('tire_details')
    .select(`
      *,
      tires!inner(id, car_id, axle_number, tire_position, cars(car_name, car_model))
    `)
    .eq('tire_durum', 'Serviste');

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return (data ?? []).map((d: any) => ({
    ...d,
    tire_id: d.tires?.id,
    car_id: d.tires?.car_id,
    car_name: d.tires?.cars?.car_name,
    car_model: d.tires?.cars?.car_model,
  }));
};

// Hurda lastikleri listele (tire_durum = 'Hurda')
export const listScrapTires = async () => {
  const { data, error } = await supabase
    .from('tire_details')
    .select(`
      *,
      tires!inner(id, car_id, axle_number, tire_position, cars(car_name, car_model))
    `)
    .eq('tire_durum', 'Hurda');

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return (data ?? []).map((d: any) => ({
    ...d,
    tire_id: d.tires?.id,
    car_id: d.tires?.car_id,
    car_name: d.tires?.cars?.car_name,
    car_model: d.tires?.cars?.car_model,
  }));
};

// Tüm lastikleri listele
export const listAllTires = async () => {
  const { data, error } = await supabase
    .from('tires')
    .select(`
      id,
      car_id,
      axle_number,
      tire_position,
      tire_details(*),
      cars(car_name, car_model)
    `)
    .order('id', { ascending: false });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return (data ?? []).map((tire: any) => {
    const details = tire.tire_details?.[0] ?? {};
    return {
      id: tire.id,
      car_id: tire.car_id,
      axle_number: tire.axle_number,
      tire_position: tire.tire_position,
      car_name: tire.cars?.car_name ?? null,
      car_model: tire.cars?.car_model ?? null,
      ...details,
    };
  }) as TireWithDetails[];
};

// Alert lastikleri (dış derinlik < 8)
export const listAlertTires = async () => {
  const { data, error } = await supabase
    .from('tire_details')
    .select(`
      *,
      tires!inner(id, car_id, axle_number, tire_position, cars(car_name, car_model))
    `)
    .lt('tire_disderinligi', 8)
    .not('tire_disderinligi', 'is', null);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return (data ?? []).map((d: any) => ({
    ...d,
    tire_id: d.tires?.id,
    car_id: d.tires?.car_id,
    car_name: d.tires?.cars?.car_name,
    car_model: d.tires?.cars?.car_model,
    alert_level: d.tire_disderinligi < 5 ? 'critical' : 'warning',
  }));
};

// Lastik detay güncelle
export const updateTireDetails = async (
  tireId: number,
  payload: Partial<TireDetail>
) => {
  const { data, error } = await supabase
    .from('tire_details')
    .update(payload)
    .eq('tire_id', tireId)
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data as TireDetail;
};

// Lastiği araca ata
export const assignTireToCar = async (
  tireId: number,
  carId: number,
  axleNumber: number,
  position: string,
  carName?: string,
  tireSerino?: string
) => {
  const { error } = await supabase
    .from('tires')
    .update({
      car_id: carId,
      axle_number: axleNumber,
      tire_position: position,
    })
    .eq('id', tireId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  // Lastik log kaydı oluştur
  const positionLabel = position.replace(/_/g, ' ');
  await addTireLog(
    tireId,
    `Lastik ${carName || `Araç #${carId}`} aracına takıldı. Aks: ${axleNumber}, Pozisyon: ${positionLabel}`
  );

  // Araç log kaydı oluştur
  await supabase.from('logs').insert({
    car_id: carId,
    message: `Lastik ${tireSerino || `#${tireId}`} araca takıldı. Aks: ${axleNumber}, Pozisyon: ${positionLabel}`,
  });

  return true;
};

// Lastiği araçtan çıkar (depoya gönder)
export const removeTireFromCar = async (tireId: number, carName?: string, tireSerino?: string) => {
  // Önce mevcut araç bilgisini al (log için)
  const { data: tireData } = await supabase
    .from('tires')
    .select('car_id, cars(car_name), tire_details(tire_serino)')
    .eq('id', tireId)
    .single();

  const previousCarId = tireData?.car_id;
  const previousCarName = carName || (tireData?.cars as any)?.car_name || `Araç #${previousCarId}`;
  const serino = tireSerino || (tireData?.tire_details as any)?.[0]?.tire_serino || `#${tireId}`;

  const { error } = await supabase
    .from('tires')
    .update({ car_id: null })
    .eq('id', tireId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  // Lastik log kaydı oluştur
  await addTireLog(tireId, `Lastik ${previousCarName} aracından çıkarıldı ve depoya gönderildi.`);

  // Araç log kaydı oluştur
  if (previousCarId) {
    await supabase.from('logs').insert({
      car_id: previousCarId,
      message: `Lastik ${serino} araçtan çıkarıldı ve depoya gönderildi.`,
    });
  }

  return true;
};

// Lastiği servise gönder
export const sendTireToService = async (tireId: number) => {
  await updateTireDetails(tireId, { tire_durum: 'Serviste' });
  await addTireLog(tireId, 'Lastik servise gönderildi.');
  return true;
};

// Lastiği hurdaya çıkar
export const sendTireToScrap = async (tireId: number) => {
  await updateTireDetails(tireId, { tire_durum: 'Hurda' });
  await addTireLog(tireId, 'Lastik hurdaya çıkarıldı.');
  return true;
};

// Lastiği onar (servisten depoya)
export const repairTire = async (tireId: number) => {
  // Önce durumu Normal yap
  await updateTireDetails(tireId, { tire_durum: 'Normal' });
  // Log kaydı
  await addTireLog(tireId, 'Lastik serviste onarıldı ve depoya gönderildi.');
  // Araçtan çıkar (depoya gönder) - bu fonksiyon kendi log'unu oluşturmaz artık
  const { error } = await supabase
    .from('tires')
    .update({ car_id: null })
    .eq('id', tireId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};

// Lastik sil
export const deleteTire = async (tireId: number) => {
  const { error } = await supabase.from('tires').delete().eq('id', tireId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};

// Lastik geçmişini getir
export const getTireHistory = async (tireId: number) => {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('tire_id', tireId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data ?? [];
};

// Diş derinliği kayıtlarını getir
export const getTireDepthHistory = async (tireId: number) => {
  const { data, error } = await supabase
    .from('dis_derinligi')
    .select('*')
    .eq('tire_id', tireId)
    .order('measurement_date', { ascending: false });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data ?? [];
};

// Diş derinliği kaydı ekle
export const addTireDepth = async (tireId: number, depthValue: number, measurementDate?: string) => {
  const { data, error } = await supabase
    .from('dis_derinligi')
    .insert({
      tire_id: tireId,
      depth_value: depthValue,
      measurement_date: measurementDate ?? new Date().toISOString().split('T')[0],
    })
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  // Ayrıca tire_details tablosunu da güncelle
  await updateTireDetails(tireId, { tire_disderinligi: String(depthValue) });

  return data;
};

// KM kayıtlarını getir
export const getTireKmHistory = async (tireId: number) => {
  const { data, error } = await supabase
    .from('km_bilgi')
    .select('*')
    .eq('tire_id', tireId)
    .order('measurement_date', { ascending: false });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data ?? [];
};

// KM kaydı ekle
export const addTireKm = async (tireId: number, kmValue: number, measurementDate?: string) => {
  const { data, error } = await supabase
    .from('km_bilgi')
    .insert({
      tire_id: tireId,
      km_value: kmValue,
      measurement_date: measurementDate ?? new Date().toISOString().split('T')[0],
    })
    .select('*')
    .single();

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return data;
};

// Log ekle
export const addTireLog = async (tireId: number, message: string) => {
  const { error } = await supabase.from('logs').insert({
    tire_id: tireId,
    message,
  });

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};
