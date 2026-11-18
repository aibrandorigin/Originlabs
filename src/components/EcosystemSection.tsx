import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Factory,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { IMAGES } from '../assets.js';

interface EcosystemSectionProps {
  onSelectCategory: (category: string) => void;
}

interface HardwareExecutionArea {
  id: string;
  categoryKey: string;
  letter: string;
  title: string;
  shortDesc: string;
  icon: any;
  image: string;
  capabilities: string[];
  deliverables: string[];
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ onSelectCategory }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>('proto');

  const areas: HardwareExecutionArea[] = [
    {
      id: 'proto',
      categoryKey: 'Prototyping',
      letter: 'A',
      title: 'Prototyping & Validation',
      shortDesc: 'Rapid technical de-risking from initial conceptual sketch to fully functional benchmark proof of concept.',
      icon: Layers,
      image: IMAGES.engLab,
      capabilities: [
        'Concept development',
        'Technical feasibility',
        'Proof of concept',
        'Rapid prototyping',
        'Testing and iteration'
      ],
      deliverables: [
        'Bench-tested physical proof of concept (POC)',
        'Engineering feasibility report & risk register',
        'Functional CAD schematics & iteration log'
      ]
    },
    {
      id: 'robotics',
      categoryKey: 'Robotics and hardware',
      letter: 'B',
      title: 'Robotics & Hardware',
      shortDesc: 'Multi-disciplinary robotics architecture, embedded electronics, custom PCB design, sensors, and firmware integration.',
      icon: Cpu,
      image: IMAGES.hardwarePcb,
      capabilities: [
        'Robotics development',
        'Embedded systems',
        'Electronics and firmware',
        'IoT products',
        'Automation',
        'System integration'
      ],
      deliverables: [
        'Custom multi-layer PCB design & gerber files',
        'Bare-metal & RTOS embedded firmware',
        'Actuation, kinematics & sensor integration rigs'
      ]
    },
    {
      id: 'mfg',
      categoryKey: 'Mechanical engineering',
      letter: 'C',
      title: 'Mechanical Engineering & Manufacturing',
      shortDesc: 'End-to-end mechanical design, DFMA optimization, high-precision machining, and bulk contract manufacturing.',
      icon: Factory,
      image: IMAGES.cncMilling,
      capabilities: [
        'Mechanical design',
        'CAD and engineering development',
        'Material selection',
        'Design for manufacturing and assembly',
        'Supplier coordination',
        'Pilot production',
        'Bulk contract manufacturing',
        'Quality planning'
      ],
      deliverables: [
        'Complete DFMA audit for injection molding / CNC / sheet metal',
        'Production tooling drawings & Bill of Materials (BOM)',
        'First-article inspection (FAI) & pilot run quality sign-off'
      ]
    }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(prev => (prev === id ? null : id));
  };

  return (
    <section id="ecosystem" className="py-20 lg:py-28 bg-[#090b0f] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
              <span>// 02. HARDWARE EXECUTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Pillars of Hardware Execution.
            </h2>
            <p className="text-base text-white/70 mt-4 leading-relaxed">
              Precision electromechanical prototyping, robotics systems engineering, and volume contract manufacturing — executed in our dedicated laboratories and partner facilities:
            </p>
          </div>
          <div className="text-xs font-mono-code text-[#FFA200] border border-[#FF5500]/25 px-3 py-2 rounded-sm bg-[#FF5500]/5 self-start md:self-auto">
            PHYSICAL ENGINEERING PIPELINE
          </div>
        </div>

        {/* 3 Physical Hardware Engineering Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {areas.map((area) => {
            const isExpanded = expandedCard === area.id;
            const Icon = area.icon;

            return (
              <div
                key={area.id}
                className={`rounded-sm border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isExpanded
                    ? 'bg-[#12161f] border-[#FF5500]/70 shadow-[0_10px_35px_rgba(255,85,0,0.18)]'
                    : 'bg-[#0c0e14] border-white/10 hover:border-white/25 hover:bg-[#101319]'
                }`}
              >
                {/* Visual Header / Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-black/50 border-b border-white/10">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover filter contrast-[1.05] brightness-90 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[10px] font-mono-code text-white/80">
                    PILLAR {area.letter} // HARDWARE
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-sm bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FFA200]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono-code text-white/40">
                        STAGE {area.letter}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCard(area.id)}
                      className="p-1.5 rounded-sm hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${area.title}`}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#FFA200]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl font-heading font-bold text-white mb-2 tracking-wide">
                    {area.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
                    {area.shortDesc}
                  </p>

                  {/* Core Capabilities List */}
                  <div className="mt-2 pt-4 border-t border-white/10 flex-1">
                    <div className="text-[11px] uppercase tracking-wider font-mono-code text-white/50 mb-2.5">
                      Scope & Capabilities:
                    </div>
                    <ul className="space-y-1.5 mb-4">
                      {area.capabilities.map((cap, i) => (
                        <li key={i} className="text-xs text-white/85 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500] shrink-0 mt-1.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Expandable Deep-dive: Deliverables */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-200">
                        <div className="text-[11px] uppercase tracking-wider font-mono-code text-[#FFA200] mb-2.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Key Deliverables:</span>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {area.deliverables.map((deliv, di) => (
                            <li key={di} className="text-xs text-white/70 flex items-start gap-2 bg-black/40 p-2 rounded border border-white/5">
                              <Check className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action CTA */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => onSelectCategory(area.categoryKey)}
                      className="w-full py-2.5 px-3 rounded-sm bg-white/5 hover:bg-gradient-to-r hover:from-[#FF6B00] hover:to-[#FF3700] text-white font-semibold text-xs uppercase tracking-wider border border-white/15 hover:border-[#FF5500] transition-all flex items-center justify-center gap-2 group hover:shadow-[0_0_16px_rgba(255,85,0,0.35)]"
                    >
                      <span>Inquire About {area.title.split('&')[0].trim()}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
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
