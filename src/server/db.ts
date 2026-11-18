import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db as firestoreDb } from '../lib/firebase.ts';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export interface InternalNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Enquiry {
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

export interface Program {
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

export interface Partnership {
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

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Content Editor' | 'Enquiry Manager';
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  entity: string;
  details: string;
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

export interface DatabaseSchema {
  enquiries: Enquiry[];
  programs: Program[];
  events: EventRecord[];
  partnerships: Partnership[];
  siteContent: SiteContent;
  staffUsers: StaffUser[];
  auditLogs: AuditLog[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'origin_db.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        result[key] = sanitizeForFirestore(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

const DEFAULT_CONTENT: SiteContent = {
  heroHeadline: 'Big ideas.\nReal world.',
  heroSupporting: 'From the first sketch to the factory floor. We bring people, engineering and opportunity together to build what comes next.',
  heroPrimaryCta: 'Build With Us',
  heroSecondaryCta: 'Explore the Ecosystem',
  visionHeadline: 'An ecosystem where ambitious ideas become useful products, sustainable ventures and meaningful opportunities.',
  visionDescription: 'Origin Labs brings together engineering rigor, advanced prototyping machinery, manufacturing supply chains, investor readiness, and collaborative builder cohorts.',
  marqueeItems: [
    'RAPID PROTOTYPING',
    'ROBOTICS & EMBEDDED SYSTEMS',
    'MECHANICAL DESIGN & CAD',
    'BULK CONTRACT MANUFACTURING',
    'DFMA & PILOT RUNS',
    'FOUNDER INCUBATION',
    'HARDWARE INVESTMENT READINESS',
    'SUPPLIER SOURCING',
    'SYSTEM INTEGRATION',
    'COHORT SUMMITS'
  ],
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  socialLinks: {
    linkedin: '',
    twitter: '',
    github: '',
    youtube: ''
  },
  seoTitle: 'ORIGIN LABS | Big ideas. Real world.',
  seoDescription: 'Origin Labs is an ecosystem that helps founders, inventors, engineers and startups turn ideas into market-ready products.',
  logoUrl: '',
  logoAlt: 'Origin Labs',
  logoHeight: 36,
  logoSubtitle: 'Hardware • Robotics • Prototyping'
};

function createInitialDatabase(): DatabaseSchema {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminHash = hashPassword('OriginLabs2026!Secure', adminSalt);

  const editorSalt = crypto.randomBytes(16).toString('hex');
  const editorHash = hashPassword('OriginLabs2026!Secure', editorSalt);

  const managerSalt = crypto.randomBytes(16).toString('hex');
  const managerHash = hashPassword('OriginLabs2026!Secure', managerSalt);

  return {
    enquiries: [],
    programs: [],
    events: [],
    partnerships: [],
    siteContent: DEFAULT_CONTENT,
    staffUsers: [
      {
        id: 'usr_admin_01',
        email: 'admin@originlabs.tech',
        name: 'Origin Admin',
        role: 'Admin',
        passwordHash: adminHash,
        salt: adminSalt,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_editor_01',
        email: 'editor@originlabs.tech',
        name: 'Content Lead',
        role: 'Content Editor',
        passwordHash: editorHash,
        salt: editorSalt,
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_mgr_01',
        email: 'manager@originlabs.tech',
        name: 'Enquiries Lead',
        role: 'Enquiry Manager',
        passwordHash: managerHash,
        salt: managerSalt,
        createdAt: new Date().toISOString()
      }
    ],
    auditLogs: [
      {
        id: 'log_init',
        timestamp: new Date().toISOString(),
        actorEmail: 'system',
        actorRole: 'System',
        action: 'INITIALIZE_SYSTEM',
        entity: 'Database',
        details: 'Origin Labs persistent database initialized with Firebase Firestore integration.'
      }
    ]
  };
}

class Database {
  private data: DatabaseSchema;
  private isFirestoreHydrated = false;

  constructor() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          enquiries: parsed.enquiries || [],
          programs: parsed.programs || [],
          events: parsed.events || [],
          partnerships: parsed.partnerships || [],
          siteContent: { ...DEFAULT_CONTENT, ...(parsed.siteContent || {}) },
          staffUsers: parsed.staffUsers && parsed.staffUsers.length > 0 ? parsed.staffUsers : createInitialDatabase().staffUsers,
          auditLogs: parsed.auditLogs || []
        };
      } catch (err) {
        console.error('Failed to read database file, creating fresh:', err);
        this.data = createInitialDatabase();
        this.save();
      }
    } else {
      this.data = createInitialDatabase();
      this.save();
    }

    // Hydrate public collections from Firebase Firestore if available
    this.hydrateFromFirestore().catch(() => {});
  }

  private async hydrateFromFirestore(): Promise<void> {
    if (this.isFirestoreHydrated || !firestoreDb) return;
    try {
      // 1. Programs (public read according to firestore.rules)
      try {
        const progSnap = await getDocs(collection(firestoreDb, 'programs'));
        if (!progSnap.empty) {
          this.data.programs = progSnap.docs.map(d => d.data() as Program);
        }
      } catch {
        // Fallback to local cache
      }

      // 2. Events (public read)
      try {
        const evtSnap = await getDocs(collection(firestoreDb, 'events'));
        if (!evtSnap.empty) {
          this.data.events = evtSnap.docs.map(d => d.data() as EventRecord);
        }
      } catch {
        // Fallback to local cache
      }

      // 3. Partnerships (public read)
      try {
        const partSnap = await getDocs(collection(firestoreDb, 'partnerships'));
        if (!partSnap.empty) {
          this.data.partnerships = partSnap.docs.map(d => d.data() as Partnership);
        }
      } catch {
        // Fallback to local cache
      }

      // 4. Site Content (public read)
      try {
        const contentDoc = await getDoc(doc(firestoreDb, 'site_content', 'main'));
        if (contentDoc.exists()) {
          this.data.siteContent = { ...this.data.siteContent, ...(contentDoc.data() as Partial<SiteContent>) };
        }
      } catch {
        // Fallback to local cache
      }

      this.isFirestoreHydrated = true;
      this.save();
    } catch {
      // Fallback cleanly to local persistence
    }
  }

  private save(): void {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // Enquiries
  getEnquiries(): Enquiry[] {
    return [...this.data.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getEnquiryById(id: string): Enquiry | undefined {
    return this.data.enquiries.find(e => e.id === id);
  }

  addEnquiry(item: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'assignedTo' | 'internalNotes'>): Enquiry {
    const newEnquiry: Enquiry = {
      ...item,
      id: `enq_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      status: 'New',
      assignedTo: null,
      internalNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.enquiries.push(newEnquiry);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'enquiries', newEnquiry.id), sanitizeForFirestore(newEnquiry)).catch(err => {
        console.warn('Firestore sync notice for enquiry:', err?.message || err);
      });
    }

    return newEnquiry;
  }

  updateEnquiry(id: string, updates: Partial<Pick<Enquiry, 'status' | 'assignedTo'>>): Enquiry | null {
    const enq = this.data.enquiries.find(e => e.id === id);
    if (!enq) return null;
    if (updates.status) enq.status = updates.status;
    if (updates.assignedTo !== undefined) enq.assignedTo = updates.assignedTo;
    enq.updatedAt = new Date().toISOString();
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'enquiries', id), sanitizeForFirestore(enq), { merge: true }).catch(err => {
        console.warn('Firestore sync notice for enquiry update:', err?.message || err);
      });
    }

    return enq;
  }

  addEnquiryNote(id: string, author: string, text: string): InternalNote | null {
    const enq = this.data.enquiries.find(e => e.id === id);
    if (!enq) return null;
    const note: InternalNote = {
      id: `note_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      author,
      text,
      createdAt: new Date().toISOString()
    };
    enq.internalNotes.push(note);
    enq.updatedAt = new Date().toISOString();
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'enquiries', id), sanitizeForFirestore(enq), { merge: true }).catch(err => {
        console.warn('Firestore sync notice for enquiry note:', err?.message || err);
      });
    }

    return note;
  }

  deleteEnquiry(id: string): boolean {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.enquiries.splice(idx, 1);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      deleteDoc(doc(firestoreDb, 'enquiries', id)).catch(err => {
        console.warn('Firestore sync notice for enquiry deletion:', err?.message || err);
      });
    }

    return true;
  }

  // Programs
  getPrograms(onlyPublic: boolean = false): Program[] {
    if (onlyPublic) {
      return this.data.programs.filter(p => p.status === 'active' || p.status === 'upcoming');
    }
    return [...this.data.programs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getProgramById(id: string): Program | undefined {
    return this.data.programs.find(p => p.id === id);
  }

  createProgram(item: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Program {
    const prog: Program = {
      ...item,
      id: `prog_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.programs.push(prog);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'programs', prog.id), sanitizeForFirestore(prog)).catch(err => {
        console.warn('Firestore sync notice for program:', err?.message || err);
      });
    }

    return prog;
  }

  updateProgram(id: string, updates: Partial<Omit<Program, 'id' | 'createdAt' | 'updatedAt'>>): Program | null {
    const prog = this.data.programs.find(p => p.id === id);
    if (!prog) return null;
    Object.assign(prog, updates);
    prog.updatedAt = new Date().toISOString();
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'programs', id), sanitizeForFirestore(prog), { merge: true }).catch(err => {
        console.warn('Firestore sync notice for program update:', err?.message || err);
      });
    }

    return prog;
  }

  deleteProgram(id: string): boolean {
    const idx = this.data.programs.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.programs.splice(idx, 1);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      deleteDoc(doc(firestoreDb, 'programs', id)).catch(err => {
        console.warn('Firestore sync notice for program deletion:', err?.message || err);
      });
    }

    return true;
  }

  // Events
  getEvents(onlyPublic: boolean = false): EventRecord[] {
    if (onlyPublic) {
      return this.data.events.filter(e => e.status !== 'draft');
    }
    return [...this.data.events].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  createEvent(item: Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt' | 'registrationsCount'>): EventRecord {
    const evt: EventRecord = {
      ...item,
      id: `evt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      registrationsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.events.push(evt);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'events', evt.id), sanitizeForFirestore(evt)).catch(err => {
        console.warn('Firestore sync notice for event:', err?.message || err);
      });
    }

    return evt;
  }

  updateEvent(id: string, updates: Partial<Omit<EventRecord, 'id' | 'createdAt' | 'updatedAt'>>): EventRecord | null {
    const evt = this.data.events.find(e => e.id === id);
    if (!evt) return null;
    Object.assign(evt, updates);
    evt.updatedAt = new Date().toISOString();
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'events', id), sanitizeForFirestore(evt), { merge: true }).catch(err => {
        console.warn('Firestore sync notice for event update:', err?.message || err);
      });
    }

    return evt;
  }

  deleteEvent(id: string): boolean {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.events.splice(idx, 1);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      deleteDoc(doc(firestoreDb, 'events', id)).catch(err => {
        console.warn('Firestore sync notice for event deletion:', err?.message || err);
      });
    }

    return true;
  }

  // Partnerships
  getPartnerships(onlyPublic: boolean = false): Partnership[] {
    if (onlyPublic) {
      return this.data.partnerships.filter(p => p.isPublic && (p.status === 'active' || p.status === 'approved'));
    }
    return [...this.data.partnerships].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPartnership(item: Omit<Partnership, 'id' | 'createdAt' | 'updatedAt'>): Partnership {
    const part: Partnership = {
      ...item,
      id: `part_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.partnerships.push(part);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'partnerships', part.id), sanitizeForFirestore(part)).catch(err => {
        console.warn('Firestore sync notice for partnership:', err?.message || err);
      });
    }

    return part;
  }

  updatePartnership(id: string, updates: Partial<Omit<Partnership, 'id' | 'createdAt' | 'updatedAt'>>): Partnership | null {
    const part = this.data.partnerships.find(p => p.id === id);
    if (!part) return null;
    Object.assign(part, updates);
    part.updatedAt = new Date().toISOString();
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'partnerships', id), sanitizeForFirestore(part), { merge: true }).catch(err => {
        console.warn('Firestore sync notice for partnership update:', err?.message || err);
      });
    }

    return part;
  }

  // Site Content
  getSiteContent(): SiteContent {
    return { ...this.data.siteContent };
  }

  updateSiteContent(updates: Partial<SiteContent>): SiteContent {
    this.data.siteContent = {
      ...this.data.siteContent,
      ...updates
    };
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'site_content', 'main'), sanitizeForFirestore(this.data.siteContent), { merge: true }).catch(err => {
        console.warn('Firestore sync notice for site content:', err?.message || err);
      });
    }

    return this.data.siteContent;
  }

  async updateLogo(logoData: { logoUrl?: string; logoAlt?: string; logoHeight?: number; logoSubtitle?: string }): Promise<SiteContent> {
    this.data.siteContent = {
      ...this.data.siteContent,
      logoUrl: logoData.logoUrl !== undefined ? logoData.logoUrl : this.data.siteContent.logoUrl,
      logoAlt: logoData.logoAlt !== undefined ? logoData.logoAlt : this.data.siteContent.logoAlt,
      logoHeight: typeof logoData.logoHeight === 'number' ? logoData.logoHeight : (this.data.siteContent.logoHeight || 36),
      logoSubtitle: logoData.logoSubtitle !== undefined ? logoData.logoSubtitle : this.data.siteContent.logoSubtitle,
    };
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'site_content', 'main'), sanitizeForFirestore(this.data.siteContent), { merge: true });
      } catch (err: any) {
        console.warn('Firestore sync notice for logo update:', err?.message || err);
      }
    }

    return this.data.siteContent;
  }

  // Staff & Auth
  getStaffUsers(): Omit<StaffUser, 'passwordHash' | 'salt'>[] {
    return this.data.staffUsers.map(({ passwordHash, salt, ...rest }) => rest);
  }

  findStaffByEmail(email: string): StaffUser | undefined {
    return this.data.staffUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createStaffUser(name: string, email: string, password: string, role: 'Admin' | 'Content Editor' | 'Enquiry Manager'): Omit<StaffUser, 'passwordHash' | 'salt'> {
    if (this.findStaffByEmail(email)) {
      throw new Error('User with this email already exists');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const user: StaffUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      email: email.toLowerCase(),
      name,
      role,
      passwordHash,
      salt,
      createdAt: new Date().toISOString()
    };
    this.data.staffUsers.push(user);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      const { passwordHash: _, salt: __, ...safeUser } = user;
      setDoc(doc(firestoreDb, 'users', user.id), sanitizeForFirestore(safeUser)).catch(err => {
        console.warn('Firestore sync notice for user:', err?.message || err);
      });
    }

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return safeUser;
  }

  deleteStaffUser(id: string): boolean {
    const idx = this.data.staffUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;
    const admins = this.data.staffUsers.filter(u => u.role === 'Admin');
    if (this.data.staffUsers[idx].role === 'Admin' && admins.length <= 1) {
      throw new Error('Cannot delete the last remaining administrator');
    }
    const [deletedUser] = this.data.staffUsers.splice(idx, 1);
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb && deletedUser) {
      deleteDoc(doc(firestoreDb, 'users', deletedUser.id)).catch(err => {
        console.warn('Firestore sync notice for user deletion:', err?.message || err);
      });
    }

    return true;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100);
  }

  addAuditLog(actorEmail: string, actorRole: string, action: string, entity: string, details: string): void {
    const log: AuditLog = {
      id: `log_${Date.now()}_${crypto.randomBytes(2).toString('hex')}`,
      timestamp: new Date().toISOString(),
      actorEmail,
      actorRole,
      action,
      entity,
      details
    };
    this.data.auditLogs.push(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(-500);
    }
    this.save();

    // Persist to Firebase Firestore
    if (firestoreDb) {
      setDoc(doc(firestoreDb, 'audit_logs', log.id), sanitizeForFirestore(log)).catch(err => {
        console.warn('Firestore sync notice for audit log:', err?.message || err);
      });
    }
  }
}

export const dbInstance = new Database();
export const db = dbInstance;
