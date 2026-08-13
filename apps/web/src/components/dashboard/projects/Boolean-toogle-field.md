Yes. Make one reusable boolean/toggle field component and use it for both `publicAccess` and `featured`.

For example:

**`apps/web/src/components/dashboard/forms/boolean-toggle-field.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface BooleanToggleFieldProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  registration: UseFormRegisterReturn;
}

export default function BooleanToggleField({
  title,
  description,
  icon,
  registration,
}: BooleanToggleFieldProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-background/40 border border-border rounded-md">
      <div className="flex items-center gap-3">
        {icon && <div className="shrink-0">{icon}</div>}

        <div>
          <p className="text-xs font-bold">{title}</p>

          {description && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input type="checkbox" {...registration} className="sr-only peer" />

        <div className="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
      </label>
    </div>
  );
}
```

Then use it in your visibility card:

```tsx
import { Globe, Star } from "lucide-react";
import BooleanToggleField from "@/components/dashboard/forms/boolean-toggle-field";
```

```tsx
<div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
    Project Visibility
  </h3>

  <BooleanToggleField
    title="Public Access"
    description="Visible on live portfolio index"
    icon={<Globe className="h-4 w-4 text-primary" />}
    registration={register("publicAccess")}
  />

  <BooleanToggleField
    title="Featured Project"
    description="Highlight this project in featured sections"
    icon={<Star className="h-4 w-4 text-yellow-500" />}
    registration={register("featured")}
  />
</div>
```

And keep your default values:

```ts
defaultValues: {
  publicAccess: true,
  featured: false,
}
```

This is a good reusable component because later you can use it for blogs too:

```tsx
<BooleanToggleField
  title="Published"
  description="Make this blog visible publicly"
  icon={<Globe className="h-4 w-4 text-primary" />}
  registration={register("publicAccess")}
/>

<BooleanToggleField
  title="Featured Blog"
  description="Show this blog in featured sections"
  icon={<Star className="h-4 w-4 text-yellow-500" />}
  registration={register("featured")}
/>
```