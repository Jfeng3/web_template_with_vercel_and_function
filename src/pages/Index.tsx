import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Check, X } from 'lucide-react';
import { notesApi, type Note, type WeeklyTags } from '../api/notes';

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [weeklyTags, setWeeklyTags] = useState<WeeklyTags>({ 
    id: '',
    tag1: 'productivity', 
    tag2: 'creativity',
    weekStart: new Date(),
    weekEnd: new Date()
  });
  const [isWriting, setIsWriting] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [draggedNote, setDraggedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const words = currentNote.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [currentNote]);

  // Load notes and weekly tags on mount
  useEffect(() => {
    loadNotes();
    loadWeeklyTags();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await notesApi.getAllNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyTags = async () => {
    try {
      const tags = await notesApi.getCurrentWeeklyTags();
      if (tags) {
        setWeeklyTags(tags);
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
        setWeeklyTags(newTags);
      }
    } catch (err) {
      console.error('Error loading weekly tags:', err);
    }
  };

  const handleNewNote = () => {
    setIsWriting(true);
    setCurrentNote('');
    setSelectedTag(weeklyTags.tag1);
  };

  const handleSaveNote = async () => {
    if (currentNote.trim() && selectedTag && wordCount <= 300) {
      try {
        setLoading(true);
        const newNote = await notesApi.createNote({
          content: currentNote,
          tag: selectedTag,
          status: 'draft',
          wordCount
        });
        setNotes([...notes, newNote]);
        setIsWriting(false);
        setCurrentNote('');
        setError(null);
      } catch (err) {
        setError('Failed to save note');
        console.error('Error saving note:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setCurrentNote(note.content);
      setSelectedTag(note.tag);
      setIsWriting(true);
    }
  };

  const handleUpdateNote = async () => {
    if (editingNote && wordCount <= 300) {
      try {
        setLoading(true);
        const updatedNote = await notesApi.updateNote(editingNote, {
          content: currentNote,
          tag: selectedTag,
          wordCount
        });
        setNotes(notes.map(note => 
          note.id === editingNote ? updatedNote : note
        ));
        setEditingNote(null);
        setIsWriting(false);
        setCurrentNote('');
        setError(null);
      } catch (err) {
        setError('Failed to update note');
        console.error('Error updating note:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, note: Note) => {
    setDraggedNote(note);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: 'draft' | 'ready') => {
    e.preventDefault();
    if (draggedNote) {
      try {
        setLoading(true);
        const updatedNote = await notesApi.updateNote(draggedNote.id, { status });
        setNotes(notes.map(note => 
          note.id === draggedNote.id ? updatedNote : note
        ));
        setDraggedNote(null);
        setError(null);
      } catch (err) {
        setError('Failed to update note status');
        console.error('Error updating note status:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const draftNotes = notes.filter(n => n.status === 'draft');
  const readyNotes = notes.filter(n => n.status === 'ready');

  return (
    <div className="min-h-screen bg-[#fffef9]">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#E5E5EA] px-8 py-6 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Daily Notes Writer</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#71717A]">
              Week Focus: <span className="font-medium text-black">{weeklyTags.tag1}</span> & <span className="font-medium text-black">{weeklyTags.tag2}</span>
            </div>
            <button
              onClick={handleNewNote}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              New Note
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-8 py-4 max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Writing Panel */}
        {isWriting && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5EA] p-6 mb-8">
            <div className="mb-4">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Start writing your note..."
                className="w-full px-4 py-3 border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none h-32"
                maxLength={1500}
              />
              <div className="flex justify-between items-center mt-2">
                <div className={`text-sm ${wordCount > 300 ? 'text-red-500' : 'text-[#71717A]'}`}>
                  {wordCount}/300 words
                </div>
                <button className="text-black border border-[#E5E5EA] rounded-lg px-3 py-1 text-sm hover:bg-[#fffef9]">
                  Apply My Style
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 border border-[#E5E5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value={weeklyTags.tag1}>{weeklyTags.tag1}</option>
                <option value={weeklyTags.tag2}>{weeklyTags.tag2}</option>
              </select>

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => {
                    setIsWriting(false);
                    setEditingNote(null);
                    setCurrentNote('');
                  }}
                  className="text-black border border-[#E5E5EA] rounded-lg px-4 py-2 hover:bg-[#fffef9]"
                >
                  Cancel
                </button>
                <button
                  onClick={editingNote ? handleUpdateNote : handleSaveNote}
                  disabled={wordCount > 300 || !currentNote.trim() || loading}
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingNote ? 'Update' : 'Save to Draft'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Two-Stage Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Draft Column */}
          <div 
            className="bg-white rounded-2xl shadow-sm border border-[#E5E5EA] p-6"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'draft')}
          >
            <h2 className="text-lg font-semibold text-black mb-4">Draft</h2>
            <div className="space-y-3">
              {draftNotes.map(note => (
                <div
                  key={note.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, note)}
                  className="bg-[#fffef9] rounded-lg p-4 cursor-move hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">
                      {note.tag}
                    </span>
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="text-[#71717A] hover:text-black"
                    >
                      <Edit3 size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-black line-clamp-3">
                    {note.content}
                  </p>
                  <p className="text-xs text-[#71717A] mt-2">
                    {note.content.split(/\s+/).filter(w => w).length} words
                  </p>
                </div>
              ))}
              {draftNotes.length === 0 && (
                <p className="text-[#71717A] text-sm text-center py-8">
                  No drafts yet. Start writing!
                </p>
              )}
            </div>
          </div>

          {/* Ready to Post Column */}
          <div 
            className="bg-white rounded-2xl shadow-sm border border-[#E5E5EA] p-6"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'ready')}
          >
            <h2 className="text-lg font-semibold text-black mb-4">Ready to Post</h2>
            <div className="space-y-3">
              {readyNotes.map(note => (
                <div
                  key={note.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, note)}
                  className="bg-[#fffef9] rounded-lg p-4 cursor-move hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-black text-white px-2 py-1 rounded">
                      {note.tag}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(note.content)}
                      className="text-[#71717A] hover:text-black"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-black line-clamp-3">
                    {note.content}
                  </p>
                  <p className="text-xs text-[#71717A] mt-2">
                    Ready to publish
                  </p>
                </div>
              ))}
              {readyNotes.length === 0 && (
                <p className="text-[#71717A] text-sm text-center py-8">
                  Drag polished notes here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}