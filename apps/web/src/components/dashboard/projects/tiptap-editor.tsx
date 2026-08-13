"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Code,
  Link,
  List,
  ImageDown,
  UnderlineIcon,
} from "lucide-react";
import { uploadImage } from "@/utils/image-upload";
import { toast } from "sonner";

interface TiptapEditorProps {
  value: string | unknown;
  onChange: (content: JSONContent) => void;
}

const CODE_LANGUAGES = [
  { value: "ts", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "js", label: "JavaScript" },
  { value: "jsx", label: "JSX" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
];

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("ts");
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value ?? {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
      const language = editor.getAttributes("codeBlock").language;
      if (typeof language === "string") {
        setSelectedLanguage(language);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const language = editor.getAttributes("codeBlock").language;

      if (typeof language === "string") {
        setSelectedLanguage(language);
      }
    },
    editorProps: {
      attributes: {
        // class:
        //   "prose prose-invert max-w-none focus:outline-none min-h-[250px] p-4 text-sm font-sans leading-relaxed text-foreground bg-transparent",
        class:
          "tiptap-editor prose prose-invert max-w-none focus:outline-none min-h-[250px] p-4 font-sans text-foreground bg-transparent",
      },
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  // 👇 PLACE IT HERE (Before any early return!)
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(value);
      if (currentContent !== newContent) {
        editor.commands.setContent(value ?? "");
      }
    }
  }, [value, editor]);

  if (!editor) return null;

  // const currentCodeLanguage =
  //   typeof editor.getAttributes("codeBlock").language === "string"
  //     ? editor.getAttributes("codeBlock").language
  //     : "ts";

  const setCodeBlockLanguage = (language: string) => {
    setSelectedLanguage(language);

    if (editor.isActive("codeBlock")) {
      editor.chain().focus().updateAttributes("codeBlock", { language }).run();
      return;
    }

    editor.chain().focus().toggleCodeBlock({ language }).run();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];

  //   if (!file || !editor) return;

  //   const previewUrl = URL.createObjectURL(file);

  //   editor.chain().focus().setImage({ src: previewUrl }).run();

  //   try {
  //     const uploadedUrl = await uploadImage(file, () => {});

  //     const doc = editor.getJSON();

  //     const replaceImageUrl = (node: any) => {
  //       if (node.type === "image" && node.attrs?.src === previewUrl) {
  //         node.attrs.src = uploadedUrl;
  //       }
  //       if (node.content) {
  //         node.content.forEach(replaceImageUrl);
  //       }
  //     };

  //     replaceImageUrl(doc);

  //     editor.commands.setContent(doc);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     URL.revokeObjectURL(previewUrl);
  //     e.target.value = "";
  //   }
  // };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !editor) return;

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImage(file, () => { });

      editor.chain().focus().setImage({ src: uploadedUrl }).run();
    } catch (error) {
      toast.error("Image upload failed");
      console.error(error);
    } finally {
      e.target.value = "";
      setIsUploading(false);
    }
  };
  const currentBlockType = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "paragraph";

  return (
    <div className="w-full border border-border rounded-xs bg-card/20 overflow-hidden focus-within:border-primary transition-all duration-200">
      {/* Action Toolbar Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-3 py-2">
        <div className="flex items-center gap-1">
          <select
            value={currentBlockType}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              }

              if (value === "h1") {
                editor.chain().focus().setHeading({ level: 1 }).run();
              }

              if (value === "h2") {
                editor.chain().focus().setHeading({ level: 2 }).run();
              }

              if (value === "h3") {
                editor.chain().focus().setHeading({ level: 3 }).run();
              }
            }}
            className="h-8 rounded-xs border border-border bg-background px-2 text-xs font-mono text-foreground cursor-pointer"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
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
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleCodeBlock({ language: selectedLanguage })
                .run()
            }
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("codeBlock") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Code className="h-4 w-4" />
          </button>

          <select
            value={selectedLanguage}
            onChange={(event) => setCodeBlockLanguage(event.target.value)}
            className="h-8 rounded-xs border border-border bg-background px-2 text-xs font-mono text-foreground cursor-pointer"
          >
            {CODE_LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleLink().run()}
            className="p-1.5 rounded-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Link className="h-4 w-4" />
          </button>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            hidden
            ref={fileInputRef}
            onChange={handleInputChange}
          />
          <button
            type="button"
            disabled={isUploading}
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
