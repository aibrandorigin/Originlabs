import { Router, Request, Response } from 'express';
import { db, verifyPassword } from './db.js';
import { createToken, requireAuth, requireRole, AuthenticatedRequest } from './auth.js';

export const apiRouter = Router();

// In-memory rate-limiter / spam-filter cache for public submissions
const recentSubmissions = new Map<string, number>();

// --- PUBLIC ROUTES ---

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.get('/content', (_req, res) => {
  const content = db.getSiteContent();
  res.json({ success: true, data: content });
});

apiRouter.get('/programs', (_req, res) => {
  const programs = db.getPrograms(true);
  res.json({ success: true, data: programs });
});

apiRouter.get('/events', (_req, res) => {
  const events = db.getEvents(true);
  res.json({ success: true, data: events });
});

apiRouter.get('/partnerships', (_req, res) => {
  const partnerships = db.getPartnerships(true);
  res.json({ success: true, data: partnerships });
});

// Enquiry Submission
apiRouter.post('/enquiries', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      orgName,
      category,
      currentStage,
      projectDescription,
      supportNeeded,
      preferredContactMethod,
      consent,
      honeypot // anti-spam bot field
    } = req.body;

    // Honeypot check
    if (honeypot) {
      // Silently accept bot submission without persisting
      res.status(200).json({ success: true, message: 'Enquiry received' });
      return;
    }

    // Input validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ error: 'Please enter your full name (minimum 2 characters).' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      res.status(400).json({ error: 'Please enter a valid phone number including country code.' });
      return;
    }

    const validCategories = [
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

    if (!category || !validCategories.includes(category)) {
      res.status(400).json({ error: 'Please select a valid enquiry category.' });
      return;
    }

    if (!currentStage || typeof currentStage !== 'string') {
      res.status(400).json({ error: 'Please select your current project stage.' });
      return;
    }

    if (!projectDescription || typeof projectDescription !== 'string' || projectDescription.trim().length < 10) {
      res.status(400).json({ error: 'Please provide a brief project description (at least 10 characters).' });
      return;
    }

    if (!supportNeeded || typeof supportNeeded !== 'string') {
      res.status(400).json({ error: 'Please describe the support you need.' });
      return;
    }

    if (!preferredContactMethod || typeof preferredContactMethod !== 'string') {
      res.status(400).json({ error: 'Please specify your preferred contact method.' });
      return;
    }

    if (!consent) {
      res.status(400).json({ error: 'You must consent to be contacted regarding your enquiry.' });
      return;
    }

    // Duplicate submission prevention (within 60 seconds from same email & category)
    const subKey = `${email.trim().toLowerCase()}_${category}`;
    const lastSubTime = recentSubmissions.get(subKey);
    const now = Date.now();
    if (lastSubTime && now - lastSubTime < 60000) {
      res.status(429).json({
        error: 'A similar enquiry was received moments ago. To avoid duplicates, please wait a minute before submitting again.'
      });
      return;
    }
    recentSubmissions.set(subKey, now);

    // Save to persistent database
    const enquiry = db.addEnquiry({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      orgName: orgName?.trim() || '',
      category,
      currentStage: currentStage.trim(),
      projectDescription: projectDescription.trim(),
      supportNeeded: supportNeeded.trim(),
      preferredContactMethod: preferredContactMethod.trim(),
      consent: Boolean(consent)
    });

    db.addAuditLog(
      'public_user',
      'Public',
      'SUBMIT_ENQUIRY',
      'Enquiry',
      `New enquiry #${enquiry.id} from ${enquiry.fullName} (${enquiry.category})`
    );

    res.status(201).json({
      success: true,
      data: {
        id: enquiry.id,
        fullName: enquiry.fullName,
        category: enquiry.category,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      },
      message: 'Thank you for reaching out to Origin Labs. Your enquiry has been saved and our engineering team will review it.'
    });
  } catch (err: any) {
    console.error('Enquiry submission error:', err);
    res.status(500).json({ error: 'Internal server error while processing your enquiry. Please retry.' });
  }
});

