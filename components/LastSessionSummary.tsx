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
  isExpanded: boolean;
  onToggle: () => void;
}

const QuadrantSection: React.FC<QuadrantSectionProps> = ({ domain, values, isExpanded, onToggle }) => {
  const meta = DOMAIN_METADATA[domain];

  // Score 4-5 = in target (good)
  const inTarget = values.filter(v => v.score >= 4).length;
  const avgScore = values.length > 0
    ? Math.round(values.reduce((sum, v) => sum + v.score, 0) / values.length * 10) / 10
    : 0;

  // Get color based on score (5=best blue, 1=worst red)
  const getScoreColor = (score: number) => {
    if (score === 5) return { bg: 'bg-[#002395]/10', text: 'text-[#002395]' };
    if (score === 4) return { bg: 'bg-[#002395]/5', text: 'text-[#002395]/80' };
    if (score === 3) return { bg: 'bg-gray-100', text: 'text-gray-600' };
    if (score === 2) return { bg: 'bg-[#ED2939]/5', text: 'text-[#ED2939]/80' };
    return { bg: 'bg-[#ED2939]/10', text: 'text-[#ED2939]' };
  };

  const getDotColor = (score: number) => {
    if (score === 5) return 'bg-[#002395]';
    if (score === 4) return 'bg-[#002395]/60';
    if (score === 3) return 'bg-gray-400';
    if (score === 2) return 'bg-[#ED2939]/60';
    return 'bg-[#ED2939]';
  };

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
              {values.length} value{values.length !== 1 ? 's' : ''} • {inTarget} on target • Avg: {avgScore}/5
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {values.slice(0, 3).map((v, i) => (
              <span key={i} className={`w-2 h-2 rounded-full ${getDotColor(v.score)}`} />
            ))}
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
            const colors = getScoreColor(v.score);
            return (
              <div
                key={v.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-gray-700">{v.label}</span>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide font-bold ${colors.bg} ${colors.text}`}>
                    {v.score}/5
                  </span>
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

const LastSessionSummary: React.FC<LastSessionSummaryProps> = ({ lastEntry }) => {
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

  // Calculate overall stats (score 4-5 = on target)
  const totalValues = lastEntry.valuePoints.length;
  const totalOnTarget = lastEntry.valuePoints.filter(v => v.score >= 4).length;

  return (
    <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="serif text-2xl italic">Last Session</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-1">
            {totalValues} values • {totalOnTarget} on target (4-5)
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
              isExpanded={expandedQuadrants[domain]}
              onToggle={() => toggleQuadrant(domain)}
            />
          );
        })}
      </div>

      {/* Quick Summary Bar - Score distribution */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map(score => {
            const count = lastEntry.valuePoints.filter(p => p.score === score).length;
            return (
              <div key={score} className="text-center">
                <div className={`text-xl font-bold ${score >= 4 ? 'text-[#002395]' : score <= 2 ? 'text-[#ED2939]' : 'text-gray-600'}`}>
                  {count}
                </div>
                <div className="text-[9px] uppercase tracking-[0.1em] text-gray-400 mt-1">
                  Score {score}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-gray-400 mt-3 px-2">
          <span>On Target</span>
          <span>Off Course</span>
        </div>
      </div>
    </div>
  );
};

export default LastSessionSummary;
