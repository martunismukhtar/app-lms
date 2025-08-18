import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CharacterCount from "@tiptap/extension-character-count";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Masukkan URL gambar");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("Masukkan URL link");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        type="button"
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`cursor-pointer px-1 py-1 border rounded ${
          editor.isActive("bold") ? "bg-gray-300" : ""
        }`}
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M13.2087 18C15.5322 18 16.9731 16.793 16.9731 14.8844C16.9731 13.4812 15.9245 12.3949 14.4836 12.2892V12.1534C15.6001 11.9875 16.4526 10.9841 16.4526 9.82991C16.4526 8.14761 15.1927 7.11409 13.0804 7.11409H8.32019V18H13.2087ZM10.5985 8.85674H12.4995C13.5859 8.85674 14.212 9.37727 14.212 10.2448C14.212 11.1199 13.5406 11.6254 12.3109 11.6254H10.5985V8.85674ZM10.5985 16.2574V13.1643H12.575C13.9178 13.1643 14.6496 13.6924 14.6496 14.6882C14.6496 15.7066 13.9404 16.2574 12.6278 16.2574H10.5985Z"
              fill="#121923"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <button
        type="button"
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`cursor-pointer px-1 py-1 border rounded ${
          editor.isActive("italic") ? "bg-gray-300" : ""
        }`}
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="Edit / Italic">
              {" "}
              <path
                id="Vector"
                d="M8 19H10M10 19H12M10 19L14 5M12 5H14M14 5H16"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>{" "}
          </g>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`cursor-pointer px-1 py-1 border rounded ${
          editor.isActive("underline") ? "bg-gray-300" : ""
        }`}
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M4 21H20M18 4V11C18 14.3137 15.3137 17 12 17C8.68629 17 6 14.3137 6 11V4M4 3H8M16 3H20"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <button
        type="button"
        title="Superscript"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`cursor-pointer px-1 py-1 border rounded `}
      >
        <svg
          fill="#000000"
          width="20px"
          height="20px"
          viewBox="0 0 36 36"
          version="1.1"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <title>superscript-line</title>{" "}
            <path
              d="M14.43,18l6.79,8.6a1.17,1.17,0,0,1-.92,1.9h0a1.17,1.17,0,0,1-.92-.44l-6.44-8.13L6.47,28a1.17,1.17,0,0,1-.92.44h0a1.17,1.17,0,0,1-.92-1.9L11.43,18l-6.8-8.6a1.17,1.17,0,0,1,.92-1.9h0A1.2,1.2,0,0,1,6.51,8l6.43,8.13L19.38,8a1.17,1.17,0,0,1,.92-.44h0a1.17,1.17,0,0,1,.92,1.9Z"
              className="clr-i-outline clr-i-outline-path-1"
            ></path>
            <path
              d="M22.85,14.47l4.51-3.85a9.37,9.37,0,0,0,1.88-2,3.43,3.43,0,0,0,.59-1.86,2.27,2.27,0,0,0-.36-1.27,2.38,2.38,0,0,0-.95-.83,2.77,2.77,0,0,0-1.26-.29,3.39,3.39,0,0,0-1.83.5,5.83,5.83,0,0,0-1.49,1.42l-1-.81a5.12,5.12,0,0,1,4.36-2.37,4.36,4.36,0,0,1,2,.45,3.47,3.47,0,0,1,2,3.18A4.44,4.44,0,0,1,30.58,9a11.14,11.14,0,0,1-2.24,2.46L25.1,14.31h6.28v1.33H22.85Z"
              className="clr-i-outline clr-i-outline-path-2"
            ></path>{" "}
            <rect x="0" y="0" width="36" height="36" fillOpacity="0"></rect>{" "}
          </g>
        </svg>
      </button>
      <button
        type="button"
        title="Subscript"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`cursor-pointer px-1 py-1 border rounded `}
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.7433 5.33104C4.37384 4.92053 3.74155 4.88726 3.33104 5.25671C2.92053 5.62617 2.88726 6.25846 3.25671 6.66897L7.15465 11L3.25671 15.331C2.88726 15.7416 2.92053 16.3738 3.33104 16.7433C3.74155 17.1128 4.37384 17.0795 4.7433 16.669L8.50001 12.4949L12.2567 16.669C12.6262 17.0795 13.2585 17.1128 13.669 16.7433C14.0795 16.3738 14.1128 15.7416 13.7433 15.331L9.84537 11L13.7433 6.66897C14.1128 6.25846 14.0795 5.62617 13.669 5.25671C13.2585 4.88726 12.6262 4.92053 12.2567 5.33104L8.50001 9.50516L4.7433 5.33104ZM17.3181 14.0484C17.6174 13.7595 18.1021 13.7977 18.3524 14.13C18.5536 14.3971 18.5353 14.7698 18.3088 15.0158L15.2643 18.3227C14.9955 18.6147 14.9248 19.0382 15.0842 19.4017C15.2437 19.7652 15.6031 20 16 20H20C20.5523 20 21 19.5523 21 19C21 18.4477 20.5523 18 20 18H18.2799L19.7802 16.3704C20.6607 15.414 20.7321 13.965 19.95 12.9267C18.9769 11.6348 17.0925 11.4862 15.929 12.6096L15.3054 13.2116C14.9081 13.5953 14.897 14.2283 15.2806 14.6256C15.6642 15.023 16.2973 15.0341 16.6946 14.6505L17.3181 14.0484Z"
              fill="#000000"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`cursor-pointer px-1 py-1 border rounded `}
      >
        Add Link
      </button>
      <button type="button" onClick={addImage} className="btn">
        Add Image
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`cursor-pointer px-2 py-1 border rounded ${
          editor.isActive("paragraph") ? "bg-gray-300" : ""
        }`}
      >
        Paragraph
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`cursor-pointer px-2 py-1 border rounded ${
          editor.isActive("bulletList") ? "bg-gray-300" : ""
        }`}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className="cursor-pointer px-2 py-1 border rounded"
      >
        Align Left
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className="cursor-pointer px-2 py-1 border rounded"
      >
        Align Center
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className="cursor-pointer px-2 py-1 border rounded"
      >
        Align Right
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHighlight().run()}
        className={`cursor-pointer px-2 py-1 border rounded ${
          editor.isActive("highlight") ? "bg-yellow-200" : ""
        }`}
      >
        Highlight
      </button>
    </div>
  );
};

const RichEditor = ({ value, onChange, className = "min-h-[200px]" }) => {
  const editor = useEditor({
    content: value || "",
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
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Tulis sesuatu..." }),
      TaskList,
      TaskItem,
      CharacterCount.configure({ limit: 10000 }),
      Superscript,
      Subscript,
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
      <EditorContent
        editor={editor}
        tabIndex={0}
        className={`w-full rounded border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${className}`}
      />
    </div>
  );
};

export default RichEditor;
