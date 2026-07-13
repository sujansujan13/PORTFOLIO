"use client";

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Code,
  Link,
  List,
  GalleryHorizontal,
  ImageDown,
  UnderlineIcon,
} from "lucide-react";
import { url } from "better-auth";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[250px] p-4 text-sm font-sans leading-relaxed text-foreground bg-transparent",
      },
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  if (!editor) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !editor) return;

    const previewUrl = URL.createObjectURL(file);

    editor.chain().focus().setImage({ src: previewUrl }).run();

    e.target.value = "";
  };

  return (
    <div className="w-full border border-border rounded-xs bg-card/20 overflow-hidden focus-within:border-primary transition-all duration-200">
      {/* Action Toolbar Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("bold") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("italic") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("underline") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("codeBlock") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleLink().run()}
            className="p-1.5 rounded-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Link className="h-4 w-4" />
          </button>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={handleUploadClick}
            // onClick={() => {
            //   const url = prompt("Image URL");
            //   if (url) {
            //     editor.chain().focus().setImage({ src: url }).run();
            //   }
            // }}
            className="p-1.5 rounded-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <ImageDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("bulletList") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase bg-muted/60 px-2 py-0.5 rounded-xs">
          Markdown Editor
        </span>
      </div>

      {/* Tiptap Workspace Canvas */}
      <EditorContent editor={editor} />
    </div>
  );
}

// Why immediatelyRender: false?
// Next.js uses server-side rendering by default. Setting immediatelyRender: false prevents the editor from rendering on the server, which avoids React hydration mismatch errors.

// React/Nextjs
//
// useRef --> useRef can be used to imitate the behaviour of one html element by another html element just like in above code
// <code>
// <input
//   type="file"
//   hidden
//   ref={fileInputRef}
//   onChange={handleInputChange}
// />
// const handleUploadClick = () => {
//   fileInputRef.current?.click();
// };
// <button
// type="button"
// onClick={handleUploadClick}
