import React, { useRef } from 'react';
import { ArrowUpRight, ChevronDown, Cpu, Activity, Layers } from 'lucide-react';
import { MachineryAnimation } from './MachineryAnimation.js';

interface HeroProps {
  headline?: string;
  supporting?: string;
  onOpenEnquiry: (category?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  headline = 'Big ideas.\nReal world.',
  supporting = 'From the first sketch to the factory floor. We bring people, engineering and opportunity together to build what comes next.',
  onOpenEnquiry
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToEcosystem = () => {
    const el = document.getElementById('ecosystem');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-grid-pattern border-b border-white/10"
      aria-label="Origin Labs Introduction"
    >
      {/* Ambient Fiery Solar Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#FF5500]/8 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-[#FFA200]/6 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2.5 mb-6 text-xs font-mono-code uppercase tracking-wider text-white/80">
              <span className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_8px_#FF5500]" />
              <span>Integrated Hardware & Prototyping Ecosystem</span>
              <span className="text-white/30" aria-hidden="true">·</span>
              <span className="text-[#FFA200] hidden sm:inline">Real-World Deployment</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6">
              {headline.split('\n').map((line, idx) => (
                <span key={idx} className="block">
                  {idx === 1 ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFA200] to-[#FF4D00]">
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-[#cbd5e1] max-w-2xl leading-relaxed mb-8 font-normal">
              {supporting}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={() => onOpenEnquiry()}
                className="group px-7 py-3.5 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-sm uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,85,0,0.4)] hover:shadow-[0_0_35px_rgba(255,85,0,0.6)] focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
              >
                <span>Build With Us</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToEcosystem}
                className="px-6 py-3.5 rounded-sm bg-white/5 hover:bg-white/10 text-white font-semibold text-sm uppercase tracking-wider border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <span>Explore the Ecosystem</span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Capabilities Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5 text-white/70">
                <Cpu className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="text-xs font-mono-code">Robotics & Firmware</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/70">
                <Layers className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="text-xs font-mono-code">Rapid Prototyping</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/70 col-span-2 sm:col-span-1">
                <Activity className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span className="text-xs font-mono-code">Contract Manufacturing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Precision Machinery Animation */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <MachineryAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
