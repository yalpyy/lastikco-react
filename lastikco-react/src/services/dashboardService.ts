// Mock Dashboard Service
// TODO: Supabase'e bağlanacak şekilde güncellenecek

export interface DashboardStats {
  totalCars: number;
  totalTires: number;
  alertCount: number; // Dış derinlik < 8
  faultyTires: number; // Arızalı lastikler
  totalBatteries: number;
  depotTires: number; // car_id IS NULL
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // TODO: Supabase'den gerçek veri çekilecek
  // Şimdilik mock data dönüyoruz
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCars: 42,
        totalTires: 168,
        alertCount: 12,
        faultyTires: 5,
        totalBatteries: 38,
        depotTires: 24,
      });
    }, 500);
  });
};
