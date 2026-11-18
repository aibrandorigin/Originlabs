import React, { useState } from 'react';
import { Building2, Cpu, Factory, Landmark, Users2, ShieldAlert, ArrowRight, CheckCircle2, Loader2, X } from 'lucide-react';
import { api, PartnershipRecord } from '../api.js';

interface PartnershipsSectionProps {
  approvedPartnerships: PartnershipRecord[];
}

export const PartnershipsSection: React.FC<PartnershipsSectionProps> = ({ approvedPartnerships }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('University & Research');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    message: ''
  });

  const partnerTypes = [
    {
      title: 'Universities & Research Institutions',
      key: 'University & Research',
      icon: Landmark,
      description: 'Lab sharing, translational research commercialization, and joint engineering student placements.'
    },
    {
      title: 'Manufacturers & Fabricators',
      key: 'Manufacturer',
      icon: Factory,
      description: 'Tooling, machining, PCB fabrication, and surface mount assembly partnerships for cohort founders.'
    },
    {
      title: 'Industry & Corporate Partners',
      key: 'Industry Partner',
      icon: Building2,
      description: 'Hardware challenge sponsorship, pilot testing opportunities, and strategic co-development.'
    },
    {
      title: 'Investors & Syndicates',
      key: 'Investor',
      icon: Cpu,
      description: 'Direct pipeline to de-risked hardware and robotics ventures with verified production BOMs.'
    },
    {
      title: 'Technical Mentors',
      key: 'Mentor',
      icon: Users2,
      description: 'Domain experts in robotics kinematics, embedded firmware, RF compliance, and supply chain.'
    },
    {
      title: 'Incubators & Ecosystems',
      key: 'Incubator & Ecosystem',
      icon: ShieldAlert,
      description: 'Cross-incubation pathways, mutual cohort referrals, and joint physical innovation initiatives.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await api.submitPartnership({
        orgName: formData.orgName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        type: selectedType,
        message: formData.message
      });

      setSuccessMsg(res.message);
      setFormData({ orgName: '', contactPerson: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit partnership request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openForType = (typeKey: string) => {
    setSelectedType(typeKey);
    setSuccessMsg(null);
    setErrorMsg(null);
    setModalOpen(true);
  };

  return (
    <section id="partnerships" className="py-20 lg:py-28 bg-[#07080a] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
            <span>// 08. STRATEGIC PARTNERSHIPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Collaborate Across the Hardware Ecosystem.
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            We partner with premier universities, component suppliers, contract manufacturers, and investment syndicates to accelerate physical product commercialization.
          </p>
        </div>

        {/* 6 Partnership Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {partnerTypes.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.key}
                className="p-6 rounded-sm bg-[#0e1117] border border-white/15 hover:border-[#FF5500]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-sm bg-[#FF5500]/10 border border-[#FF5500]/25 text-[#FFA200] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                    {pt.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openForType(pt.key)}
                  className="w-full py-2.5 px-3 rounded-sm bg-white/5 hover:bg-gradient-to-r hover:from-[#FF6B00] hover:to-[#FF3700] text-white font-semibold text-xs uppercase tracking-wider border border-white/15 hover:border-[#FF5500] transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(255,85,0,0.35)]"
                >
                  <span>Explore a Partnership</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Approved Partnerships Display (if any configured by admin) */}
        {approvedPartnerships && approvedPartnerships.length > 0 && (
          <div className="pt-8 border-t border-white/10">
            <div className="text-xs font-mono-code text-white/40 uppercase tracking-wider mb-4">
              Approved Strategic Network:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {approvedPartnerships.map((p) => (
                <div key={p.id} className="p-4 rounded bg-[#0e1117] border border-white/10 text-center">
                  <div className="font-heading font-bold text-sm text-white">{p.orgName}</div>
                  <div className="text-[11px] font-mono-code text-[#FFA200]">{p.type}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Partnership Proposal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0e1117] border border-white/20 rounded-sm max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-mono-code text-[#FFA200] uppercase tracking-wider">
                PARTNERSHIP PROPOSAL // {selectedType}
              </span>
              <h3 className="text-2xl font-heading font-bold text-white mt-1">
                Collaborate with Origin Labs
              </h3>
            </div>

            {successMsg ? (
              <div className="p-6 rounded bg-[#15120f] border border-[#FF5500]/40 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#FF5500] mx-auto" />
                <p className="text-sm text-white/90 leading-relaxed">{successMsg}</p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-sm bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,85,0,0.4)]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded bg-red-950/50 border border-red-500/50 text-red-300 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono-code text-white/70 mb-1">
                    Organization / Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    placeholder="e.g. Precision Robotics Lab"
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white placeholder-white/30 focus:border-[#FF5500] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-code text-white/70 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="e.g. Dr. Alex Mercer"
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white placeholder-white/30 focus:border-[#FF5500] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-white/70 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="partner@organization.edu"
                      className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white placeholder-white/30 focus:border-[#FF5500] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-white/70 mb-1">
                    Partnership Category *
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                  >
                    {partnerTypes.map((pt) => (
                      <option key={pt.key} value={pt.key} className="bg-[#0e1117]">
                        {pt.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-white/70 mb-1">
                    Collaboration Proposal / Focus Area *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe how our ecosystem and your organization can collaborate..."
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white placeholder-white/30 focus:border-[#FF5500] focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded text-xs font-mono-code text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(255,85,0,0.35)]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Proposal</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