// Partnership Request Submission
apiRouter.post('/partnerships', (req: Request, res: Response) => {
  try {
    const { orgName, contactPerson, email, type, message } = req.body;

    if (!orgName || !contactPerson || !email || !type || !message) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email.' });
      return;
    }

    const partnership = db.createPartnership({
      orgName: orgName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim().toLowerCase(),
      type: type.trim(),
      message: message.trim(),
      status: 'review',
      isPublic: false
    });

    db.addAuditLog(
      'public_user',
      'Public',
      'SUBMIT_PARTNERSHIP',
      'Partnership',
      `Partnership proposal from ${partnership.orgName} (${partnership.type})`
    );

    res.status(201).json({
      success: true,
      data: partnership,
      message: 'Thank you for your interest in partnering with Origin Labs. Our partnerships team will connect shortly.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record partnership request.' });
  }
});

// --- AUTHENTICATION ---

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.findStaffByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = createToken(user);
    res.cookie('origin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    db.addAuditLog(
      user.email,
      user.role,
      'STAFF_LOGIN',
      'Auth',
      `Staff user ${user.email} (${user.role}) logged in.`
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login process error' });
  }
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('origin_auth');
  res.json({ success: true, message: 'Logged out' });
});

// --- ADMIN DASHBOARD & METRICS ---

apiRouter.get('/admin/dashboard', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const enquiries = db.getEnquiries();
  const programs = db.getPrograms();
  const events = db.getEvents();
  const partnerships = db.getPartnerships();
  const logs = db.getAuditLogs();

  const countsByCategory: Record<string, number> = {};
  enquiries.forEach(e => {
    countsByCategory[e.category] = (countsByCategory[e.category] || 0) + 1;
  });

  const countsByStatus: Record<string, number> = {
    New: 0,
    Contacted: 0,
    'Under Review': 0,
    'In Progress': 0,
    Closed: 0
  };
  enquiries.forEach(e => {
    countsByStatus[e.status] = (countsByStatus[e.status] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      metrics: {
        totalEnquiries: enquiries.length,
        newEnquiries: countsByStatus['New'] || 0,
        inReviewEnquiries: countsByStatus['Under Review'] || 0,
        inProgressEnquiries: countsByStatus['In Progress'] || 0,
        closedEnquiries: countsByStatus['Closed'] || 0,
        totalPrograms: programs.length,
        activePrograms: programs.filter(p => p.status === 'active').length,
        totalEvents: events.length,
        upcomingEvents: events.filter(e => e.status === 'upcoming').length,
        partnershipRequests: partnerships.length
      },
      countsByCategory,
      countsByStatus,
      recentEnquiries: enquiries.slice(0, 5),
      recentLogs: logs.slice(0, 8)
    }
  });
});

// --- ADMIN ENQUIRIES ---

apiRouter.get('/admin/enquiries', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { search, status, category, stage } = req.query;
  let enquiries = db.getEnquiries();

  if (status && typeof status === 'string' && status !== 'all') {
    enquiries = enquiries.filter(e => e.status.toLowerCase() === status.toLowerCase());
  }

  if (category && typeof category === 'string' && category !== 'all') {
    enquiries = enquiries.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  if (stage && typeof stage === 'string' && stage !== 'all') {
    enquiries = enquiries.filter(e => e.currentStage.toLowerCase() === stage.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    enquiries = enquiries.filter(
      e =>
        e.fullName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.phone.toLowerCase().includes(term) ||
        (e.orgName && e.orgName.toLowerCase().includes(term)) ||
        e.projectDescription.toLowerCase().includes(term)
    );
  }

  res.json({ success: true, data: enquiries });
});

apiRouter.get('/admin/enquiries/export', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const enquiries = db.getEnquiries();

  // CSV generation
  const headers = [
    'ID',
    'Full Name',
    'Email',
    'Phone',
    'Organisation',
    'Category',
    'Stage',
    'Status',
    'Assigned To',
    'Description',
    'Support Needed',
    'Preferred Contact',
    'Submitted At'
  ];

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = enquiries.map(e => [
    escapeCsv(e.id),
    escapeCsv(e.fullName),
    escapeCsv(e.email),
    escapeCsv(e.phone),
    escapeCsv(e.orgName || ''),
    escapeCsv(e.category),
    escapeCsv(e.currentStage),
    escapeCsv(e.status),
    escapeCsv(e.assignedTo || 'Unassigned'),
    escapeCsv(e.projectDescription),
    escapeCsv(e.supportNeeded),
    escapeCsv(e.preferredContactMethod),
    escapeCsv(e.createdAt)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="origin_labs_enquiries_${Date.now()}.csv"`);
  res.status(200).send(csvContent);
});

apiRouter.patch(
  '/admin/enquiries/:id',
  requireAuth,
  requireRole(['Admin', 'Enquiry Manager']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const updated = db.updateEnquiry(id, { status, assignedTo });
    if (!updated) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'UPDATE_ENQUIRY',
      'Enquiry',
      `Enquiry #${id} updated: status=${status || updated.status}, assigned=${assignedTo || updated.assignedTo}`
    );

    res.json({ success: true, data: updated });
  }
);

apiRouter.post(
  '/admin/enquiries/:id/notes',
  requireAuth,
  requireRole(['Admin', 'Enquiry Manager']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Note text cannot be empty' });
      return;
    }

    const note = db.addEnquiryNote(id, req.user!.name, text.trim());
    if (!note) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'ADD_NOTE',
      'Enquiry',
      `Added internal note to enquiry #${id}`
    );

    res.status(201).json({ success: true, data: note });
  }
);

