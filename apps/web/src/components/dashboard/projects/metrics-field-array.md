The magic is happening because of **`useFieldArray`**. It manages a dynamic array of form fields for you.

Let's follow the flow step by step.

#### useFieldArray is designed for arrays of objects.###
```ts
metrics: [
  {
    value: "98",
    label: "Lighthouse"
  },
  {
    value: "120+",
    label: "Components"
  }
]
```

---

# Step 1. Your form starts

Suppose your form is initialized like this:

```ts
useForm({
  defaultValues: {
    metrics: [],
  },
});
```

Initially,

```ts
metrics = []
```

No metrics exist.

---

# Step 2. `useFieldArray` connects to `metrics`

```tsx
const { fields, append, remove } = useFieldArray({
  control,
  name: "metrics",
});
```

This tells React Hook Form:

> "I want to manage the array called `metrics`."

It gives you three important things:

```ts
fields
```

Current items in the array.

```ts
append()
```

Add an item.

```ts
remove()
```

Delete an item.

---

# Step 3. Initially

```
metrics = []
```

So

```tsx
fields
```

is also

```ts
[]
```

Then React renders

```tsx
fields.map(...)
```

Since there are no items,

```
Nothing is rendered.
```

You only see the **Add** button.

---

# Step 4. User clicks Add

This runs

```tsx
onClick={() => append({ value: "", label: "" })}
```

So React Hook Form changes

```
Before

metrics = []
```

to

```
After

metrics = [
  {
    value: "",
    label: ""
  }
]
```

You didn't update any state yourself.

`append()` did it internally.

---

# Step 5. React re-renders

Now

```tsx
fields
```

becomes

```ts
[
  {
    id: "abc123",
    value: "",
    label: ""
  }
]
```

Notice it has an extra

```ts
id
```

React Hook Form automatically generates this.

---

# Step 6. map() runs again

Now

```tsx
fields.map(...)
```

loops once.

```
fields

↓

Item 0
```

It renders

```
Value input

Label input

Delete button
```

That's why a new row suddenly appears.

---

# Step 7. User clicks Add again

Again,

```tsx
append({
    value:"",
    label:""
})
```

Now

```
metrics
```

becomes

```ts
[
    {
        value:"",
        label:""
    },
    {
        value:"",
        label:""
    }
]
```

Now

```tsx
fields
```

contains two items.

React runs

```tsx
fields.map(...)
```

twice.

Now you see

```
Metric 1

Metric 2
```

---

# Step 8. Typing

Suppose you type

```
98
```

into

```tsx
metrics.0.value
```

React Hook Form stores

```ts
metrics = [
    {
        value:"98",
        label:""
    }
]
```

Then you type

```
Lighthouse Score
```

Now

```ts
metrics = [
    {
        value:"98",
        label:"Lighthouse Score"
    }
]
```

---

# Step 9. Clicking Remove

Clicking

```tsx
remove(index)
```

Suppose

```ts
remove(0)
```

React Hook Form changes

```
Before

[
    {
        value:"98",
        label:"Lighthouse Score"
    }
]
```

to

```
[]
```

React re-renders.

Nothing is left to map.

The row disappears.

---

# Why `field.id`?

Notice

```tsx
key={field.id}
```

React needs a **stable unique key**.

React Hook Form automatically gives every row an `id`.

Example

```ts
[
    {
        id:"a1",
        value:"",
        label:""
    },
    {
        id:"b2",
        value:"",
        label:""
    }
]
```

React uses these ids to know exactly which row changed.

---

# The complete flow

```
Form

metrics = []

        │
        ▼
useFieldArray

fields = []

        │
        ▼
fields.map()

Nothing rendered

        │
Click Add
        │
        ▼
append()

metrics = [
    { value:"", label:"" }
]

        │
        ▼
React re-renders

fields = [
    { id:"xyz", value:"", label:"" }
]

        │
        ▼
fields.map()

Renders one row

        │
Click Add again
        │
        ▼
append()

metrics = [
    {...},
    {...}
]

        │
        ▼
React re-renders

Now two rows appear.
```

The important idea is that **you never manually create or remove `<input>` elements**. You only modify the **`metrics` array** by calling `append()` or `remove()`. React Hook Form updates the array, React notices the change, and `fields.map(...)` automatically renders the correct number of input rows.
