import { useState } from "react"
import SimpleEditor from "./SimpleEditor"
import { Editor } from "@tiptap/react"

const EditorExample = () => {
  const [content, setContent] = useState(`
    <h1>Welcome to the Simple Rich Text Editor</h1>
    <p>This is a lightweight editor with a floating toolbar. Try the following:</p>
    <p>1. <strong>Select some text</strong> to see the formatting options</p>
    <p>2. Try different text styles like <em>italic</em> or <strong>bold</strong></p>
    <p>3. Change text alignment or headings</p>
  `)
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Simple Rich Text Editor</h1>
      <p className="text-center text-gray-600 mb-8">Select text to see the floating toolbar with formatting options</p>

      <div className="mb-8 max-w-3xl mx-auto">
        <SimpleEditor
          initContent={content}
          onChange={handleContentChange}
          setEditor={setEditor}
        />
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <div className="flex items-center mb-4">
          <div className="h-px flex-grow bg-gray-200"></div>
          <h2 className="text-xl font-semibold px-4 text-gray-700">HTML Output</h2>
          <div className="h-px flex-grow bg-gray-200"></div>
        </div>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40 text-sm border border-gray-200">
          {content}
        </pre>
      </div>
    </div>
  )
}

export default EditorExample
