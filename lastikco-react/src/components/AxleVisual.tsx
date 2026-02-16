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

const AxleVisual = ({ axleCount, tires, onTireClick, onEmptyClick }: AxleVisualProps) => {
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

  const renderTireButton = (axle: number, position: string): ReactNode => {
    const tire = getTireAtPosition(axle, position);
    const key = `${axle}-${position}`;

    if (tire) {
      const status = getDepthStatus(tire.tire_disderinligi);
      return (
        <button
          key={key}
          onClick={() => onTireClick?.(tire)}
          title={`${tire.tire_marka} - ${tire.tire_serino}\nDiş Derinliği: ${tire.tire_disderinligi}mm\nDurum: ${status.status}`}
          className={`
            w-12 h-6 rounded-full
            ${status.bgColor} ${status.color} ${status.borderColor}
            border-2 shadow-md
            flex items-center justify-center
            text-[10px] font-bold
            hover:scale-110 hover:z-20
            transition-all duration-200
            cursor-pointer
          `}
        >
          {tire.tire_disderinligi || '?'}
        </button>
      );
    } else {
      return (
        <button
          key={key}
          onClick={() => onEmptyClick?.(axle, position)}
          title={`Boş Pozisyon: ${position} (Aks ${axle})\nLastik eklemek için tıklayın`}
          className={`
            w-12 h-6 rounded-full
            bg-slate-200 border-2 border-dashed border-slate-400
            flex items-center justify-center
            text-slate-500 text-sm font-bold
            hover:bg-[#0B5394] hover:border-[#0B5394] hover:text-white hover:border-solid
            hover:scale-110 hover:z-20
            transition-all duration-200
            cursor-pointer
          `}
        >
          +
        </button>
      );
    }
  };

  // Render axle row based on axle type
  const renderAxleRow = (axleNum: number, isFront: boolean) => {
    if (isFront) {
      // Front axle: 2 tires (single on each side)
      return (
        <div className="flex justify-between items-center px-2">
          <div className="flex justify-center" style={{ width: '20%' }}>
            {renderTireButton(axleNum, 'Sol Ön')}
          </div>
          <div className="flex-1" />
          <div className="flex justify-center" style={{ width: '20%' }}>
            {renderTireButton(axleNum, 'Sağ Ön')}
          </div>
        </div>
      );
    } else {
      // Rear axle: 4 tires (dual on each side)
      return (
        <div className="flex justify-between items-center px-1">
          <div className="flex gap-1">
            {renderTireButton(axleNum, 'Sol Dış')}
            {renderTireButton(axleNum, 'Sol İç')}
          </div>
          <div className="flex-1" />
          <div className="flex gap-1">
            {renderTireButton(axleNum, 'Sağ İç')}
            {renderTireButton(axleNum, 'Sağ Dış')}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="axle-visual-container max-w-md mx-auto">
      {/* Container with fixed aspect ratio */}
      <div
        className="relative bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden"
        style={{ aspectRatio: '4/3' }}
      >
        {/* Background Image */}
        <img
          src={`/images/aks/aks${axleCount}.png`}
          alt={`${axleCount} akslı araç şeması`}
          className="absolute inset-0 w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext fill="%2364748b" font-family="system-ui" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EAks görseli yüklenemedi%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Overlay Grid for Tire Positions */}
        <div className="absolute inset-0 flex flex-col">
          {axleCount === 2 && (
            <>
              {/* Front Axle Area - Top */}
              <div className="flex items-end justify-center" style={{ height: '30%', paddingBottom: '2%' }}>
                {renderAxleRow(1, true)}
              </div>
              {/* Middle spacer */}
              <div className="flex-1" />
              {/* Rear Axle Area - Bottom */}
              <div className="flex items-start justify-center" style={{ height: '30%', paddingTop: '2%' }}>
                {renderAxleRow(2, false)}
              </div>
            </>
          )}

          {axleCount === 3 && (
            <>
              {/* Front Axle */}
              <div className="flex items-end justify-center" style={{ height: '22%', paddingBottom: '1%' }}>
                {renderAxleRow(1, true)}
              </div>
              {/* Middle spacer */}
              <div style={{ height: '18%' }} />
              {/* Middle Axle */}
              <div className="flex items-center justify-center" style={{ height: '20%' }}>
                {renderAxleRow(2, false)}
              </div>
              {/* Spacer */}
              <div style={{ height: '12%' }} />
              {/* Rear Axle */}
              <div className="flex items-start justify-center" style={{ height: '28%', paddingTop: '1%' }}>
                {renderAxleRow(3, false)}
              </div>
            </>
          )}

          {axleCount === 4 && (
            <>
              {/* Front Axle */}
              <div className="flex items-end justify-center" style={{ height: '18%', paddingBottom: '1%' }}>
                {renderAxleRow(1, true)}
              </div>
              {/* Spacer */}
              <div style={{ height: '14%' }} />
              {/* Axle 2 */}
              <div className="flex items-center justify-center" style={{ height: '16%' }}>
                {renderAxleRow(2, false)}
              </div>
              {/* Spacer */}
              <div style={{ height: '10%' }} />
              {/* Axle 3 */}
              <div className="flex items-center justify-center" style={{ height: '16%' }}>
                {renderAxleRow(3, false)}
              </div>
              {/* Spacer */}
              <div style={{ height: '6%' }} />
              {/* Rear Axle */}
              <div className="flex items-start justify-center" style={{ height: '20%', paddingTop: '1%' }}>
                {renderAxleRow(4, false)}
              </div>
            </>
          )}
        </div>
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
