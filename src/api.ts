export interface EnquirySubmission {
  fullName: string;
  email: string;
  phone: string;
  orgName?: string;
  category: string;
  currentStage: string;
  projectDescription: string;
  supportNeeded: string;
  preferredContactMethod: string;
  consent: boolean;
  honeypot?: string;
}

export interface InternalNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface EnquiryRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  orgName?: string;
  category: string;
  currentStage: string;
  projectDescription: string;
  supportNeeded: string;
  preferredContactMethod: string;
  consent: boolean;
  status: 'New' | 'Contacted' | 'Under Review' | 'In Progress' | 'Closed';
  assignedTo: string | null;
  internalNotes: InternalNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgramRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  format: string;
  status: 'draft' | 'active' | 'upcoming' | 'archived';
  applicationDeadline?: string;
  cohortStartDate?: string;
  deliverables: string[];
  prerequisites: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  dateTime: string;
  timezone: string;
  venueOrLink: string;
  isOnline: boolean;
  bannerUrl?: string;
  registrationUrl: string;
  status: 'upcoming' | 'completed' | 'draft';
  registrationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipRecord {
  id: string;
  orgName: string;
  contactPerson: string;
  email: string;
  type: string;
  message: string;
  status: 'review' | 'approved' | 'active' | 'archived';
  isPublic: boolean;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContent {
  heroHeadline: string;
  heroSupporting: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  visionHeadline: string;
  visionDescription: string;
  marqueeItems: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
    youtube: string;
  };
  seoTitle: string;
  seoDescription: string;
  logoUrl?: string;
  logoAlt?: string;
  logoHeight?: number;
  logoSubtitle?: string;
}

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Content Editor' | 'Enquiry Manager';
  createdAt: string;
}

export interface DashboardMetrics {
  metrics: {
    totalEnquiries: number;
    newEnquiries: number;
    inReviewEnquiries: number;
    inProgressEnquiries: number;
    closedEnquiries: number;
    totalPrograms: number;
    activePrograms: number;
    totalEvents: number;
    upcomingEvents: number;
    partnershipRequests: number;
  };
  countsByCategory: Record<string, number>;
  countsByStatus: Record<string, number>;
  recentEnquiries: EnquiryRecord[];
  recentLogs: Array<{
    id: string;
    timestamp: string;
    actorEmail: string;
    actorRole: string;
    action: string;
    entity: string;
    details: string;
  }>;
}

const TOKEN_KEY = 'origin_auth_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY)
};

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    let errMsg = `Request failed: ${res.statusText}`;
    try {
      const errData = await res.json();
      errMsg = errData.error || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Public
  getContent: () => fetchJson<{ success: boolean; data: SiteContent }>('/api/content'),
  getPrograms: () => fetchJson<{ success: boolean; data: ProgramRecord[] }>('/api/programs'),
  getEvents: () => fetchJson<{ success: boolean; data: EventRecord[] }>('/api/events'),
  getPartnerships: () => fetchJson<{ success: boolean; data: PartnershipRecord[] }>('/api/partnerships'),
  
  submitEnquiry: (data: EnquirySubmission) =>
    fetchJson<{ success: boolean; data: any; message: string }>('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  submitPartnership: (data: { orgName: string; contactPerson: string; email: string; type: string; message: string }) =>
    fetchJson<{ success: boolean; data: any; message: string }>('/api/partnerships', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetchJson<{ success: boolean; token: string; user: StaffUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getMe: () => fetchJson<{ success: boolean; user: StaffUser }>('/api/auth/me'),

  logout: () => {
    authStorage.removeToken();
    return fetchJson<{ success: boolean; message: string }>('/api/auth/logout', { method: 'POST' });
  },

  // Admin Dashboard
  getDashboardMetrics: () => fetchJson<{ success: boolean; data: DashboardMetrics }>('/api/admin/dashboard'),

  // Admin Enquiries
  getEnquiries: (params?: { search?: string; status?: string; category?: string; stage?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.stage) query.set('stage', params.stage);
    return fetchJson<{ success: boolean; data: EnquiryRecord[] }>(`/api/admin/enquiries?${query.toString()}`);
  },

  updateEnquiry: (id: string, updates: { status?: string; assignedTo?: string | null }) =>
    fetchJson<{ success: boolean; data: EnquiryRecord }>(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),

  addEnquiryNote: (id: string, text: string) =>
    fetchJson<{ success: boolean; data: InternalNote }>(`/api/admin/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text })
    }),

  deleteEnquiry: (id: string) =>
    fetchJson<{ success: boolean; message: string }>(`/api/admin/enquiries/${id}`, {
      method: 'DELETE'
    }),

  // Admin Programs
  getAdminPrograms: () => fetchJson<{ success: boolean; data: ProgramRecord[] }>('/api/admin/programs'),
  createProgram: (prog: Partial<ProgramRecord>) =>
    fetchJson<{ success: boolean; data: ProgramRecord }>('/api/admin/programs', {
      method: 'POST',
      body: JSON.stringify(prog)
    }),
  updateProgram: (id: string, prog: Partial<ProgramRecord>) =>
    fetchJson<{ success: boolean; data: ProgramRecord }>(`/api/admin/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prog)
    }),
  deleteProgram: (id: string) =>
    fetchJson<{ success: boolean; message: string }>(`/api/admin/programs/${id}`, {
      method: 'DELETE'
    }),

  // Admin Events
  getAdminEvents: () => fetchJson<{ success: boolean; data: EventRecord[] }>('/api/admin/events'),
  createEvent: (evt: Partial<EventRecord>) =>
    fetchJson<{ success: boolean; data: EventRecord }>('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(evt)
    }),
  updateEvent: (id: string, evt: Partial<EventRecord>) =>
    fetchJson<{ success: boolean; data: EventRecord }>(`/api/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(evt)
    }),
  deleteEvent: (id: string) =>
    fetchJson<{ success: boolean; message: string }>(`/api/admin/events/${id}`, {
      method: 'DELETE'
    }),

  // Admin Partnerships
  getAdminPartnerships: () => fetchJson<{ success: boolean; data: PartnershipRecord[] }>('/api/admin/partnerships'),
  updatePartnership: (id: string, updates: Partial<PartnershipRecord>) =>
    fetchJson<{ success: boolean; data: PartnershipRecord }>(`/api/admin/partnerships/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),

  // Admin Site Content
  getAdminContent: () => fetchJson<{ success: boolean; data: SiteContent }>('/api/admin/content'),
  updateAdminContent: (content: Partial<SiteContent>) =>
    fetchJson<{ success: boolean; data: SiteContent; message: string }>('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(content)
    }),
  updateLogo: (logoData: { logoUrl?: string; logoAlt?: string; logoHeight?: number; logoSubtitle?: string }) =>
    fetchJson<{ success: boolean; data: SiteContent; message: string }>('/api/admin/logo', {
      method: 'PUT',
      body: JSON.stringify(logoData)
    }),

  // Admin Staff & Logs
  getStaff: () => fetchJson<{ success: boolean; data: StaffUser[] }>('/api/admin/staff'),
  createStaff: (user: { name: string; email: string; password: string; role: string }) =>
    fetchJson<{ success: boolean; data: StaffUser }>('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify(user)
    }),
  deleteStaff: (id: string) =>
    fetchJson<{ success: boolean; message: string }>(`/api/admin/staff/${id}`, {
      method: 'DELETE'
    }),
  getAuditLogs: () =>
    fetchJson<{ success: boolean; data: any[] }>('/api/admin/audit-logs')
};
