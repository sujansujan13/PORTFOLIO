With React Hook Form, there are **three common patterns**.

---

## 1. `watch()` + `setValue()` (Most common)

This is what you're already doing.

```tsx
const title = watch("title");

useEffect(() => {
  setValue("customSlug", slugify(title));
}, [title, setValue]);
```

This is the standard way when one field depends on another.

---

## 2. `watch()` directly (No `useEffect`)

If the slug is **display-only** and you don't need to submit it, you don't even need `setValue`.

```tsx
const title = watch("title");

<input
  value={slugify(title)}
  readOnly
/>
```

Here, the slug is computed on every render.

This is great for previews but **won't include `customSlug` in the submitted form data** because it isn't registered.

---

## 3. Update inside the title's `onChange` (Also common)

Instead of `useEffect`, intercept the title's `onChange`.

```tsx
const titleField = register("title");

<input
  {...titleField}
  onChange={(e) => {
    titleField.onChange(e);

    setValue("customSlug", slugify(e.target.value), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }}
/>
```

This avoids `watch()` and `useEffect` entirely.

---

# Which one should you use?

For your portfolio CMS, I'd recommend **Option 1**.

```tsx
const title = watch("title");

useEffect(() => {
  setValue("customSlug", slugify(title), {
    shouldValidate: true,
    shouldDirty: true,
  });
}, [title, setValue]);
```

Why?

* ✅ Easy to understand.
* ✅ Works well with React Hook Form.
* ✅ Keeps the slug registered in the form.
* ✅ Updates automatically whenever the title changes.
* ✅ Easy to extend later (e.g., stop auto-generating after the user manually edits the slug).

It's also the approach you'll commonly see in React Hook Form examples for dependent form fields.
