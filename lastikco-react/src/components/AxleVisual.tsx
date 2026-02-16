import { type ReactNode } from 'react';

export interface TirePosition {
  id: number;
  tire_id: number;
  tire_serino: string;
  tire_marka: string;
  tire_disderinligi: string;
  tire_position: string;
  axle_number: number;
}

interface AxleVisualProps {
  axleCount: 2 | 3 | 4;
  tires: TirePosition[];
  onTireClick?: (tire: TirePosition) => void;
  onEmptyClick?: (axleNumber: number, position: string) => void;
}

// Pixel-calibrated positions for each axle config (vertical images)
// top/left are percentages relative to image dimensions
const POSITION_MAPS: Record<number, { key: string; axle: number; position: string; top: number; left: number }[]> = {
  2: [
    // Aks 1 - Ön (tekli lastik)
    { key: '1-Sol Ön',  axle: 1, position: 'Sol Ön',  top: 18, left: 8 },
    { key: '1-Sağ Ön',  axle: 1, position: 'Sağ Ön',  top: 18, left: 92 },
    // Aks 2 - Arka (çiftli lastik)
    { key: '2-Sol Dış',  axle: 2, position: 'Sol Dış',  top: 80, left: 3 },
    { key: '2-Sol İç',   axle: 2, position: 'Sol İç',   top: 80, left: 18 },
    { key: '2-Sağ İç',   axle: 2, position: 'Sağ İç',   top: 80, left: 82 },
    { key: '2-Sağ Dış',  axle: 2, position: 'Sağ Dış',  top: 80, left: 97 },
  ],
  3: [
    // Aks 1 - Ön (tekli lastik)
    { key: '1-Sol Ön',  axle: 1, position: 'Sol Ön',  top: 15, left: 8 },
    { key: '1-Sağ Ön',  axle: 1, position: 'Sağ Ön',  top: 15, left: 92 },
    // Aks 2 - Orta (çiftli lastik)
    { key: '2-Sol Dış',  axle: 2, position: 'Sol Dış',  top: 54, left: 2 },
    { key: '2-Sol İç',   axle: 2, position: 'Sol İç',   top: 54, left: 17 },
    { key: '2-Sağ İç',   axle: 2, position: 'Sağ İç',   top: 54, left: 83 },
    { key: '2-Sağ Dış',  axle: 2, position: 'Sağ Dış',  top: 54, left: 98 },
    // Aks 3 - Arka (çiftli lastik)
    { key: '3-Sol Dış',  axle: 3, position: 'Sol Dış',  top: 82, left: 2 },
    { key: '3-Sol İç',   axle: 3, position: 'Sol İç',   top: 82, left: 17 },
    { key: '3-Sağ İç',   axle: 3, position: 'Sağ İç',   top: 82, left: 83 },
    { key: '3-Sağ Dış',  axle: 3, position: 'Sağ Dış',  top: 82, left: 98 },
  ],
  4: [
    // Aks 1 - Ön (tekli lastik)
    { key: '1-Sol Ön',  axle: 1, position: 'Sol Ön',  top: 12, left: 10 },
    { key: '1-Sağ Ön',  axle: 1, position: 'Sağ Ön',  top: 12, left: 90 },
    // Aks 2 (çiftli lastik)
    { key: '2-Sol Dış',  axle: 2, position: 'Sol Dış',  top: 38, left: 3 },
    { key: '2-Sol İç',   axle: 2, position: 'Sol İç',   top: 38, left: 18 },
    { key: '2-Sağ İç',   axle: 2, position: 'Sağ İç',   top: 38, left: 82 },
    { key: '2-Sağ Dış',  axle: 2, position: 'Sağ Dış',  top: 38, left: 97 },
    // Aks 3 (çiftli lastik)
    { key: '3-Sol Dış',  axle: 3, position: 'Sol Dış',  top: 60, left: 3 },
    { key: '3-Sol İç',   axle: 3, position: 'Sol İç',   top: 60, left: 18 },
    { key: '3-Sağ İç',   axle: 3, position: 'Sağ İç',   top: 60, left: 82 },
    { key: '3-Sağ Dış',  axle: 3, position: 'Sağ Dış',  top: 60, left: 97 },
    // Aks 4 - Arka (çiftli lastik)
    { key: '4-Sol Dış',  axle: 4, position: 'Sol Dış',  top: 82, left: 3 },
    { key: '4-Sol İç',   axle: 4, position: 'Sol İç',   top: 82, left: 18 },
    { key: '4-Sağ İç',   axle: 4, position: 'Sağ İç',   top: 82, left: 82 },
    { key: '4-Sağ Dış',  axle: 4, position: 'Sağ Dış',  top: 82, left: 97 },
  ],
};

