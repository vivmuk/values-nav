
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Domain, ValuePoint } from '../types';

interface BullseyeChartProps {
  valuePoints: ValuePoint[];
  onPositionChange: (id: string, score: number) => void;
  interactive?: boolean;
}

const BullseyeChart: React.FC<BullseyeChartProps> = ({ valuePoints, onPositionChange, interactive = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = 600;
  const center = size / 2;
  const radius = size / 2 - 40;

  const getInitialPos = (domain: Domain, score: number) => {
    const d = (10 - score) / 10 * radius;
    let angle = 0;
    switch(domain) {
      case Domain.LEISURE: angle = -45; break;
      case Domain.WORK_EDUCATION: angle = -135; break;
      case Domain.PERSONAL_GROWTH_HEALTH: angle = 135; break;
      case Domain.RELATIONSHIPS: angle = 45; break;
    }
    const rad = angle * (Math.PI / 180);
    return {
      x: center + d * Math.cos(rad),
      y: center + d * Math.sin(rad)
    };
  };

  const handleDrag = (id: string, _: any, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left - (rect.width / 2);
    const y = info.point.y - rect.top - (rect.height / 2);

    const distance = Math.sqrt(x * x + y * y);
    const scale = radius / (rect.width / 2 - 40);
    const normalizedDistance = distance * scale;
    const score = Math.max(0, Math.min(10, 10 - (normalizedDistance / radius) * 10));
    // Round to integer for cleaner layer calculation
    onPositionChange(id, Math.round(score));
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto aspect-square select-none">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
        <defs>
          <filter id="puckShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
          </filter>
          <radialGradient id="targetGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fcfcfc" />
          </radialGradient>
        </defs>

        {/* Concentric Circles */}
        {[10, 8, 6, 4, 2].map((lvl, i) => (
          <circle
            key={lvl}
            cx={center}
            cy={center}
            r={(lvl / 10) * radius}
            fill={i === 0 ? "url(#targetGrad)" : "none"}
            stroke={i === 0 ? "#002395" : "#eee"}
            strokeWidth={i === 0 ? "1.5" : "1"}
            strokeDasharray={i > 0 ? "4 4" : "0"}
          />
        ))}

        {/* Quadrant Dividers */}
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#eee" strokeWidth="1" />
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#eee" strokeWidth="1" />

        {/* Labels with French-inspired styling */}
        <g className="serif italic text-[12px] fill-gray-900 pointer-events-none uppercase tracking-[0.2em] font-medium">
          <text x={center - radius} y={center - radius - 20}>Work & Ed</text>
          <text x={center + radius} y={center - radius - 20} textAnchor="end">Leisure</text>
          <text x={center - radius} y={center + radius + 35}>Growth & Health</text>
          <text x={center + radius} y={center + radius + 35} textAnchor="end">Relationships</text>
        </g>

        {/* Core Methodology Labels */}
        <text x={center} y={center - 12} textAnchor="middle" className="text-[8px] uppercase tracking-[0.5em] fill-[#002395] font-bold">In-Target</text>
        <text x={center} y={center + radius + 55} textAnchor="middle" className="text-[8px] uppercase tracking-[0.5em] fill-[#ED2939] font-bold">Off-Course</text>
        
        <circle cx={center} cy={center} r="4" fill="#1a1a1a" />
      </svg>

      {/* Luxury Pucks */}
      {valuePoints.map((p) => {
        const initial = getInitialPos(p.domain, p.score);
        return (
          <motion.div
            key={p.id}
            drag={interactive}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(p.id, e, info)}
            initial={{ left: initial.x, top: initial.y }}
            animate={{ left: initial.x, top: initial.y }}
            className="absolute -ml-5 -mt-5 w-10 h-10 cursor-grab active:cursor-grabbing z-20 group"
          >
            <div className="w-full h-full bg-white border border-gray-200 rounded-full shadow-xl flex items-center justify-center transition-all group-active:scale-125 group-active:border-black">
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="absolute inset-0 border border-black opacity-10 rounded-full"></div>
            </div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[8px] uppercase tracking-[0.2em] py-1.5 px-3 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
              {p.label} • {p.score}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BullseyeChart;
