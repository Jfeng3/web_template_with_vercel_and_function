import { db } from './config';
import { memo, tags, personas } from './schema';
import { eq } from 'drizzle-orm';

// Example queries you can use with Drizzle ORM

// Select all memos
export async function getAllMemos() {
  return await db.select().from(memo);
}

// Select memo with tags
export async function getMemoWithTags(memoId: string) {
  const memoData = await db
    .select()
    .from(memo)
    .where(eq(memo.id, memoId));
  
  const tagsData = await db
    .select()
    .from(tags)
    .where(eq(tags.memoId, memoId));
  
  return { memo: memoData[0], tags: tagsData };
}

// Insert a new memo
export async function createMemo(text: string, email: string) {
  return await db.insert(memo).values({
    textMemo: text,
    email: email,
  }).returning();
}

// Get all personas
export async function getAllPersonas() {
  return await db.select().from(personas);
}