// Image aspect ratios (width/height)
const ASPECT_RATIOS: Record<number, string> = {
  2: '313 / 449',   // ~0.70
  3: '354 / 473',   // ~0.75
  4: '354 / 650',   // ~0.54
};

const AxleVisual = ({ axleCount, tires, onTireClick, onEmptyClick }: AxleVisualProps) => {
  const positions = POSITION_MAPS[axleCount];

  const getTireAtPosition = (axle: number, position: string): TirePosition | undefined => {
    return tires.find(t => t.axle_number === axle && t.tire_position === position);
  };

  const getDepthStatus = (depth: string): { color: string; bgColor: string; borderColor: string; status: string } => {
    const depthNum = parseFloat(depth);
    if (isNaN(depthNum)) return { color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-400', status: 'N/A' };
    if (depthNum < 5) return { color: 'text-white', bgColor: 'bg-red-500', borderColor: 'border-red-600', status: 'Kritik' };
    if (depthNum < 8) return { color: 'text-gray-900', bgColor: 'bg-amber-400', borderColor: 'border-amber-500', status: 'Uyarı' };
    return { color: 'text-white', bgColor: 'bg-emerald-500', borderColor: 'border-emerald-600', status: 'İyi' };
  };

  const renderMarker = (pos: typeof positions[0]): ReactNode => {
    const tire = getTireAtPosition(pos.axle, pos.position);

    if (tire) {
      const status = getDepthStatus(tire.tire_disderinligi);
      return (
        <button
          key={pos.key}
          onClick={() => onTireClick?.(tire)}
          title={`${tire.tire_marka} - ${tire.tire_serino}\nDiş Derinliği: ${tire.tire_disderinligi}mm\nDurum: ${status.status}`}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2 z-10
            w-11 h-5 rounded-full
            ${status.bgColor} ${status.color} ${status.borderColor}
            border-2 shadow-md
            flex items-center justify-center
            text-[9px] font-bold leading-none
            hover:scale-125 hover:z-20
            transition-all duration-200
            cursor-pointer
          `}
          style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
        >
          {tire.tire_disderinligi || '?'}
        </button>
      );
    }

    return (
      <button
        key={pos.key}
        onClick={() => onEmptyClick?.(pos.axle, pos.position)}
        title={`Boş Pozisyon: ${pos.position} (Aks ${pos.axle})\nLastik eklemek için tıklayın`}
        className={`
          absolute -translate-x-1/2 -translate-y-1/2 z-10
          w-11 h-5 rounded-full
          bg-slate-200 border-2 border-dashed border-slate-400
          flex items-center justify-center
          text-slate-500 text-sm font-bold leading-none
          hover:bg-[#0B5394] hover:border-[#0B5394] hover:text-white hover:border-solid
          hover:scale-125 hover:z-20
          transition-all duration-200
          cursor-pointer
        `}
        style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
      >
        +
      </button>
    );
  };

  return (
    <div className="axle-visual-container max-w-sm mx-auto">
      {/* Container - aspect ratio matches rotated image */}
      <div
        className="relative bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden"
        style={{ aspectRatio: ASPECT_RATIOS[axleCount] }}
      >
        {/* Background Image - fills container exactly */}
        <img
          src={`${import.meta.env.BASE_URL}images/aks/aks${axleCount}.png`}
          alt={`${axleCount} akslı araç şeması`}
          className="absolute inset-0 w-full h-full object-fill"
          draggable={false}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"%3E%3Crect fill="%23f1f5f9" width="300" height="400"/%3E%3Ctext fill="%2364748b" font-family="system-ui" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EAks görseli yüklenemedi%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Tire position markers */}
        {positions.map(renderMarker)}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-600"></span>
          <span className="text-gray-600">İyi (≥8mm)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-amber-400 rounded-full border-2 border-amber-500"></span>
          <span className="text-gray-600">Uyarı (5-8mm)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-600"></span>
          <span className="text-gray-600">Kritik (&lt;5mm)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-slate-200 rounded-full border-2 border-dashed border-slate-400"></span>
          <span className="text-gray-600">Boş</span>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-gray-500">
        Lastik eklemek veya düzenlemek için pozisyona tıklayın
      </p>
    </div>
  );
};

export default AxleVisual;
