import React, { useState } from 'react';
import { Lightbulb, Wrench, Factory, Rocket, HeartHandshake, Building2, ArrowRight, Check } from 'lucide-react';

interface WhoWeHelpSectionProps {
  onSelectAudiencePathway: (category: string, stage: string) => void;
}

export const WhoWeHelpSection: React.FC<WhoWeHelpSectionProps> = ({ onSelectAudiencePathway }) => {
  const [selectedPathway, setSelectedPathway] = useState<number>(0);

  const pathways = [
    {
      id: 'idea',
      title: 'I have an idea',
      category: 'Prototyping',
      stage: 'Idea',
      icon: Lightbulb,
      subtitle: 'From concept sketch to technical feasibility',
      description: 'You have identified a market problem or created an initial concept, but need engineering validation, CAD modeling, and a working proof of concept to demonstrate feasibility.',
      recommendations: [
        'Initial technical scoping and BOM cost feasibility',
        'Rapid physical bench prototype (3D print, CNC, breadboard circuit)',
        'Customer discovery framework to confirm willingness to pay'
      ],
      ctaText: 'Start With Your Idea'
    },
    {
      id: 'prototype',
      title: 'I have a prototype',
      category: 'Robotics and hardware',
      stage: 'Prototype',
      icon: Wrench,
      subtitle: 'From rough POC to production-grade engineering',
      description: 'You have built an early works-like or looks-like prototype, but need professional mechanical redesign, custom PCB layout, sensor integration, and environmental testing.',
      recommendations: [
        'PCB schematic optimization & custom multi-layer board design',
        'Drop, thermal, and electrical durability testing',
        'DFMA (Design for Manufacturing & Assembly) audit'
      ],
      ctaText: 'Refine Your Prototype'
    },
    {
      id: 'mfg',
      title: 'I need manufacturing',
      category: 'Contract manufacturing',
      stage: 'Manufacturing',
      icon: Factory,
      subtitle: 'From single units to pilot and volume batches',
      description: 'You have a validated design and need production tooling, injection mold engineering, supplier contract negotiations, First Article Inspections, and quality control oversight.',
      recommendations: [
        'Tooling design, draft angle review, and mold flow analysis',
        'Vetted supplier matching for mechanical and electrical parts',
        'Quality assurance test jigs & pilot production run oversight'
      ],
      ctaText: 'Request Manufacturing Support'
    },
    {
      id: 'startup',
      title: 'I am building a startup',
      category: 'Incubation',
      stage: 'Validation',
      icon: Rocket,
      subtitle: 'Structured hardware venture incubation & PMF',
      description: 'You are leading a hardware or robotics venture and need cohort accountability, business model validation, operational mentorship, and milestone execution.',
      recommendations: [
        'Structured founder incubation cohorts and weekly peer reviews',
        'Unit economic modeling with verified factory yield rates',
        'Investor data room creation & pitch deck technical reviews'
      ],
      ctaText: 'Apply for Founder Incubation'
    },
    {
      id: 'mentor_invest',
      title: 'I want to mentor or invest',
      category: 'Funding readiness',
      stage: 'Other',
      icon: HeartHandshake,
      subtitle: 'Back high-conviction hardware engineering ventures',
      description: 'You are an angel investor, hardware syndicate lead, venture capital partner, or experienced engineering operator looking to advise and back vetted hardware startups.',
      recommendations: [
        'Early access to cohort showcase summits and demo days',
        'Technical due diligence summaries with audited BOMs',
        'Advisory opportunities with high-potential technical founders'
      ],
      ctaText: 'Connect as Mentor or Investor'
    },
    {
      id: 'partner',
      title: 'I want to partner',
      category: 'Partnerships',
      stage: 'Other',
      icon: Building2,
      subtitle: 'Universities, labs, fabricators, and ecosystem hubs',
      description: 'You represent a research institution, university incubator, precision fabrication facility, or corporate innovation department seeking strategic ecosystem collaboration.',
      recommendations: [
        'Shared laboratory and prototyping facility agreements',
        'Joint hackathons, technical workshops, and cohort recruitment',
        'Supply chain agreements for preferred founder pricing'
      ],
      ctaText: 'Propose an Ecosystem Partnership'
    }
  ];

  const current = pathways[selectedPathway];
  const CurrentIcon = current.icon;

  return (
    <section id="audiences" className="py-20 lg:py-28 bg-[#090b0f] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
            <span>// 05. TAILORED PATHWAYS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Who We Help & How We Engage.
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            Whether you are starting from a notebook sketch, scaling contract manufacturing, or looking to mentor the next generation of physical technology — choose your journey:
          </p>
        </div>

        {/* Pathways Grid & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pathway Buttons */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pathways.map((pathway, idx) => {
              const Icon = pathway.icon;
              const isSelected = selectedPathway === idx;
              return (
                <button
                  key={pathway.id}
                  type="button"
                  onClick={() => setSelectedPathway(idx)}
                  className={`p-4 rounded-sm border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#12161f] border-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.22)] text-white'
                      : 'bg-[#0c0e14] border-white/10 hover:border-white/20 hover:bg-[#101319] text-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-sm ${isSelected ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white shadow-[0_0_10px_rgba(255,85,0,0.35)]' : 'bg-white/5 text-white/70'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white mb-1">
                      {pathway.title}
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2">
                      {pathway.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Pathway Guidance Box */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-sm bg-[#0e1117] border border-white/15 relative overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-sm bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white shadow-[0_0_12px_rgba(255,85,0,0.35)]">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-code text-[#FFA200] uppercase tracking-wider">
                    RECOMMENDED PATHWAY
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-white">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-6">
                {current.description}
              </p>

              <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                <div className="text-xs font-mono-code text-white/50 uppercase tracking-wider">
                  How Origin Labs Engages With You:
                </div>
                {current.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85">
                    <Check className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onSelectAudiencePathway(current.category, current.stage)}
                className="w-full py-3.5 px-4 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.4)]"
              >
                <span>{current.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
