export type Car = {
  id: number;
  car_name: string;
  car_model: string;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Axle = {
  id: number;
  car_id: number;
  axle_count: number;
  created_at?: string | null;
};

export type CarWithAxle = Car & {
  axle_count?: number | null;
};

export type Tire = {
  id: number;
  car_id: number;
  axle_number: number;
  tire_position: string;
  created_at?: string | null;
};

export type TireDetail = {
  id: number;
  tire_id: number;
  tire_serino: string | null;
  tire_marka: string | null;
  tire_desen: string | null;
  tire_olcu: string | null;
  tire_disderinligi: string | null;
  tire_durum: string | null;
  tire_olcumtarihi: string | null;
  tire_olcumkm: number | null;
  created_at?: string | null;
};

export type TireInput = {
  axle_number: number;
  tire_position: string;
  tire_serino?: string;
  tire_marka?: string;
  tire_desen?: string;
  tire_olcu?: string;
  tire_disderinligi?: string;
  tire_durum?: string;
  tire_olcumtarihi?: string;
  tire_olcumkm?: number;
};
