Without React Hook Form, **you manage the array yourself using `useState`**.

The idea is exactly the same:

* Store an array in state.
* Add an object to the array when the user clicks **Add**.
* Remove an object when they click **Remove**.
* Update the correct object when an input changes.

---

## Step 1. Create state

```tsx
const [metrics, setMetrics] = useState([
  { value: "", label: "" },
]);
```

Initially,

```ts
metrics = [
  {
    value: "",
    label: ""
  }
]
```

---

## Step 2. Render inputs

```tsx
{metrics.map((metric, index) => (
  <div key={index}>
    <input
      value={metric.value}
      onChange={(e) =>
        handleChange(index, "value", e.target.value)
      }
    />

    <input
      value={metric.label}
      onChange={(e) =>
        handleChange(index, "label", e.target.value)
      }
    />

    <button onClick={() => removeMetric(index)}>
      Remove
    </button>
  </div>
))}
```

Instead of

```tsx
register(...)
```

you use

```tsx
value={...}
onChange={...}
```

---

## Step 3. Update a field

```tsx
function handleChange(
  index: number,
  field: "value" | "label",
  value: string
) {
  setMetrics((prev) =>
    prev.map((metric, i) =>
      i === index
        ? { ...metric, [field]: value }
        : metric
    )
  );
}
```

Suppose

```ts
metrics = [
  {
    value: "",
    label: ""
  }
]
```

Typing

```text
98
```

changes it into

```ts
metrics = [
  {
    value: "98",
    label: ""
  }
]
```

---

## Step 4. Add a row

```tsx
function addMetric() {
  setMetrics((prev) => [
    ...prev,
    {
      value: "",
      label: "",
    },
  ]);
}
```

Clicking **Add**

Before

```ts
[
  {
    value: "98",
    label: "Lighthouse"
  }
]
```

After

```ts
[
  {
    value: "98",
    label: "Lighthouse"
  },
  {
    value: "",
    label: ""
  }
]
```

React re-renders automatically.

---

## Step 5. Remove a row

```tsx
function removeMetric(index: number) {
  setMetrics((prev) =>
    prev.filter((_, i) => i !== index)
  );
}
```

Suppose

```ts
[
  { value: "98", label: "Lighthouse" },
  { value: "120+", label: "Components" }
]
```

Removing index `0`

becomes

```ts
[
  { value: "120+", label: "Components" }
]
```

---

# Complete example

```tsx
import { useState } from "react";

export default function Metrics() {
  const [metrics, setMetrics] = useState([
    { value: "", label: "" },
  ]);

  function addMetric() {
    setMetrics((prev) => [
      ...prev,
      { value: "", label: "" },
    ]);
  }

  function removeMetric(index: number) {
    setMetrics((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function handleChange(
    index: number,
    field: "value" | "label",
    value: string
  ) {
    setMetrics((prev) =>
      prev.map((metric, i) =>
        i === index
          ? { ...metric, [field]: value }
          : metric
      )
    );
  }

  return (
    <>
      <button onClick={addMetric}>Add</button>

      {metrics.map((metric, index) => (
        <div key={index}>
          <input
            value={metric.value}
            onChange={(e) =>
              handleChange(index, "value", e.target.value)
            }
          />

          <input
            value={metric.label}
            onChange={(e) =>
              handleChange(index, "label", e.target.value)
            }
          />

          <button onClick={() => removeMetric(index)}>
            Remove
          </button>
        </div>
      ))}
    </>
  );
}
```

## So why use React Hook Form?

Both approaches work, but React Hook Form saves you from writing and maintaining all that state-management logic.

With `useState`, **you** are responsible for:

* Managing the array state
* Updating individual fields
* Tracking touched/dirty state
* Validation
* Resetting the form
* Performance optimizations

With `useFieldArray`, React Hook Form handles those concerns for you, while still letting you render the fields with a simple `fields.map(...)`.
