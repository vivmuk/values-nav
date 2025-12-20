import React, { useState } from 'react';
import { Domain, Entry, ValuePoint } from '../types';
import { DOMAIN_METADATA } from '../constants';

interface LastSessionSummaryProps {
  lastEntry: Entry;
  scoreToLayer: (score: number) => number;
}

interface QuadrantSectionProps {
  domain: Domain;
  values: ValuePoint[];
  scoreToLayer: (score: number) => number;
  isExpanded: boolean;
  onToggle: () => void;
}

const QuadrantSection: React.FC<QuadrantSectionProps> = ({ domain, values, scoreToLayer, isExpanded, onToggle }) => {
  const meta = DOMAIN_METADATA[domain];

  // Calculate stats for this quadrant
  const inTarget = values.filter(v => {
    const layer = (v as any).layer || scoreToLayer(v.score);
    return layer <= 2;
  }).length;

  const avgScore = values.length > 0
    ? Math.round(values.reduce((sum, v) => sum + v.score, 0) / values.length * 10) / 10
    : 0;

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white/80">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="p-2 rounded-full text-sm"
            style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
          >
            {meta.icon}
          </span>
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]">{domain}</h4>
            <p className="text-[10px] text-gray-400">
              {values.length} value{values.length !== 1 ? 's' : ''} • {inTarget} in target • Avg: {avgScore}/10
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {values.slice(0, 3).map((v, i) => {
              const layer = (v as any).layer || scoreToLayer(v.score);
              return (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    layer === 1 ? 'bg-[#002395]' :
                    layer === 2 ? 'bg-[#002395]/60' :
                    layer === 3 ? 'bg-gray-400' :
                    layer === 4 ? 'bg-[#ED2939]/60' :
                    'bg-[#ED2939]'
                  }`}
                />
              );
            })}
            {values.length > 3 && (
              <span className="text-[9px] text-gray-400 ml-1">+{values.length - 3}</span>
            )}
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 space-y-2 border-t border-gray-50">
          {values.map(v => {
            const layer = (v as any).layer || scoreToLayer(v.score);
            const score = Math.round(v.score);
            return (
              <div
                key={v.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-gray-700">{v.label}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide font-bold ${
                      layer === 1 ? 'bg-[#002395]/10 text-[#002395]' :
                      layer === 2 ? 'bg-[#002395]/5 text-[#002395]/80' :
                      layer === 3 ? 'bg-gray-100 text-gray-600' :
                      layer === 4 ? 'bg-[#ED2939]/5 text-[#ED2939]/80' :
                      'bg-[#ED2939]/10 text-[#ED2939]'
                    }`}
                  >
                    Layer {layer}
                  </span>
                  <span className="text-xs font-medium text-gray-500 w-10 text-right">{score}/10</span>
                </div>
              </div>
            );
          })}
          {values.length === 0 && (
            <p className="text-xs text-gray-400 italic py-2">No values in this quadrant</p>
          )}
        </div>
      </div>
    </div>
  );
};

const LastSessionSummary: React.FC<LastSessionSummaryProps> = ({ lastEntry, scoreToLayer }) => {
  const [expandedQuadrants, setExpandedQuadrants] = useState<Record<Domain, boolean>>({
    [Domain.WORK_EDUCATION]: true,
    [Domain.RELATIONSHIPS]: true,
    [Domain.PERSONAL_GROWTH_HEALTH]: true,
    [Domain.LEISURE]: true,
  });

  const toggleQuadrant = (domain: Domain) => {
    setExpandedQuadrants(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }));
  };

  // Group values by domain
  const valuesByDomain: Record<Domain, ValuePoint[]> = {
    [Domain.WORK_EDUCATION]: [],
    [Domain.RELATIONSHIPS]: [],
    [Domain.PERSONAL_GROWTH_HEALTH]: [],
    [Domain.LEISURE]: [],
  };

  lastEntry.valuePoints.forEach(v => {
    valuesByDomain[v.domain].push(v);
  });

  // Calculate overall stats
  const totalValues = lastEntry.valuePoints.length;
  const totalInTarget = lastEntry.valuePoints.filter(v => {
    const layer = (v as any).layer || scoreToLayer(v.score);
    return layer <= 2;
  }).length;

  return (
    <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="serif text-2xl italic">Last Session</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">
            {totalValues} values • {totalInTarget} in target (Layer 1-2)
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
          {new Date(lastEntry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Collapsible Quadrant Sections */}
      <div className="space-y-3">
        {(Object.keys(Domain) as (keyof typeof Domain)[]).map(key => {
          const domain = Domain[key];
          const values = valuesByDomain[domain];

          return (
            <QuadrantSection
              key={domain}
              domain={domain}
              values={values}
              scoreToLayer={scoreToLayer}
              isExpanded={expandedQuadrants[domain]}
              onToggle={() => toggleQuadrant(domain)}
            />
          );
        })}
      </div>

      {/* Quick Summary Bar */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(layer => {
            const count = lastEntry.valuePoints.filter(p => {
              const entryLayer = (p as any).layer || scoreToLayer(p.score);
              return entryLayer === layer;
            }).length;
            return (
              <div key={layer} className="text-center">
                <div className={`text-xl font-bold ${layer === 1 ? 'text-[#002395]' : layer === 5 ? 'text-[#ED2939]' : 'text-gray-600'}`}>
                  {count}
                </div>
                <div className="text-[9px] uppercase tracking-[0.1em] text-gray-400 mt-1">
                  Layer {layer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LastSessionSummary;
