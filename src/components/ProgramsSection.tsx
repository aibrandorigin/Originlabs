import React from 'react';
import { Calendar, Clock, CheckCircle2, ArrowRight, Layers, Bell } from 'lucide-react';
import { ProgramRecord } from '../api.js';

interface ProgramsSectionProps {
  programs: ProgramRecord[];
  onApplyProgram: (programTitle: string, category: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ programs, onApplyProgram }) => {
  return (
    <section id="programs" className="py-20 lg:py-28 bg-[#07080a] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
              <span>// 06. PROGRAMS & COHORTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Structured Acceleration for Physical Tech.
            </h2>
            <p className="text-base text-white/70 mt-4 leading-relaxed">
              Curated founder tracks spanning idea-to-prototype cycles, robotics engineering, founder incubation, and manufacturing readiness.
            </p>
          </div>
          <div className="text-xs font-mono-code text-white/40 border border-white/10 px-3 py-2 rounded-sm bg-white/5 self-start md:self-auto">
            ADMIN MANAGED CURRICULUM
          </div>
        </div>

        {/* Dynamic Rendering: Honest Empty State or Live Programs */}
        {programs.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-sm bg-[#0e1117] border border-white/10 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#FF5500]">
              <Layers className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 text-xs font-mono-code text-[#FFA200] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
              <span>COHORT INTAKE SCHEDULING</span>
            </div>

            <h3 className="text-2xl font-heading font-bold text-white mb-3">
              No Public Cohorts Currently Enrolling
            </h3>

            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed mb-8">
              Origin Labs manages rigorous, specialized intakes across Idea-to-Prototype, Robotics & Hardware, Founder Incubation, and Manufacturing Readiness. Applications for the next scheduled cohort cycle will be published here upon committee sign-off.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onApplyProgram('General Cohort Intake', 'Cohorts and community')}
                className="px-6 py-3 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.35)] w-full sm:w-auto"
              >
                <Bell className="w-4 h-4" />
                <span>Register Interest for Next Intake</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="p-6 rounded-sm bg-[#0e1117] border border-white/15 hover:border-[#FF5500]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded bg-[#FF5500]/10 border border-[#FF5500]/25 text-[10px] font-mono-code text-[#FFA200] uppercase tracking-wider">
                      {program.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-code uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {program.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-white mb-2">
                    {program.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                    {program.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs font-mono-code text-white/60 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FFA200]" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FFA200]" />
                      <span>{program.format}</span>
                    </div>
                  </div>

                  {program.deliverables && program.deliverables.length > 0 && (
                    <div className="mb-6">
                      <div className="text-[11px] font-mono-code text-white/40 uppercase tracking-wider mb-2">
                        Deliverables:
                      </div>
                      <ul className="space-y-1.5">
                        {program.deliverables.map((item, i) => (
                          <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onApplyProgram(program.title, program.category)}
                  className="w-full py-2.5 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_15px_rgba(255,85,0,0.3)]"
                >
                  <span>Apply for Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
