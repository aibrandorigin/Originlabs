import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db, StaffUser } from './db.js';

const AUTH_SECRET = process.env.AUTH_SECRET || 'origin_labs_jwt_secret_salt_9988_tech';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Content Editor' | 'Enquiry Manager';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function createToken(user: StaffUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadB64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return null;
    }
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    };
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token && req.cookies?.origin_auth) {
    token = req.cookies.origin_auth;
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  req.user = user;
  next();
}

export function requireRole(allowedRoles: ('Admin' | 'Content Editor' | 'Enquiry Manager')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Role "${req.user.role}" does not have permission to perform this action.`
      });
      return;
    }
    next();
  };
}