apiRouter.delete(
  '/admin/enquiries/:id',
  requireAuth,
  requireRole(['Admin']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const success = db.deleteEnquiry(id);
    if (!success) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'DELETE_ENQUIRY',
      'Enquiry',
      `Deleted enquiry #${id}`
    );

    res.json({ success: true, message: 'Enquiry deleted' });
  }
);

// --- ADMIN PROGRAMS ---

apiRouter.get('/admin/programs', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const programs = db.getPrograms(false);
  res.json({ success: true, data: programs });
});

apiRouter.post(
  '/admin/programs',
  requireAuth,
  requireRole(['Admin', 'Content Editor']),
  (req: AuthenticatedRequest, res: Response) => {
    const {
      title,
      category,
      description,
      duration,
      format,
      status,
      applicationDeadline,
      cohortStartDate,
      deliverables,
      prerequisites
    } = req.body;

    if (!title || !category || !description) {
      res.status(400).json({ error: 'Title, category, and description are required' });
      return;
    }

    const program = db.createProgram({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      duration: duration?.trim() || '8 Weeks',
      format: format?.trim() || 'Hybrid',
      status: status || 'draft',
      applicationDeadline: applicationDeadline || undefined,
      cohortStartDate: cohortStartDate || undefined,
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      prerequisites: Array.isArray(prerequisites) ? prerequisites : []
    });

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'CREATE_PROGRAM',
      'Program',
      `Created program "${program.title}" (${program.status})`
    );

    res.status(201).json({ success: true, data: program });
  }
);

apiRouter.put(
  '/admin/programs/:id',
  requireAuth,
  requireRole(['Admin', 'Content Editor']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updated = db.updateProgram(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'UPDATE_PROGRAM',
      'Program',
      `Updated program "${updated.title}"`
    );

    res.json({ success: true, data: updated });
  }
);

apiRouter.delete(
  '/admin/programs/:id',
  requireAuth,
  requireRole(['Admin']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const success = db.deleteProgram(id);
    if (!success) {
      res.status(404).json({ error: 'Program not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'DELETE_PROGRAM',
      'Program',
      `Deleted program #${id}`
    );

    res.json({ success: true, message: 'Program deleted' });
  }
);

// --- ADMIN EVENTS ---

apiRouter.get('/admin/events', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const events = db.getEvents(false);
  res.json({ success: true, data: events });
});

apiRouter.post(
  '/admin/events',
  requireAuth,
  requireRole(['Admin', 'Content Editor']),
  (req: AuthenticatedRequest, res: Response) => {
    const {
      title,
      description,
      category,
      dateTime,
      timezone,
      venueOrLink,
      isOnline,
      bannerUrl,
      registrationUrl,
      status
    } = req.body;

    if (!title || !description || !dateTime) {
      res.status(400).json({ error: 'Title, description, and date/time are required' });
      return;
    }

    const event = db.createEvent({
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || 'Workshop',
      dateTime,
      timezone: timezone || 'UTC',
      venueOrLink: venueOrLink?.trim() || '',
      isOnline: Boolean(isOnline),
      bannerUrl: bannerUrl?.trim() || undefined,
      registrationUrl: registrationUrl?.trim() || '',
      status: status || 'draft'
    });

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'CREATE_EVENT',
      'Event',
      `Created event "${event.title}"`
    );

    res.status(201).json({ success: true, data: event });
  }
);

