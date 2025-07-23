import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Start writing your note..."
}: TiptapEditorProps) {
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
    onUpdate: ({ editor }) => {
      onChange(editor.getText());
    },
  });

  return (
    <div className="min-h-[72px] border border-gray-300 rounded-md p-3">
      <EditorContent 
        editor={editor} 
        className="min-h-[48px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[48px] [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-medium" 
      />
    </div>
  );
}