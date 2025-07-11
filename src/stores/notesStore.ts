import { create } from 'zustand';
import { notesApi, type Note, type WeeklyTags } from '../api/notes';

interface NotesStore {
  // Core Data
  notes: Note[];
  weeklyTags: WeeklyTags;
  
  // UI State
  isWriting: boolean;
  currentNote: string;
  selectedTag: string;
  wordCount: number;
  editingNote: string | null;
  draggedNote: Note | null;
  
  // App State
  loading: boolean;
  error: string | null;
  
  // Filters
  filterStatus: 'all' | 'draft' | 'ready';
  filterTag: string | null;
  sidebarCollapsed: boolean;
  
  // Data Actions
  loadNotes: () => Promise<void>;
  loadWeeklyTags: () => Promise<void>;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // UI Actions
  setIsWriting: (writing: boolean) => void;
  setCurrentNote: (note: string) => void;
  setSelectedTag: (tag: string) => void;
  setEditingNote: (id: string | null) => void;
  setDraggedNote: (note: Note | null) => void;
  setFilterStatus: (status: 'all' | 'draft' | 'ready') => void;
  setFilterTag: (tag: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed Properties
  filteredNotes: () => Note[];
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  // Initial State
  notes: [],
  weeklyTags: {
    id: '',
    tag1: 'productivity',
    tag2: 'creativity',
    weekStart: new Date(),
    weekEnd: new Date()
  },
  
  // UI State
  isWriting: false,
  currentNote: '',
  selectedTag: '',
  wordCount: 0,
  editingNote: null,
  draggedNote: null,
  
  // App State
  loading: false,
  error: null,
  
  // Filters
  filterStatus: 'all',
  filterTag: null,
  sidebarCollapsed: false,
  
  // Data Actions
  loadNotes: async () => {
    try {
      set({ loading: true, error: null });
      const fetchedNotes = await notesApi.getAllNotes();
      set({ notes: fetchedNotes, loading: false });
    } catch (err) {
      set({ error: 'Failed to load notes', loading: false });
      console.error('Error loading notes:', err);
    }
  },
  
  loadWeeklyTags: async () => {
    try {
      const tags = await notesApi.getCurrentWeeklyTags();
      if (tags) {
        set({ weeklyTags: tags });
      } else {
        // Create default weekly tags
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const newTags = await notesApi.createWeeklyTags({
          tag1: 'productivity',
          tag2: 'creativity',
          weekStart,
          weekEnd
        });
        set({ weeklyTags: newTags });
      }
    } catch (err) {
      console.error('Error loading weekly tags:', err);
    }
  },
  
  createNote: async (noteData) => {
    try {
      set({ loading: true, error: null });
      const newNote = await notesApi.createNote(noteData);
      set(state => ({
        notes: [...state.notes, newNote],
        loading: false,
        isWriting: false,
        currentNote: '',
        wordCount: 0
      }));
    } catch (err) {
      set({ error: 'Failed to save note', loading: false });
      console.error('Error saving note:', err);
    }
  },
  
  updateNote: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const updatedNote = await notesApi.updateNote(id, updates);
      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? updatedNote : note
        ),
        loading: false,
        editingNote: null
      }));
    } catch (err) {
      set({ error: 'Failed to update note', loading: false });
      console.error('Error updating note:', err);
    }
  },
  
  deleteNote: async (id) => {
    try {
      set({ loading: true, error: null });
      await notesApi.deleteNote(id);
      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        loading: false
      }));
    } catch (err) {
      set({ error: 'Failed to delete note', loading: false });
      console.error('Error deleting note:', err);
    }
  },
  
  // UI Actions
  setIsWriting: (writing) => set({ isWriting: writing }),
  
  setCurrentNote: (note) => {
    const words = note.trim().split(/\s+/).filter(word => word.length > 0);
    set({ currentNote: note, wordCount: words.length });
  },
  
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  
  setEditingNote: (id) => set({ editingNote: id }),
  
  setDraggedNote: (note) => set({ draggedNote: note }),
  
  setFilterStatus: (status) => set({ filterStatus: status }),
  
  setFilterTag: (tag) => set({ filterTag: tag }),
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  setError: (error) => set({ error }),
  
  // Computed Properties
  filteredNotes: () => {
    const { notes, filterStatus, filterTag } = get();
    return notes.filter(note => {
      const statusMatch = filterStatus === 'all' || note.status === filterStatus;
      const tagMatch = !filterTag || note.tag === filterTag;
      return statusMatch && tagMatch;
    });
  }
}));