import { supabase } from '../lib/db';

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
    const query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(note => ({
      id: note.id,
      content: note.content,
      tag: note.tag,
      status: note.status as 'draft' | 'ready',
      createdAt: new Date(note.created_at),
      originalContent: note.original_content,
      wordCount: note.word_count
    }));
  },

  async createNote(note: Omit<Note, 'id' | 'createdAt'> & { userId?: string }): Promise<Note> {
    const wordCount = note.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    const { data, error } = await supabase
      .from('notes')
      .insert({
        content: note.content,
        tag: note.tag,
        status: note.status,
        original_content: note.originalContent,
        word_count: wordCount,
        user_id: note.userId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      content: data.content,
      tag: data.tag,
      status: data.status as 'draft' | 'ready',
      createdAt: new Date(data.created_at),
      originalContent: data.original_content,
      wordCount: data.word_count
    };
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const wordCount = updates.content 
      ? updates.content.trim().split(/\s+/).filter(word => word.length > 0).length
      : undefined;
    
    const updateData: any = {};
    if (updates.content !== undefined) updateData.content = updates.content;
    if (updates.tag !== undefined) updateData.tag = updates.tag;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.originalContent !== undefined) updateData.original_content = updates.originalContent;
    if (wordCount !== undefined) updateData.word_count = wordCount;
    
    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      content: data.content,
      tag: data.tag,
      status: data.status as 'draft' | 'ready',
      createdAt: new Date(data.created_at),
      originalContent: data.original_content,
      wordCount: data.word_count
    };
  },

  async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getCurrentWeeklyTags(userId?: string): Promise<WeeklyTags | null> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const query = supabase
      .from('weekly_tags')
      .select('*')
      .gte('week_start', oneWeekAgo.toISOString())
      .order('week_start', { ascending: false })
      .limit(1);
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    const result = data[0];
    return {
      id: result.id,
      tag1: result.tag1,
      tag2: result.tag2,
      weekStart: new Date(result.week_start),
      weekEnd: new Date(result.week_end)
    };
  },

  async createWeeklyTags(tags: Omit<WeeklyTags, 'id'> & { userId?: string }): Promise<WeeklyTags> {
    const { data, error } = await supabase
      .from('weekly_tags')
      .insert({
        tag1: tags.tag1,
        tag2: tags.tag2,
        week_start: tags.weekStart.toISOString(),
        week_end: tags.weekEnd.toISOString(),
        user_id: tags.userId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      tag1: data.tag1,
      tag2: data.tag2,
      weekStart: new Date(data.week_start),
      weekEnd: new Date(data.week_end)
    };
  },

  async updateWeeklyTags(id: string, updates: Partial<WeeklyTags>): Promise<WeeklyTags> {
    const updateData: any = {};
    if (updates.tag1 !== undefined) updateData.tag1 = updates.tag1;
    if (updates.tag2 !== undefined) updateData.tag2 = updates.tag2;
    if (updates.weekStart !== undefined) updateData.week_start = updates.weekStart.toISOString();
    if (updates.weekEnd !== undefined) updateData.week_end = updates.weekEnd.toISOString();
    
    const { data, error } = await supabase
      .from('weekly_tags')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      tag1: data.tag1,
      tag2: data.tag2,
      weekStart: new Date(data.week_start),
      weekEnd: new Date(data.week_end)
    };
  }
};