apiRouter.put(
  '/admin/events/:id',
  requireAuth,
  requireRole(['Admin', 'Content Editor']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updated = db.updateEvent(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'UPDATE_EVENT',
      'Event',
      `Updated event "${updated.title}"`
    );

    res.json({ success: true, data: updated });
  }
);

apiRouter.delete(
  '/admin/events/:id',
  requireAuth,
  requireRole(['Admin']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const success = db.deleteEvent(id);
    if (!success) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'DELETE_EVENT',
      'Event',
      `Deleted event #${id}`
    );

    res.json({ success: true, message: 'Event deleted' });
  }
);

// --- ADMIN PARTNERSHIPS ---

apiRouter.get('/admin/partnerships', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const partnerships = db.getPartnerships(false);
  res.json({ success: true, data: partnerships });
});

apiRouter.patch(
  '/admin/partnerships/:id',
  requireAuth,
  requireRole(['Admin', 'Enquiry Manager', 'Content Editor']),
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updated = db.updatePartnership(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Partnership record not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'UPDATE_PARTNERSHIP',
      'Partnership',
      `Updated partnership #${id} (${updated.orgName}): status=${updated.status}, public=${updated.isPublic}`
    );

    res.json({ success: true, data: updated });
  }
);

// --- ADMIN WEBSITE CONTENT & SETTINGS ---

apiRouter.get('/admin/content', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const content = db.getSiteContent();
  res.json({ success: true, data: content });
});

apiRouter.put(
  '/admin/content',
  requireAuth,
  requireRole(['Admin', 'Content Editor']),
  (req: AuthenticatedRequest, res: Response) => {
    const updated = db.updateSiteContent(req.body);
    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'UPDATE_SITE_CONTENT',
      'SiteContent',
      'Updated website homepage and settings content.'
    );
    res.json({ success: true, data: updated, message: 'Website content updated successfully.' });
  }
);

apiRouter.put(
  '/admin/logo',
  requireAuth,
  requireRole(['Admin', 'Content Editor']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { logoUrl, logoAlt, logoHeight, logoSubtitle } = req.body;
      const updated = await db.updateLogo({
        logoUrl: typeof logoUrl === 'string' ? logoUrl : '',
        logoAlt: typeof logoAlt === 'string' ? logoAlt : 'Origin Labs',
        logoHeight: typeof logoHeight === 'number' ? logoHeight : 36,
        logoSubtitle: typeof logoSubtitle === 'string' ? logoSubtitle : ''
      });
      db.addAuditLog(
        req.user!.email,
        req.user!.role,
        'UPDATE_LOGO',
        'SiteContent',
        `Updated brand logo in database (custom: ${Boolean(logoUrl)}, height: ${logoHeight || 36}px)`
      );
      res.json({
        success: true,
        data: updated,
        message: 'Brand logo updated and saved in the database successfully.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to update logo in database.' });
    }
  }
);

// --- ADMIN STAFF & PERMISSIONS ---

apiRouter.get('/admin/staff', requireAuth, requireRole(['Admin']), (_req: AuthenticatedRequest, res: Response) => {
  const staff = db.getStaffUsers();
  res.json({ success: true, data: staff });
});

apiRouter.post('/admin/staff', requireAuth, requireRole(['Admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Name, email, password, and role are required' });
      return;
    }

    if (!['Admin', 'Content Editor', 'Enquiry Manager'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const newUser = db.createStaffUser(name.trim(), email.trim(), password, role);

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'CREATE_STAFF_USER',
      'StaffUser',
      `Created staff user ${newUser.email} (${newUser.role})`
    );

    res.status(201).json({ success: true, data: newUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create staff account' });
  }
});

apiRouter.delete('/admin/staff/:id', requireAuth, requireRole(['Admin']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteStaffUser(id);
    if (!success) {
      res.status(404).json({ error: 'Staff user not found' });
      return;
    }

    db.addAuditLog(
      req.user!.email,
      req.user!.role,
      'DELETE_STAFF_USER',
      'StaffUser',
      `Deleted staff user #${id}`
    );

    res.json({ success: true, message: 'Staff member removed' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to delete staff member' });
  }
});

// --- ADMIN AUDIT LOGS ---

apiRouter.get('/admin/audit-logs', requireAuth, requireRole(['Admin']), (_req: AuthenticatedRequest, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ success: true, data: logs });
});
