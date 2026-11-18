import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { Marquee } from './components/Marquee.js';
import { VisionSection } from './components/VisionSection.js';
import { EcosystemSection } from './components/EcosystemSection.js';
import { VentureEcosystemSection } from './components/VentureEcosystemSection.js';
import { JourneySection } from './components/JourneySection.js';
import { WhoWeHelpSection } from './components/WhoWeHelpSection.js';
import { ProgramsSection } from './components/ProgramsSection.js';
import { EventsSection } from './components/EventsSection.js';
import { PartnershipsSection } from './components/PartnershipsSection.js';
import { EnquiryFormSection } from './components/EnquiryFormSection.js';
import { Footer } from './components/Footer.js';
import { AdminPortal } from './components/AdminPortal.js';
import { api, authStorage, SiteContent, ProgramRecord, EventRecord, PartnershipRecord, StaffUser } from './api.js';

export default function App() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [programs, setPrograms] = useState<ProgramRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);

  // Form pre-fill coordination
  const [targetCategory, setTargetCategory] = useState<string>('Prototyping');
  const [targetStage, setTargetStage] = useState<string>('Concept & Initial Idea');

  // Load public data on mount
  const loadPublicData = async () => {
    try {
      const [cRes, pRes, eRes, partRes] = await Promise.all([
        api.getContent().catch(() => null),
        api.getPrograms().catch(() => ({ success: true, data: [] })),
        api.getEvents().catch(() => ({ success: true, data: [] })),
        api.getPartnerships().catch(() => ({ success: true, data: [] }))
      ]);

      if (cRes && cRes.data) {
        setContent(cRes.data);
      }
      if (pRes && pRes.data) {
        setPrograms(pRes.data);
      }
      if (eRes && eRes.data) {
        setEvents(eRes.data);
      }
      if (partRes && partRes.data) {
        setPartnerships(partRes.data);
      }
    } catch (err) {
      console.error('Failed to load initial site data:', err);
    }
  };

  // Check auth session
  const checkAuth = async () => {
    const token = authStorage.getToken();
    if (!token) return;

    try {
      const meRes = await api.getMe();
      if (meRes.success && meRes.user) {
        setCurrentUser(meRes.user);
      }
    } catch {
      authStorage.removeToken();
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadPublicData();
    checkAuth();
  }, []);

  const scrollToEnquiry = () => {
    const el = document.getElementById('build');
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleOpenEnquiry = (category?: string, stage?: string) => {
    if (category) setTargetCategory(category);
    if (stage) setTargetStage(stage);
    scrollToEnquiry();
  };

  const handleSelectAudiencePathway = (category: string, stage: string) => {
    setTargetCategory(category);
    setTargetStage(stage);
    scrollToEnquiry();
  };

  const handleStartStage = (_stageName: string, category: string) => {
    setTargetCategory(category);
    scrollToEnquiry();
  };

  const handleApplyProgram = (_programTitle: string, category: string) => {
    setTargetCategory(category || 'Cohorts and community');
    scrollToEnquiry();
  };

  const handleProposeEvent = () => {
    setTargetCategory('Events');
    scrollToEnquiry();
  };

  const handleAuthSuccess = (user: StaffUser) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#e2e8f0] flex flex-col selection:bg-[#ff5500] selection:text-white">
      {/* Navigation Header */}
      <Header
        onOpenEnquiry={(cat) => handleOpenEnquiry(cat)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        isAdminLoggedIn={Boolean(currentUser)}
        content={content}
      />

      <main className="flex-1" id="main-content">
        {/* 1. Hero */}
        <Hero
          headline={content?.heroHeadline}
          supporting={content?.heroSupporting}
          onOpenEnquiry={(cat) => handleOpenEnquiry(cat)}
        />

        {/* 2. Marquee */}
        <Marquee items={content?.marqueeItems} />

        {/* 3. Vision & Connectivity */}
        <VisionSection
          headline={content?.visionHeadline}
          description={content?.visionDescription}
        />

        {/* 4. Hardware Execution (Pillars A, B, C) */}
        <EcosystemSection
          onSelectCategory={(cat) => handleOpenEnquiry(cat)}
        />

        {/* 5. Venture Incubation, Capital & Community (Pillars D, E, F as Separate Contents) */}
        <VentureEcosystemSection
          onSelectCategory={(cat) => handleOpenEnquiry(cat)}
        />

        {/* 6. How We Build: Interactive Journey */}
        <JourneySection
          onStartStage={handleStartStage}
        />

        {/* 7. Who We Help: Tailored Pathways */}
        <WhoWeHelpSection
          onSelectAudiencePathway={handleSelectAudiencePathway}
        />

        {/* 8. Programs & Cohorts */}
        <ProgramsSection
          programs={programs}
          onApplyProgram={handleApplyProgram}
        />

        {/* 9. Community, Summits & Events */}
        <EventsSection
          events={events}
          onProposeEvent={handleProposeEvent}
        />

        {/* 10. Strategic Partnerships */}
        <PartnershipsSection
          approvedPartnerships={partnerships}
        />

        {/* 11. Build With Us: Persistent Enquiry Form */}
        <EnquiryFormSection
          initialCategory={targetCategory}
          initialStage={targetStage}
        />
      </main>

      {/* Footer */}
      <Footer
        content={content || undefined}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        isAdminLoggedIn={Boolean(currentUser)}
      />

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onContentUpdated={() => {
          loadPublicData();
        }}
      />
    </div>
  );
}
