import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, AlertTriangle, Loader2, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import { api, EnquirySubmission } from '../api.js';

interface EnquiryFormSectionProps {
  initialCategory?: string;
  initialStage?: string;
}

export const EnquiryFormSection: React.FC<EnquiryFormSectionProps> = ({
  initialCategory = 'Prototyping',
  initialStage = 'Idea'
}) => {
  const [formData, setFormData] = useState<EnquirySubmission>({
    fullName: '',
    email: '',
    phone: '',
    orgName: '',
    category: initialCategory,
    currentStage: initialStage,
    projectDescription: '',
    supportNeeded: '',
    preferredContactMethod: 'Email',
    consent: false,
    honeypot: '' // spam bot detector
  });

  useEffect(() => {
    if (initialCategory) {
      setFormData(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialStage) {
      setFormData(prev => ({ ...prev, currentStage: initialStage }));
    }
  }, [initialStage]);

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; fullName: string; category: string } | null>(null);

  const categories = [
    'Prototyping',
    'Robotics and hardware',
    'Mechanical engineering',
    'Contract manufacturing',
    'Incubation',
    'Funding readiness',
    'Cohorts and community',
    'Events',
    'Partnerships',
    'Other'
  ];

  const stages = [
    'Concept & Initial Idea',
    'Early Breadboard / Proof of Concept',
    'Working Functional Prototype',
    'Engineering Validation (EVT / DVT)',
    'Pilot / Low-Volume Production',
    'Mass Production / Factory Scaling',
    'Other / Ecosystem Exploration'
  ];

  const contactMethods = ['Email', 'Phone', 'WhatsApp'];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Full Name is required (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errs.email = 'A valid official email address is required.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      errs.phone = 'Phone number with country code is required (e.g. +1 555-0199).';
    }

    if (!formData.projectDescription.trim() || formData.projectDescription.trim().length < 10) {
      errs.projectDescription = 'Project description must be at least 10 characters.';
    }

    if (!formData.supportNeeded.trim() || formData.supportNeeded.trim().length < 5) {
      errs.supportNeeded = 'Please state the specific support or capabilities needed.';
    }

    if (!formData.consent) {
      errs.consent = 'You must agree to the processing of your enquiry.';
    }

    setClientErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Spam honeypot test
    if (formData.honeypot) {
      console.warn('Spam submission suppressed via honeypot.');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.submitEnquiry(formData);
      if (response.success && response.data) {
        setSubmittedData(response.data);
      } else {
        throw new Error('Server did not confirm enquiry persistence.');
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setServerError(err.message || 'Unable to save enquiry. Please check your network connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setServerError(null);
    setClientErrors({});
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      orgName: '',
      category: initialCategory,
      currentStage: initialStage,
      projectDescription: '',
      supportNeeded: '',
      preferredContactMethod: 'Email',
      consent: false,
      honeypot: ''
    });
  };

  return (
    <section id="build" className="py-20 lg:py-28 bg-[#07080a] border-b border-white/10 relative">
      {/* Background ambient lighting in ember orange */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF5500]/6 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Context & Expectations */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-mono-code text-[#FFA200] mb-4">
                <span>// 09. BUILD WITH US</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                Tell Us What You Are Building.
              </h2>
              <p className="text-base text-white/70 leading-relaxed mb-8">
                Whether you need precision multi-axis CNC prototyping, robotics firmware architecture, DFMA tooling coordination, or founder incubation — our engineering team evaluates every submission directly.
              </p>

              <div className="space-y-4 py-6 border-y border-white/10">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-white/80">
                  <ShieldCheck className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Strict Technical Confidentiality:</strong>
                    Your intellectual property, CAD models, and trade secrets are treated with confidentiality.
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Real Engineering Triage:</strong>
                    Submissions are reviewed by practicing hardware engineers, not generic marketing filters.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded bg-[#0e1117] border border-white/10 text-xs font-mono-code text-white/60">
              <span className="text-[#FFA200] block mb-1">SYSTEM PERSISTENCE:</span>
              Enquiries are securely saved directly into our backend server database. You will receive a unique tracking reference on submission.
            </div>
          </div>

          {/* Right Column: Interactive Form or Success State */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-sm bg-[#0e1117] border border-white/15 relative shadow-2xl">
              {submittedData ? (
                /* Success Screen */
                <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#FF5500]/10 border border-[#FF5500]/40 flex items-center justify-center text-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-mono-code text-[#FFA200] uppercase tracking-wider">
                      CONFIRMED IN DATABASE // SAVED
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
                      Enquiry Received
                    </h3>
                  </div>

                  <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-semibold">{submittedData.fullName}</span>. Your enquiry for <span className="text-[#FFA200] font-semibold">{submittedData.category}</span> has been securely stored in our system.
                  </p>

                  <div className="p-4 rounded bg-black/50 border border-white/10 max-w-xs mx-auto font-mono-code text-xs text-white/70">
                    <div>Reference ID:</div>
                    <div className="text-sm text-[#FFA200] font-bold mt-1 select-all">{submittedData.id}</div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 rounded-sm bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Submit Another Enquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {serverError && (
                    <div className="p-4 rounded bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Submission Error: </strong>
                        {serverError}
                      </div>
                    </div>
                  )}

                  {/* Honeypot hidden input for anti-bot protection */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="hp_field">Ignore this field</label>
                    <input
                      id="hp_field"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot || ''}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Row 1: Full Name & Official Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. David Zhang"
                        className={`w-full px-3.5 py-2.5 bg-black/40 border rounded-sm text-sm text-white placeholder-white/25 focus:outline-none transition-colors ${
                          clientErrors.fullName ? 'border-red-500' : 'border-white/15 focus:border-[#FF5500]'
                        }`}
                      />
                      {clientErrors.fullName && (
                        <p className="text-[11px] text-red-400 mt-1">{clientErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="david@startup.com"
                        className={`w-full px-3.5 py-2.5 bg-black/40 border rounded-sm text-sm text-white placeholder-white/25 focus:outline-none transition-colors ${
                          clientErrors.email ? 'border-red-500' : 'border-white/15 focus:border-[#FF5500]'
                        }`}
                      />
                      {clientErrors.email && (
                        <p className="text-[11px] text-red-400 mt-1">{clientErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone with country code & Organisation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                        Phone with Country Code *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className={`w-full px-3.5 py-2.5 bg-black/40 border rounded-sm text-sm text-white placeholder-white/25 focus:outline-none transition-colors ${
                          clientErrors.phone ? 'border-red-500' : 'border-white/15 focus:border-[#FF5500]'
                        }`}
                      />
                      {clientErrors.phone && (
                        <p className="text-[11px] text-red-400 mt-1">{clientErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                        Organisation or Startup Name <span className="text-white/40">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.orgName || ''}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        placeholder="e.g. Apex Robotics Inc."
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 focus:border-[#FF5500] rounded-sm text-sm text-white placeholder-white/25 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Category & Current Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                        Enquiry Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 focus:border-[#FF5500] rounded-sm text-sm text-white focus:outline-none transition-colors"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c} className="bg-[#0e1117]">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                        Current Stage *
                      </label>
                      <select
                        value={formData.currentStage}
                        onChange={(e) => setFormData({ ...formData, currentStage: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 focus:border-[#FF5500] rounded-sm text-sm text-white focus:outline-none transition-colors"
                      >
                        {stages.map((st) => (
                          <option key={st} value={st} className="bg-[#0e1117]">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                      Project Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      placeholder="Outline what device, robot, or physical product you are engineering..."
                      className={`w-full px-3.5 py-2.5 bg-black/40 border rounded-sm text-sm text-white placeholder-white/25 focus:outline-none transition-colors resize-none ${
                        clientErrors.projectDescription ? 'border-red-500' : 'border-white/15 focus:border-[#FF5500]'
                      }`}
                    />
                    {clientErrors.projectDescription && (
                      <p className="text-[11px] text-red-400 mt-1">{clientErrors.projectDescription}</p>
                    )}
                  </div>

                  {/* Support Needed */}
                  <div>
                    <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                      Specific Support Needed *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.supportNeeded}
                      onChange={(e) => setFormData({ ...formData, supportNeeded: e.target.value })}
                      placeholder="e.g. PCB redesign, 5-axis CNC chassis milling, pilot run of 250 units, incubator cohort..."
                      className={`w-full px-3.5 py-2.5 bg-black/40 border rounded-sm text-sm text-white placeholder-white/25 focus:outline-none transition-colors resize-none ${
                        clientErrors.supportNeeded ? 'border-red-500' : 'border-white/15 focus:border-[#FF5500]'
                      }`}
                    />
                    {clientErrors.supportNeeded && (
                      <p className="text-[11px] text-red-400 mt-1">{clientErrors.supportNeeded}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {contactMethods.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredContactMethod: m })}
                          className={`py-2 px-3 rounded-sm border text-xs font-mono-code transition-all text-center ${
                            formData.preferredContactMethod === m
                              ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white font-semibold border-[#FF5500] shadow-[0_0_10px_rgba(255,85,0,0.3)]'
                              : 'bg-black/30 border-white/10 text-white/70 hover:border-white/30'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 rounded border-white/20 bg-black/40 text-[#FF5500] focus:ring-[#FF5500] focus:ring-offset-0"
                      />
                      <span className="text-xs text-white/70 group-hover:text-white leading-relaxed">
                        I consent to Origin Labs contacting me regarding this project and understand that project information is handled under strict engineering confidentiality. *
                      </span>
                    </label>
                    {clientErrors.consent && (
                      <p className="text-[11px] text-red-400 mt-1">{clientErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(255,85,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving to Persistent Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Engineering Enquiry</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
