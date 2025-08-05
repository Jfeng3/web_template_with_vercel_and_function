import React, { useState } from 'react';
import { MoreVertical, Sparkles, Edit3, Trash2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Note } from '@/api/notes';

interface NoteCardProps {
  note: Note;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, isExpanded, onToggleExpand, onEdit, onDelete }: NoteCardProps) {
  const needsExpansion = note.content.length > 150;
  
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
  };

  return (
    <div
      className="bg-white rounded-[10px] p-[18px] shadow-[0_4px_7px_rgba(0,0,0,0.1)] transition-all duration-200 group"
      style={{ cursor: needsExpansion ? 'pointer' : 'default' }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="menu"]')) return;
        if (needsExpansion) {
          e.preventDefault();
          onToggleExpand();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {/* Timestamp */}
        <span className="text-sm text-[#9B9C9E]">
          {formatDate(note.createdAt)}
        </span>
        
        {/* Tag and Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5D87F8]" />
            <span className="text-sm text-[#5D87F8]">
              {note.tag}
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Content */}
      <div className={cn(
        "text-sm text-[#202124] transition-all duration-200 prose prose-sm max-w-none",
        !isExpanded && needsExpansion && "line-clamp-1"
      )}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-lg font-bold text-[#05445E] mb-2">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-semibold text-[#05445E] mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-medium text-[#05445E] mb-1">{children}</h3>
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
              <strong className="font-semibold text-[#05445E]">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic">{children}</em>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              return isInline ? (
                <code className="px-1 py-0.5 bg-[#D4F1F4] text-[#05445E] rounded text-xs">
                  {children}
                </code>
              ) : (
                <code className={className}>{children}</code>
              );
            },
            a: ({ children, href }) => (
              <a href={href} className="text-[#189AB4] hover:text-[#75E6DA] underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {note.content}
        </ReactMarkdown>
      </div>
      
      {/* Footer - only show if there's expansion hint */}
      {needsExpansion && (
        <div className="mt-2 flex justify-end">
          <p className="text-xs text-[#5D87F8] opacity-0 group-hover:opacity-100 transition-opacity">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </p>
        </div>
      )}
    </div>
  );
}