import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield, ChevronRight } from 'lucide-react';
import { OriginLogo } from './OriginLogo.js';
import { SiteContent } from '../api.js';

interface HeaderProps {
  onOpenEnquiry: (category?: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  content?: SiteContent | null;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry, onOpenAdmin, isAdminLoggedIn, content }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Hardware', href: '#ecosystem' },
    { label: 'VENTURE CAPITAL', href: '#venture-ecosystem' },
    { label: 'How We Build', href: '#journey' },
    { label: 'Who We Help', href: '#audiences' },
    { label: 'Programs', href: '#programs' },
    { label: 'Community', href: '#community' },
    { label: 'Partnerships', href: '#partnerships' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at the top in warm solar/ember flame gradient */}
      <div 
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#FFA200] via-[#FF5500] to-[#FF3700] z-50 transition-all duration-75 origin-left shadow-[0_0_8px_rgba(255,85,0,0.6)]"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#07080a]/92 backdrop-blur-md border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.85)] py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Authentic Brand Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#FF5500] rounded-sm p-1"
              aria-label="ORIGIN LABS Home"
            >
              <OriginLogo
                size="md"
                customLogoUrl={content?.logoUrl}
                customLogoAlt={content?.logoAlt}
                customLogoHeight={content?.logoHeight}
                customSubtitle={content?.logoSubtitle}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-white/75 hover:text-white hover:bg-white/5 rounded-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => onOpenEnquiry()}
                className="relative group px-5 py-2 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] hover:from-[#FF7B1A] hover:to-[#FF4700] text-white font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,85,0,0.35)] hover:shadow-[0_0_28px_rgba(255,85,0,0.55)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#07080a] focus:ring-[#FF5500]"
              >
                <span>Build With Us</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenEnquiry()}
                className="px-3 py-1.5 rounded-sm bg-gradient-to-r from-[#FF6B00] to-[#FF3700] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(255,85,0,0.3)]"
              >
                Build
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white/80 hover:text-white bg-white/5 border border-white/10 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF5500]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF5500]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#0c0e13] border-b border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 rounded-sm border-l-2 border-transparent hover:border-[#FF5500]"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-3 rounded-sm bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3700] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.4)]"
              >
                <span>Build With Us</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-sm border border-white/15 bg-white/5 text-white/70 hover:text-white font-mono-code text-xs flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>{isAdminLoggedIn ? 'Admin Portal (Signed In)' : 'Admin & Staff Portal'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
