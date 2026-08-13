This is the typical **Tailwind CSS switch** pattern. It looks complicated because it uses **peer**, **pseudo-elements**, and **absolute positioning** together. Let's break it down piece by piece.

---

# 1. The `<label>`

```tsx
<label
  htmlFor={title}
  className="relative inline-flex items-center cursor-pointer select-none"
>
```

### `htmlFor={title}`

Connects the label with the input.

```tsx
<input id={title} />
```

Now clicking anywhere on the label also toggles the checkbox.

---

### `relative`

This is important.

```html
<label class="relative">
```

Any absolutely positioned child (like the white circle) will be positioned relative to this label.

Without `relative`, the circle would position itself relative to the page.

---

### `inline-flex`

Instead of

```css
display: flex;
```

it becomes

```css
display: inline-flex;
```

Meaning:

* behaves like text
* only takes as much width as needed

---

### `items-center`

Vertically centers children.

```
 ---------
|   O     |
 ---------
```

---

### `cursor-pointer`

Mouse becomes

☞

instead of

I

---

### `select-none`

Prevents highlighting text when clicking repeatedly.

---

# 2. The hidden checkbox

```tsx
<input
  type="checkbox"
  {...registration}
  className="sr-only peer"
  id={title}
/>
```

---

## `type="checkbox"`

The real checkbox.

---

## `{...registration}`

React Hook Form registers it.

Equivalent to

```tsx
<input
  onChange={...}
  onBlur={...}
  ref={...}
/>
```

---

## `id={title}`

Matches

```tsx
<label htmlFor={title}>
```

---

## `sr-only`

Means

> Screen Reader Only

The checkbox still exists

✔ accessible

✔ keyboard focus

✔ form submission

but visually invisible.

Instead of

```
☐
```

the user only sees the custom switch.

---

## `peer`

This is one of Tailwind's coolest utilities.

Imagine

```
Input
↓

Switch UI
```

Normally CSS cannot style a sibling based on another sibling.

Tailwind solves this.

```
<input class="peer">

<div class="peer-checked:bg-blue-500"></div>
```

When

```
input checked
```

↓

```
div background changes
```

---

# 3. The switch background

```tsx
<div
className="
w-9
h-5
bg-input
peer-focus:outline-none
rounded-full
peer
peer-checked:bg-primary
..."
>
```

---

## `w-9`

Width

```
36px
```

---

## `h-5`

Height

```
20px
```

---

## `bg-input`

Default background

```
────────────
████████████
────────────
```

Usually gray.

---

## `rounded-full`

Makes

```
████████
```

become

```
(██████)
```

Like an iPhone switch.

---

## `peer-focus:outline-none`

When checkbox gets keyboard focus

```
Tab
```

don't draw browser outline.

---

## `peer-checked:bg-primary`

This is magic.

When checkbox becomes

```
checked
```

Tailwind changes

```
gray
```

↓

```
primary color
```

---

# 4. The white circle

This is the crazy-looking part.

```tsx
after:content-['']
```

There isn't actually another element.

CSS creates one.

Equivalent CSS

```css
div::after{
    content:"";
}
```

So the browser secretly creates

```
<div>

   ○

</div>
```

without writing another `<div>`.

---

# 5. Positioning the circle

```tsx
after:absolute
```

Means

```
○
```

is absolutely positioned.

---

```tsx
after:top-0.5
```

Move

```
2px
```

from top.

---

```tsx
after:left-0.5
```

Move

```
2px
```

from left.

Initially

```
○────────
```

---

# 6. Circle appearance

```tsx
after:bg-white
```

White.

---

```tsx
after:rounded-full
```

Perfect circle.

---

```tsx
after:h-4
after:w-4
```

Circle

```
16 × 16
```

---

# 7. Animation

```tsx
after:transition-all
```

Without it

```
OFF

○──────

↓

ON

──────○
```

It jumps instantly.

With transition

```
○──────

→→→→→

──────○
```

Smooth animation.

---

# 8. Moving the knob

```tsx
peer-checked:after:translate-x-full
```

When checked,

move the pseudo-element horizontally by **100% of its own width**.

Initially

```
○──────────
```

Checked

```
──────────○
```

---

# Complete flow

Initially

```
Checkbox = false

Background
────────────
 Gray

○──────────
```

Click

↓

Checkbox becomes true

↓

`peer-checked`

activates

↓

Background

```
Blue
```

↓

Circle

```
○──────
```

animates

```
──────○
```

---

# The generated HTML conceptually

Your JSX:

```tsx
<label>
    <input class="peer" />
    <div></div>
</label>
```

The browser effectively renders something like:

```html
<label class="relative">
    <input class="peer">

    <div class="switch">
        ::after
    </div>
</label>
```

The `::after` pseudo-element is an invisible extra element created by CSS:

```html
<label class="relative">
    <input class="peer">

    <div class="switch">
        <pseudo-after class="knob"></pseudo-after>
    </div>
</label>
```

So visually, what you end up with is:

```
Label
│
├── Hidden checkbox
│
└── Switch
      │
      └── White knob (::after)
```

The hidden checkbox controls the switch's appearance via `peer-*` classes, while the white knob is just a CSS pseudo-element that slides left and right when the checkbox is checked. This pattern is widely used because it's accessible (the real checkbox still exists), easy to animate, and doesn't require extra markup.
