import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  try {
    const result = await db
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

    return result[0];
  } catch (error) {
    console.error('Failed to getOrCreateUser in Cloud SQL:', error);
    // Fallback: try querying by uid
    try {
      const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
      if (existing.length > 0) return existing[0];
    } catch (queryErr) {
      console.error('Fallback query error:', queryErr);
    }
    throw new Error('Database user synchronization failed', { cause: error });
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Failed to fetch users from Cloud SQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
