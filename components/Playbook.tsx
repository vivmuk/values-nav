import React from 'react';
import { motion } from 'framer-motion';

const Playbook: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="space-y-32"
    >
      {/* Header */}
      <section className="text-center max-w-4xl mx-auto space-y-8">
        <h2 className="serif text-6xl md:text-8xl italic leading-none">The Playbook</h2>
        <p className="text-gray-400 text-xs uppercase tracking-[0.5em] font-medium leading-relaxed">
          Navigating the Fog: Presence, Memory & Identity
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto text-center space-y-8">
        <p className="text-xl serif italic text-gray-500 leading-relaxed">
          "In our fast-paced, information-saturated world, many find it increasingly challenging to remain present in the moment."
        </p>
        <p className="text-sm font-light leading-loose text-gray-600">
          This "mental fog" stems from a complex interplay of psychological, physiological, and environmental factors. Understanding these root causes is the first step towards reclaiming mental clarity.
        </p>
      </section>

      {/* Part 1: Presence & Memory */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Challenges */}
        <div className="space-y-12">
          <div className="border-b border-gray-100 pb-8">
            <h3 className="serif text-4xl italic mb-4">The Fog</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Barriers to Presence</p>
          </div>
          
          <div className="space-y-10">
            {[
              { title: "Stress & Anxiety", desc: "The body's 'fight or flight' state prioritizes immediate threats over memory encoding and focus." },
              { title: "Information Overload", desc: "Constant bombardment of notifications overwhelms cognitive processing capacity." },
              { title: "Lack of Sleep", desc: "Insufficient sleep impairs memory consolidation—the transformation of short-term memories into long-term ones." },
              { title: "Multitasking", desc: "Divides attention, leading to superficial processing and poor memory encoding." },
              { title: "Environmental Distractions", desc: "Noisy or cluttered environments pull focus away from the task at hand." },
              { title: "Lack of Engagement", desc: "If information isn't perceived as relevant or emotionally engaging, the brain won't prioritize it." }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-[#002395] transition-colors">{item.title}</h4>
                <p className="text-sm font-light text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation */}
        <div className="space-y-12">
          <div className="border-b border-gray-100 pb-8">
            <h3 className="serif text-4xl italic mb-4">The Clarity</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Strategies for Presence</p>
          </div>

          <div className="space-y-10">
            {[
              { title: "Mindfulness", desc: "Pay attention to the present moment without judgment to reduce mind-wandering." },
              { title: "Single-Tasking", desc: "Eliminate distractions and resist the urge to switch tasks. Being truly present requires singular focus." },
              { title: "Cognitive Strategies", desc: "Use active recall, spaced repetition, chunking, and visualization to anchor memories." },
              { title: "Prioritize Sleep", desc: "Aim for 7-9 hours to ensure memory consolidation and cognitive function." },
              { title: "Digital Detox", desc: "Be intentional about consumption. Unsubscribe, limit social media, and schedule unplugged periods." },
              { title: "Active Engagement", desc: "Make a conscious effort to find personal relevance and ask questions when learning." }
            ].map((item, idx) => (
              <div key={idx} className="group">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-2 group-hover:text-[#002395] transition-colors">{item.title}</h4>
                <p className="text-sm font-light text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part 2: Identity Evolution */}
      <section className="space-y-24">
        <div className="text-center space-y-6">
          <h2 className="serif text-5xl italic">Identity Evolution</h2>
          <p className="text-gray-400 text-xs uppercase tracking-[0.5em] font-medium">From Familiar Patterns to Emerging Self</p>
        </div>

        {/* Table 1: Mapped Clearly */}
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white rounded-[3rem] p-12 shadow-sm border border-gray-50">
            <h4 className="serif text-2xl italic mb-10 text-center">The Shift</h4>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">Dimension</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">Old Identity (Familiar)</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-[#002395] font-bold">Emerging Identity (Forming)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                {[
                  { dim: "Relationship to effort", old: "Push through resistance", new: "Listen to resistance as data" },
                  { dim: "Thinking style", old: "Fast, lateral, associative", new: "Intentional, selective, slower" },
                  { dim: "Self-worth signal", old: "Productivity + ideas", new: "Presence + follow-through" },
                  { dim: "Fear", old: "If I slow down, I lose my edge", new: "If I don’t slow down, I burn out" },
                  { dim: "Journaling style", old: "Externalize chaos", new: "Integrate meaning" },
                  { dim: "Social energy", old: "Idea-driven engagement", new: "Presence-driven engagement" },
                  { dim: "Inner narrative", old: "“Why can’t I just try harder?”", new: "“What does my system need right now?”" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 px-4 font-medium text-gray-900">{row.dim}</td>
                    <td className="py-6 px-4">{row.old}</td>
                    <td className="py-6 px-4 text-[#002395]">{row.new}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Today's Version */}
        <div className="overflow-x-auto">
          <div className="min-w-full bg-white rounded-[3rem] p-12 shadow-sm border border-gray-50">
            <h4 className="serif text-2xl italic mb-10 text-center">The Friction</h4>
            <p className="text-center text-xs text-gray-400 mb-12 uppercase tracking-widest">Today's Version & Friction Points</p>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">Dimension</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">Old Identity (Implicit)</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-[#002395] font-bold">Emerging Identity (Today)</th>
                  <th className="py-6 px-4 text-[10px] uppercase tracking-[0.2em] text-[#ED2939] font-bold">Friction Point</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                {[
                  { dim: "Energy Source", old: "Momentum-driven, externally structured", new: "Self-directed, internally regulated", friction: "Requires self-trust instead of urgency" },
                  { dim: "Work Relationship", old: "Execute plans, deliver reliably", new: "Create meaning, lead thoughtfully", friction: "Meaning work demands presence" },
                  { dim: "Responsibility", old: "Carry responsibility without questioning", new: "Aware of emotional + cognitive load", friction: "Awareness precedes boundaries" },
                  { dim: "Attention", old: "Focus followed structure", new: "Attention fragments under pressure", friction: "Nervous system overload, not lack of will" },
                  { dim: "Self-Care", old: "Secondary, implicit", new: "Explicit but not embodied yet", friction: "Knowing ≠ doing" },
                  { dim: "Care Orientation", old: "High care for others", new: "Low care for self", friction: "Compassion asymmetry" },
                  { dim: "Motivation Style", old: "Deadline and expectation-based", new: "Intention and alignment-based", friction: "Intentions need scaffolding" },
                  { dim: "Joy Access", old: "Spontaneous, occasional", new: "Remembered but distant", friction: "Joy blocked by responsibility weight" },
                  { dim: "Inner Authority", old: "External validation + roles", new: "Emerging self-authority", friction: "Uncomfortable transition" },
                  { dim: "Action Readiness", old: "Do first, feel later", new: "Feel blocked, then stall", friction: "Feeling-state dependence" }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-6 px-4 font-medium text-gray-900">{row.dim}</td>
                    <td className="py-6 px-4">{row.old}</td>
                    <td className="py-6 px-4 text-[#002395]">{row.new}</td>
                    <td className="py-6 px-4 text-[#ED2939]">{row.friction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Playbook;

