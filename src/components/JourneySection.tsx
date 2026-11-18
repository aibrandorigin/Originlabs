import React, { useState } from 'react';
import { Search, Wrench, ShieldCheck, Factory, Rocket, ArrowRight, CheckCircle } from 'lucide-react';

interface JourneySectionProps {
  onStartStage: (stage: string, category: string) => void;
}

interface StageDetail {
  id: string;
  name: string;
  number: string;
  categoryLink: string;
  icon: any;
  tagline: string;
  description: string;
  activities: string[];
  deliverables: string[];
  originSupport: string[];
  ctaLabel: string;
}

export const JourneySection: React.FC<JourneySectionProps> = ({ onStartStage }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages: StageDetail[] = [
    {
      id: 'discover',
      name: 'Discover',
      number: '01',
      categoryLink: 'Incubation',
      icon: Search,
      tagline: 'De-risk the core proposition before machining metal or printing silicon.',
      description: 'The discovery stage transforms raw concepts into defined engineering requirements. We validate user needs, conduct competitive teardowns, and establish target unit costs to ensure technical viability matches market viability.',
      activities: [
        'Problem definition and target user discovery interviews',
        'Patent and prior-art landscape analysis',
        'Preliminary Bill of Materials (BOM) cost modeling',
        'Regulatory and compliance pathway identification'
      ],
      deliverables: [
        'Product Requirements Document (PRD)',
        'Technical Feasibility Matrix',
        'Initial Target BOM & Unit Economics Model'
      ],
      originSupport: [
        'Venture mentor matching & design thinking workshops',
        'Preliminary electrical & mechanical architecture scoping',
        'Cohort customer discovery feedback sessions'
      ],
      ctaLabel: 'Begin Discovery & Scoping'
    },
    {
      id: 'prototype',
      name: 'Prototype',
      number: '02',
      categoryLink: 'Prototyping',
      icon: Wrench,
      tagline: 'Rapid physical manifestation to prove technical feasibility.',
      description: 'Moving from CAD and circuit schematics into tangible, testable breadboard and appearance prototypes. We iterate quickly across form, fit, and core electromechanical functions using high-precision in-house fabrication.',
      activities: [
        '3D CAD modeling, kinematics, and structural FEA simulations',
        'Custom PCB schematic capture, routing, and bare-board assembly',
        'Microcontroller firmware development & sensor integration',
        'Rapid additive/subtractive prototyping (CNC, SLA/SLS)'
      ],
      deliverables: [
        'Functional “Looks-Like / Works-Like” Proof of Concept',
        'Tested PCBAs with debugged firmware repository',
        'Engineering prototype test and measurement log'
      ],
      originSupport: [
        'Hands-on engineering lab benches and rapid prototyping rigs',
        'Senior firmware and mechanical design engineer reviews',
        'Supply chain sourcing for long-lead specialized chips'
      ],
      ctaLabel: 'Submit Your Prototype Project'
    },
    {
      id: 'validate',
      name: 'Validate',
      number: '03',
      categoryLink: 'Mechanical engineering',
      icon: ShieldCheck,
      tagline: 'Stress testing, environmental cycles, and user validation.',
      description: 'Prototypes are subjected to rigorous real-world torture testing, thermal management analysis, and pilot user trials. Every flaw found here saves tens of thousands in production tooling modifications.',
      activities: [
        'Drop, vibration, thermal, and moisture stress testing',
        'Electromagnetic compliance (EMC) pre-scan validation',
        'Pilot customer field testing and telemetry data logging',
        'Design for Manufacturing and Assembly (DFMA) review'
      ],
      deliverables: [
        'Comprehensive Environmental & Reliability Test Report',
        'Pre-compliance EMC / RF RFQ certification dossier',
        'DFMA Audit with tooling cost estimates'
      ],
      originSupport: [
        'Lab instrumentation (spectrum analyzers, thermal cameras, load cells)',
        'DFMA manufacturing specialists optimizing wall thickness & draft angles',
        'Structured customer beta feedback synthesis'
      ],
      ctaLabel: 'Validate Your Existing Hardware'
    },
    {
      id: 'manufacture',
      name: 'Manufacture',
      number: '04',
      categoryLink: 'Contract manufacturing',
      icon: Factory,
      tagline: 'Tooling, pilot runs, supplier management, and quality control.',
      description: 'Transitioning from handmade prototypes to industrial scale. We lock production tooling, negotiate with tier-1/tier-2 suppliers, oversee First Article Inspections, and manage pilot production runs.',
      activities: [
        'Injection mold tooling, die casting, and stamping fabrication',
        'Surface-mount technology (SMT) automated pick-and-place setup',
        'Quality Assurance (QA) jig and test fixture engineering',
        'Pilot production batch run (100 – 1,000 units)'
      ],
      deliverables: [
        'Locked production tooling & golden samples',
        'First Article Inspection (FAI) sign-off documents',
        'Factory Test Fixtures & Automated Inspection Protocols'
      ],
      originSupport: [
        'Direct supplier introductions & contract manufacturing liaison',
        'On-site or remote production line quality monitoring',
        'Logistics, freight, and customs clearance coordination'
      ],
      ctaLabel: 'Plan Your Production Run'
    },
    {
      id: 'launch',
      name: 'Launch',
      number: '05',
      categoryLink: 'Funding readiness',
      icon: Rocket,
      tagline: 'Market entry, fulfillment, scaling capital, and ecosystem growth.',
      description: 'With verified products coming off the line, Origin Labs helps founders synchronize fulfillment, showcase at industry demo days, and present audited production data to hardware investors.',
      activities: [
        'Fulfillment logistics & warranty/rma support system setup',
        'Investor readiness package presentation with verified BOM margins',
        'Cohort demo day showcase & press briefing',
        'Product iteration planning for Gen-2 enhancements'
      ],
      deliverables: [
        'Market-Ready Packaged Hardware Inventory',
        'Audited Production Data Room for Investors',
        'Customer Support & RMA Diagnostic Playbook'
      ],
      originSupport: [
        'High-density investor network introductions',
        'Cohort showcase summits & ecosystem press coverage',
        'Enterprise pilot customer introductions'
      ],
      ctaLabel: 'Explore Launch & Capital Readiness'
    }
  ];

  const current = stages[activeStageIndex];
  const CurrentIcon = current.icon;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveStageIndex((index + 1) % stages.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveStageIndex((index - 1 + stages.length) % stages.length);
    }
  };

  return (
    <section id="journey" className="py-20 lg:py-28 bg-[#07080a] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
            <span>// 04. HOW WE BUILD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            The Interactive Idea-to-Market Journey.
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            From sketch to factory floor. Explore each sequential stage of hardware execution, expected deliverables, and how Origin Labs supports your progress.
          </p>
        </div>

        {/* 5-Step Tab Navigation Bar */}
        <div
          role="tablist"
          aria-label="Idea-to-market journey stages"
          className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10"
        >
          {stages.map((stage, idx) => {
            const isActive = activeStageIndex === idx;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3.5 sm:p-4 rounded-sm border text-left transition-all relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#12161f] border-[#FF5500] shadow-[0_0_24px_rgba(255,85,0,0.22)]'
                    : 'bg-[#0c0e14] border-white/10 hover:border-white/20 hover:bg-[#10131a]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-mono-code text-xs font-bold ${isActive ? 'text-[#FFA200]' : 'text-white/40'}`}>
                    {stage.number}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFA200]' : 'text-white/40'}`} />
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-white">
                  {stage.name}
                </div>
                {isActive && (
                  <div className="absolute -bottom-[2px] left-2 right-2 h-[2px] bg-gradient-to-r from-[#FFA200] to-[#FF3700]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown Panel */}
        <div className="p-6 sm:p-10 rounded-sm bg-[#0e1117] border border-white/15 relative overflow-hidden shadow-2xl">
          {/* Top Stage Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-sm bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono-code text-[#FFA200] uppercase tracking-wider">
                  STAGE {current.number} // {current.name.toUpperCase()}
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                  {current.tagline}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartStage(current.name, current.categoryLink)}
              className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.35)] shrink-0"
            >
              <span>{current.ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8 max-w-4xl">
            {current.description}
          </p>

          {/* 3 Pillars of the Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Activities */}
            <div className="p-5 rounded bg-black/40 border border-white/10">
              <div className="text-xs font-mono-code text-white/50 uppercase tracking-wider mb-3">
                1. Typical Activities
              </div>
              <ul className="space-y-2.5">
                {current.activities.map((act, i) => (
                  <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500] shrink-0 mt-1.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            <div className="p-5 rounded bg-black/40 border border-white/10">
              <div className="text-xs font-mono-code text-white/50 uppercase tracking-wider mb-3">
                2. Expected Deliverables
              </div>
              <ul className="space-y-2.5">
                {current.deliverables.map((deliv, i) => (
                  <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                    <span className="font-medium text-white">{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Origin Labs Support */}
            <div className="p-5 rounded bg-black/40 border border-white/10">
              <div className="text-xs font-mono-code text-[#FFA200] uppercase tracking-wider mb-3">
                3. Origin Labs Support
              </div>
              <ul className="space-y-2.5">
                {current.originSupport.map((sup, i) => (
                  <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0 mt-1.5" />
                    <span>{sup}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
