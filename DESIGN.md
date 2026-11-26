# FloraLearn Design System

FloraLearn is a botanical learning space for students and teachers. Its interface
should feel calm and practical: the green identity connects learning to plant
science, while clear hierarchy keeps lessons, course progress, and teaching tools
easy to scan.

This document describes the visual system currently implemented in the app. CSS
custom properties in `src/styles.css` are the source of truth; hex values below
are visual references converted from those OKLCH tokens.

## Design principles

- **Learning comes first.** Give lesson content and the next useful action more
  emphasis than decoration.
- **Use botanical color with restraint.** Green identifies the product and
  important actions; neutral surfaces carry most of the interface.
- **Make progress legible.** Use concise labels, clear states, and progress
  indicators instead of requiring students to infer what is complete.
- **Keep teacher workflows direct.** Course, module, PDF, and quiz actions should
  be easy to distinguish and find.
- **Stay approachable.** Use friendly shapes and plain Indonesian copy without
  sacrificing readability or accessibility.

## Color

The palette is defined in OKLCH to preserve predictable lightness and chroma.
Use semantic tokens in components rather than hard-coding the reference hexes.

| Token | Light value | Hex reference | Purpose |
| --- | --- | --- | --- |
| `background` | `oklch(0.99 0.005 140)` | `#FAFDF9` | Main page canvas |
| `foreground` | `oklch(0.18 0.02 150)` | `#0B140D` | Primary text |
| `primary` | `oklch(0.44 0.135 152)` | `#006629` | Main actions, brand mark, active emphasis |
| `secondary` | `oklch(0.955 0.025 145)` | `#E6F5E6` | Selected navigation and soft emphasis |
| `muted` | `oklch(0.96 0.01 140)` | `#EEF4ED` | Quiet surfaces and supporting content |
| `border` | `oklch(0.915 0.015 140)` | `#DEE6DC` | Dividers, outlines, and control boundaries |

Other semantic tokens include `card`, `popover`, `accent`, `muted-foreground`,
`destructive`, `input`, and `ring`. Prefer these tokens for their matching
roles. Status colors should use component variants or semantic status tokens,
not arbitrary colors.

### Dark theme

The `.dark` theme overrides the same semantic tokens. It uses a deep green-black
canvas (`oklch(0.14 0.018 150)`), softened dark surfaces, light text, and a
brighter green primary (`oklch(0.66 0.14 150)`). Keep component markup
theme-agnostic so these token changes remain effective.

## Typography

- **Typeface:** Figtree Variable, loaded from `@fontsource-variable/figtree`.
- **Role:** Use the same family for headings, body copy, navigation, and controls.
  The variable weights provide hierarchy without adding another typeface.
- **Headings:** Bold or semibold, compact leading, and slight negative tracking
  for page titles.
- **Body:** Regular weight with comfortable line-height; use `muted-foreground`
  for supporting descriptions.
- **Labels and metadata:** Keep small text readable and sentence case. Reserve
  uppercase for the compact sidebar navigation label already used by the app.

Use the existing Tailwind type scale where practical. Page titles commonly use
`text-2xl` and scale to `sm:text-3xl`; section titles are typically `text-lg`;
supporting copy is usually `text-sm` or `text-xs`.

## Shape, spacing, and elevation

- **Base radius:** `--radius: 0.625rem` (10px), with derived small, medium, large,
  and extended radius tokens.
- **Cards:** Rounded `2xl` surfaces with a subtle outline rather than a heavy
  drop shadow. Reserve shadows for small emphasis, such as a primary action.
- **Buttons and badges:** Pill-like, using the existing high-radius component
  variants.
- **Spacing:** Use Tailwind spacing utilities and `gap-*` for layout. Dashboard
  sections commonly use 4–8 spacing units; card interiors use the component's
  built-in spacing.
- **Borders:** Use `border-border` and related semantic tokens. Avoid decorative
  rules that do not clarify grouping.

## Layout

### Application shell

- On desktop (`lg` and above), use a fixed, 18rem-wide sidebar that fills the
  viewport height. Keep the profile area at the bottom and allow the sidebar to
  scroll internally only if necessary.
- Offset the main column by the sidebar width on desktop so content never sits
  underneath it.
- Keep the 4rem application header sticky at the top. It contains mobile
  navigation, global search, notifications, and the user menu.
- On smaller screens, hide the desktop sidebar and use the existing sheet
  navigation.

### Page content

- Align dashboard content to the left and constrain it to a readable maximum
  width (`max-w-7xl` in the current layouts).
- Use a clear page introduction followed by task-relevant content. Do not center
  entire dashboards or justify paragraphs.
- Use responsive grids that collapse to one column on narrow screens. Increase
  columns only when the content can remain comfortably readable.
- For lesson pages, prioritize the reading column and place module navigation
  alongside it only when the viewport has sufficient width.

## Components and states

Use the existing components in `src/components/ui` before creating new
primitives. They use Base UI, class-variance-authority, and the project's
semantic tokens.

- **Buttons:** Use the default primary variant for the main action, `outline`
  for secondary actions, and `ghost` for low-emphasis actions. Use `destructive`
  for irreversible or destructive actions.
- **Cards:** Use the full `Card` composition (`CardHeader`, `CardContent`, and
  optionally `CardFooter`) to keep information structured.
- **Badges:** Use concise labels for roles, course states, and completion states.
- **Inputs:** Keep labels visible and adjacent to their controls. Use the
  existing input, select, and textarea components.
- **Navigation:** Show the current section with the secondary surface and
  foreground tokens. Preserve a clear keyboard focus ring.
- **Dialogs and sheets:** Use for focused tasks and mobile navigation, not to
  replace straightforward inline content.
- **Loading and empty states:** Explain what is loading or what action can fill
  an empty view; avoid decorative placeholders without useful context.

Interactive elements need visible hover, focus-visible, active, and disabled
states. Provide accessible names for icon-only controls, maintain keyboard
operation, and respect reduced-motion preferences.

## Content and iconography

- Write in Indonesian for the current audience. Use direct, helpful wording and
  consistent action names such as “Simpan”, “Terbitkan”, and “Lihat materi”.
- Keep labels short and describe the result of an action rather than its
  implementation.
- Use Hugeicons from `@hugeicons/core-free-icons` through `HugeiconsIcon`.
  Pair icons with text when an action or status might otherwise be ambiguous.
- Botanical imagery and plant symbols should support the learning content, not
  serve as repeated decoration.

## Implementation conventions

- Keep color values in `src/styles.css` and reference them through semantic
  Tailwind classes such as `bg-background`, `text-foreground`, `bg-primary`, and
  `border-border`.
- Reuse components from `src/components/ui`; extend their variants when a shared
  pattern is needed.
- Prefer layout utilities (`flex`, `grid`, `gap-*`, responsive prefixes) over
  one-off CSS.
- Maintain responsive behavior, readable contrast, and keyboard focus when
  adding or changing components.
- When changing a global token, check both light and dark themes and review
  buttons, cards, navigation, inputs, and status indicators.
