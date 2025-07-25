import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Check } from 'lucide-react';
import { useNotesStore } from '../stores/notesStore';
import Sidebar from '../components/Sidebar';
import AIAssistantButtons from '../components/AIAssistantButtons';
import AIResponseModal from '../components/AIResponseModal';
import { TiptapEditor } from '../components/TiptapEditor';
import { getCriticFeedback, getRephraseOptions } from '../api/openai';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  
  // Expanded notes state
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

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

  const toggleNoteExpanded = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const isNoteExpanded = (noteId: string) => expandedNotes.has(noteId);

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
          <h1 className="text-2xl font-bold text-black">Daily Post Writer</h1>
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
            <Button
              onClick={handleNewNote}
              disabled={loading}
              variant="default"
              size="default"
            >
              <Plus size={16} className="mr-2" />
              Clear Form
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-8 py-4 max-w-6xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Writing Panel */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <TiptapEditor
                value={currentNote}
                onChange={setCurrentNote}
                placeholder="Start writing your note... (Type # for heading, **bold**, *italic*, etc.)"
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
                  <Button variant="outline" size="sm">
                    Apply My Style
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {!weeklyTags.tag1 && !weeklyTags.tag2 && (
                    <SelectItem value="" disabled>No tags for this week</SelectItem>
                  )}
                  {weeklyTags.tag1 && weeklyTags.tag1.trim() && (
                    <SelectItem value={weeklyTags.tag1}>{weeklyTags.tag1}</SelectItem>
                  )}
                  {weeklyTags.tag2 && weeklyTags.tag2.trim() && (
                    <SelectItem value={weeklyTags.tag2}>{weeklyTags.tag2}</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <div className="flex gap-2 ml-auto">
                <Button
                  onClick={() => {
                    setEditingNote(null);
                    setCurrentNote('');
                  }}
                  variant="outline"
                >
                  Clear
                </Button>
                <Button
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
                  variant="default"
                >
                  {loading ? 'Saving...' : editingNote ? 'Update' : 'Save to Draft'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Stage Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Draft Column */}
          <Card
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'draft')}
          >
            <CardHeader>
              <CardTitle>Draft</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {draftNotes.map(note => {
                const isExpanded = isNoteExpanded(note.id);
                const needsExpansion = note.content.length > 150; // Rough estimate for 3 lines
                
                return (
                  <div
                    key={note.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, note)}
                    className="bg-[#fffef9] rounded-lg p-4 hover:shadow-sm transition-all duration-200 group"
                    style={{ cursor: needsExpansion ? 'pointer' : 'move' }}
                    onClick={(e) => {
                      // Only expand if clicking on the content area, not buttons
                      if ((e.target as HTMLElement).closest('button')) return;
                      if (needsExpansion) {
                        e.preventDefault();
                        toggleNoteExpanded(note.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="default" className="text-xs">
                        {note.tag}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note.id);
                        }}
                        className="text-[#71717A] hover:text-black z-10"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                    <div className={cn(
                      "text-sm text-black transition-all duration-200 prose prose-sm max-w-none",
                      !isExpanded && "line-clamp-3"
                    )}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold text-navy-blue mb-2">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold text-navy-blue mb-2">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-medium text-navy-blue mb-1">{children}</h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 space-y-1 mb-2">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-sm leading-relaxed">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-navy-blue">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="px-1 py-0.5 bg-baby-blue text-navy-blue rounded text-xs">
                                {children}
                              </code>
                            ) : (
                              <code className={className}>{children}</code>
                            );
                          },
                          a: ({ children, href }) => (
                            <a href={href} className="text-blue-grotto hover:text-blue-green underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {note.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-[#71717A]">
                        {note.content.split(/\s+/).filter(w => w).length} words
                      </p>
                      {needsExpansion && (
                        <p className="text-xs text-blue-grotto opacity-0 group-hover:opacity-100 transition-opacity">
                          {isExpanded ? 'Click to collapse' : 'Click to expand'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {draftNotes.length === 0 && (
                <p className="text-[#71717A] text-sm text-center py-8">
                  No drafts yet. Start writing!
                </p>
              )}
            </div>
            </CardContent>
          </Card>

          {/* Ready Column */}
          <Card
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'ready')}
          >
            <CardHeader>
              <CardTitle>Ready</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {readyNotes.map(note => {
                const isExpanded = isNoteExpanded(note.id);
                const needsExpansion = note.content.length > 150; // Rough estimate for 3 lines
                
                return (
                  <div
                    key={note.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, note)}
                    className="bg-[#fffef9] rounded-lg p-4 hover:shadow-sm transition-all duration-200 group"
                    style={{ cursor: needsExpansion ? 'pointer' : 'move' }}
                    onClick={(e) => {
                      // Only expand if clicking on the content area, not buttons
                      if ((e.target as HTMLElement).closest('button')) return;
                      if (needsExpansion) {
                        e.preventDefault();
                        toggleNoteExpanded(note.id);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="default" className="text-xs">
                        {note.tag}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(note.content);
                        }}
                        className="text-[#71717A] hover:text-black z-10"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                    <div className={cn(
                      "text-sm text-black transition-all duration-200 prose prose-sm max-w-none",
                      !isExpanded && "line-clamp-3"
                    )}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold text-navy-blue mb-2">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold text-navy-blue mb-2">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-medium text-navy-blue mb-1">{children}</h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-4 space-y-1 mb-2">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-sm leading-relaxed">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-navy-blue">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="px-1 py-0.5 bg-baby-blue text-navy-blue rounded text-xs">
                                {children}
                              </code>
                            ) : (
                              <code className={className}>{children}</code>
                            );
                          },
                          a: ({ children, href }) => (
                            <a href={href} className="text-blue-grotto hover:text-blue-green underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {note.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-[#71717A]">
                        Ready to publish
                      </p>
                      {needsExpansion && (
                        <p className="text-xs text-blue-grotto opacity-0 group-hover:opacity-100 transition-opacity">
                          {isExpanded ? 'Click to collapse' : 'Click to expand'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {readyNotes.length === 0 && (
                <p className="text-[#71717A] text-sm text-center py-8">
                  Drag polished notes here
                </p>
              )}
            </div>
            </CardContent>
          </Card>
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