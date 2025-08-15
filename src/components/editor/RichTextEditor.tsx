import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, Strikethrough, Heading2, List, ListOrdered } from 'lucide-react'

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  return (
    <div className="flex items-center space-x-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-300 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-300 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}><Italic size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-gray-300 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}><Strikethrough size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}><Heading2 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-300 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-300 p-2 rounded' : 'p-2 rounded hover:bg-gray-200'}><ListOrdered size={16} /></button>
    </div>
  )
}

interface RichTextEditorProps {
  content: any; // TipTap content is JSON
  onChange: (newContent: any) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
        attributes: {
            class: 'prose max-w-none p-4 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none min-h-[300px]',
        },
    }
  })

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
