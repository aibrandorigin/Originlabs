import React from 'react';
import { Calendar, MapPin, ExternalLink, Users, Sparkles, Clock, Globe } from 'lucide-react';
import { EventRecord } from '../api.js';

interface EventsSectionProps {
  events: EventRecord[];
  onProposeEvent: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, onProposeEvent }) => {
  return (
    <section id="community" className="py-20 lg:py-28 bg-[#090b0f] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
              <span>// 07. COMMUNITY & SUMMITS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Where Hardware Builders Gather.
            </h2>
            <p className="text-base text-white/70 mt-4 leading-relaxed">
              Physical engineering thrives on peer teardowns, hands-on masterclasses, and high-trust ecosystem summits connecting innovators, manufacturers, and mentors.
            </p>
          </div>
          <button
            type="button"
            onClick={onProposeEvent}
            className="px-4 py-2 rounded-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono-code flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFA200]" />
            <span>Propose Event Partnership</span>
          </button>
        </div>

        {/* Dynamic Display */}
        {events.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-sm bg-[#0e1117] border border-white/10 text-center max-w-3xl mx-auto shadow-2xl relative">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#FF5500]">
              <Users className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF5500]/10 border border-[#FF5500]/25 text-xs font-mono-code text-[#FFA200] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
              <span>SCHEDULE STATUS: FINALIZING DATES</span>
            </div>

            <h3 className="text-2xl font-heading font-bold text-white mb-3">
              No Public Events Scheduled At This Time
            </h3>

            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed mb-8">
              Origin Labs convenes invite-only teardowns, technical masterclasses, and hardware summits. Dates and speaker schedules for the upcoming quarter will be published here upon confirmation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onProposeEvent}
                className="px-6 py-3 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.35)] w-full sm:w-auto"
              >
                <span>Propose a Technical Workshop or Summit</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => {
              const formattedDate = new Date(evt.dateTime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const formattedTime = new Date(evt.dateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={evt.id}
                  className="rounded-sm bg-[#0e1117] border border-white/15 hover:border-[#FF5500]/60 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {evt.bannerUrl && (
                    <div className="h-40 w-full overflow-hidden bg-black/40">
                      <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded bg-[#FF5500]/10 border border-[#FF5500]/25 text-[10px] font-mono-code text-[#FFA200] uppercase tracking-wider">
                        {evt.category}
                      </span>
                      <span className="text-[11px] font-mono-code text-white/50">
                        {evt.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-white mb-2">
                      {evt.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6 flex-1">
                      {evt.description}
                    </p>

                    <div className="space-y-2 py-3 border-t border-white/10 text-xs font-mono-code text-white/60 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#FFA200]" />
                        <span>{formattedDate} at {formattedTime} ({evt.timezone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {evt.isOnline ? (
                          <Globe className="w-3.5 h-3.5 text-[#FFA200]" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#FFA200]" />
                        )}
                        <span className="truncate">{evt.venueOrLink || (evt.isOnline ? 'Online Session' : 'Origin Labs Facility')}</span>
                      </div>
                    </div>

                    {evt.registrationUrl ? (
                      <a
                        href={evt.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,85,0,0.3)]"
                      >
                        <span>Register for Event</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="text-center py-2 text-xs font-mono-code text-white/40 border border-white/10 rounded">
                        Registration Opening Soon
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
