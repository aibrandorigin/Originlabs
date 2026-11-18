import React, { useState } from 'react';
import { Shield, Mail, Phone, MapPin, X, ArrowUpRight } from 'lucide-react';
import { SiteContent } from '../api.js';
import { OriginLogo } from './OriginLogo.js';

interface FooterProps {
  content?: SiteContent;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ content, onOpenAdmin, isAdminLoggedIn }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const hasContactInfo = Boolean(
    content?.contactEmail || content?.contactPhone || content?.contactAddress
  );

  const hasSocials = Boolean(
    content?.socialLinks?.linkedin ||
    content?.socialLinks?.twitter ||
    content?.socialLinks?.github ||
    content?.socialLinks?.youtube
  );

  return (
    <footer className="bg-[#050608] border-t border-white/10 text-white/70 py-14 lg:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-12 border-b border-white/10">
          {/* Column 1: Brand & Vision (3 cols) */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start">
            <a href="#" className="inline-flex items-center mb-4 focus:outline-none">
              <OriginLogo
                size="md"
                customLogoUrl={content?.logoUrl}
                customLogoAlt={content?.logoAlt}
                customLogoHeight={content?.logoHeight}
              />
            </a>
            <p className="text-xs text-white/60 leading-relaxed mb-5 max-w-xs">
              An ecosystem where ambitious ideas become useful products, sustainable ventures, and meaningful opportunities—from the first sketch to the factory floor.
            </p>
            <div className="text-[11px] font-mono-code text-[#FF6B00] tracking-wide leading-relaxed">
              Hardware · Robotics · Prototyping · Manufacturing
            </div>
          </div>

          {/* Column 2: Hardware Execution (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <h4 className="text-xs uppercase font-mono-code font-semibold text-white tracking-wider mb-4 leading-none">
              Hardware Execution
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li>
                <a href="#ecosystem" className="hover:text-white transition-colors inline-block">
                  Prototyping &amp; POC
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-white transition-colors inline-block">
                  Robotics &amp; Firmware
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-white transition-colors inline-block">
                  Mechanical &amp; DFMA
                </a>
              </li>
              <li>
                <a href="#journey" className="hover:text-white transition-colors inline-block">
                  Production Scaling
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Venture Capital (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <h4 className="text-xs uppercase font-mono-code font-semibold text-white tracking-wider mb-4 leading-none">
              Venture Capital
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li>
                <a href="#venture-ecosystem" className="hover:text-white transition-colors inline-block">
                  Incubation &amp; PMF
                </a>
              </li>
              <li>
                <a href="#venture-ecosystem" className="hover:text-white transition-colors inline-block">
                  Funding &amp; Diligence
                </a>
              </li>
              <li>
                <a href="#venture-ecosystem" className="hover:text-white transition-colors inline-block">
                  Cohorts &amp; Community
                </a>
              </li>
              <li>
                <a href="#partnerships" className="hover:text-white transition-colors inline-block">
                  Strategic Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Navigation (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <h4 className="text-xs uppercase font-mono-code font-semibold text-white tracking-wider mb-4 leading-none">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-white/65">
              <li>
                <a href="#journey" className="hover:text-white transition-colors inline-block">
                  How We Build
                </a>
              </li>
              <li>
                <a href="#audiences" className="hover:text-white transition-colors inline-block">
                  Who We Help
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-white transition-colors inline-block">
                  Programs &amp; Cohorts
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white transition-colors inline-block">
                  Community &amp; Summits
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect With Us (3 cols) */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-start">
            <h4 className="text-xs uppercase font-mono-code font-semibold text-white tracking-wider mb-4 leading-none">
              Connect With Us
            </h4>

            {hasContactInfo ? (
              <div className="space-y-2.5 text-xs text-white/75 mb-5">
                {content?.contactEmail && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <a href={`mailto:${content.contactEmail}`} className="hover:text-white transition-colors">
                      {content.contactEmail}
                    </a>
                  </div>
                )}
                {content?.contactPhone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span>{content.contactPhone}</span>
                  </div>
                )}
                {content?.contactAddress && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{content.contactAddress}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-white/55 leading-relaxed mb-4">
                Direct engineering inquiries, pilot proposals, and venture applications through our project intake portal.
              </p>
            )}

            <a
              href="#build"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B00] hover:text-[#FFA200] transition-colors"
            >
              <span>Build With Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Configured Social Links */}
            {hasSocials && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {content?.socialLinks?.linkedin && (
                  <a
                    href={content.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs font-mono-code"
                  >
                    LinkedIn
                  </a>
                )}
                {content?.socialLinks?.twitter && (
                  <a
                    href={content.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs font-mono-code"
                  >
                    X / Twitter
                  </a>
                )}
                {content?.socialLinks?.github && (
                  <a
                    href={content.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs font-mono-code"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="text-center sm:text-left leading-none">
            &copy; {new Date().getFullYear()} ORIGIN LABS. Big ideas. Real world. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 leading-none">
            <button
              type="button"
              onClick={() => setModalType('privacy')}
              className="inline-flex items-center hover:text-white transition-colors leading-none"
            >
              Privacy Policy
            </button>
            <span className="text-white/25 select-none" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setModalType('terms')}
              className="inline-flex items-center hover:text-white transition-colors leading-none"
            >
              Terms of Engagement
            </button>
            <span className="text-white/25 select-none" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 hover:text-[#FF5500] transition-colors leading-none ${
                isAdminLoggedIn ? 'text-[#FF5500]' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>{isAdminLoggedIn ? 'Staff Portal (Active)' : 'Admin Access'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12161e] border border-white/20 rounded-sm max-w-lg w-full p-6 sm:p-8 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-sm"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-heading font-bold text-white mb-4">
              {modalType === 'privacy' ? 'Origin Labs Privacy Policy' : 'Terms of Engagement'}
            </h3>

            <div className="space-y-4 text-xs text-white/70 leading-relaxed font-sans">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    At Origin Labs, we recognize that engineering schematics, trade secrets, firmware code, and mechanical designs constitute the core intellectual property of inventors and founders.
                  </p>
                  <p>
                    <strong>Data Collection:</strong> We collect only the information submitted via our forms (name, contact coordinates, technical descriptions) to evaluate project suitability and coordinate manufacturing or incubation services.
                  </p>
                  <p>
                    <strong>Confidentiality:</strong> Origin Labs does not sell, broker, or publicly expose project details. All CAD models and technical files submitted remain the exclusive property of the applicant.
                  </p>
                  <p>
                    <strong>Persistence &amp; Security:</strong> Records are stored in secure backend databases with restricted role-based staff authentication and TLS encryption in transit.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Scope:</strong> Origin Labs operates as an integrated hardware engineering, rapid prototyping, and ecosystem incubation platform.
                  </p>
                  <p>
                    <strong>No Unverified Warranties:</strong> While our engineers use rigorous DFMA standards and precision machinery, physical prototypes are experimental de-risking units. Volume manufacturing tooling sign-offs require formal First Article Inspection (FAI) approval.
                  </p>
                  <p>
                    <strong>No Capital Guarantee:</strong> Origin Labs provides structured diligence preparation, milestone audits, and network introductions. We do not guarantee equity investment, government grant approvals, or commercial venture success.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
