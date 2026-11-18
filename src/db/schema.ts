import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

// Users table with Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('Admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Enquiries submitted through the persistent engineering form
export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  enquiryId: text('enquiry_id').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').default(''),
  orgName: text('org_name').default(''),
  category: text('category').notNull(),
  currentStage: text('current_stage').notNull(),
  projectDescription: text('project_description').notNull(),
  supportNeeded: text('support_needed').default(''),
  preferredContactMethod: text('preferred_contact_method').default('Email'),
  consent: boolean('consent').default(true),
  status: text('status').default('New'),
  assignedTo: text('assigned_to'),
  internalNotes: jsonb('internal_notes').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Accelerator & Technical Cohort Programs
export const programs = pgTable('programs', {
  id: serial('id').primaryKey(),
  programId: text('program_id').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  duration: text('duration').notNull(),
  format: text('format').notNull(),
  status: text('status').default('active'),
  applicationDeadline: text('application_deadline'),
  cohortStartDate: text('cohort_start_date'),
  deliverables: jsonb('deliverables').default([]),
  prerequisites: jsonb('prerequisites').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Builder Meetups, Teardowns & Ecosystem Events
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  eventId: text('event_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  dateTime: text('date_time').notNull(),
  timezone: text('timezone').default('GMT+8'),
  venueOrLink: text('venue_or_link').notNull(),
  isOnline: boolean('is_online').default(false),
  bannerUrl: text('banner_url'),
  registrationUrl: text('registration_url').notNull(),
  status: text('status').default('upcoming'),
  registrationsCount: integer('registrations_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Strategic Ecosystem Partnerships
export const partnerships = pgTable('partnerships', {
  id: serial('id').primaryKey(),
  partnershipId: text('partnership_id').notNull().unique(),
  orgName: text('org_name').notNull(),
  contactPerson: text('contact_person').default(''),
  email: text('email').default(''),
  type: text('type').notNull(),
  message: text('message').notNull(),
  status: text('status').default('review'),
  isPublic: boolean('is_public').default(false),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Security & Operations Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  logId: text('log_id').notNull().unique(),
  timestamp: timestamp('timestamp').defaultNow(),
  actorEmail: text('actor_email').notNull(),
  actorRole: text('actor_role').default('Staff'),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  details: text('details').default(''),
});

// Dynamic Content Management
export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique().default('main'),
  heroHeadline: text('hero_headline').notNull(),
  heroSupporting: text('hero_supporting').notNull(),
  visionHeadline: text('vision_headline').notNull(),
  visionDescription: text('vision_description').notNull(),
  marqueeItems: jsonb('marquee_items').default([]),
  updatedAt: timestamp('updated_at').defaultNow(),
});
