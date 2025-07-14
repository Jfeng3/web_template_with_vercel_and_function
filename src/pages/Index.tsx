import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Check } from 'lucide-react';
import { useNotesStore } from '../stores/notesStore';
import Sidebar from '../components/Sidebar';
import AIAssistantButtons from '../components/AIAssistantButtons';
import AIResponseModal from '../components/AIResponseModal';
import { getCriticFeedback, getRephraseOptions } from '../api/openai';

export default function Index() {
  const {
    notes,
    weeklyTags,
    isWriting,
    currentNote,
    selectedTag,
    wordCount,
    editingNote,
    draggedNote,
    loading,
    error,
    filterStatus,
    filterTag,
    sidebarCollapsed,
    loadNotes,
    loadWeeklyTags,
    createNote,
    updateNote,
    setIsWriting,
    setCurrentNote,
    setSelectedTag,
    setEditingNote,
    setDraggedNote,
    setFilterStatus,
    setFilterTag,
    setSidebarCollapsed,
    setError,
    filteredNotes
  } = useNotesStore();

  // AI Assistant state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'critic' | 'rephrase'>('critic');
  const [aiResponse, setAiResponse] = useState<any>({});
  const [aiLoading, setAiLoading] = useState(false);

  // Load notes and weekly tags on mount
  useEffect(() => {
    loadNotes();
    loadWeeklyTags();
  }, [loadNotes, loadWeeklyTags]);

  const handleNewNote = () => {
    setCurrentNote('');
    setSelectedTag(weeklyTags.tag1);
    setEditingNote(null);
  };

  const handleSaveNote = async () => {

    if (currentNote.trim() && wordCount <= 300) {
      console.log('createNote', currentNote, selectedTag, wordCount);
      await createNote({
        content: currentNote,
        tag: selectedTag || weeklyTags.tag1,
        status: 'draft',
        wordCount
      });
    }
  };

  const handleEditNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setCurrentNote(note.content);
      setSelectedTag(note.tag);
    }
  };

  const handleUpdateNote = async () => {
    if (editingNote && wordCount <= 300) {
      await updateNote(editingNote, {
        content: currentNote,
        tag: selectedTag,
        wordCount
      });
    }
  };

  const handleDragStart = (_e: React.DragEvent, note: any) => {
    setDraggedNote(note);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: 'draft' | 'ready') => {
    e.preventDefault();
    if (draggedNote) {
      await updateNote(draggedNote.id, { status });
      setDraggedNote(null);
    }
  };

  const handleCritic = async () => {
    if (!currentNote.trim()) return;
    
    setAiLoading(true);
    setAiModalType('critic');
    setAiModalOpen(true);
    
    try {
      const response = await getCriticFeedback(currentNote);
      setAiResponse(response);
    } catch (error) {
      setError('Failed to get AI feedback. Please try again.');
      setAiModalOpen(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRephrase = async () => {
    if (!currentNote.trim()) return;
    
    setAiLoading(true);
    setAiModalType('rephrase');
    setAiModalOpen(true);
    
    try {
      const response = await getRephraseOptions(currentNote);
      setAiResponse(response);
    } catch (error) {
      setError('Failed to get AI rephrase options. Please try again.');
      setAiModalOpen(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyRephrase = (content: string) => {
    setCurrentNote(content);
    setAiModalOpen(false);
  };

  // Apply filters
  const filtered = filteredNotes();
  const draftNotes = filtered.filter(n => n.status === 'draft');
  const readyNotes = filtered.filter(n => n.status === 'ready');

  return (
    <div className="min-h-screen bg-[#fffef9] flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#E5E5EA] px-8 py-6 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Daily Notes Writer</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#71717A]">
              Week Focus: <span className="font-medium text-black">{weeklyTags.tag1}</span> & <span className="font-medium text-black">{weeklyTags.tag2}</span>
            </div>
            {/* Filter indicator */}
            {(filterStatus !== 'all' || filterTag) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#71717A]">Filtering:</span>
                {filterStatus !== 'all' && (
                  <span className="text-xs bg-[#fffef9] text-black px-2 py-1 rounded">
                    {filterStatus}
                  </span>
                )}
                {filterTag && (
                  <span className="text-xs bg-[#fffef9] text-black px-2 py-1 rounded">
                    #{filterTag}
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterTag(null);
                  }}
                  className="text-xs text-[#71717A] hover:text-black"
                >
                  Clear
                </button>
              </div>
            )}
            <button
              onClick={handleNewNote}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              Clear Form
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
                <div className="flex items-center gap-2">
                  <AIAssistantButtons
                    onCritic={handleCritic}
                    onRephrase={handleRephrase}
                    disabled={!currentNote.trim()}
                    isLoading={aiLoading}
                  />
                  <button className="text-black border border-[#E5E5EA] rounded-lg px-3 py-1 text-sm hover:bg-[#fffef9]">
                    Apply My Style
                  </button>
                </div>
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
                    setEditingNote(null);
                    setCurrentNote('');
                  }}
                  className="text-black border border-[#E5E5EA] rounded-lg px-4 py-2 hover:bg-[#fffef9]"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    console.log('Button clicked - editingNote:', editingNote);
                    console.log('Current note:', currentNote);
                    console.log('Selected tag:', selectedTag);
                    console.log('Word count:', wordCount);
                    if (editingNote) {
                      console.log('>>> Calling handleUpdateNote');
                      handleUpdateNote();
                    } else {
                      console.log('>>> Calling handleSaveNote');
                      handleSaveNote();
                    }
                  }}
                  disabled={wordCount > 300 || !currentNote.trim() || loading}
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingNote ? 'Update' : 'Save to Draft'}
                </button>
              </div>
            </div>
          </div>

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

      {/* AI Response Modal */}
      <AIResponseModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        type={aiModalType}
        response={aiResponse}
        onApply={handleApplyRephrase}
        isLoading={aiLoading}
      />
    </div>
  );
}