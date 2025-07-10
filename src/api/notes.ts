import { db } from '../lib/db';
import { notes, weeklyTags } from '../db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

export interface Note {
  id: string;
  content: string;
  tag: string;
  status: 'draft' | 'ready';
  createdAt: Date;
  originalContent?: string | null;
  wordCount: number;
}

export interface WeeklyTags {
  id: string;
  tag1: string;
  tag2: string;
  weekStart: Date;
  weekEnd: Date;
}

export const notesApi = {
  async getAllNotes(userId?: string): Promise<Note[]> {
    const result = await db
      .select()
      .from(notes)
      .where(userId ? eq(notes.userId, userId) : undefined)
      .orderBy(desc(notes.createdAt));
    
    return result.map(note => ({
      id: note.id,
      content: note.content,
      tag: note.tag,
      status: note.status as 'draft' | 'ready',
      createdAt: note.createdAt,
      originalContent: note.originalContent,
      wordCount: note.wordCount
    }));
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt'> & { userId?: string }): Promise<Note> {
    const wordCount = note.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    const [result] = await db
      .insert(notes)
      .values({
        content: note.content,
        tag: note.tag,
        status: note.status,
        originalContent: note.originalContent,
        wordCount: wordCount,
        userId: note.userId
      })
      .returning();
    
    return {
      id: result.id,
      content: result.content,
      tag: result.tag,
      status: result.status as 'draft' | 'ready',
      createdAt: result.createdAt,
      originalContent: result.originalContent,
      wordCount: result.wordCount
    };
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const wordCount = updates.content 
      ? updates.content.trim().split(/\s+/).filter(word => word.length > 0).length
      : undefined;
    
    const [result] = await db
      .update(notes)
      .set({
        content: updates.content,
        tag: updates.tag,
        status: updates.status,
        originalContent: updates.originalContent,
        wordCount: wordCount,
        updatedAt: new Date()
      })
      .where(eq(notes.id, id))
      .returning();
    
    return {
      id: result.id,
      content: result.content,
      tag: result.tag,
      status: result.status as 'draft' | 'ready',
      createdAt: result.createdAt,
      originalContent: result.originalContent,
      wordCount: result.wordCount
    };
  },

  async deleteNote(id: string): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  },

  async getCurrentWeeklyTags(userId?: string): Promise<WeeklyTags | null> {
    const now = new Date();
    const result = await db
      .select()
      .from(weeklyTags)
      .where(
        and(
          userId ? eq(weeklyTags.userId, userId) : undefined,
          gte(weeklyTags.weekStart, new Date(now.setDate(now.getDate() - 7)))
        )
      )
      .orderBy(desc(weeklyTags.weekStart))
      .limit(1);
    
    if (result.length === 0) return null;
    
    return {
      id: result[0].id,
      tag1: result[0].tag1,
      tag2: result[0].tag2,
      weekStart: result[0].weekStart,
      weekEnd: result[0].weekEnd
    };
  },

  async createWeeklyTags(tags: Omit<WeeklyTags, 'id'> & { userId?: string }): Promise<WeeklyTags> {
    const [result] = await db
      .insert(weeklyTags)
      .values({
        tag1: tags.tag1,
        tag2: tags.tag2,
        weekStart: tags.weekStart,
        weekEnd: tags.weekEnd,
        userId: tags.userId
      })
      .returning();
    
    return {
      id: result.id,
      tag1: result.tag1,
      tag2: result.tag2,
      weekStart: result.weekStart,
      weekEnd: result.weekEnd
    };
  },

  async updateWeeklyTags(id: string, updates: Partial<WeeklyTags>): Promise<WeeklyTags> {
    const [result] = await db
      .update(weeklyTags)
      .set({
        tag1: updates.tag1,
        tag2: updates.tag2,
        weekStart: updates.weekStart,
        weekEnd: updates.weekEnd,
        updatedAt: new Date()
      })
      .where(eq(weeklyTags.id, id))
      .returning();
    
    return {
      id: result.id,
      tag1: result.tag1,
      tag2: result.tag2,
      weekStart: result.weekStart,
      weekEnd: result.weekEnd
    };
  }
};