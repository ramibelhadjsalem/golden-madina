"use client"
import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Heading from "@tiptap/extension-heading"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { useEffect } from "react"
import { Editor as TiptapEditor } from "@tiptap/react"
import FloatingToolbar from "./FloatingToolbar"

interface EditorProps {
  initContent: string
  onChange: (content: string) => void
  setEditor?: (editor: TiptapEditor | null) => void
}

const SimpleEditor: React.FC<EditorProps> = ({ initContent, onChange, setEditor }) => {
  // Initialize the editor with simplified extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({
        emptyEditorClass: 'text-gray-400 text-lg',
        placeholder: "Start writing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
    ],
    content: initContent || '',
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none p-4 min-h-[200px] font-sans",
      },
    },
    onUpdate: ({ editor }) => {
      // Send the updated content to the parent component
      const html = editor.getHTML();
      onChange(html);
    },
  })

  // Set the editor in the parent component if needed
  useEffect(() => {
    if (setEditor && editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  // Update editor content when initContent changes
  useEffect(() => {
    if (editor && initContent) {
      // Only update if content is different to avoid loops
      const currentContent = editor.getHTML();
      if (initContent !== currentContent) {
        try {
          editor.commands.setContent(initContent);
        } catch (error) {
          console.error("Error updating editor content:", error);
        }
      }
    }
  }, [initContent, editor]);

  return (
    <div className="border border-gray-200 rounded-md relative shadow-sm hover:shadow-md transition-shadow duration-200">
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            placement: 'top',
          }}
          className="bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden z-50"
        >
          <FloatingToolbar editor={editor} />
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className="w-full rich-text-content"
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        Select text to format
      </div>
    </div>
  );
}

export default SimpleEditor;
