import { useEffect, useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { useNotesStore } from '../stores/notesStore';
import Sidebar from '../components/Sidebar';
import AIResponseModal from '../components/AIResponseModal';
import { TextEditor } from '../components/TextEditor';
import { ComparisonTextEditor } from '../components/ComparisonTextEditor';
import { RephraseBox } from '../components/RephraseBox';
import { getCriticFeedback, getRephraseOptions } from '../api/openai';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
    setFilterStatus,
    setFilterTag,
    setSidebarCollapsed,
    setError,
    filteredNotes
  } = useNotesStore();

  // AI Assistant state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'critic'>('critic');
  const [aiResponse, setAiResponse] = useState<any>({});
  const [aiLoading, setAiLoading] = useState(false);
  
  // Inline rephrase state
  const [rephraseResponse, setRephraseResponse] = useState<any>(null);
  const [rephraseLoading, setRephraseLoading] = useState(false);
  
  // Expanded notes state
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  // Load notes and weekly tags on mount
  useEffect(() => {
    loadNotes();
    loadWeeklyTags();
  }, [loadNotes, loadWeeklyTags]);

  // Set default tag when weekly tags are loaded
  useEffect(() => {
    if (!selectedTag && weeklyTags.tag1) {
      setSelectedTag(weeklyTags.tag1);
    }
  }, [weeklyTags.tag1, selectedTag, setSelectedTag]);

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
    
    setRephraseLoading(true);
    setRephraseResponse(null);
    
    try {
      const response = await getRephraseOptions(currentNote);
      setRephraseResponse(response);
    } catch (error) {
      setError('Failed to get AI rephrase options. Please try again.');
      setRephraseResponse(null);
    } finally {
      setRephraseLoading(false);
    }
  };

  const handleApplyRephrase = (content: string) => {
    setCurrentNote(content);
    setRephraseResponse(null);
  };

  const handleCloseRephrase = () => {
    setRephraseResponse(null);
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
              onClick={() => {
                setEditingNote(null);
                setCurrentNote('');
              }}
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
              <div className={`flex gap-4 ${rephraseResponse || rephraseLoading ? '' : 'justify-center'}`}>
                <div className={`${rephraseResponse || rephraseLoading ? 'flex-1' : 'w-full'} transition-all duration-300`}>
                  {rephraseResponse || rephraseLoading ? (
                    <ComparisonTextEditor
                      value={currentNote}
                      onChange={setCurrentNote}
                      placeholder="Start writing your note... (Type # for heading, **bold**, *italic*, etc.)"
                      onCritic={handleCritic}
                      onRephrase={handleRephrase}
                      onApplyStyle={() => console.log('Apply style')}
                      onSubmit={() => {
                        if (editingNote) {
                          handleUpdateNote();
                        } else {
                          handleSaveNote();
                        }
                      }}
                      disabled={loading}
                      isLoading={aiLoading}
                      showComparison={true}
                    />
                  ) : (
                    <TextEditor
                      value={currentNote}
                      onChange={setCurrentNote}
                      placeholder="Start writing your note... (Type # for heading, **bold**, *italic*, etc.)"
                      onCritic={handleCritic}
                      onRephrase={handleRephrase}
                      onApplyStyle={() => console.log('Apply style')}
                      onSubmit={() => {
                        if (editingNote) {
                          handleUpdateNote();
                        } else {
                          handleSaveNote();
                        }
                      }}
                      disabled={loading}
                      isLoading={aiLoading}
                    />
                  )}
                </div>
                
                {(rephraseResponse || rephraseLoading) && (
                  <div className="flex-1 transition-all duration-300">
                    <RephraseBox
                      rephraseResponse={rephraseResponse}
                      isLoading={rephraseLoading}
                      onApply={handleApplyRephrase}
                      onClose={handleCloseRephrase}
                      originalText={currentNote}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className={`text-sm ${wordCount > 300 ? 'text-red-500' : 'text-[#71717A]'}`}>
                  {wordCount}/300 words
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Tags and buttons removed - Send button in TextEditor handles saving */}
            </div>
          </CardContent>
        </Card>

        {/* Notes Board */}
        <div className="max-w-4xl mx-auto">
          {/* Notes Column */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {draftNotes.map(note => {
                const isExpanded = isNoteExpanded(note.id);
                const needsExpansion = note.content.length > 150; // Rough estimate for 3 lines
                
                return (
                  <div
                    key={note.id}
                    className="bg-[#fffef9] rounded-lg p-4 hover:shadow-sm transition-all duration-200 group"
                    style={{ cursor: needsExpansion ? 'pointer' : 'default' }}
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
        </div>
      </div>
      </div>

      {/* AI Response Modal */}
      <AIResponseModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        type={aiModalType}
        response={aiResponse}
        isLoading={aiLoading}
      />
    </div>
  );
}