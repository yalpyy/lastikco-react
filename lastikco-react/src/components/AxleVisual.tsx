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

// Position mapping for different axle configurations
// These positions are calibrated to match the actual tire positions in the images
const POSITION_MAPS: Record<number, Record<string, { top: string; left: string }>> = {
  2: {
    // Axle 1 - Front (single tires)
    '1-Sol Ön': { top: '22%', left: '10%' },
    '1-Sağ Ön': { top: '22%', left: '90%' },
    // Axle 2 - Rear (dual tires)
    '2-Sol Dış': { top: '78%', left: '4%' },
    '2-Sol İç': { top: '78%', left: '16%' },
    '2-Sağ İç': { top: '78%', left: '84%' },
    '2-Sağ Dış': { top: '78%', left: '96%' },
  },
  3: {
    // Axle 1 - Front (single tires)
    '1-Sol Ön': { top: '15%', left: '10%' },
    '1-Sağ Ön': { top: '15%', left: '90%' },
    // Axle 2 - Middle (dual tires)
    '2-Sol Dış': { top: '52%', left: '4%' },
    '2-Sol İç': { top: '52%', left: '16%' },
    '2-Sağ İç': { top: '52%', left: '84%' },
    '2-Sağ Dış': { top: '52%', left: '96%' },
    // Axle 3 - Rear (dual tires)
    '3-Sol Dış': { top: '85%', left: '4%' },
    '3-Sol İç': { top: '85%', left: '16%' },
    '3-Sağ İç': { top: '85%', left: '84%' },
    '3-Sağ Dış': { top: '85%', left: '96%' },
  },
  4: {
    // Axle 1 - Front (single tires)
    '1-Sol Ön': { top: '12%', left: '10%' },
    '1-Sağ Ön': { top: '12%', left: '90%' },
    // Axle 2 - Middle Front (dual tires)
    '2-Sol Dış': { top: '38%', left: '4%' },
    '2-Sol İç': { top: '38%', left: '16%' },
    '2-Sağ İç': { top: '38%', left: '84%' },
    '2-Sağ Dış': { top: '38%', left: '96%' },
    // Axle 3 - Middle Rear (dual tires)
    '3-Sol Dış': { top: '62%', left: '4%' },
    '3-Sol İç': { top: '62%', left: '16%' },
    '3-Sağ İç': { top: '62%', left: '84%' },
    '3-Sağ Dış': { top: '62%', left: '96%' },
    // Axle 4 - Rear (dual tires)
    '4-Sol Dış': { top: '86%', left: '4%' },
    '4-Sol İç': { top: '86%', left: '16%' },
    '4-Sağ İç': { top: '86%', left: '84%' },
    '4-Sağ Dış': { top: '86%', left: '96%' },
  },
};

// Get all positions for a given axle configuration
const getAllPositions = (axleCount: number): { axle: number; position: string; key: string }[] => {
  const positions: { axle: number; position: string; key: string }[] = [];

  for (let axle = 1; axle <= axleCount; axle++) {
    if (axle === 1) {
      positions.push(
        { axle: 1, position: 'Sol Ön', key: '1-Sol Ön' },
        { axle: 1, position: 'Sağ Ön', key: '1-Sağ Ön' }
      );
    } else {
      positions.push(
        { axle, position: 'Sol Dış', key: `${axle}-Sol Dış` },
        { axle, position: 'Sol İç', key: `${axle}-Sol İç` },
        { axle, position: 'Sağ İç', key: `${axle}-Sağ İç` },
        { axle, position: 'Sağ Dış', key: `${axle}-Sağ Dış` }
      );
    }
  }

  return positions;
};

const AxleVisual = ({ axleCount, tires, onTireClick, onEmptyClick }: AxleVisualProps) => {
  const positionMap = POSITION_MAPS[axleCount];
  const allPositions = getAllPositions(axleCount);

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

  const renderTireMarker = (posKey: string, axle: number, position: string): ReactNode => {
    const coords = positionMap[posKey];
    if (!coords) return null;

    const tire = getTireAtPosition(axle, position);

    if (tire) {
      const status = getDepthStatus(tire.tire_disderinligi);
      return (
        <button
          key={posKey}
          onClick={() => onTireClick?.(tire)}
          title={`${tire.tire_marka} - ${tire.tire_serino}\nDiş Derinliği: ${tire.tire_disderinligi}mm\nDurum: ${status.status}`}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2
            w-10 h-5 rounded-full
            ${status.bgColor} ${status.color} ${status.borderColor}
            border-2 shadow-md
            flex items-center justify-center
            text-[9px] font-bold
            hover:scale-125 hover:z-20
            transition-all duration-200
            cursor-pointer
          `}
          style={{ top: coords.top, left: coords.left }}
        >
          {tire.tire_disderinligi || '?'}
        </button>
      );
    } else {
      return (
        <button
          key={posKey}
          onClick={() => onEmptyClick?.(axle, position)}
          title={`Boş Pozisyon: ${position} (Aks ${axle})\nLastik eklemek için tıklayın`}
          className={`
            absolute -translate-x-1/2 -translate-y-1/2
            w-10 h-5 rounded-full
            bg-slate-200 border-2 border-dashed border-slate-400
            flex items-center justify-center
            text-slate-500 text-sm font-bold
            hover:bg-[#0B5394] hover:border-[#0B5394] hover:text-white hover:border-solid
            hover:scale-125 hover:z-20
            transition-all duration-200
            cursor-pointer
          `}
          style={{ top: coords.top, left: coords.left }}
        >
          +
        </button>
      );
    }
  };

  return (
    <div className="axle-visual-container max-w-md mx-auto">
      {/* Image Container */}
      <div className="relative bg-white rounded-xl p-4 shadow-inner border border-gray-200">
        <img
          src={`/images/aks/aks${axleCount}.png`}
          alt={`${axleCount} akslı araç şeması`}
          className="w-full h-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext fill="%2364748b" font-family="system-ui" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EAks görseli yüklenemedi%3C/text%3E%3C/svg%3E';
          }}
        />
        {allPositions.map(({ key, axle, position }) => renderTireMarker(key, axle, position))}
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

      {/* Info Text */}
      <p className="mt-3 text-center text-xs text-gray-500">
        Lastik eklemek veya düzenlemek için pozisyona tıklayın
      </p>
    </div>
  );
};

export default AxleVisual;
