import React from 'react';

interface MarqueeProps {
  items?: string[];
}

export const Marquee: React.FC<MarqueeProps> = ({ items }) => {
  const defaultItems = [
    'RAPID PROTOTYPING',
    'ROBOTICS & EMBEDDED SYSTEMS',
    'MECHANICAL DESIGN & CAD',
    'DFMA & PILOT PRODUCTION',
    'BULK CONTRACT MANUFACTURING',
    'FOUNDER INCUBATION',
    'INVESTOR READINESS',
    'SUPPLIER COORDINATION',
    'FIRMWARE & SENSORS',
    'HARDWARE COHORTS & SUMMITS'
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;
  // Double list for continuous seamless loop
  const repeatedItems = [...displayItems, ...displayItems];

  return (
    <div
      className="relative w-full py-4 bg-[#0a0c10] border-y border-white/10 overflow-hidden select-none"
      aria-label="Capabilities Marquee"
    >
      {/* Edge gradient fades for smooth loop transition */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07080a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07080a] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center">
        {repeatedItems.map((item, index) => (
          <div key={index} className="flex items-center gap-6 px-4 shrink-0">
            <span className="font-heading text-xs sm:text-sm font-bold tracking-widest text-white/80 hover:text-[#FFA200] transition-colors uppercase whitespace-nowrap">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500] shrink-0" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
};
