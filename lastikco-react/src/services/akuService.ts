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

// Log ekle (akü geçmişi)
export const addAkuLog = async (akuId: number, message: string) => {
  await supabase.from('logs').insert({
    aku_id: akuId,
    message,
  });
};

// Araç logu ekle (araç geçmişi)
const addCarLogForAku = async (carId: number, message: string) => {
  await supabase.from('logs').insert({
    car_id: carId,
    message,
  });
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

  const akuLabel = `${payload.aku_marka} ${payload.aku_volt} ${payload.aku_amper}`;

  // Akü log kaydı
  if (payload.car_id) {
    // Araç adını al
    const { data: carData } = await supabase
      .from('cars')
      .select('car_name')
      .eq('id', payload.car_id)
      .single();
    const carName = carData?.car_name || `Araç #${payload.car_id}`;

    await addAkuLog(data.id, `Yeni akü oluşturuldu (${akuLabel}) ve ${carName} aracına takıldı.`);
    await addCarLogForAku(payload.car_id, `Yeni akü eklendi: ${akuLabel}`);
  } else {
    await addAkuLog(data.id, `Yeni akü oluşturuldu (${akuLabel}) ve depoya eklendi.`);
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
  // Akü bilgisini al (log için)
  const { data: akuData } = await supabase
    .from('aku')
    .select('aku_marka, aku_volt, aku_amper')
    .eq('id', akuId)
    .single();

  // Araç bilgisini al (log için)
  const { data: carData } = await supabase
    .from('cars')
    .select('car_name')
    .eq('id', carId)
    .single();

  const result = await updateAku(akuId, { car_id: carId });

  const akuLabel = akuData
    ? `${akuData.aku_marka} ${akuData.aku_volt} ${akuData.aku_amper}`
    : `Akü #${akuId}`;
  const carName = carData?.car_name || `Araç #${carId}`;

  // Akü log kaydı
  await addAkuLog(akuId, `Akü ${carName} aracına takıldı.`);
  // Araç log kaydı
  await addCarLogForAku(carId, `Akü takıldı: ${akuLabel}`);

  return result;
};

// Aküyü depoya gönder (araçtan çıkar)
export const sendAkuToDepot = async (akuId: number) => {
  // Mevcut araç ve akü bilgisini al (log için)
  const { data: akuData } = await supabase
    .from('aku')
    .select('car_id, aku_marka, aku_volt, aku_amper, cars(car_name)')
    .eq('id', akuId)
    .single();

  const previousCarId = akuData?.car_id;
  const previousCarName = (akuData?.cars as any)?.car_name || `Araç #${previousCarId}`;
  const akuLabel = akuData
    ? `${akuData.aku_marka} ${akuData.aku_volt} ${akuData.aku_amper}`
    : `Akü #${akuId}`;

  const result = await updateAku(akuId, { car_id: null });

  // Akü log kaydı
  await addAkuLog(akuId, `Akü ${previousCarName} aracından çıkarıldı ve depoya gönderildi.`);
  // Araç log kaydı
  if (previousCarId) {
    await addCarLogForAku(previousCarId, `Akü çıkarıldı: ${akuLabel} - depoya gönderildi.`);
  }

  return result;
};

// Akü sil
export const deleteAku = async (akuId: number) => {
  // Silmeden önce akü bilgisini al (log için)
  const { data: akuData } = await supabase
    .from('aku')
    .select('car_id, aku_marka, aku_volt, aku_amper, cars(car_name)')
    .eq('id', akuId)
    .single();

  const akuLabel = akuData
    ? `${akuData.aku_marka} ${akuData.aku_volt} ${akuData.aku_amper}`
    : `Akü #${akuId}`;
  const carId = akuData?.car_id;

  // Araç log kaydı (silmeden önce, çünkü aku_id ON DELETE SET NULL olacak)
  if (carId) {
    await addCarLogForAku(carId, `Akü silindi: ${akuLabel}`);
  }

  const { error } = await supabase.from('aku').delete().eq('id', akuId);

  if (error) {
    throw new UserFacingError(mapSupabaseError(error));
  }

  return true;
};
