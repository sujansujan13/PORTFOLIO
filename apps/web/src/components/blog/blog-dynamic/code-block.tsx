"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative rounded-lg border border-border bg-neutral-950">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="text-xs font-mono uppercase text-zinc-400">
          {language || "code"}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 text-sm text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}
