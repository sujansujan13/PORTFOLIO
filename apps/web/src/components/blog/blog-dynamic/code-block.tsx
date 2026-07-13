import { div } from "framer-motion/client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export const CodeBlock = ({ code }: { code: string }) => {
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
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 flex items-center gap-1 rounded-full  px-3 py-3 text-xs text-zinc-300 hover:bg-zinc-800 transition cursor-pointer group"
      >
        {copied ? (
          <>
            <Check />
            <span className="absolute bottom-full mb-5 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
              Copied
            </span>
          </>
        ) : (
          <>
            <Copy />
            <span className="absolute top-full mt-4 hidden rounded bg-zinc-800 px-2 py-1 text-sm text-white group-hover:block">
              copy
            </span>
          </>
        )}
      </button>
      <pre className="overflow-x-auto p-4 pt-15 text-sm text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// JAVASCRIPT
//
// await navigator.clipboard.writeText(code);
// navigator.clipboard is the browser's Clipboard API.
// writeText() copies the provided string to the user's clipboard.
// await waits until the copy operation completes before continuing.
