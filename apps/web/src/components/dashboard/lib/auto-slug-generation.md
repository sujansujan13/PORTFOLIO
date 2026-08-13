## how do we normally update the other field automatically after typing the other one like title and readonly slug not using react-hook
Without React Hook Form, this is usually done by making the inputs **controlled components** using React state.

### Method 1 (Most common): `useState`

```tsx
import { useEffect, useState } from "react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export default function Form() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  return (
    <>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
      />

      <input
        value={slug}
        readOnly
        placeholder="Slug"
      />
    </>
  );
}
```

Whenever `title` changes, the `slug` is updated automatically.

---

## Method 2: Update both in the same event

You don't even need `useEffect`.

```tsx
const [title, setTitle] = useState("");
const [slug, setSlug] = useState("");

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;

  setTitle(value);
  setSlug(slugify(value));
};
```

```tsx
<input
  value={title}
  onChange={handleTitleChange}
/>

<input
  value={slug}
  readOnly
/>
```

Many developers actually prefer this because it's simpler and doesn't require an effect.

---

## Method 3: Don't store the slug at all

If the slug is always derived from the title, you can compute it on every render.

```tsx
const [title, setTitle] = useState("");

const slug = slugify(title);
```

```tsx
<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<input
  value={slug}
  readOnly
/>
```

This is the cleanest solution **if the slug is never edited manually**.

---

### Why React Hook Form uses `watch` + `setValue`

React Hook Form stores form values internally instead of in React state. So instead of:

```tsx
const [title, setTitle] = useState("");
```

you do:

```tsx
const title = watch("title");

useEffect(() => {
  setValue("customSlug", slugify(title));
}, [title, setValue]);
```

The concept is exactly the same:

* React state → `useState`
* React Hook Form state → `watch()` and `setValue()`

The mechanism differs, but the idea of "when title changes, update slug" is the same.
