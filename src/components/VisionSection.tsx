import React, { useState } from 'react';
import { Cpu, Rocket, Factory, TrendingUp, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface VisionSectionProps {
  headline?: string;
  description?: string;
}

export const VisionSection: React.FC<VisionSectionProps> = ({
  headline = 'An ecosystem where ambitious ideas become useful products, sustainable ventures and meaningful opportunities.',
  description = 'Hardware and robotics ventures fail when engineering happens in isolation from manufacturing, customer demand, and capital. Origin Labs integrates these five critical disciplines into a continuous, cohesive feedback loop.'
}) => {
  const [activeNode, setActiveNode] = useState<number>(0);

  const pillars = [
    {
      id: 'engineering',
      title: 'Engineering Rigor',
      icon: Cpu,
      subtitle: 'From First Sketch to Working Prototype',
      overview: 'Direct access to mechanical engineers, firmware developers, and precision machinery to rapidly de-risk technical feasibility.',
      connections: [
        'CAD & mechanical engineering feed directly into manufacturing DFMA',
        'Functional prototypes provide tangible proof for investor readiness',
        'Technical specs validated against real customer usage conditions'
      ]
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship & PMF',
      icon: Rocket,
      subtitle: 'Customer Discovery & Business Viability',
      overview: 'Structured validation milestones that ensure hardware is built for actual market demand, not speculative assumptions.',
      connections: [
        'Customer discovery informs initial product feature priorities',
        'Unit economics defined before entering factory production runs',
        'Founders coached by seasoned hardware operators and mentors'
      ]
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing & DFMA',
      icon: Factory,
      subtitle: 'From Pilot Batches to Mass Production',
      overview: 'Design for Manufacturing & Assembly (DFMA), trusted supplier networks, and quality control protocols that scale seamlessly.',
      connections: [
        'Tooling and material choices locked in early to prevent redesign delays',
        'Pilot production runs prove yield rates before mass capital commitment',
        'Direct coordination with vetted domestic and international manufacturing partners'
      ]
    },
    {
      id: 'capital',
      title: 'Capital & Readiness',
      icon: TrendingUp,
      subtitle: 'De-Risked Hardware for Investors',
      overview: 'Milestone-based preparation, financial models, and strategic introductions without unrealistic hype or premature fundraising.',
      connections: [
        'BOM (Bill of Materials) audits and yield models present clear margins',
        'Working physical hardware eliminates speculative technical doubt',
        'Guidance on structured non-dilutive and venture capital pathways'
      ]
    },
    {
      id: 'community',
      title: 'Community & Ecosystem',
      icon: Users,
      subtitle: 'Collective Knowledge & Cohorts',
      overview: 'A high-density peer network of founders, engineers, researchers, and mentors sharing hard-won industrial experience.',
      connections: [
        'Cohort peer accountability keeps technical milestones on schedule',
        'Shared supplier benchmarks and component sourcing knowledge',
        'Access to university labs, research talent, and industry summits'
      ]
    }
  ];

  return (
    <section id="vision" className="py-20 lg:py-28 bg-[#07080a] border-b border-white/10 relative overflow-hidden">
      {/* Background accents in fiery ember tones */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#FF5500]/6 via-[#FFA200]/2 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
            <span>// 01. OUR VISION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {headline}
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Interactive Connectivity Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pillar Selector Buttons */}
          <div className="lg:col-span-5 space-y-3" role="tablist" aria-label="Ecosystem Pillars">
            <div className="text-xs uppercase tracking-wider font-mono-code text-white/50 px-2 mb-2">
              Select an ecosystem pillar to inspect connections:
            </div>
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeNode === idx;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveNode(idx)}
                  className={`w-full text-left p-4 rounded-sm border transition-all flex items-start gap-4 ${
                    isActive
                      ? 'bg-[#12151d] border-[#FF5500] shadow-[0_0_24px_rgba(255,85,0,0.22)] text-white'
                      : 'bg-[#0c0e13] border-white/10 hover:border-white/25 hover:bg-[#101319] text-white/70'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-sm shrink-0 transition-colors ${
                      isActive ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]' : 'bg-white/5 text-white/80'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-base text-white tracking-wide">
                        {pillar.title}
                      </h3>
                      {isActive && (
                        <span className="text-[10px] font-mono-code text-[#FFA200] uppercase tracking-wider">
                          Active Link
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-0.5 truncate">
                      {pillar.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Connection Inspector Box */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-sm bg-[#0e1117] border border-white/15 relative overflow-hidden shadow-2xl">
              {/* Corner tech stamp */}
              <div className="absolute top-4 right-4 text-[10px] font-mono-code text-white/40 border border-white/10 px-2 py-0.5 rounded">
                CONNECTED_SYSTEM // 0{activeNode + 1}
              </div>

              {/* Node Title & Overview */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                  {pillars[activeNode].title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 font-normal">
                {pillars[activeNode].overview}
              </p>

              {/* Interconnection Pipeline Points */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs uppercase tracking-wider font-mono-code text-[#FFA200] flex items-center gap-2">
                  <span>How This Links With Other Ecosystem Areas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </h4>
                <div className="space-y-3">
                  {pillars[activeNode].connections.map((conn, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3.5 rounded bg-black/40 border border-white/10 flex items-start gap-3 hover:border-white/20 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-white/80 leading-snug">
                        {conn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quote Banner */}
              <div className="mt-8 p-4 rounded bg-[#07080a] border-l-2 border-[#FF5500] text-xs text-white/70 italic">
                “Building physical products demands that prototyping never outpaces manufacturing reality, and manufacturing never commits before product validation.”
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
