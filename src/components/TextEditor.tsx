import React, { useEffect } from 'react';
import { RefreshCw, Send, Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TextEditorProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCritic?: () => void;
  onRephrase?: () => void;
  onApplyStyle?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

interface ToolbarButton {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  group: 'ai' | 'action';
}

export function TextEditor({ 
  placeholder = "What's in your mind?",
  value = '',
  onChange,
  onSubmit,
  onCritic,
  onRephrase,
  onApplyStyle,
  disabled = false,
  isLoading = false,
  className 
}: TextEditorProps) {
  const { toast } = useToast();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getText());
    },
  });

  // Speech to text
  const { isSupported, isRecording, interimText, start, stop } = useSpeechToText({
    onFinal: (text) => {
      const base = editor?.getText() || '';
      const sep = base && !base.endsWith('\n') ? '\n' : '';
      editor?.commands.setContent(base + sep + text);
      onChange?.(base + sep + text);
    },
  });

  // Sync external value changes with editor
  useEffect(() => {
    if (editor && value !== editor.getText()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const handleSubmit = () => {
    if (editor) {
      onSubmit?.(editor.getText());
    }
  };

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: <RefreshCw className="w-5 h-5" />,
      label: 'Rephrase',
      action: () => onRephrase?.(),
      group: 'ai'
    },
    {
      icon: isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />,
      label: isRecording ? 'Stop recording' : 'Record',
      action: () => {
        if (!isSupported) {
          toast({ title: 'Speech not supported', description: 'Your browser does not support speech recognition.' });
          return;
        }
        if (isRecording) stop(); else start();
      },
      group: 'ai'
    }
  ];

  return (
    <div className={cn(
      "w-full rounded-lg border-2 border-[#75E6DA] bg-white",
      className
    )}>
      <EditorContent 
        editor={editor} 
        className="text-[#202124]"
      />
      
      <div className="flex items-center justify-between p-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              disabled={disabled || (button.label === 'Rephrase' ? (isLoading || !editor?.getText().trim()) : false)}
              className="h-9 w-9 p-0 hover:bg-[#D4F1F4] text-gray-600 hover:text-[#05445E]"
              title={button.label}
            >
              {button.icon}
            </Button>
          ))}
        </div>
        
        <Button
          onClick={handleSubmit}
          size="sm"
          disabled={disabled || !editor?.getText().trim()}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}