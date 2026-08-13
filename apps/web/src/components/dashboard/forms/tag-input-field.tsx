import { Plus, X } from "lucide-react";
import React from "react";

interface TagInputFieldProps {
  title: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export default function TagInputField({
  title,
  values,
  onAdd,
  onRemove,
  placeholder,
  error,
}: TagInputFieldProps) {
  const [inputValue, setInputValue] = React.useState("");

  const commit = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onAdd(trimmed);
    }
    setInputValue("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-wrap gap-1.5 p-2 bg-background/20 border border-border/80 rounded-md min-h-10.5">
        {values.map((value) => (
          <span
            key={value}
            className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-md"
          >
            {value}
            <button
              type="button"
              onClick={() => onRemove(value)}
              className="hover:text-destructive transition-colors cursor-pointer"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className="w-full bg-input/40 border border-border p-2 text-xs focus:outline-none focus:border-primary transition-colors rounded-sm"
      />
      {error && (
        <span className="text-destructive text-xs mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}

// import { Plus, X } from "lucide-react";
// import React from "react";

// interface TagInputField {
//   title: string;
//   values: string[];
//   onRemove: (value: string) => void;
//   placeholder?: string;
//   error?: string;
//   onAdd: (value: string) => void;
// }

// export default function TagInputField({
//   title,
//   values,
//   onRemove,
//   placeholder,
//   error,
//   onAdd,
// }: TagInputField) {
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
//           {title}
//         </h3>
//         <Plus className="h-3.5 w-3.5 text-muted-foreground" />
//       </div>
//       <div className="flex flex-wrap gap-1.5 p-2 bg-background/20 border border-border/80 rounded-md min-h-10.5">
//         {values.map((value) => (
//           <span
//             key={value}
//             className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-md"
//           >
//             {value}

//             <button
//               type="button"
//               onClick={() => onRemove(value)}
//               className="hover:text-destructive transition-colors cursor-pointer"
//             >
//               <X className="h-2.5 w-2.5" />
//             </button>
//           </span>
//         ))}
//       </div>
//       <input
//         type="text"
//         placeholder={placeholder}
//         onKeyDown={onAdd}
//         className="w-full bg-input/40 border border-border p-2 text-xs focus:outline-none focus:border-primary transition-colors rounded-sm"
//       />
//       {error && (
//         <span className="text-destructive text-xs mt-1 block font-medium">
//           {error}
//         </span>
//       )}
//     </div>
//   );
// }
