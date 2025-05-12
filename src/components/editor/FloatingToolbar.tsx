import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Palette
} from "lucide-react"

interface FloatingToolbarProps {
  editor: Editor
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  const toolbarItems = [
    {
      icon: <Type size={16} />,
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      icon: <Heading1 size={16} />,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 size={16} />,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 size={16} />,
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold size={16} />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <Italic size={16} />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <Underline size={16} />,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: <AlignLeft size={16} />,
      title: "Align Left",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter size={16} />,
      title: "Align Center",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight size={16} />,
      title: "Align Right",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <Palette size={16} />,
      title: "Text Color",
      action: () => {
        const color = prompt('Enter a color (hex, rgb, etc.)', '#000000')
        if (color) {
          editor.chain().focus().setColor(color).run()
        }
      },
      isActive: () => editor.isActive('textStyle'),
    },
  ]

  // Group the toolbar items by category
  const textStyleItems = toolbarItems.slice(0, 4); // Paragraph and headings
  const formattingItems = toolbarItems.slice(4, 7); // Bold, italic, underline
  const alignmentItems = toolbarItems.slice(7, 10); // Alignment options
  const colorItems = toolbarItems.slice(10); // Color picker

  const renderButtonGroup = (items: typeof toolbarItems) => (
    <div className="flex">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.action}
          className={`p-2 rounded-sm hover:bg-gray-100 ${item.isActive() ? "bg-gray-100 text-blue-600" : "text-gray-600"
            }`}
          title={item.title}
          type="button"
        >
          {item.icon}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex p-1 items-center">
      {renderButtonGroup(textStyleItems)}
      <div className="h-4 mx-1 border-r border-gray-200"></div>
      {renderButtonGroup(formattingItems)}
      <div className="h-4 mx-1 border-r border-gray-200"></div>
      {renderButtonGroup(alignmentItems)}
      <div className="h-4 mx-1 border-r border-gray-200"></div>
      {renderButtonGroup(colorItems)}
    </div>
  )
}

export default FloatingToolbar
