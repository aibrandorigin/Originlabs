import { db } from '../db/index.ts';
import {
  enquiries,
  programs,
  events,
  partnerships,
  siteContent,
  auditLogs,
  users,
} from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class CloudSqlService {
  // --- ENQUIRIES ---
  static async createEnquiry(data: {
    fullName: string;
    email: string;
    phone?: string;
    orgName?: string;
    category: string;
    currentStage: string;
    projectDescription: string;
    supportNeeded?: string;
    preferredContactMethod?: string;
    consent?: boolean;
  }) {
    try {
      const enquiryId = `enq_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const [record] = await db
        .insert(enquiries)
        .values({
          enquiryId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || '',
          orgName: data.orgName || '',
          category: data.category,
          currentStage: data.currentStage,
          projectDescription: data.projectDescription,
          supportNeeded: data.supportNeeded || '',
          preferredContactMethod: data.preferredContactMethod || 'Email',
          consent: data.consent !== false,
          status: 'New',
          internalNotes: [],
        })
        .returning();
      return record;
    } catch (error) {
      console.error('Cloud SQL createEnquiry error:', error);
      throw new Error('Database operation failed while recording enquiry', { cause: error });
    }
  }

  static async getEnquiries() {
    try {
      return await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    } catch (error) {
      console.error('Cloud SQL getEnquiries error:', error);
      throw new Error('Database query failed while fetching enquiries', { cause: error });
    }
  }

  static async updateEnquiryStatus(enquiryId: string, status: string, assignedTo?: string) {
    try {
      const [updated] = await db
        .update(enquiries)
        .set({
          status,
          ...(assignedTo !== undefined ? { assignedTo } : {}),
          updatedAt: new Date(),
        })
        .where(eq(enquiries.enquiryId, enquiryId))
        .returning();
      return updated;
    } catch (error) {
      console.error('Cloud SQL updateEnquiryStatus error:', error);
      throw new Error('Database operation failed while updating enquiry', { cause: error });
    }
  }

  // --- PROGRAMS ---
  static async getPrograms(onlyActive = false) {
    try {
      const query = db.select().from(programs);
      if (onlyActive) {
        return await query.where(eq(programs.status, 'active')).orderBy(desc(programs.createdAt));
      }
      return await query.orderBy(desc(programs.createdAt));
    } catch (error) {
      console.error('Cloud SQL getPrograms error:', error);
      throw new Error('Database query failed while fetching programs', { cause: error });
    }
  }

  static async createProgram(data: {
    title: string;
    category: string;
    description: string;
    duration: string;
    format: string;
    status?: string;
    applicationDeadline?: string;
    cohortStartDate?: string;
    deliverables?: string[];
    prerequisites?: string[];
  }) {
    try {
      const programId = `prog_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const [record] = await db
        .insert(programs)
        .values({
          programId,
          title: data.title,
          category: data.category,
          description: data.description,
          duration: data.duration,
          format: data.format,
          status: data.status || 'active',
          applicationDeadline: data.applicationDeadline || '',
          cohortStartDate: data.cohortStartDate || '',
          deliverables: data.deliverables || [],
          prerequisites: data.prerequisites || [],
        })
        .returning();
      return record;
    } catch (error) {
      console.error('Cloud SQL createProgram error:', error);
      throw new Error('Database operation failed while creating program', { cause: error });
    }
  }

  // --- EVENTS ---
  static async getEvents(onlyUpcoming = false) {
    try {
      const query = db.select().from(events);
      if (onlyUpcoming) {
        return await query.where(eq(events.status, 'upcoming')).orderBy(desc(events.createdAt));
      }
      return await query.orderBy(desc(events.createdAt));
    } catch (error) {
      console.error('Cloud SQL getEvents error:', error);
      throw new Error('Database query failed while fetching events', { cause: error });
    }
  }

  static async createEvent(data: {
    title: string;
    description: string;
    category: string;
    dateTime: string;
    timezone?: string;
    venueOrLink: string;
    isOnline?: boolean;
    bannerUrl?: string;
    registrationUrl: string;
  }) {
    try {
      const eventId = `evt_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const [record] = await db
        .insert(events)
        .values({
          eventId,
          title: data.title,
          description: data.description,
          category: data.category,
          dateTime: data.dateTime,
          timezone: data.timezone || 'GMT+8',
          venueOrLink: data.venueOrLink,
          isOnline: Boolean(data.isOnline),
          bannerUrl: data.bannerUrl || '',
          registrationUrl: data.registrationUrl,
          status: 'upcoming',
          registrationsCount: 0,
        })
        .returning();
      return record;
    } catch (error) {
      console.error('Cloud SQL createEvent error:', error);
      throw new Error('Database operation failed while creating event', { cause: error });
    }
  }

  // --- PARTNERSHIPS ---
  static async getPartnerships(onlyPublic = false) {
    try {
      const query = db.select().from(partnerships);
      if (onlyPublic) {
        return await query.where(eq(partnerships.isPublic, true)).orderBy(desc(partnerships.createdAt));
      }
      return await query.orderBy(desc(partnerships.createdAt));
    } catch (error) {
      console.error('Cloud SQL getPartnerships error:', error);
      throw new Error('Database query failed while fetching partnerships', { cause: error });
    }
  }

  static async createPartnership(data: {
    orgName: string;
    contactPerson?: string;
    email?: string;
    type: string;
    message: string;
  }) {
    try {
      const partnershipId = `part_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      const [record] = await db
        .insert(partnerships)
        .values({
          partnershipId,
          orgName: data.orgName,
          contactPerson: data.contactPerson || '',
          email: data.email || '',
          type: data.type,
          message: data.message,
          status: 'review',
          isPublic: false,
        })
        .returning();
      return record;
    } catch (error) {
      console.error('Cloud SQL createPartnership error:', error);
      throw new Error('Database operation failed while recording partnership', { cause: error });
    }
  }

  // --- AUDIT LOGS ---
  static async logAction(actorEmail: string, actorRole: string, action: string, entity: string, details = '') {
    try {
      const logId = `log_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
      await db.insert(auditLogs).values({
        logId,
        actorEmail,
        actorRole,
        action,
        entity,
        details,
      });
    } catch (error) {
      console.warn('Audit log write to Cloud SQL failed (non-blocking):', error);
    }
  }

  // --- USERS ---
  static async syncUser(uid: string, email: string, name?: string) {
    try {
      const [record] = await db
        .insert(users)
        .values({
          uid,
          email,
          name: name || email.split('@')[0],
          role: 'Admin',
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            ...(name ? { name } : {}),
          },
        })
        .returning();
      return record;
    } catch (error) {
      console.error('Cloud SQL syncUser error:', error);
      throw new Error('Database user synchronization failed', { cause: error });
    }
  }
}
