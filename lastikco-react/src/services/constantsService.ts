import { supabase } from '../lib/supabaseClient';

export interface TireConstant {
  id: number;
  type: 'marka' | 'desen' | 'olcu';
  value: string;
  created_at?: string;
}

// Get all constants by type
export const getConstantsByType = async (type: 'marka' | 'desen' | 'olcu'): Promise<TireConstant[]> => {
  const { data, error } = await supabase
    .from('tire_constants')
    .select('*')
    .eq('type', type)
    .order('value', { ascending: true });

  if (error) {
    console.error(`${type} sabitleri yüklenemedi:`, error);
    return [];
  }

  return data || [];
};

// Get all constants
export const getAllConstants = async (): Promise<TireConstant[]> => {
  const { data, error } = await supabase
    .from('tire_constants')
    .select('*')
    .order('type', { ascending: true })
    .order('value', { ascending: true });

  if (error) {
    console.error('Sabitler yüklenemedi:', error);
    return [];
  }

  return data || [];
};

// Add a new constant
export const addConstant = async (type: 'marka' | 'desen' | 'olcu', value: string): Promise<TireConstant> => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error('Değer boş olamaz');
  }

  // Check for duplicates
  const { data: existing } = await supabase
    .from('tire_constants')
    .select('id')
    .eq('type', type)
    .ilike('value', trimmedValue)
    .single();

  if (existing) {
    throw new Error('Bu değer zaten mevcut');
  }

  const { data, error } = await supabase
    .from('tire_constants')
    .insert({ type, value: trimmedValue })
    .select()
    .single();

  if (error) {
    console.error('Sabit eklenemedi:', error);
    throw new Error('Sabit eklenirken hata oluştu');
  }

  return data;
};

// Update a constant
export const updateConstant = async (id: number, value: string): Promise<TireConstant> => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error('Değer boş olamaz');
  }

  const { data, error } = await supabase
    .from('tire_constants')
    .update({ value: trimmedValue })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Sabit güncellenemedi:', error);
    throw new Error('Sabit güncellenirken hata oluştu');
  }

  return data;
};

// Delete a constant
export const deleteConstant = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('tire_constants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Sabit silinemedi:', error);
    throw new Error('Sabit silinirken hata oluştu');
  }
};

// Get unique values from existing tire_details (for migration)
export const getExistingTireValues = async (): Promise<{
  markalar: string[];
  desenler: string[];
  olculer: string[];
}> => {
  const { data, error } = await supabase
    .from('tire_details')
    .select('tire_marka, tire_desen, tire_olcu');

  if (error) {
    console.error('Lastik değerleri alınamadı:', error);
    return { markalar: [], desenler: [], olculer: [] };
  }

  const markalar = [...new Set(data?.map(d => d.tire_marka).filter(Boolean))] as string[];
  const desenler = [...new Set(data?.map(d => d.tire_desen).filter(Boolean))] as string[];
  const olculer = [...new Set(data?.map(d => d.tire_olcu).filter(Boolean))] as string[];

  return { markalar, desenler, olculer };
};

// Import existing values as constants
export const importExistingValuesAsConstants = async (): Promise<{
  markaCount: number;
  desenCount: number;
  olcuCount: number;
}> => {
  const { markalar, desenler, olculer } = await getExistingTireValues();

  let markaCount = 0;
  let desenCount = 0;
  let olcuCount = 0;

  // Import markalar
  for (const marka of markalar) {
    try {
      await addConstant('marka', marka);
      markaCount++;
    } catch (e) {
      // Already exists, skip
    }
  }

  // Import desenler
  for (const desen of desenler) {
    try {
      await addConstant('desen', desen);
      desenCount++;
    } catch (e) {
      // Already exists, skip
    }
  }

  // Import olculer
  for (const olcu of olculer) {
    try {
      await addConstant('olcu', olcu);
      olcuCount++;
    } catch (e) {
      // Already exists, skip
    }
  }

  return { markaCount, desenCount, olcuCount };
};
