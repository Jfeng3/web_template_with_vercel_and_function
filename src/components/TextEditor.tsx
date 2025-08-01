import React, { useEffect } from 'react';
import { 
  Hash, 
  Image, 
  Type, 
  List, 
  ListOrdered, 
  AtSign,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Send
} from 'lucide-react';
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
  group: 'formatting' | 'ai' | 'action';
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
    // Formatting tools
    {
      icon: <Hash className="w-5 h-5" />,
      label: 'Heading',
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      group: 'formatting'
    },
    {
      icon: <Image className="w-5 h-5" />,
      label: 'Insert image',
      action: () => console.log('Insert image'),
      group: 'formatting'
    },
    {
      icon: <Type className="w-5 h-5" />,
      label: 'Text format',
      action: () => editor?.chain().focus().toggleBold().run(),
      group: 'formatting'
    },
    {
      icon: <List className="w-5 h-5" />,
      label: 'Bulleted list',
      action: () => editor?.chain().focus().toggleBulletList().run(),
      group: 'formatting'
    },
    {
      icon: <ListOrdered className="w-5 h-5" />,
      label: 'Numbered list',
      action: () => editor?.chain().focus().toggleOrderedList().run(),
      group: 'formatting'
    },
    {
      icon: <AtSign className="w-5 h-5" />,
      label: 'Mention',
      action: () => console.log('Mention'),
      group: 'formatting'
    },
    // AI tools
    {
      icon: <RefreshCw className="w-5 h-5" />,
      label: 'Rephrase',
      action: () => onRephrase?.(),
      group: 'ai'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      label: 'Critic',
      action: () => onCritic?.(),
      group: 'ai'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'Apply my style',
      action: () => onApplyStyle?.(),
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
          {toolbarButtons.filter(btn => btn.group === 'formatting').map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              disabled={disabled || !editor}
              className="h-9 w-9 p-0 hover:bg-[#D4F1F4] text-gray-600 hover:text-[#05445E]"
              title={button.label}
            >
              {button.icon}
            </Button>
          ))}
          
          <div className="w-px h-6 bg-gray-200 mx-1" />
          
          {toolbarButtons.filter(btn => btn.group === 'ai').map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              disabled={disabled || isLoading || !editor?.getText().trim()}
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