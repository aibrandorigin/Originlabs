import { OriginEmblem, OriginLogo } from './OriginLogo.js';
import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  LayoutDashboard,
  Inbox,
  FileText,
  Calendar,
  Layers,
  Building2,
  Users,
  Settings,
  ShieldAlert,
  Search,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  Code,
  Check,
  Globe,
  Sliders,
  Database
} from 'lucide-react';
import {
  api,
  authStorage,
  StaffUser,
  DashboardMetrics,
  EnquiryRecord,
  ProgramRecord,
  EventRecord,
  PartnershipRecord,
  SiteContent
} from '../api.js';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StaffUser | null;
  onAuthSuccess: (user: StaffUser) => void;
  onLogout: () => void;
  onContentUpdated: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  onContentUpdated
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'enquiries' | 'content' | 'programs' | 'events' | 'partnerships' | 'staff' | 'logs'
  >('dashboard');

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');
  const [enquiryCategoryFilter, setEnquiryCategoryFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Programs & Events & Partnerships
  const [programs, setPrograms] = useState<ProgramRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Site Content Form state
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSuccess, setContentSuccess] = useState<string | null>(null);
  const [logoPreviewBg, setLogoPreviewBg] = useState<'dark' | 'surface' | 'light' | 'checker'>('dark');
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [logoSourceTab, setLogoSourceTab] = useState<'upload' | 'url' | 'svg' | 'presets'>('upload');
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoSuccess, setLogoSuccess] = useState<string | null>(null);
  const [rawSvgInput, setRawSvgInput] = useState('');
  const [showNavMock, setShowNavMock] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Program creation modal/drawer state
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<ProgramRecord> | null>(null);

  // Event creation modal/drawer state
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<EventRecord> | null>(null);

  // Staff creation state
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({ name: '', email: '', password: '', role: 'Content Editor' });

  // Status message
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setActionError(null);
    setActionSuccess(null);
  };

  // Load data when authenticated
  useEffect(() => {
    if (currentUser) {
      loadDashboard();
      loadEnquiries();
      loadSiteContent();
      loadPrograms();
      loadEvents();
      loadPartnerships();
      if (currentUser.role === 'Admin') {
        loadStaff();
        loadAuditLogs();
      }
    }
  }, [currentUser]);

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboardMetrics();
      setMetrics(res.data);
    } catch (err: any) {
      console.error('Failed to load metrics:', err);
    }
  };

  const loadEnquiries = async () => {
    try {
      const res = await api.getEnquiries({
        search: enquirySearch,
        status: enquiryStatusFilter,
        category: enquiryCategoryFilter
      });
      setEnquiries(res.data);
      if (selectedEnquiry) {
        const refreshed = res.data.find(e => e.id === selectedEnquiry.id);
        if (refreshed) setSelectedEnquiry(refreshed);
      }
    } catch (err: any) {
      console.error('Failed to load enquiries:', err);
    }
  };

  const loadSiteContent = async () => {
    try {
      const res = await api.getAdminContent();
      setSiteContent(res.data);
    } catch (err) {
      console.error('Failed to load content:', err);
    }
  };

  const loadPrograms = async () => {
    try {
      const res = await api.getAdminPrograms();
      setPrograms(res.data);
    } catch (err) {
      console.error('Failed to load programs:', err);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await api.getAdminEvents();
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const loadPartnerships = async () => {
    try {
      const res = await api.getAdminPartnerships();
      setPartnerships(res.data);
    } catch (err) {
      console.error('Failed to load partnerships:', err);
    }
  };

  const loadStaff = async () => {
    try {
      const res = await api.getStaff();
      setStaffList(res.data);
    } catch (err) {
      console.error('Failed to load staff:', err);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      setAuditLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      authStorage.setToken(res.token);
      onAuthSuccess(res.user);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    clearMessages();
    try {
      const res = await api.updateEnquiry(id, { status });
      setActionSuccess(`Enquiry #${id} marked as ${status}`);
      loadEnquiries();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAssignOwner = async (id: string, assignedTo: string) => {
    clearMessages();
    try {
      await api.updateEnquiry(id, { assignedTo });
      setActionSuccess(`Assigned to ${assignedTo || 'Unassigned'}`);
      loadEnquiries();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleAddNote = async (id: string) => {
    if (!newNoteText.trim()) return;
    clearMessages();
    try {
      await api.addEnquiryNote(id, newNoteText);
      setNewNoteText('');
      setActionSuccess('Note added.');
      loadEnquiries();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm(`Delete enquiry #${id}?`)) return;
    clearMessages();
    try {
      await api.deleteEnquiry(id);
      setSelectedEnquiry(null);
      setActionSuccess('Enquiry deleted.');
      loadEnquiries();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteContent) return;
    setContentSaving(true);
    setContentSuccess(null);
    clearMessages();

    try {
      const res = await api.updateAdminContent(siteContent);
      setContentSuccess(res.message || 'Content updated successfully.');
      onContentUpdated();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setContentSaving(false);
    }
  };

  const handleSaveLogoToDatabase = async () => {
    if (!siteContent) return;
    setLogoSaving(true);
    setLogoUploadError(null);
    setLogoSuccess(null);
    try {
      const res = await api.updateLogo({
        logoUrl: siteContent.logoUrl || '',
        logoAlt: siteContent.logoAlt || 'Origin Labs',
        logoHeight: siteContent.logoHeight || 36,
        logoSubtitle: siteContent.logoSubtitle || ''
      });
      if (res && res.data) {
        setSiteContent(res.data);
      }
      setLogoSuccess('Logo successfully saved in Firestore database and synced live across the entire website!');
      onContentUpdated();
      loadDashboard();
      setTimeout(() => setLogoSuccess(null), 5000);
    } catch (err: any) {
      setLogoUploadError(err.message || 'Failed to save logo to database');
    } finally {
      setLogoSaving(false);
    }
  };

  const processImageFile = (file: File) => {
    setLogoUploadError(null);
    setLogoSuccess(null);

    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please select a valid image file (PNG, SVG, JPG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setLogoUploadError('Logo file size is too large (maximum 4MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && siteContent) {
        setSiteContent({
          ...siteContent,
          logoUrl: dataUrl,
          logoAlt: siteContent.logoAlt || file.name.replace(/\.[^/.]+$/, '')
        });
      }
    };
    reader.onerror = () => {
      setLogoUploadError('Failed to read image file. Please try again or use an image URL.');
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleApplySvgCode = (svgCode: string) => {
    if (!siteContent) return;
    setLogoUploadError(null);
    const trimmed = svgCode.trim();
    if (!trimmed.startsWith('<svg') || !trimmed.endsWith('</svg>')) {
      setLogoUploadError('Invalid SVG code. Markup must begin with <svg and end with </svg>');
      return;
    }
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(trimmed)}`;
    setSiteContent({
      ...siteContent,
      logoUrl: dataUri
    });
    setLogoSuccess('Vector SVG applied to canvas! Click "Save Logo to Database" to commit.');
  };

  const handleApplyPreset = (presetType: 'official' | 'gold' | 'monochrome' | 'flame' | 'badge') => {
    if (!siteContent) return;
    setLogoUploadError(null);
    setLogoSuccess(null);

    if (presetType === 'official') {
      setSiteContent({
        ...siteContent,
        logoUrl: '',
        logoAlt: 'Origin Labs',
        logoHeight: 36,
        logoSubtitle: 'Hardware • Robotics • Prototyping'
      });
      setLogoSuccess('Preset applied: Official Origin Labs Logo (Fiery Solar Aperture + Wordmark)');
    } else if (presetType === 'gold') {
      const goldSvg = `<svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFE066"/><stop offset="50%" stop-color="#FFAA00"/><stop offset="100%" stop-color="#E66A00"/></linearGradient></defs><g transform="translate(10, 10)"><path d="M 30 6 A 24 24 0 1 1 9.1 41.2 L 16.4 36.4 A 13 13 0 1 0 30 17 A 13 13 0 0 0 18.9 36.6 L 7.8 38.6 A 24 24 0 0 1 30 6 Z" fill="url(#gold)"/><circle cx="30" cy="30" r="24" stroke="url(#gold)" stroke-width="1" stroke-opacity="0.4" fill="none"/></g><text x="75" y="38" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="0.1em">RIGIN</text><text x="76" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#FFAA00" letter-spacing="0.45em">L A B S</text></svg>`;
      setSiteContent({
        ...siteContent,
        logoUrl: `data:image/svg+xml;utf8,${encodeURIComponent(goldSvg)}`,
        logoAlt: 'Origin Labs Gold Radiant'
      });
      setLogoSuccess('Preset applied: Gold Radiant Solar Edition');
    } else if (presetType === 'monochrome') {
      const monoSvg = `<svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg"><g transform="translate(10, 10)"><path d="M 30 6 A 24 24 0 1 1 9.1 41.2 L 16.4 36.4 A 13 13 0 1 0 30 17 A 13 13 0 0 0 18.9 36.6 L 7.8 38.6 A 24 24 0 0 1 30 6 Z" fill="#FFFFFF"/><circle cx="30" cy="30" r="24" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.3" fill="none"/></g><text x="75" y="38" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="0.1em">RIGIN</text><text x="76" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#FFFFFF" opacity="0.9" letter-spacing="0.45em">L A B S</text></svg>`;
      setSiteContent({
        ...siteContent,
        logoUrl: `data:image/svg+xml;utf8,${encodeURIComponent(monoSvg)}`,
        logoAlt: 'Origin Labs Monochrome White'
      });
      setLogoSuccess('Preset applied: Pure High-Contrast White Vector');
    } else if (presetType === 'flame') {
      const flameSvg = `<svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="flame" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFDD00"/><stop offset="35%" stop-color="#FF5500"/><stop offset="80%" stop-color="#FF1100"/><stop offset="100%" stop-color="#CC0033"/></linearGradient></defs><g transform="translate(10, 10)"><path d="M 30 6 A 24 24 0 1 1 9.1 41.2 L 16.4 36.4 A 13 13 0 1 0 30 17 A 13 13 0 0 0 18.9 36.6 L 7.8 38.6 A 24 24 0 0 1 30 6 Z" fill="url(#flame)"/><circle cx="30" cy="30" r="24" stroke="url(#flame)" stroke-width="1.2" stroke-opacity="0.5" fill="none"/></g><text x="75" y="38" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="0.1em">RIGIN</text><text x="76" y="52" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#FF5500" letter-spacing="0.45em">L A B S</text></svg>`;
      setSiteContent({
        ...siteContent,
        logoUrl: `data:image/svg+xml;utf8,${encodeURIComponent(flameSvg)}`,
        logoAlt: 'Origin Labs Flame Core'
      });
      setLogoSuccess('Preset applied: Flame Core Neon Edition');
    } else if (presetType === 'badge') {
      const badgeSvg = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="badgeGrad" x1="15%" y1="0%" x2="85%" y2="100%"><stop offset="0%" stop-color="#FFA600"/><stop offset="40%" stop-color="#FF7A00"/><stop offset="80%" stop-color="#FF4D00"/><stop offset="100%" stop-color="#FF2600"/></linearGradient></defs><g transform="translate(10, 10)"><path d="M 30 6 A 24 24 0 1 1 9.1 41.2 L 16.4 36.4 A 13 13 0 1 0 30 17 A 13 13 0 0 0 18.9 36.6 L 7.8 38.6 A 24 24 0 0 1 30 6 Z" fill="url(#badgeGrad)"/><path d="M 6 34 C 9 32, 14 31, 19 36 L 22 34 C 16 28, 9 29, 6 34 Z" fill="white" opacity="0.95"/><circle cx="30" cy="30" r="24" stroke="url(#badgeGrad)" stroke-width="1" stroke-opacity="0.4" fill="none"/></g></svg>`;
      setSiteContent({
        ...siteContent,
        logoUrl: `data:image/svg+xml;utf8,${encodeURIComponent(badgeSvg)}`,
        logoAlt: 'Origin Labs Aperture Badge Solo'
      });
      setLogoSuccess('Preset applied: Aperture Badge Solo (Compact Emblem)');
    }
  };

  const handleResetLogo = async (saveImmediately = false) => {
    if (!siteContent) return;
    setLogoUploadError(null);
    setLogoSuccess(null);
    const updated = {
      ...siteContent,
      logoUrl: '',
      logoAlt: 'Origin Labs',
      logoHeight: 36,
      logoSubtitle: 'Hardware • Robotics • Prototyping'
    };
    setSiteContent(updated);
    setRawSvgInput('');

    if (saveImmediately) {
      setLogoSaving(true);
      try {
        await api.updateLogo({
          logoUrl: '',
          logoAlt: 'Origin Labs',
          logoHeight: 36,
          logoSubtitle: 'Hardware • Robotics • Prototyping'
        });
        setLogoSuccess('Reset to Official Origin Labs Logo and saved in database!');
        onContentUpdated();
        loadDashboard();
        setTimeout(() => setLogoSuccess(null), 4000);
      } catch (err: any) {
        setLogoUploadError(err.message || 'Failed to reset logo in database');
      } finally {
        setLogoSaving(false);
      }
    }
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProgram) return;
    clearMessages();

    try {
      if (editingProgram.id) {
        await api.updateProgram(editingProgram.id, editingProgram);
        setActionSuccess('Program updated.');
      } else {
        await api.createProgram(editingProgram);
        setActionSuccess('Program created.');
      }
      setProgramModalOpen(false);
      setEditingProgram(null);
      loadPrograms();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!window.confirm('Delete this program?')) return;
    clearMessages();
    try {
      await api.deleteProgram(id);
      setActionSuccess('Program deleted.');
      loadPrograms();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    clearMessages();

    try {
      if (editingEvent.id) {
        await api.updateEvent(editingEvent.id, editingEvent);
        setActionSuccess('Event updated.');
      } else {
        await api.createEvent(editingEvent);
        setActionSuccess('Event scheduled.');
      }
      setEventModalOpen(false);
      setEditingEvent(null);
      loadEvents();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    clearMessages();
    try {
      await api.deleteEvent(id);
      setActionSuccess('Event deleted.');
      loadEvents();
      loadDashboard();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleTogglePartnershipPublic = async (
    id: string,
    isPublic: boolean,
    status: 'review' | 'approved' | 'active' | 'archived'
  ) => {
    clearMessages();
    try {
      await api.updatePartnership(id, { isPublic, status });
      setActionSuccess('Partnership updated.');
      loadPartnerships();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    try {
      await api.createStaff(newStaffData);
      setNewStaffModalOpen(false);
      setNewStaffData({ name: '', email: '', password: '', role: 'Content Editor' });
      setActionSuccess('Staff account created.');
      loadStaff();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Remove this staff account?')) return;
    clearMessages();
    try {
      await api.deleteStaff(id);
      setActionSuccess('Staff account removed.');
      loadStaff();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0e1116] border border-white/20 rounded-md w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-[#12151b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center">
              <OriginEmblem size={28} />
            </div>
            <div>
              <span className="font-heading font-bold text-white text-base">ORIGIN LABS // PORTAL</span>
              <span className="text-[10px] font-mono-code text-white/50 block sm:inline sm:ml-2">
                Unified Ecosystem Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-3 pr-3 border-r border-white/10">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                  <div className="text-[10px] font-mono-code text-[#FFA200] uppercase">
                    Role: {currentUser.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close Admin Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notifications inside Admin */}
        {actionSuccess && (
          <div className="px-6 py-2 bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccess}</span>
            </div>
            <button type="button" onClick={() => setActionSuccess(null)} className="text-emerald-400 font-bold">×</button>
          </div>
        )}
        {actionError && (
          <div className="px-6 py-2 bg-red-950/60 border-b border-red-500/30 text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{actionError}</span>
            </div>
            <button type="button" onClick={() => setActionError(null)} className="text-red-400 font-bold">×</button>
          </div>
        )}

        {/* Main Body */}
        {!currentUser ? (
          /* Sign-in Screen */
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="max-w-md w-full p-8 rounded-sm bg-[#12161f] border border-white/15 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FFA200] mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-heading font-bold text-white">Staff Authentication</h2>
                <p className="text-xs text-white/60 mt-1 font-mono-code">
                  Restricted to authorized Origin Labs engineers and managers
                </p>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded bg-red-950/40 border border-red-500/40 text-red-200 text-xs">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-code text-white/70 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@originlabs.tech"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white placeholder:text-white/25 focus:border-[#FF5500] focus:outline-none font-mono-code"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-white/70 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-sm text-white placeholder:text-white/25 focus:border-[#FF5500] focus:outline-none font-mono-code"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 rounded-sm bg-[#FF5500] hover:bg-[#FF6B1A] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Portal</span>}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#101318] border-r border-white/10 p-3 space-y-1 shrink-0 overflow-y-auto">
              <button
                type="button"
                onClick={() => { setActiveTab('dashboard'); setSelectedEnquiry(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'dashboard' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('enquiries'); loadEnquiries(); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'enquiries' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Enquiries</span>
                </div>
                {metrics && metrics.metrics.newEnquiries > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-code bg-red-500 text-white font-bold">
                    {metrics.metrics.newEnquiries}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('content'); setSelectedEnquiry(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'content' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Website Content</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('programs'); setSelectedEnquiry(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'programs' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Programs & Cohorts</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('events'); setSelectedEnquiry(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'events' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Events & Summits</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('partnerships'); setSelectedEnquiry(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === 'partnerships' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Partnerships</span>
              </button>

              {currentUser.role === 'Admin' && (
                <>
                  <div className="pt-3 border-t border-white/10 text-[10px] font-mono-code text-white/40 px-3 uppercase tracking-wider">
                    Admin Tools
                  </div>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('staff'); setSelectedEnquiry(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === 'staff' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Staff & Access</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('logs'); setSelectedEnquiry(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                      activeTab === 'logs' ? 'bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Audit Trail</span>
                  </button>
                </>
              )}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#0b0e13]">
              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && metrics && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white">System Dashboard</h2>
                    <p className="text-xs text-white/60 font-mono-code mt-0.5">
                      Real-time database records and operational metrics
                    </p>
                  </div>

                  {/* Top Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded bg-[#12151b] border border-white/10">
                      <div className="text-xs font-mono-code text-white/50 uppercase">Total Enquiries</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">{metrics.metrics.totalEnquiries}</div>
                      <div className="text-[11px] font-mono-code text-[#FFA200] mt-1">{metrics.metrics.newEnquiries} New / Unreviewed</div>
                    </div>
                    <div className="p-4 rounded bg-[#12151b] border border-white/10">
                      <div className="text-xs font-mono-code text-white/50 uppercase">In Review / Progress</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">
                        {metrics.metrics.inReviewEnquiries + metrics.metrics.inProgressEnquiries}
                      </div>
                      <div className="text-[11px] font-mono-code text-white/50 mt-1">Active Engineering Pipeline</div>
                    </div>
                    <div className="p-4 rounded bg-[#12151b] border border-white/10">
                      <div className="text-xs font-mono-code text-white/50 uppercase">Configured Programs</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">{metrics.metrics.totalPrograms}</div>
                      <div className="text-[11px] font-mono-code text-emerald-400 mt-1">{metrics.metrics.activePrograms} Active Cohorts</div>
                    </div>
                    <div className="p-4 rounded bg-[#12151b] border border-white/10">
                      <div className="text-xs font-mono-code text-white/50 uppercase">Partnership Proposals</div>
                      <div className="text-3xl font-heading font-bold text-white mt-1">{metrics.metrics.partnershipRequests}</div>
                      <div className="text-[11px] font-mono-code text-white/50 mt-1">Universities & Fabricators</div>
                    </div>
                  </div>

                  {/* Status Breakdown & Category Distribution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded bg-[#12151b] border border-white/10">
                      <h3 className="font-heading font-bold text-sm text-white mb-4">Pipeline by Status</h3>
                      <div className="space-y-2">
                        {Object.entries(metrics.countsByStatus).map(([st, cnt]) => (
                          <div key={st} className="flex items-center justify-between text-xs p-2 rounded bg-black/40">
                            <span className="text-white/80">{st}</span>
                            <span className="font-mono-code font-bold text-[#FFA200]">{cnt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded bg-[#12151b] border border-white/10">
                      <h3 className="font-heading font-bold text-sm text-white mb-4">Enquiries by Category</h3>
                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {Object.entries(metrics.countsByCategory).length === 0 ? (
                          <div className="text-xs text-white/40 italic py-4">No enquiries recorded yet.</div>
                        ) : (
                          Object.entries(metrics.countsByCategory).map(([cat, cnt]) => (
                            <div key={cat} className="flex items-center justify-between text-xs p-2 rounded bg-black/40">
                              <span className="text-white/80 truncate mr-2">{cat}</span>
                              <span className="font-mono-code font-bold text-[#FFA200]">{cnt}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Table */}
                  <div className="p-5 rounded bg-[#12151b] border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-bold text-sm text-white">Recent Enquiries</h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('enquiries')}
                        className="text-xs font-mono-code text-[#FFA200] hover:underline"
                      >
                        View All Enquiries →
                      </button>
                    </div>

                    {metrics.recentEnquiries.length === 0 ? (
                      <div className="text-xs text-white/40 italic py-4">No enquiries received yet.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-white/80">
                          <thead>
                            <tr className="border-b border-white/10 text-white/40 font-mono-code uppercase text-[10px]">
                              <th className="py-2">Name</th>
                              <th className="py-2">Category</th>
                              <th className="py-2">Stage</th>
                              <th className="py-2">Status</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics.recentEnquiries.map((e) => (
                              <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-2.5 font-semibold text-white">{e.fullName}</td>
                                <td className="py-2.5">{e.category}</td>
                                <td className="py-2.5 text-white/60">{e.currentStage}</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-white/10 text-[#FFA200]">
                                    {e.status}
                                  </span>
                                </td>
                                <td className="py-2.5 text-white/40 font-mono-code text-[11px]">
                                  {new Date(e.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-white">Enquiry Management</h2>
                      <p className="text-xs text-white/60 font-mono-code">
                        Review submissions, assign owners, append technical notes, update lifecycle status
                      </p>
                    </div>
                    <a
                      href="/api/admin/enquiries/export"
                      download
                      className="px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-mono-code flex items-center gap-2 self-start transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#FFA200]" />
                      <span>Export CSV</span>
                    </a>
                  </div>

                  {/* Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
                      <input
                        type="text"
                        placeholder="Search by name, email, keyword..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        onKeyUp={(e) => { if (e.key === 'Enter') loadEnquiries(); }}
                        className="w-full pl-9 pr-3 py-2 bg-[#12151b] border border-white/15 rounded text-xs text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>

                    <select
                      value={enquiryStatusFilter}
                      onChange={(e) => { setEnquiryStatusFilter(e.target.value); }}
                      className="px-3 py-2 bg-[#12151b] border border-white/15 rounded text-xs text-white focus:border-[#FF5500] focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button
                      type="button"
                      onClick={loadEnquiries}
                      className="px-4 py-2 rounded bg-[#FF5500] hover:bg-[#FF6B1A] text-black text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Filters
                    </button>
                  </div>

                  {/* Split View: List on left, Detail on right */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-5 space-y-2">
                      <div className="text-xs font-mono-code text-white/50 px-1">
                        Found {enquiries.length} enquiry record(s):
                      </div>
                      {enquiries.length === 0 ? (
                        <div className="p-8 text-center bg-[#12151b] border border-white/10 rounded text-xs text-white/40 italic">
                          No matching enquiries found.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                          {enquiries.map((e) => {
                            const isSelected = selectedEnquiry?.id === e.id;
                            return (
                              <button
                                key={e.id}
                                type="button"
                                onClick={() => setSelectedEnquiry(e)}
                                className={`w-full text-left p-3.5 rounded border transition-all ${
                                  isSelected
                                    ? 'bg-[#181d26] border-[#FF5500] text-white shadow-md'
                                    : 'bg-[#12151b] border-white/10 hover:border-white/20 text-white/80'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-heading font-bold text-sm text-white truncate max-w-[180px]">
                                    {e.fullName}
                                  </span>
                                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-white/10 text-[#FFA200]">
                                    {e.status}
                                  </span>
                                </div>
                                <div className="text-xs text-white/60 truncate mb-1">
                                  {e.category} • {e.currentStage}
                                </div>
                                <div className="text-[10px] font-mono-code text-white/40">
                                  {new Date(e.createdAt).toLocaleString()}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Enquiry Detail Inspector */}
                    <div className="lg:col-span-7">
                      {selectedEnquiry ? (
                        <div className="p-6 rounded bg-[#12151b] border border-white/15 space-y-5">
                          {/* Header */}
                          <div className="flex items-start justify-between pb-4 border-b border-white/10">
                            <div>
                              <div className="text-[10px] font-mono-code text-[#FFA200] mb-0.5">
                                ENQUIRY #{selectedEnquiry.id}
                              </div>
                              <h3 className="text-xl font-heading font-bold text-white">
                                {selectedEnquiry.fullName}
                              </h3>
                              {selectedEnquiry.orgName && (
                                <p className="text-xs text-white/60">{selectedEnquiry.orgName}</p>
                              )}
                            </div>

                            {currentUser.role === 'Admin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                                className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Contact Coordinates */}
                          <div className="grid grid-cols-2 gap-3 p-3 rounded bg-black/40 text-xs font-mono-code">
                            <div>
                              <span className="text-white/40 block">Email:</span>
                              <a href={`mailto:${selectedEnquiry.email}`} className="text-[#FFA200] hover:underline">
                                {selectedEnquiry.email}
                              </a>
                            </div>
                            <div>
                              <span className="text-white/40 block">Phone:</span>
                              <span className="text-white">{selectedEnquiry.phone}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">Preferred Contact:</span>
                              <span className="text-white">{selectedEnquiry.preferredContactMethod}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">Stage:</span>
                              <span className="text-white">{selectedEnquiry.currentStage}</span>
                            </div>
                          </div>

                          {/* Descriptions */}
                          <div>
                            <div className="text-xs font-mono-code text-white/40 uppercase mb-1">Project Description</div>
                            <div className="p-3 rounded bg-black/30 border border-white/10 text-xs text-white/90 leading-relaxed whitespace-pre-wrap">
                              {selectedEnquiry.projectDescription}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-mono-code text-white/40 uppercase mb-1">Support Needed</div>
                            <div className="p-3 rounded bg-black/30 border border-white/10 text-xs text-white/90 leading-relaxed whitespace-pre-wrap">
                              {selectedEnquiry.supportNeeded}
                            </div>
                          </div>

                          {/* Controls: Status & Assignment */}
                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                            <div>
                              <label className="block text-xs font-mono-code text-white/60 mb-1">Status Workflow:</label>
                              <select
                                value={selectedEnquiry.status}
                                onChange={(e) => handleUpdateEnquiryStatus(selectedEnquiry.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-black/50 border border-white/20 rounded text-xs text-white focus:border-[#FF5500] focus:outline-none"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-mono-code text-white/60 mb-1">Assigned Engineer:</label>
                              <input
                                type="text"
                                placeholder="Enter staff name..."
                                defaultValue={selectedEnquiry.assignedTo || ''}
                                onBlur={(e) => handleAssignOwner(selectedEnquiry.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-black/50 border border-white/20 rounded text-xs text-white focus:border-[#FF5500] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Internal Notes Section */}
                          <div className="pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs font-mono-code text-white/70 mb-2">
                              <MessageSquare className="w-3.5 h-3.5 text-[#FFA200]" />
                              <span>Internal Technical Notes ({selectedEnquiry.internalNotes.length})</span>
                            </div>

                            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                              {selectedEnquiry.internalNotes.map((note) => (
                                <div key={note.id} className="p-2.5 rounded bg-black/40 border border-white/5 text-xs">
                                  <div className="flex items-center justify-between text-[10px] font-mono-code text-white/40 mb-1">
                                    <span className="text-[#FFA200]">{note.author}</span>
                                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-white/85 leading-snug">{note.text}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add note (e.g. reviewed BOM, scheduled CAD call)..."
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(selectedEnquiry.id); }}
                                className="flex-1 px-3 py-1.5 bg-black/40 border border-white/15 rounded text-xs text-white focus:border-[#FF5500] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddNote(selectedEnquiry.id)}
                                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-mono-code"
                              >
                                Add Note
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center rounded bg-[#12151b] border border-white/10 text-xs text-white/40 italic">
                          Select an enquiry from the list to review details and update status.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: WEBSITE CONTENT */}
              {activeTab === 'content' && siteContent && (
                <form onSubmit={handleSaveContent} className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-white">Website Content & Settings</h2>
                      <p className="text-xs text-white/60 font-mono-code">
                        Edit live marketing copy, vision statement, contact info, and SEO tags
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={contentSaving}
                      className="px-5 py-2.5 rounded-sm bg-[#FF5500] hover:bg-[#FF6B1A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow disabled:opacity-50"
                    >
                      {contentSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Save Content</span>
                    </button>
                  </div>

                  {contentSuccess && (
                    <div className="p-3 rounded bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs">
                      {contentSuccess}
                    </div>
                  )}

                  {/* Section 0: Brand Identity & Logo Configuration */}
                  <div className="p-5 sm:p-7 rounded-sm bg-[#101319] border border-white/10 space-y-6 shadow-xl">
                    {/* Header Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-white/10 gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-sm bg-[#FF5500]/15 border border-[#FF5500]/40 flex items-center justify-center text-[#FFA200]">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider text-[#FFA200]">
                            Brand Identity & Logo Configuration
                          </h3>
                        </div>
                        <p className="text-xs text-white/60 mt-1 max-w-2xl">
                          Customize the Origin Labs logo displayed in the global navigation, footer, and branding assets. Any changes are committed directly to your persistent Firebase Firestore database and reflect immediately across the entire site.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start lg:self-auto">
                        {siteContent.logoUrl ? (
                          <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono-code uppercase tracking-wider bg-[#FF5500]/15 text-[#FFA200] border border-[#FF5500]/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
                            Custom Logo Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-sm text-[10px] font-mono-code uppercase tracking-wider bg-white/10 text-white/70 border border-white/15 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-[#FFA200]" />
                            Official Vector Logo Active
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={handleSaveLogoToDatabase}
                          disabled={logoSaving}
                          className="px-4 py-2 rounded-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:from-[#FF8C1A] hover:to-[#FF5500] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,85,0,0.3)] disabled:opacity-50 active:scale-98"
                        >
                          {logoSaving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                          ) : (
                            <Database className="w-3.5 h-3.5 text-black" />
                          )}
                          <span>{logoSaving ? 'Saving to Firestore...' : 'Save Logo to Database'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Feedback Alerts */}
                    {logoSuccess && (
                      <div className="p-3.5 rounded-sm bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 font-mono-code animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{logoSuccess}</span>
                      </div>
                    )}

                    {logoUploadError && (
                      <div className="p-3.5 rounded-sm bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 font-mono-code animate-fadeIn">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{logoUploadError}</span>
                      </div>
                    )}

                    {/* Live Interactive Logo Preview Screen */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between mb-2.5 gap-2">
                        <label className="text-xs font-mono-code text-white/80 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#FFA200]" />
                          <span className="font-semibold text-white">Live Canvas & Navigation Preview</span>
                          <span className="text-white/40 text-[11px]">(Real-Time Render)</span>
                        </label>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono-code">
                          <span className="text-white/40 mr-1 hidden sm:inline">Background:</span>
                          <button
                            type="button"
                            onClick={() => setLogoPreviewBg('dark')}
                            className={`px-2.5 py-1 rounded-sm text-[10px] transition-colors border ${
                              logoPreviewBg === 'dark'
                                ? 'bg-[#FF5500] text-black font-bold border-[#FF5500]'
                                : 'bg-black/50 text-white/70 hover:text-white border-white/10'
                            }`}
                          >
                            Dark Header (#07080a)
                          </button>
                          <button
                            type="button"
                            onClick={() => setLogoPreviewBg('surface')}
                            className={`px-2.5 py-1 rounded-sm text-[10px] transition-colors border ${
                              logoPreviewBg === 'surface'
                                ? 'bg-[#FF5500] text-black font-bold border-[#FF5500]'
                                : 'bg-black/50 text-white/70 hover:text-white border-white/10'
                            }`}
                          >
                            Charcoal Surface
                          </button>
                          <button
                            type="button"
                            onClick={() => setLogoPreviewBg('light')}
                            className={`px-2.5 py-1 rounded-sm text-[10px] transition-colors border ${
                              logoPreviewBg === 'light'
                                ? 'bg-[#FF5500] text-black font-bold border-[#FF5500]'
                                : 'bg-black/50 text-white/70 hover:text-white border-white/10'
                            }`}
                          >
                            White Light
                          </button>
                          <button
                            type="button"
                            onClick={() => setLogoPreviewBg('checker')}
                            className={`px-2.5 py-1 rounded-sm text-[10px] transition-colors border ${
                              logoPreviewBg === 'checker'
                                ? 'bg-[#FF5500] text-black font-bold border-[#FF5500]'
                                : 'bg-black/50 text-white/70 hover:text-white border-white/10'
                            }`}
                          >
                            Transparency Grid
                          </button>

                          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

                          <button
                            type="button"
                            onClick={() => setShowNavMock(!showNavMock)}
                            className={`px-2.5 py-1 rounded-sm text-[10px] transition-colors border ${
                              showNavMock
                                ? 'bg-white/20 text-white font-bold border-white/40'
                                : 'bg-black/40 text-white/50 hover:text-white/80 border-white/10'
                            }`}
                          >
                            {showNavMock ? 'Hide Mock Nav' : 'Show Mock Nav'}
                          </button>
                        </div>
                      </div>

                      <div
                        className={`p-6 sm:p-7 rounded-sm border transition-all relative overflow-hidden ${
                          logoPreviewBg === 'dark'
                            ? 'bg-[#07080a] border-white/15'
                            : logoPreviewBg === 'surface'
                            ? 'bg-[#151921] border-white/20'
                            : logoPreviewBg === 'light'
                            ? 'bg-[#ffffff] border-gray-300'
                            : 'bg-neutral-900 border-white/20'
                        }`}
                        style={
                          logoPreviewBg === 'checker'
                            ? {
                                backgroundImage:
                                  'linear-gradient(45deg, #1f242d 25%, transparent 25%), linear-gradient(-45deg, #1f242d 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f242d 75%), linear-gradient(-45deg, transparent 75%, #1f242d 75%)',
                                backgroundSize: '16px 16px',
                                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                              }
                            : {}
                        }
                      >
                        {showNavMock ? (
                          <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
                            <OriginLogo
                              size="md"
                              customLogoUrl={siteContent.logoUrl}
                              customLogoAlt={siteContent.logoAlt}
                              customLogoHeight={siteContent.logoHeight || 36}
                              customSubtitle={siteContent.logoSubtitle}
                            />
                            <div className="hidden md:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/70">
                              <span>Hardware Execution</span>
                              <span>Venture Incubation</span>
                              <span>Cohorts</span>
                              <span className="px-3 py-1 rounded-sm bg-[#FF5500] text-black font-bold text-[11px]">
                                Build With Us
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <OriginLogo
                                size="md"
                                customLogoUrl={siteContent.logoUrl}
                                customLogoAlt={siteContent.logoAlt}
                                customLogoHeight={siteContent.logoHeight || 36}
                                customSubtitle={siteContent.logoSubtitle}
                              />
                            </div>

                            <div className="text-right">
                              <div
                                className={`text-[11px] font-mono-code ${
                                  logoPreviewBg === 'light' ? 'text-gray-700' : 'text-white/60'
                                }`}
                              >
                                Height: <span className="text-[#FF5500] font-bold">{siteContent.logoHeight || 36}px</span>
                              </div>
                              <div
                                className={`text-[10px] font-mono-code ${
                                  logoPreviewBg === 'light' ? 'text-gray-500' : 'text-white/40'
                                }`}
                              >
                                {siteContent.logoUrl ? 'Mode: Custom Asset' : 'Mode: Authentic Vector Emblem'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Logo Source Mode Tabs */}
                    <div>
                      <div className="flex items-center gap-1 pb-2 border-b border-white/10">
                        <button
                          type="button"
                          onClick={() => setLogoSourceTab('upload')}
                          className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 border ${
                            logoSourceTab === 'upload'
                              ? 'bg-[#FF5500]/20 text-[#FFA200] border-[#FF5500]/50 font-bold'
                              : 'bg-black/30 text-white/60 hover:text-white border-white/10'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>1. Upload File</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLogoSourceTab('url')}
                          className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 border ${
                            logoSourceTab === 'url'
                              ? 'bg-[#FF5500]/20 text-[#FFA200] border-[#FF5500]/50 font-bold'
                              : 'bg-black/30 text-white/60 hover:text-white border-white/10'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>2. Image URL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLogoSourceTab('svg')}
                          className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 border ${
                            logoSourceTab === 'svg'
                              ? 'bg-[#FF5500]/20 text-[#FFA200] border-[#FF5500]/50 font-bold'
                              : 'bg-black/30 text-white/60 hover:text-white border-white/10'
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>3. Raw SVG Code</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setLogoSourceTab('presets')}
                          className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 border ${
                            logoSourceTab === 'presets'
                              ? 'bg-[#FF5500]/20 text-[#FFA200] border-[#FF5500]/50 font-bold'
                              : 'bg-black/30 text-white/60 hover:text-white border-white/10'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>4. Brand Presets</span>
                        </button>
                      </div>

                      {/* Tab 1: Upload File */}
                      {logoSourceTab === 'upload' && (
                        <div className="pt-4">
                          <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) processImageFile(file);
                            }}
                            className={`p-6 rounded-sm border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                              dragOver
                                ? 'border-[#FF5500] bg-[#FF5500]/10'
                                : 'border-white/15 bg-black/40 hover:border-white/30'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FFA200] mb-3">
                              <Upload className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-1">
                              Drag and drop your logo file here
                            </h4>
                            <p className="text-xs text-white/50 mb-4 max-w-md">
                              PNG, SVG, JPG, WebP supported. Transparent PNG or SVG vector formats give the highest fidelity across dark themes.
                            </p>

                            <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-[#FF5500]/20 hover:bg-[#FF5500]/30 border border-[#FF5500]/50 text-white text-xs font-mono-code uppercase tracking-wider transition-colors">
                              <Upload className="w-3.5 h-3.5 text-[#FFA200]" />
                              <span>Select Image From Device</span>
                              <input
                                type="file"
                                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                                onChange={handleLogoFileUpload}
                                className="hidden"
                              />
                            </label>

                            {siteContent.logoUrl && siteContent.logoUrl.startsWith('data:') && (
                              <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-between text-xs font-mono-code text-white/60">
                                <span>Active file: Custom uploaded image (Data URI)</span>
                                <button
                                  type="button"
                                  onClick={() => handleResetLogo(false)}
                                  className="text-red-400 hover:text-red-300 underline"
                                >
                                  Remove file
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Direct Image URL */}
                      {logoSourceTab === 'url' && (
                        <div className="pt-4 space-y-3">
                          <label className="block text-xs font-mono-code text-white/80">
                            Enter Direct Image URL (PNG, SVG, WebP, or CDN Link)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={siteContent.logoUrl || ''}
                              onChange={(e) => setSiteContent({ ...siteContent, logoUrl: e.target.value })}
                              placeholder="https://cdn.example.com/assets/origin-labs-logo.svg"
                              className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-sm text-xs text-white placeholder-white/25 focus:border-[#FF5500] focus:outline-none font-mono-code"
                            />
                            {siteContent.logoUrl && (
                              <button
                                type="button"
                                onClick={() => setSiteContent({ ...siteContent, logoUrl: '' })}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-sm text-xs font-mono-code"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-white/50">
                            Tip: For production reliability, use URLs hosted on reliable HTTPS image delivery services, AWS S3, or Firebase Storage.
                          </p>
                        </div>
                      )}

                      {/* Tab 3: Raw SVG Code */}
                      {logoSourceTab === 'svg' && (
                        <div className="pt-4 space-y-3">
                          <label className="block text-xs font-mono-code text-white/80">
                            Paste Raw &lt;svg&gt; Markup
                          </label>
                          <textarea
                            rows={4}
                            value={rawSvgInput}
                            onChange={(e) => setRawSvgInput(e.target.value)}
                            placeholder='<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">...</svg>'
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-sm text-xs text-white placeholder-white/25 focus:border-[#FF5500] focus:outline-none font-mono-code"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApplySvgCode(rawSvgInput)}
                              disabled={!rawSvgInput.trim()}
                              className="px-4 py-2 rounded-sm bg-[#FF5500] hover:bg-[#FF6B1A] text-black font-bold text-xs uppercase tracking-wider disabled:opacity-40"
                            >
                              Apply Vector SVG
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const sample = `<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="20" fill="#FF5500"/><circle cx="25" cy="25" r="10" fill="#07080a"/><text x="55" y="32" font-family="sans-serif" font-weight="900" font-size="20" fill="#ffffff">ORIGIN LABS</text></svg>`;
                                setRawSvgInput(sample);
                              }}
                              className="px-3 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono-code border border-white/10"
                            >
                              Load Sample SVG
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tab 4: Curated Brand Presets */}
                      {logoSourceTab === 'presets' && (
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <button
                            type="button"
                            onClick={() => handleApplyPreset('official')}
                            className="p-3.5 rounded-sm bg-black/50 hover:bg-[#FF5500]/10 border border-white/15 hover:border-[#FF5500]/60 text-left transition-all group"
                          >
                            <div className="h-10 flex items-center mb-2">
                              <OriginLogo size="sm" showWordmark={true} />
                            </div>
                            <div className="text-xs font-bold text-white group-hover:text-[#FFA200]">
                              Official Brand Logo
                            </div>
                            <div className="text-[10px] text-white/50 mt-0.5">
                              Solar Aperture "O" + RIGIN LABS Wordmark
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApplyPreset('gold')}
                            className="p-3.5 rounded-sm bg-black/50 hover:bg-[#FFAA00]/10 border border-white/15 hover:border-[#FFAA00]/60 text-left transition-all group"
                          >
                            <div className="h-10 flex items-center mb-2">
                              <span className="text-base font-bold text-[#FFAA00] font-heading">ORIGIN LABS (GOLD)</span>
                            </div>
                            <div className="text-xs font-bold text-white group-hover:text-[#FFAA00]">
                              Gold Radiant Edition
                            </div>
                            <div className="text-[10px] text-white/50 mt-0.5">
                              Warm metallic gold solar finish
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApplyPreset('monochrome')}
                            className="p-3.5 rounded-sm bg-black/50 hover:bg-white/10 border border-white/15 hover:border-white/60 text-left transition-all group"
                          >
                            <div className="h-10 flex items-center mb-2">
                              <span className="text-base font-bold text-white font-heading">ORIGIN LABS (WHITE)</span>
                            </div>
                            <div className="text-xs font-bold text-white group-hover:text-white">
                              Pure White Vector
                            </div>
                            <div className="text-[10px] text-white/50 mt-0.5">
                              Ultra-clean high contrast monochrome
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApplyPreset('badge')}
                            className="p-3.5 rounded-sm bg-black/50 hover:bg-[#FF5500]/10 border border-white/15 hover:border-[#FF5500]/60 text-left transition-all group"
                          >
                            <div className="h-10 flex items-center mb-2">
                              <OriginEmblem size={32} />
                            </div>
                            <div className="text-xs font-bold text-white group-hover:text-[#FFA200]">
                              Aperture Badge Solo
                            </div>
                            <div className="text-[10px] text-white/50 mt-0.5">
                              Compact mark for dense headers
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sizing, Alt & Tagline Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3 border-t border-white/10">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-mono-code text-white/80 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-[#FFA200]" />
                            <span>Logo Render Height</span>
                          </label>
                          <span className="text-xs font-mono-code text-[#FFA200] font-bold">
                            {siteContent.logoHeight || 36}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min={20}
                          max={72}
                          step={2}
                          value={siteContent.logoHeight || 36}
                          onChange={(e) => setSiteContent({ ...siteContent, logoHeight: parseInt(e.target.value, 10) })}
                          className="w-full accent-[#FF5500] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono-code text-white/40 mt-1">
                          <button
                            type="button"
                            onClick={() => setSiteContent({ ...siteContent, logoHeight: 28 })}
                            className="hover:text-white"
                          >
                            28px (Compact)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSiteContent({ ...siteContent, logoHeight: 36 })}
                            className="hover:text-white text-[#FFA200]"
                          >
                            36px (Standard)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSiteContent({ ...siteContent, logoHeight: 48 })}
                            className="hover:text-white"
                          >
                            48px (Large)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSiteContent({ ...siteContent, logoHeight: 60 })}
                            className="hover:text-white"
                          >
                            60px (Hero)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                          Logo Alt Text (Accessibility & SEO)
                        </label>
                        <input
                          type="text"
                          value={siteContent.logoAlt || ''}
                          onChange={(e) => setSiteContent({ ...siteContent, logoAlt: e.target.value })}
                          placeholder="Origin Labs — Hardware & Robotics"
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-sm text-xs text-white focus:border-[#FF5500] focus:outline-none font-mono-code"
                        />
                        <span className="text-[10px] text-white/40 mt-1 block">
                          Screen readers and search engine crawlers use this text.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-code text-white/80 mb-1.5">
                          Header Subtitle Tagline (Optional)
                        </label>
                        <input
                          type="text"
                          value={siteContent.logoSubtitle || ''}
                          onChange={(e) => setSiteContent({ ...siteContent, logoSubtitle: e.target.value })}
                          placeholder="Hardware • Robotics • Prototyping"
                          className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-sm text-xs text-white focus:border-[#FF5500] focus:outline-none font-mono-code"
                        />
                        <span className="text-[10px] text-white/40 mt-1 block">
                          Displays alongside the brand mark in top navigation.
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleResetLogo(true)}
                          className="px-3.5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono-code flex items-center gap-1.5 transition-colors border border-white/15"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset & Save Official Origin Labs Logo</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSaveLogoToDatabase}
                          disabled={logoSaving}
                          className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:from-[#FF8C1A] hover:to-[#FF5500] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,85,0,0.35)] disabled:opacity-50 active:scale-98"
                        >
                          {logoSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin text-black" />
                          ) : (
                            <Database className="w-4 h-4 text-black" />
                          )}
                          <span>{logoSaving ? 'Saving to Database...' : 'Save Logo to Database'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Hero */}
                  <div className="p-5 rounded bg-[#12151b] border border-white/10 space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider text-[#FFA200]">
                      Hero Section
                    </h3>
                    <div>
                      <label className="block text-xs font-mono-code text-white/70 mb-1">Headline (multiline)</label>
                      <textarea
                        rows={2}
                        value={siteContent.heroHeadline}
                        onChange={(e) => setSiteContent({ ...siteContent, heroHeadline: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-code text-white/70 mb-1">Supporting Copy</label>
                      <textarea
                        rows={2}
                        value={siteContent.heroSupporting}
                        onChange={(e) => setSiteContent({ ...siteContent, heroSupporting: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: Vision */}
                  <div className="p-5 rounded bg-[#12151b] border border-white/10 space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider text-[#FFA200]">
                      Our Vision
                    </h3>
                    <div>
                      <label className="block text-xs font-mono-code text-white/70 mb-1">Vision Headline</label>
                      <input
                        type="text"
                        value={siteContent.visionHeadline}
                        onChange={(e) => setSiteContent({ ...siteContent, visionHeadline: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-code text-white/70 mb-1">Vision Description</label>
                      <textarea
                        rows={2}
                        value={siteContent.visionDescription}
                        onChange={(e) => setSiteContent({ ...siteContent, visionDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Section 3: Contact Settings */}
                  <div className="p-5 rounded bg-[#12151b] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider text-[#FFA200]">
                        Contact Details
                      </h3>
                      <span className="text-[10px] font-mono-code text-white/40">
                        Leave blank to hide in footer
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono-code text-white/70 mb-1">Official Email</label>
                        <input
                          type="email"
                          value={siteContent.contactEmail || ''}
                          onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                          placeholder="e.g. contact@originlabs.tech"
                          className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono-code text-white/70 mb-1">Official Phone</label>
                        <input
                          type="text"
                          value={siteContent.contactPhone || ''}
                          onChange={(e) => setSiteContent({ ...siteContent, contactPhone: e.target.value })}
                          placeholder="e.g. +1 (415) 555-0192"
                          className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: SEO */}
                  <div className="p-5 rounded bg-[#12151b] border border-white/10 space-y-4">
                    <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider text-[#FFA200]">
                      Search Engine Optimization (SEO)
                    </h3>
                    <div>
                      <label className="block text-xs font-mono-code text-white/70 mb-1">Page Title</label>
                      <input
                        type="text"
                        value={siteContent.seoTitle}
                        onChange={(e) => setSiteContent({ ...siteContent, seoTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-code text-white/70 mb-1">Meta Description</label>
                      <textarea
                        rows={2}
                        value={siteContent.seoDescription}
                        onChange={(e) => setSiteContent({ ...siteContent, seoDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded text-sm text-white focus:border-[#FF5500] focus:outline-none"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB: PROGRAMS */}
              {activeTab === 'programs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-white">Programs & Cohorts</h2>
                      <p className="text-xs text-white/60 font-mono-code">
                        Manage accelerator cohorts, application deadlines, and curriculum deliverables
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProgram({
                          title: '',
                          category: 'Idea-to-prototype programs',
                          description: '',
                          duration: '10 Weeks',
                          format: 'Hybrid / Lab Access',
                          status: 'draft',
                          deliverables: ['Working physical proof of concept', 'DFMA risk register']
                        });
                        setProgramModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-sm bg-[#FF5500] hover:bg-[#FF6B1A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Program</span>
                    </button>
                  </div>

                  {programs.length === 0 ? (
                    <div className="p-8 text-center bg-[#12151b] border border-white/10 rounded text-xs text-white/50">
                      No programs configured yet. Use "Create Program" above to publish a cohort to the live site.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {programs.map((p) => (
                        <div key={p.id} className="p-5 rounded bg-[#12151b] border border-white/15 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono-code text-[#FFA200] uppercase">
                                {p.category}
                              </span>
                              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/10 text-white">
                                {p.status}
                              </span>
                            </div>
                            <h3 className="font-heading font-bold text-base text-white mb-1">{p.title}</h3>
                            <p className="text-xs text-white/70 mb-3">{p.description}</p>
                            <div className="text-[11px] font-mono-code text-white/50 space-x-3">
                              <span>Duration: {p.duration}</span>
                              <span>Format: {p.format}</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/10 flex justify-end gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => { setEditingProgram(p); setProgramModalOpen(true); }}
                              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono-code text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProgram(p.id)}
                              className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs font-mono-code text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: EVENTS */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-white">Events & Summits</h2>
                      <p className="text-xs text-white/60 font-mono-code">
                        Schedule teardown workshops, hardware summits, and community meetups
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingEvent({
                          title: '',
                          description: '',
                          category: 'Summit',
                          dateTime: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 16),
                          timezone: 'PST',
                          venueOrLink: 'Origin Labs Prototyping Bay',
                          isOnline: false,
                          registrationUrl: '',
                          status: 'upcoming'
                        });
                        setEventModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-sm bg-[#FF5500] hover:bg-[#FF6B1A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Schedule Event</span>
                    </button>
                  </div>

                  {events.length === 0 ? (
                    <div className="p-8 text-center bg-[#12151b] border border-white/10 rounded text-xs text-white/50">
                      No events scheduled yet. The public site displays an honest empty state until an event is scheduled here.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map((evt) => (
                        <div key={evt.id} className="p-5 rounded bg-[#12151b] border border-white/15 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono-code text-[#FFA200] uppercase">
                                {evt.category}
                              </span>
                              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/10 text-white">
                                {evt.status}
                              </span>
                            </div>
                            <h3 className="font-heading font-bold text-base text-white mb-1">{evt.title}</h3>
                            <p className="text-xs text-white/70 mb-3">{evt.description}</p>
                            <div className="text-[11px] font-mono-code text-white/50">
                              {new Date(evt.dateTime).toLocaleString()} ({evt.timezone})
                            </div>
                          </div>

                          <div className="pt-4 border-t border-white/10 flex justify-end gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => { setEditingEvent(evt); setEventModalOpen(true); }}
                              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono-code text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs font-mono-code text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PARTNERSHIPS */}
              {activeTab === 'partnerships' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white">Strategic Partnerships</h2>
                    <p className="text-xs text-white/60 font-mono-code">
                      Review university, manufacturing, and investor partnership requests
                    </p>
                  </div>

                  {partnerships.length === 0 ? (
                    <div className="p-8 text-center bg-[#12151b] border border-white/10 rounded text-xs text-white/50">
                      No partnership proposals submitted yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {partnerships.map((p) => (
                        <div key={p.id} className="p-5 rounded bg-[#12151b] border border-white/15">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-heading font-bold text-base text-white">{p.orgName}</h3>
                              <div className="text-xs text-white/60">
                                Contact: {p.contactPerson} (<a href={`mailto:${p.email}`} className="text-[#FFA200]">{p.email}</a>)
                              </div>
                            </div>
                            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/10 text-[#FFA200] self-start sm:self-auto">
                              {p.type}
                            </span>
                          </div>

                          <p className="text-xs text-white/80 p-3 rounded bg-black/40 border border-white/5 my-3">
                            "{p.message}"
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                            <span className="font-mono-code text-white/40 text-[10px]">
                              Status: {p.status} {p.isPublic ? '• (Published on site)' : ''}
                            </span>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleTogglePartnershipPublic(p.id, !p.isPublic, (p.status === 'review' ? 'approved' : p.status) as 'review' | 'approved' | 'active' | 'archived')}
                                className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono-code text-white"
                              >
                                {p.isPublic ? 'Hide from Public' : 'Show on Public Site'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: STAFF & ACCESS */}
              {activeTab === 'staff' && currentUser.role === 'Admin' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-white">Staff & Access Permissions</h2>
                      <p className="text-xs text-white/60 font-mono-code">
                        Manage roles (Admin, Content Editor, Enquiry Manager) enforced on the server
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNewStaffModalOpen(true)}
                      className="px-4 py-2 rounded-sm bg-[#FF5500] hover:bg-[#FF6B1A] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Staff User</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {staffList.map((user) => (
                      <div key={user.id} className="p-4 rounded bg-[#12151b] border border-white/15 flex items-center justify-between">
                        <div>
                          <div className="font-heading font-bold text-white text-sm">{user.name}</div>
                          <div className="text-xs font-mono-code text-white/50">{user.email}</div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-mono-code ${
                            user.role === 'Admin' ? 'bg-[#FF5500]/10 text-[#FFA200] border border-[#FF5500]/30' : 'bg-white/10 text-white'
                          }`}>
                            {user.role}
                          </span>

                          {user.id !== currentUser.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteStaff(user.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Remove staff member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: AUDIT TRAIL */}
              {activeTab === 'logs' && currentUser.role === 'Admin' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-white">System Audit Trail</h2>
                    <p className="text-xs text-white/60 font-mono-code">
                      Immutable record of admin actions, status modifications, and public submissions
                    </p>
                  </div>

                  <div className="p-4 rounded bg-[#12151b] border border-white/10 max-h-[600px] overflow-y-auto">
                    <div className="space-y-2">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-2.5 rounded bg-black/40 border border-white/5 text-xs font-mono-code flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[#FFA200] font-bold">[{log.action}]</span>
                            <span className="text-white/80">{log.details}</span>
                          </div>
                          <div className="text-[10px] text-white/40 shrink-0">
                            {log.actorEmail} ({log.actorRole}) • {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Program Create/Edit Modal */}
      {programModalOpen && editingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#12161f] border border-white/20 rounded p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              {editingProgram.id ? 'Edit Program' : 'Create New Program Cohort'}
            </h3>
            <form onSubmit={handleSaveProgram} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono-code text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProgram.title || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                />
              </div>

              <div>
                <label className="block font-mono-code text-white/70 mb-1">Category</label>
                <select
                  value={editingProgram.category || 'Idea-to-prototype programs'}
                  onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                >
                  <option value="Idea-to-prototype programs">Idea-to-prototype programs</option>
                  <option value="Hardware and robotics cohorts">Hardware and robotics cohorts</option>
                  <option value="Founder incubation">Founder incubation</option>
                  <option value="Manufacturing readiness">Manufacturing readiness</option>
                </select>
              </div>

              <div>
                <label className="block font-mono-code text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProgram.description || ''}
                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-code text-white/70 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingProgram.duration || ''}
                    onChange={(e) => setEditingProgram({ ...editingProgram, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-white/70 mb-1">Status</label>
                  <select
                    value={editingProgram.status || 'draft'}
                    onChange={(e) => setEditingProgram({ ...editingProgram, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="active">Active (Visible)</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProgramModalOpen(false)}
                  className="px-4 py-2 rounded bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)] uppercase tracking-wider"
                >
                  Save Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Create/Edit Modal */}
      {eventModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#12161f] border border-white/20 rounded p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-white mb-4">
              {editingEvent.id ? 'Edit Event' : 'Schedule New Event'}
            </h3>
            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono-code text-white/70 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                />
              </div>

              <div>
                <label className="block font-mono-code text-white/70 mb-1">Category</label>
                <select
                  value={editingEvent.category || 'Workshop'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                >
                  <option value="Workshop">Technical Workshop</option>
                  <option value="Summit">Hardware Summit</option>
                  <option value="Teardown">Peer Teardown</option>
                  <option value="Demo Day">Demo Showcase</option>
                </select>
              </div>

              <div>
                <label className="block font-mono-code text-white/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-code text-white/70 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={editingEvent.dateTime || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-white/70 mb-1">Timezone</label>
                  <input
                    type="text"
                    value={editingEvent.timezone || 'PST'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timezone: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-white/70 mb-1">Venue or Online Link</label>
                <input
                  type="text"
                  value={editingEvent.venueOrLink || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, venueOrLink: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono-code text-white/70 mb-1">Status</label>
                  <select
                    value={editingEvent.status || 'draft'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="upcoming">Upcoming (Visible)</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono-code text-white/70 mb-1">Registration URL (Optional)</label>
                  <input
                    type="url"
                    value={editingEvent.registrationUrl || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, registrationUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="px-4 py-2 rounded bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)] uppercase tracking-wider"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Create Modal */}
      {newStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#12161f] border border-white/20 rounded p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-heading font-bold text-white mb-4">Add Staff Member</h3>
            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono-code text-white/70 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-mono-code text-white/70 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newStaffData.email}
                  onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-mono-code text-white/70 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newStaffData.password}
                  onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                />
              </div>
              <div>
                <label className="block font-mono-code text-white/70 mb-1">Role</label>
                <select
                  value={newStaffData.role}
                  onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded text-white"
                >
                  <option value="Content Editor">Content Editor</option>
                  <option value="Enquiry Manager">Enquiry Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewStaffModalOpen(false)}
                  className="px-4 py-2 rounded bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)] uppercase tracking-wider"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
