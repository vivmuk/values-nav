import React from 'react';
import { Domain, ValuePoint } from '../types';

interface BullseyeChartProps {
  valuePoints: ValuePoint[];
}

const BullseyeChart: React.FC<BullseyeChartProps> = ({ valuePoints }) => {
  const size = 600;
  const center = size / 2;
  const radius = size / 2 - 40;

  // Get angle range for each domain quadrant
  const getDomainAngleRange = (domain: Domain): { start: number; end: number } => {
    switch(domain) {
      case Domain.WORK_EDUCATION: return { start: -180, end: -90 }; // Top-left
      case Domain.LEISURE: return { start: -90, end: 0 }; // Top-right
      case Domain.RELATIONSHIPS: return { start: 0, end: 90 }; // Bottom-right
      case Domain.PERSONAL_GROWTH_HEALTH: return { start: 90, end: 180 }; // Bottom-left
    }
  };

  // Calculate position for a value point, spreading values at same score
  const getPosition = (point: ValuePoint, index: number, sameScoreCount: number) => {
    // Score 5 = center (layer 5), Score 1 = edge (layer 1)
    // Distance from center: score 5 = close to center, score 1 = far from center
    const layerRadius = ((6 - point.score) / 5) * radius * 0.9; // 0.9 to keep some margin

    const { start, end } = getDomainAngleRange(point.domain);
    const quadrantSpan = end - start;

    // Spread values within the quadrant
    // Add padding from edges (15 degrees from each edge)
    const padding = 15;
    const usableSpan = quadrantSpan - (padding * 2);
    const angleStep = sameScoreCount > 1 ? usableSpan / (sameScoreCount - 1) : 0;
    const baseAngle = start + padding + (sameScoreCount > 1 ? angleStep * index : usableSpan / 2);

    const rad = baseAngle * (Math.PI / 180);
    return {
      x: center + layerRadius * Math.cos(rad),
      y: center + layerRadius * Math.sin(rad)
    };
  };

  // Group values by domain and score for spreading
  const getPositionWithSpread = (point: ValuePoint) => {
    const sameDomainAndScore = valuePoints.filter(
      p => p.domain === point.domain && p.score === point.score
    );
    const index = sameDomainAndScore.findIndex(p => p.id === point.id);
    return getPosition(point, index, sameDomainAndScore.length);
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score === 5) return '#002395';
    if (score === 4) return '#3355aa';
    if (score === 3) return '#666666';
    if (score === 2) return '#c44444';
    return '#ED2939';
  };

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square select-none">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="targetGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fcfcfc" />
          </radialGradient>
        </defs>

        {/* 5 Concentric Circles for layers 1-5 */}
        {[1, 2, 3, 4, 5].map((layer) => {
          const layerRadius = ((6 - layer) / 5) * radius * 0.9;
          const isOuter = layer === 1;
          const isInner = layer === 5;
          return (
            <circle
              key={layer}
              cx={center}
              cy={center}
              r={layerRadius}
              fill={isInner ? "url(#targetGrad)" : "none"}
              stroke={isInner ? "#002395" : isOuter ? "#ED2939" : "#ddd"}
              strokeWidth={isInner || isOuter ? "2" : "1"}
              strokeDasharray={!isInner && !isOuter ? "4 4" : "0"}
            />
          );
        })}

        {/* Quadrant Dividers */}
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#eee" strokeWidth="1" />
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#eee" strokeWidth="1" />

        {/* Layer numbers */}
        {[1, 2, 3, 4, 5].map((layer) => {
          const layerRadius = ((6 - layer) / 5) * radius * 0.9;
          return (
            <text
              key={layer}
              x={center + layerRadius + 8}
              y={center - 5}
              className="text-[10px] fill-gray-300 font-bold"
            >
              {layer}
            </text>
          );
        })}

        {/* Labels */}
        <g className="text-[11px] fill-gray-600 pointer-events-none uppercase tracking-[0.15em] font-medium">
          <text x={center - radius + 10} y={center - radius + 25}>Work & Ed</text>
          <text x={center + radius - 10} y={center - radius + 25} textAnchor="end">Leisure</text>
          <text x={center - radius + 10} y={center + radius - 15}>Growth</text>
          <text x={center + radius - 10} y={center + radius - 15} textAnchor="end">Relationships</text>
        </g>

        {/* Center labels */}
        <text x={center} y={45} textAnchor="middle" className="text-[9px] uppercase tracking-[0.3em] fill-[#002395] font-bold">On Target (5)</text>
        <text x={center} y={size - 30} textAnchor="middle" className="text-[9px] uppercase tracking-[0.3em] fill-[#ED2939] font-bold">Off Course (1)</text>

        {/* Center dot */}
        <circle cx={center} cy={center} r="4" fill="#002395" />

        {/* Value Points */}
        {valuePoints.map((p) => {
          const pos = getPositionWithSpread(p);
          const color = getScoreColor(p.score);
          return (
            <g key={p.id}>
              {/* Puck */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                fill="white"
                stroke={color}
                strokeWidth="2"
                filter="url(#puckShadow)"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={color}
              />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + 32}
                textAnchor="middle"
                className="text-[8px] uppercase tracking-wider fill-gray-600 font-medium"
              >
                {p.label.length > 10 ? p.label.substring(0, 10) + '...' : p.label}
              </text>
            </g>
          );
        })}

        {/* Shadow filter */}
        <defs>
          <filter id="puckShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default BullseyeChart;
