import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import CharacterCount from '@tiptap/extension-character-count';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Masukkan URL gambar');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Masukkan URL link');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button type="button" title='Bold'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`cursor-pointer px-1 py-1 border rounded ${
          editor.isActive('bold') ? 'bg-gray-300' : ''
        }`}
      >
        bold
      </button>
      <button type="button" title='Italic'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`cursor-pointer px-1 py-1 border rounded ${
          editor.isActive('italic') ? 'bg-gray-300' : ''
        }`}
      >
        Italic
      </button>
      <button type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`cursor-pointer px-1 py-1 border rounded ${
          editor.isActive('underline') ? 'bg-gray-300' : ''
        }`}
      >
        Underline
      </button>
      <button type='button' title='Superscript'
        onClick={() => editor.chain().focus().toggleSuperscript().run()} 
        className={`cursor-pointer px-1 py-1 border rounded `}>
       Superscript

      </button>
      <button type='button' title='Subscript'
        onClick={() => editor.chain().focus().toggleSubscript().run()} 
          className={`cursor-pointer px-1 py-1 border rounded `}>
        Subscript
      </button>
      <button type='button' onClick={setLink} className={`cursor-pointer px-1 py-1 border rounded `}>
        Add Link
      </button>
      <button type='button' onClick={addImage} className="btn">
        Add Image
      </button>
      <button type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`cursor-pointer px-2 py-1 border rounded ${
          editor.isActive('paragraph') ? 'bg-gray-300' : ''
        }`}
      >
        Paragraph
      </button>
      <button type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`cursor-pointer px-2 py-1 border rounded ${
          editor.isActive('bulletList') ? 'bg-gray-300' : ''
        }`}
      >
        Bullet List
      </button>
      <button type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign('left').run()
        }
        className="cursor-pointer px-2 py-1 border rounded"
      >
        Align Left
      </button>
      <button type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign('center').run()
        }
        className="cursor-pointer px-2 py-1 border rounded"
      >
        Align Center
      </button>
      <button type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign('right').run()
        }
        className="cursor-pointer px-2 py-1 border rounded"
      >
        Align Right
      </button>
      <button type="button"
        onClick={() => editor.chain().focus().setHighlight().run()}
        className={`cursor-pointer px-2 py-1 border rounded ${
          editor.isActive('highlight') ? 'bg-yellow-200' : ''
        }`}
      >
        Highlight
      </button>
    </div>
  );
};

const RichEditor = ({ value, onChange, className="min-h-[200px]" }) => {
  const editor = useEditor({
    content: value || '',
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Highlight,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Tulis sesuatu...' }),
      TaskList,
      TaskItem,
      // Dropcursor,
      // Gapcursor,
      CharacterCount.configure({ limit: 10000 }),
      Superscript,
      Subscript
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2 border border-gray-300 rounded p-2">
      <MenuBar editor={editor} />
      <hr />
      <EditorContent editor={editor} className={`${className}`} />
    </div>
  );
};

export default RichEditor;
