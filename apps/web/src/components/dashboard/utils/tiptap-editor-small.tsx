"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";

export interface TiptapEditorSmallProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  className?: string;
}

export function TiptapEditorSmall({
  value = "",
  onChange,
  placeholder = "Write something...",
  minHeight = "140px",
  disabled = false,
  className = "",
}: TiptapEditorSmallProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // If empty paragraph, emit empty string
      const isCleanEmpty = html === "<p></p>";
      onChange?.(isCleanEmpty ? "" : html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert max-w-none p-3 text-foreground focus:outline-none transition-colors overflow-y-auto [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/60 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-xs [&_code]:font-mono [&_p]:my-1`,
        style: `min-height: ${minHeight};`,
      },
    },
  });

  // Sync external value updates (e.g. form reset / loaded data from API)
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    const cleanCurrent = currentHTML === "<p></p>" ? "" : currentHTML;
    const cleanIncoming = value === "<p></p>" ? "" : value;

    if (cleanCurrent !== cleanIncoming) {
      editor.commands.setContent(cleanIncoming || "");
    }
  }, [value, editor]);

  // Sync disabled / editable state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div
        className="w-full border border-border/80 bg-input/20 rounded-md p-4 animate-pulse flex items-center justify-center text-xs text-muted-foreground"
        style={{ minHeight }}
      >
        Loading Editor...
      </div>
    );
  }

  return (
    <div
      className={`w-full border border-border/80 bg-input/20 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 rounded-md overflow-hidden transition-colors ${
        disabled ? "opacity-60 pointer-events-none" : ""
      } ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border/60 bg-card/60 select-none">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("bold")
              ? "bg-primary/20 text-primary font-bold"
              : ""
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("italic") ? "bg-primary/20 text-primary italic" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("strike") ? "bg-primary/20 text-primary" : ""
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        {/* Inline Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("code") ? "bg-primary/20 text-primary" : ""
          }`}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border/60 mx-1" />

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary/20 text-primary font-semibold"
              : ""
          }`}
          title="Subheading (H2)"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-primary/20 text-primary font-semibold"
              : ""
          }`}
          title="Small Heading (H3)"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border/60 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("bulletList") ? "bg-primary/20 text-primary" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("orderedList") ? "bg-primary/20 text-primary" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer ${
            editor.isActive("blockquote") ? "bg-primary/20 text-primary" : ""
          }`}
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        {/* Horizontal Line */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 cursor-pointer"
          title="Divider"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-border/60 mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          title="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          className="p-1.5 rounded-xs transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/80 ml-auto cursor-pointer"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Editable Area */}
      <EditorContent editor={editor} />
    </div>
  );
}

export default TiptapEditorSmall;
