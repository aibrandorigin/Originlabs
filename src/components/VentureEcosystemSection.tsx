import React, { useState } from 'react';
import {
  Rocket,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileCheck
} from 'lucide-react';

interface VentureEcosystemSectionProps {
  onSelectCategory: (category: string) => void;
}

interface VenturePillar {
  id: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  icon: any;
  description: string;
  capabilities: string[];
  deliverables: string[];
  disclaimer?: string;
  highlightStat: string;
  highlightLabel: string;
}

export const VentureEcosystemSection: React.FC<VentureEcosystemSectionProps> = ({ onSelectCategory }) => {
  const [activePillar, setActivePillar] = useState<string>('incubation');

  const pillars: VenturePillar[] = [
    {
      id: 'incubation',
      categoryKey: 'Incubation',
      title: 'Incubation & Acceleration',
      subtitle: 'Structured Hardware Company-Building',
      icon: Rocket,
      description: 'Hardware ventures operate under very different cycles than software. Our incubation structure pairs hands-on engineering lab time with intense customer discovery, unit economics modeling, and milestone reviews.',
      capabilities: [
        'Founder incubation cohorts',
        'Hardware-tailored acceleration curriculum',
        'Customer discovery and problem-solution validation',
        'Unit economics, BOM cost analysis & pricing strategy',
        'Milestone-based stage-gate technical reviews',
        'Direct mentorship from exited hardware founders'
      ],
      deliverables: [
        'Validated customer problem-solution discovery canvas',
        'First-year financial model and BOM cost curve',
        'Structured hardware development roadmap to MVP'
      ],
      highlightStat: 'Cohort Based',
      highlightLabel: 'Focused peer builder groups'
    },
    {
      id: 'funding',
      categoryKey: 'Funding readiness',
      title: 'Funding Readiness & Investor Access',
      subtitle: 'De-Risked Hardware Prepared for Diligent Capital',
      icon: TrendingUp,
      description: 'We do not sell hype or guarantee funding. We prepare hardware companies so their engineering, supply chain readiness, and financial models stand up to rigorous investor due diligence.',
      capabilities: [
        'Milestone-based investor readiness preparation',
        'Hardware-specific pitch deck & data room structuring',
        'Financial models & manufacturing capital expense (CapEx) projections',
        'Working physical proof-of-concept showcases (eliminating technical doubt)',
        'Strategic introductions to hardware-focused angels, syndicates, and VCs',
        'Guidance on non-dilutive government grants and innovation vouchers'
      ],
      deliverables: [
        'Complete hardware investor data room checklist',
        'Manufacturing CapEx & OpEx financial pro-forma',
        'Working hardware demo protocol for pitch meetings'
      ],
      disclaimer: 'Note: Origin Labs provides structured readiness preparation and strategic ecosystem introductions; investments are strictly subject to independent third-party diligence and decisions.',
      highlightStat: '100% Honest',
      highlightLabel: 'Physical proof over speculative decks'
    },
    {
      id: 'cohorts',
      categoryKey: 'Cohorts and community',
      title: 'Cohorts, Community & Ecosystem',
      subtitle: 'High-Density Physical Hardware Community',
      icon: Users,
      description: 'Building physical products is challenging in isolation. Origin Labs organizes structured builder cohorts, masterclasses, and an active network of founders, engineers, researchers, and manufacturing suppliers.',
      capabilities: [
        'Builder cohorts with peer milestone accountability',
        'Expert-led masterclasses (CAD, DFMA, embedded firmware, supply chains)',
        'Industry summits, demo days, and hardware showcase evenings',
        'Shared supplier benchmarks and vetted vendor directory',
        'University research labs and technical talent integration',
        'Lifelong alumni network of hardware entrepreneurs'
      ],
      deliverables: [
        'Cohort milestone accountability group placement',
        'Access to Origin Labs private supplier & vendor directory',
        'Passes to private hardware demonstration summits'
      ],
      highlightStat: 'Peer Dense',
      highlightLabel: 'Engineers, researchers, and suppliers solving physical challenges together'
    }
  ];

  return (
    <section id="venture-ecosystem" className="py-20 lg:py-28 bg-[#07080a] border-b border-white/10 relative overflow-hidden">
      {/* Subtle ambient fiery solar lighting */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-[#FF5500]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[350px] bg-[#FFA200]/4 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
              <span>// 03. VENTURE INCUBATION & CAPITAL ACCESS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Incubation, Investor Readiness & Community.
            </h2>
            <p className="text-base text-white/70 mt-4 leading-relaxed">
              Engineering breakthroughs must be supported by market validation, structured capital readiness, and a committed peer ecosystem. Explore our dedicated venture and ecosystem pillars:
            </p>
          </div>
          <div className="text-xs font-mono-code text-[#FFA200] border border-[#FF5500]/25 px-3 py-2 rounded-sm bg-[#FF5500]/5 self-start md:self-auto">
            VENTURE ECOSYSTEM
          </div>
        </div>

        {/* 3 Dedicated Pillars as Distinct Content Blocks */}
        <div className="space-y-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === pillar.id;

            return (
              <div
                key={pillar.id}
                className={`p-6 sm:p-10 rounded-sm border transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#11141b] border-[#FF5500]/70 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_24px_rgba(255,85,0,0.18)]'
                    : 'bg-[#0c0e14] border-white/15 hover:border-white/30'
                }`}
                onClick={() => setActivePillar(pillar.id)}
              >
                {/* Tech coordinates top tag */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white flex items-center justify-center font-bold shadow-[0_0_12px_rgba(255,85,0,0.35)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono-code text-white/90 font-bold">{pillar.highlightStat}</div>
                      <div className="text-[10px] font-mono-code text-white/50">{pillar.highlightLabel}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(pillar.categoryKey);
                      }}
                      className="px-4 py-2 rounded-sm bg-white/10 hover:bg-gradient-to-r hover:from-[#FF6B00] hover:to-[#FF3700] text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 hover:shadow-[0_0_14px_rgba(255,85,0,0.35)]"
                    >
                      <span>Inquire for {pillar.title.split('&')[0].trim()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Description & Subtitle */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="text-sm font-semibold text-[#FFA200]">
                      {pillar.subtitle}
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Disclaimer if present */}
                    {pillar.disclaimer && (
                      <div className="p-3 rounded bg-black/40 border border-white/10 text-xs text-white/60 italic leading-relaxed">
                        {pillar.disclaimer}
                      </div>
                    )}

                    {/* Deliverables Box */}
                    <div className="pt-2">
                      <div className="text-[11px] font-mono-code text-white/50 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#FFA200]" />
                        <span>Key Deliverables & Assets:</span>
                      </div>
                      <div className="space-y-2">
                        {pillar.deliverables.map((deliv, di) => (
                          <div
                            key={di}
                            className="p-2.5 rounded bg-black/40 border border-white/10 flex items-start gap-2 text-xs text-white/85"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Capabilities Checklist */}
                  <div className="lg:col-span-6 bg-black/40 p-5 rounded border border-white/10">
                    <div className="text-xs font-mono-code text-white/50 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Structured Support Scope</span>
                      <span className="text-[#FFA200]">{pillar.capabilities.length} Focus Areas</span>
                    </div>

                    <div className="space-y-2.5">
                      {pillar.capabilities.map((cap, ci) => (
                        <div key={ci} className="flex items-start gap-2.5 text-xs text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500] shrink-0 mt-1.5" />
                          <span className="leading-snug">{cap}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono-code text-white/40">
                        Origin Labs Ecosystem Track
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCategory(pillar.categoryKey);
                        }}
                        className="text-xs font-mono-code text-[#FFA200] hover:text-[#FF5500] hover:underline flex items-center gap-1 transition-colors"
                      >
                        <span>Start Application</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
