
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Domain, ValuePoint, Entry } from './types';
import { DOMAIN_METADATA, PREDEFINED_VALUES } from './constants';
import BullseyeChart from './components/BullseyeChart';
import HistoryView from './components/HistoryView';
import LastSessionSummary from './components/LastSessionSummary';
import Playbook from './components/Playbook';
import { cloudService } from './services/cloudService';

const App: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [view, setView] = useState<'landing' | 'assess' | 'history' | 'playbook'>('landing');
  const [valuePoints, setValuePoints] = useState<ValuePoint[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastEntry, setLastEntry] = useState<Entry | null>(null);
  const [deleteCode, setDeleteCode] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [customInputs, setCustomInputs] = useState<Record<Domain, string>>({
    [Domain.WORK_EDUCATION]: '',
    [Domain.RELATIONSHIPS]: '',
    [Domain.PERSONAL_GROWTH_HEALTH]: '',
    [Domain.LEISURE]: '',
  });
  // For score selection popup
  const [pendingValue, setPendingValue] = useState<{ domain: Domain; label: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      const history = await cloudService.getHistory();
      setEntries(history);
      // Set the most recent entry as the last entry
      if (history.length > 0) {
        setLastEntry(history[0]);
      }
    };
    init();
  }, []);

  // Load last entry when switching to assess view
  useEffect(() => {
    if (view === 'assess' && entries.length > 0 && !lastEntry) {
      setLastEntry(entries[0]);
    }
  }, [view, entries]);

  // When clicking a value, either remove it or show score selector
  const handleValueClick = (domain: Domain, label: string) => {
    const exists = valuePoints.find(p => p.label === label && p.domain === domain);
    if (exists) {
      // Remove it
      setValuePoints(prev => prev.filter(p => p.id !== exists.id));
    } else {
      // Show score selector
      setPendingValue({ domain, label });
    }
  };

  // Add value with selected score
  const addValueWithScore = (score: number) => {
    if (!pendingValue) return;
    setValuePoints(prev => [
      ...prev,
      { id: Math.random().toString(36).substr(2, 9), label: pendingValue.label, domain: pendingValue.domain, score }
    ]);
    setPendingValue(null);
  };

  const handleCustomAdd = (domain: Domain) => {
    if (!customInputs[domain]) return;
    const label = customInputs[domain];
    setPendingValue({ domain, label });
    setCustomInputs(prev => ({ ...prev, [domain]: '' }));
  };

  // Score IS the layer now (1-5, where 5=center/best, 1=outer/worst)
  const scoreToLayer = (score: number): number => {
    return Math.round(score);
  };

  const saveToCloud = async () => {
    if (valuePoints.length === 0) return;
    setIsSyncing(true);
    // Score is already the layer (1-5)
    const valuePointsWithLayers = valuePoints.map(vp => ({
      ...vp,
      score: vp.score,
      layer: vp.score // Score IS the layer
    }));
    const newEntry: Entry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      valuePoints: valuePointsWithLayers
    };
    await cloudService.syncEntry(newEntry);
    const updatedHistory = await cloudService.getHistory();
    setEntries(updatedHistory);
    setLastEntry(updatedHistory[0]);
    setValuePoints([]);
    setIsSyncing(false);
    setView('history');
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (deleteCode !== '1983') {
      return;
    }
    await cloudService.deleteEntry(entryId);
    const updatedHistory = await cloudService.getHistory();
    setEntries(updatedHistory);
    if (updatedHistory.length > 0) {
      setLastEntry(updatedHistory[0]);
    } else {
      setLastEntry(null);
    }
    setShowDeleteConfirm(null);
    setDeleteCode('');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1a1a1a] selection:bg-[#002395] selection:text-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Navigation - Haute Couture style */}
        <nav className="flex justify-between items-center mb-32">
          <button onClick={() => setView('landing')} className="text-2xl serif italic tracking-tighter hover:opacity-70 transition-opacity">
            Values <span className="text-gray-300">Navigator</span>
          </button>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.4em] font-semibold text-gray-400">
            <button onClick={() => setView('assess')} className={`transition-colors ${view === 'assess' ? 'text-black border-b border-black' : 'hover:text-black'}`}>The Compass</button>
            <button onClick={() => setView('history')} className={`transition-colors ${view === 'history' ? 'text-black border-b border-black' : 'hover:text-black'}`}>The Timeline</button>
            <button onClick={() => setView('playbook')} className={`transition-colors ${view === 'playbook' ? 'text-black border-b border-black' : 'hover:text-black'}`}>The Playbook</button>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-24">
                <h1 className="text-8xl md:text-[10rem] font-light serif mb-8 tracking-tighter leading-none">
                  Values <span className="italic text-gray-300">Navigator</span>
                </h1>
                <p className="text-[11px] uppercase tracking-[0.6em] text-gray-400 font-medium">A Journey of Mindful Directions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
                <div className="space-y-6">
                  <h4 className="serif italic text-xl">The Methodology</h4>
                  <p className="text-sm font-light leading-relaxed text-gray-500">The Bull's Eye target represents the life you want to live. It is divided into four domains: Work & Education, Relationships, Personal Growth & Health, and Leisure.</p>
                </div>
                <div className="space-y-6">
                  <h4 className="serif italic text-xl">The Center</h4>
                  <p className="text-sm font-light leading-relaxed text-gray-500">When you place a marker in the center, it signifies you are living fully—hitting the target. You are acting in accordance with your heart's desires.</p>
                </div>
                <div className="space-y-6">
                  <h4 className="serif italic text-xl">The Obstacles</h4>
                  <p className="text-sm font-light leading-relaxed text-gray-500">Markers on the edges represent being "Off-Course." This usually happens when we are distracted by difficult thoughts or feelings that pull us away.</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setView('assess')}
                  className="px-16 py-6 bg-black text-white text-[10px] uppercase tracking-[0.5em] rounded-full hover:bg-[#002395] transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  Enter Assessment
                </button>
                <p className="mt-8 text-[9px] text-gray-300 uppercase tracking-widest font-bold italic">Synchronized with Secure Cloud Storage</p>
              </div>
            </motion.div>
          )}

          {view === 'assess' && (
            <motion.div
              key="assess"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Score Selection Popup */}
              {pendingValue && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setPendingValue(null)}>
                  <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <h3 className="serif text-2xl italic mb-2 text-center">Rate Your Alignment</h3>
                    <p className="text-center text-gray-500 text-sm mb-6">"{pendingValue.label}"</p>
                    <p className="text-center text-xs text-gray-400 mb-4">How well are you living this value?</p>
                    <div className="flex justify-center gap-3 mb-6">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          onClick={() => addValueWithScore(score)}
                          className={`w-14 h-14 rounded-full text-lg font-bold transition-all hover:scale-110 ${
                            score === 5 ? 'bg-[#002395] text-white' :
                            score === 4 ? 'bg-[#002395]/70 text-white' :
                            score === 3 ? 'bg-gray-300 text-gray-700' :
                            score === 2 ? 'bg-[#ED2939]/70 text-white' :
                            'bg-[#ED2939] text-white'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 px-2">
                      <span>Off Course</span>
                      <span>On Target</span>
                    </div>
                    <button
                      onClick={() => setPendingValue(null)}
                      className="w-full mt-6 py-2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
              {/* Left Column: Visual Mapping */}
              <div className="lg:sticky lg:top-12 space-y-12">
                <div className="bg-white p-16 rounded-[4rem] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.1)] border border-white">
                  <BullseyeChart valuePoints={valuePoints} />
                </div>
                <div className="bg-white/50 p-8 rounded-3xl border border-white backdrop-blur-md">
                   <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#002395]"></span>
                     Scoring Guide
                   </h5>
                   <p className="text-xs text-gray-500 font-light leading-relaxed">
                     <span className="font-bold text-[#002395]">5</span> = Fully aligned, living this value completely<br/>
                     <span className="font-bold">3</span> = Partially aligned, room for improvement<br/>
                     <span className="font-bold text-[#ED2939]">1</span> = Off course, not living this value
                   </p>
                </div>
              </div>

              {/* Right Column: Values Definition */}
              <div className="space-y-20">
                <div className="border-b border-gray-100 pb-12">
                  <h2 className="serif text-5xl mb-4 italic">Defining Intentions</h2>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.4em] font-medium">Select values and rate your alignment</p>
                </div>

                {(Object.keys(Domain) as (keyof typeof Domain)[]).map(key => {
                  const domain = Domain[key];
                  const meta = DOMAIN_METADATA[domain];
                  const domainValues = valuePoints.filter(p => p.domain === domain);
                  return (
                    <div key={domain} className="group space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="p-3 bg-white rounded-full shadow-sm text-black" style={{ color: meta.color }}>{meta.icon}</span>
                          <h4 className="text-xs font-bold uppercase tracking-[0.2em]">{domain}</h4>
                        </div>
                        <span className="text-[10px] text-gray-300 font-medium italic">{domainValues.length} selected</span>
                      </div>

                      {/* Selected values with scores */}
                      {domainValues.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {domainValues.map(vp => (
                            <button
                              key={vp.id}
                              onClick={() => handleValueClick(domain, vp.label)}
                              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all duration-300 flex items-center gap-2 ${
                                vp.score === 5 ? 'bg-[#002395] text-white border-[#002395]' :
                                vp.score === 4 ? 'bg-[#002395]/70 text-white border-[#002395]/70' :
                                vp.score === 3 ? 'bg-gray-300 text-gray-700 border-gray-300' :
                                vp.score === 2 ? 'bg-[#ED2939]/70 text-white border-[#ED2939]/70' :
                                'bg-[#ED2939] text-white border-[#ED2939]'
                              }`}
                            >
                              {vp.label}
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">{vp.score}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2.5">
                        {PREDEFINED_VALUES[domain].filter(val => !valuePoints.some(p => p.label === val && p.domain === domain)).map(val => (
                          <button
                            key={val}
                            onClick={() => handleValueClick(domain, val)}
                            className="px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest border transition-all duration-300 bg-white text-gray-400 border-gray-100 hover:border-black"
                          >
                            {val}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          value={customInputs[domain]}
                          onChange={(e) => setCustomInputs(prev => ({ ...prev, [domain]: e.target.value }))}
                          placeholder="Manually enter a custom value..."
                          className="w-full bg-transparent border-b border-gray-200 py-3 text-xs focus:border-[#002395] focus:outline-none placeholder:italic transition-colors"
                          onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd(domain)}
                        />
                        <button
                          onClick={() => handleCustomAdd(domain)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold tracking-widest text-[#002395] opacity-50 hover:opacity-100 transition-opacity"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-12">
                  <button
                    onClick={saveToCloud}
                    disabled={valuePoints.length === 0 || isSyncing}
                    className="group relative w-full py-8 bg-black text-white rounded-full text-xs uppercase tracking-[0.6em] disabled:opacity-20 transition-all hover:bg-[#002395] shadow-2xl overflow-hidden"
                  >
                    {isSyncing ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Syncing to Cloud...
                      </span>
                    ) : (
                      <span className="relative z-10">Commit to Daily Archive</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
              </div>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="space-y-16"
            >
              {/* Last Session with Bullseye and Collapsible Quadrants */}
              {lastEntry && (
                <section className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="serif text-7xl italic">Last Session</h2>
                    <p className="text-gray-400 text-xs uppercase tracking-[0.5em]">
                      {new Date(lastEntry.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Bullseye Chart showing last session values */}
                    <div className="bg-white p-12 rounded-[3rem] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.1)] border border-white">
                      <BullseyeChart valuePoints={lastEntry.valuePoints} />
                    </div>

                    {/* Collapsible Quadrants */}
                    <LastSessionSummary lastEntry={lastEntry} scoreToLayer={scoreToLayer} />
                  </div>
                </section>
              )}

              {/* Timeline Chart */}
              <section className="text-center max-w-5xl mx-auto space-y-16">
                <div className="space-y-4">
                  <h2 className="serif text-7xl italic">The Timeline</h2>
                  <p className="text-gray-400 text-xs uppercase tracking-[0.5em]">Tracking specific value congruence across your journey</p>
                </div>
                <div className="p-16 bg-white rounded-[4rem] border border-white shadow-[0_50px_100px_-50px_rgba(0,0,0,0.05)]">
                   <HistoryView entries={entries} />
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {entries.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-[3rem]">
                    <p className="text-gray-300 serif text-lg italic">Your journey awaits its first archive.</p>
                  </div>
                ) : (
                  entries.map(entry => {
                    // Calculate summary statistics - score IS the value (1-5)
                    const scoreCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                    const domainCounts: Record<Domain, number> = {
                      [Domain.WORK_EDUCATION]: 0,
                      [Domain.RELATIONSHIPS]: 0,
                      [Domain.PERSONAL_GROWTH_HEALTH]: 0,
                      [Domain.LEISURE]: 0
                    };

                    entry.valuePoints.forEach(p => {
                      scoreCounts[p.score] = (scoreCounts[p.score] || 0) + 1;
                      domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
                    });

                    return (
                      <motion.div
                        layout
                        key={entry.id}
                        className="bg-white p-12 rounded-[3rem] border border-white shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#002395] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300">
                            {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">
                            {entry.valuePoints.length} values
                          </span>
                        </div>

                        {/* Summary by Score */}
                        <div className="mb-8 space-y-3">
                          <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Score Distribution</h4>
                          <div className="grid grid-cols-5 gap-2">
                            {[5, 4, 3, 2, 1].map(score => (
                              <div key={score} className="text-center">
                                <div className={`text-lg font-bold ${score >= 4 ? 'text-[#002395]' : score <= 2 ? 'text-[#ED2939]' : 'text-gray-600'}`}>
                                  {scoreCounts[score] || 0}
                                </div>
                                <div className="text-[8px] uppercase tracking-[0.1em] text-gray-400 mt-1">
                                  {score}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between text-[8px] text-gray-400 mt-4 pt-4 border-t border-gray-50">
                            <span>On Target</span>
                            <span>Off Course</span>
                          </div>
                        </div>

                        {/* Domain Breakdown */}
                        <div className="mb-8 space-y-2">
                          <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">By Domain</h4>
                          {(Object.keys(Domain) as (keyof typeof Domain)[]).map(key => {
                            const domain = Domain[key];
                            const count = domainCounts[domain];
                            if (count === 0) return null;
                            return (
                              <div key={domain} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600">{domain.split(' ')[0]}</span>
                                <span className="font-bold text-gray-900">{count}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Value Points List */}
                        <div className="space-y-4 pt-6 border-t border-gray-50">
                          <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-3">Values</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {entry.valuePoints.map(p => {
                              const score = p.score;
                              return (
                                <div key={p.id} className="flex justify-between items-center py-1">
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-700">{p.label}</p>
                                    <span className="text-[9px] text-gray-400">{p.domain.split(' ')[0]}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    score >= 4 ? 'bg-[#002395]/10 text-[#002395]' :
                                    score <= 2 ? 'bg-[#ED2939]/10 text-[#ED2939]' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {score}/5
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="pt-6 border-t border-gray-50 mt-6">
                          {showDeleteConfirm === entry.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={deleteCode}
                                onChange={(e) => setDeleteCode(e.target.value)}
                                placeholder="Enter code to delete"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-[#ED2939]"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="flex-1 py-2 bg-[#ED2939] text-white rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#ED2939]/80 transition-colors"
                                >
                                  Confirm Delete
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDeleteConfirm(null);
                                    setDeleteCode('');
                                  }}
                                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowDeleteConfirm(entry.id)}
                              className="w-full py-2 bg-gray-50 text-gray-500 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#ED2939]/10 hover:text-[#ED2939] transition-colors"
                            >
                              Delete Entry
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </section>
            </motion.div>
          )}

          {view === 'playbook' && (
            <Playbook />
          )}
        </AnimatePresence>

        <footer className="mt-60 pt-16 border-t border-gray-100 flex flex-col items-center gap-12">
          <div className="flex gap-12 text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">
            <span>Values Navigator</span>
            <span className="text-gray-200">/</span>
            <span>2026 Archive System</span>
          </div>
          <div className="flex gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-[#002395]"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white border border-gray-200"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-[#ED2939]"></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
