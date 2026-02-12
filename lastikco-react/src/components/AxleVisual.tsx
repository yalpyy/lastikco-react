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
// These positions are relative percentages for overlaying on the image
const POSITION_MAPS: Record<number, Record<string, { top: string; left: string }>> = {
  2: {
    // Axle 1 - Front
    '1-Sol Ön': { top: '35%', left: '8%' },
    '1-Sağ Ön': { top: '35%', left: '84%' },
    // Axle 2 - Rear
    '2-Sol Dış': { top: '75%', left: '5%' },
    '2-Sol İç': { top: '75%', left: '18%' },
    '2-Sağ İç': { top: '75%', left: '74%' },
    '2-Sağ Dış': { top: '75%', left: '87%' },
  },
  3: {
    // Axle 1 - Front
    '1-Sol Ön': { top: '25%', left: '8%' },
    '1-Sağ Ön': { top: '25%', left: '84%' },
    // Axle 2 - Middle
    '2-Sol Dış': { top: '55%', left: '5%' },
    '2-Sol İç': { top: '55%', left: '18%' },
    '2-Sağ İç': { top: '55%', left: '74%' },
    '2-Sağ Dış': { top: '55%', left: '87%' },
    // Axle 3 - Rear
    '3-Sol Dış': { top: '80%', left: '5%' },
    '3-Sol İç': { top: '80%', left: '18%' },
    '3-Sağ İç': { top: '80%', left: '74%' },
    '3-Sağ Dış': { top: '80%', left: '87%' },
  },
  4: {
    // Axle 1 - Front
    '1-Sol Ön': { top: '18%', left: '8%' },
    '1-Sağ Ön': { top: '18%', left: '84%' },
    // Axle 2 - Middle Front
    '2-Sol Dış': { top: '42%', left: '5%' },
    '2-Sol İç': { top: '42%', left: '18%' },
    '2-Sağ İç': { top: '42%', left: '74%' },
    '2-Sağ Dış': { top: '42%', left: '87%' },
    // Axle 3 - Middle Rear
    '3-Sol Dış': { top: '62%', left: '5%' },
    '3-Sol İç': { top: '62%', left: '18%' },
    '3-Sağ İç': { top: '62%', left: '74%' },
    '3-Sağ Dış': { top: '62%', left: '87%' },
    // Axle 4 - Rear
    '4-Sol Dış': { top: '82%', left: '5%' },
    '4-Sol İç': { top: '82%', left: '18%' },
    '4-Sağ İç': { top: '82%', left: '74%' },
    '4-Sağ Dış': { top: '82%', left: '87%' },
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

  const getDepthColor = (depth: string): string => {
    const depthNum = parseFloat(depth);
    if (isNaN(depthNum)) return '#6c757d';
    if (depthNum < 5) return '#dc3545'; // Red - Critical
    if (depthNum < 8) return '#ffc107'; // Yellow - Warning
    return '#28a745'; // Green - Good
  };

  const renderTireMarker = (posKey: string, axle: number, position: string): ReactNode => {
    const coords = positionMap[posKey];
    if (!coords) return null;

    const tire = getTireAtPosition(axle, position);

    const style: React.CSSProperties = {
      position: 'absolute',
      top: coords.top,
      left: coords.left,
      transform: 'translate(-50%, -50%)',
      width: '55px',
      height: '22px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
      cursor: 'pointer',
      border: '2px solid',
      transition: 'transform 0.2s',
    };

    if (tire) {
      const depthColor = getDepthColor(tire.tire_disderinligi);
      return (
        <div
          key={posKey}
          style={{
            ...style,
            backgroundColor: depthColor,
            borderColor: depthColor,
            color: '#fff',
          }}
          onClick={() => onTireClick?.(tire)}
          title={`${tire.tire_marka} - ${tire.tire_serino}\nDiş: ${tire.tire_disderinligi}mm`}
          className="axle-tire-marker"
        >
          {tire.tire_disderinligi}mm
        </div>
      );
    } else {
      return (
        <div
          key={posKey}
          style={{
            ...style,
            backgroundColor: '#f8f9fa',
            borderColor: '#dee2e6',
            color: '#6c757d',
          }}
          onClick={() => onEmptyClick?.(axle, position)}
          title={`Boş: ${position} (Aks ${axle})`}
          className="axle-tire-marker axle-tire-empty"
        >
          +
        </div>
      );
    }
  };

  return (
    <div className="axle-visual-container" style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
      <style>{`
        .axle-tire-marker:hover {
          transform: translate(-50%, -50%) scale(1.1);
          z-index: 10;
        }
        .axle-tire-empty:hover {
          background-color: #e9ecef !important;
        }
      `}</style>
      <img
        src={`/images/aks/aks${axleCount}.png`}
        alt={`${axleCount} akslı araç şeması`}
        style={{ width: '100%', height: 'auto' }}
      />
      {allPositions.map(({ key, axle, position }) => renderTireMarker(key, axle, position))}

      {/* Legend */}
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#28a745', borderRadius: '2px', display: 'inline-block' }}></span>
          İyi (≥8mm)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#ffc107', borderRadius: '2px', display: 'inline-block' }}></span>
          Uyarı (5-8mm)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', borderRadius: '2px', display: 'inline-block' }}></span>
          Kritik (&lt;5mm)
        </div>
      </div>
    </div>
  );
};

export default AxleVisual;
