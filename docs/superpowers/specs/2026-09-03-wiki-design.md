# Wiki Feature Design

## Overview

Add a static wiki section at `/wiki` to the Pipe Bomb landing site. Content is sourced from the GitHub wiki on the `/server` repo, cloned at build time. Pages are fully statically generated.

## Source & Build Pipeline

- Wiki lives at `github.com/Pipe-Bomb/server.wiki.git`
- At CI build time, wiki repo is cloned into `wiki-content/` (gitignored) before `next build` runs
- A `gollum` event workflow on the server repo dispatches a rebuild of the landing site when any wiki page is edited
- For local development, a script clones the wiki manually
- `wiki-content/` is excluded from git via `.gitignore`

### File Structure Convention

GitHub wiki stores nested pages as subdirectories:

```
wiki-content/
  Home.md              → /wiki
  Installation.md      → /wiki/installation
  Configuration/
    Server.md          → /wiki/configuration/server
    Plugins.md         → /wiki/configuration/plugins
```

`Home.md` maps to the index route `/wiki`. All other files map to their path segments lowercased.

## Architecture

### New Files

```
src/
  lib/
    wiki.ts                         ← data layer
  components/
    wiki-sidebar.component.tsx      ← client component
    wiki-sidebar.module.scss
  app/
    wiki/
      layout.tsx                    ← wiki shell layout
      wiki.module.scss
      [[...slug]]/
        page.tsx                    ← catch-all page
        wiki-content.module.scss    ← markdown element styles
```

### `src/lib/wiki.ts`

Exports:

- `getWikiTree(): WikiNode[]` - walks `wiki-content/` recursively, returns typed tree
- `getWikiPage(slug: string[]): { title: string; html: string }` - reads `.md` file, parses through remark pipeline, returns HTML string
- `getAllWikiSlugs(): { slug: string[] }[]` - flattens tree for `generateStaticParams`

Types:

```ts
type WikiPage = { kind: "page"; title: string; slug: string[] };
type WikiSection = { kind: "section"; title: string; children: WikiNode[] };
type WikiNode = WikiPage | WikiSection;
```

Title is derived from the first `# heading` in the file, falling back to the filename with hyphens replaced by spaces.

### `src/app/wiki/layout.tsx`

Server component. Calls `getWikiTree()` and passes the tree to `WikiSidebar`. Renders a two-column shell: fixed-width sidebar (260px) + scrollable content area. Uses the existing navbar above.

### `src/app/wiki/[[...slug]]/page.tsx`

- Exports `generateStaticParams` using `getAllWikiSlugs()`
- No slug = `Home.md`
- Calls `getWikiPage(slug)` and renders HTML via `dangerouslySetInnerHTML` inside a styled `<article>`
- Generates `<title>` and OG meta from page title

### `src/components/wiki-sidebar.component.tsx`

Client component. Receives the full `WikiNode[]` tree and the current slug (passed as a prop from layout). Renders a recursive tree:

- Leaf pages: links with active state (green left-border accent, `--accent-primary` text)
- Sections: collapsible with `IconChevronRight`/`IconChevronDown` from `@tabler/icons-react`, `stroke={1.5}`
- Sections containing the active page auto-expand on mount
- Mobile: hidden by default, toggled via a menu button in the wiki header bar

## Layout

```
┌─ navbar (existing) ──────────────────────────────────┐
├─ sidebar (260px) ───┬─ content area ─────────────────┤
│ bg-surface          │ bg-base                        │
│ border-right        │                                │
│ sticky, full height │ max-width: 72ch                │
│                     │ padding: 48px 64px             │
│ Page links          │ <article> markdown output      │
│   > Section         │                                │
│     Nested page     │                                │
└─────────────────────┴────────────────────────────────┘
```

Mobile breakpoint (`< 768px`): sidebar becomes a slide-in overlay, triggered by a menu icon button in a top bar above the content.

## Markdown Styling

All styles use existing CSS variables. The `<article>` element contains all rendered markdown. Styles are scoped via SCSS module.

| Element                     | Style                                                                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `h1`                        | Outfit, 2rem, `--fg-primary`, `font-weight: 700`, `letter-spacing: -0.02em`, `margin-bottom: 16px`, anchor `#` on hover                                     |
| `h2`                        | Outfit, 1.5rem, `--fg-primary`, `font-weight: 700`, `border-bottom: 1px --border-default`, `padding-bottom: 8px`                                            |
| `h3`                        | Outfit, 1.25rem, `--fg-primary`, `font-weight: 600`                                                                                                         |
| `h4`–`h6`                   | Inter, 1rem, `--fg-secondary`, `font-weight: 600`                                                                                                           |
| `p`                         | Inter, 1rem, `--fg-secondary`, `line-height: 1.75`, `max-width: 72ch`                                                                                       |
| `a`                         | `--accent-primary`, underline on hover                                                                                                                      |
| `strong`                    | `--fg-primary`, `font-weight: 600`                                                                                                                          |
| `em`                        | italic, inherits color                                                                                                                                      |
| `del`                       | `--fg-muted`, `text-decoration: line-through`                                                                                                               |
| `code` (inline)             | mono font, `--bg-elevated` bg, `--accent-primary` text, `border-radius: 4px`, `padding: 2px 6px`                                                            |
| code block                  | `--bg-elevated` bg, `1px --border-default` border, `border-radius: 10px`, `padding: 20px 24px`, language label in `--fg-muted` top-right, horizontal scroll |
| `blockquote`                | `3px solid --accent-primary` left border, `--bg-surface` bg, `border-radius: 0 8px 8px 0`, `--fg-secondary` text                                            |
| `ul`                        | `--fg-secondary`, custom bullet: `3px` circle in `--accent-primary`                                                                                         |
| `ol`                        | `--fg-secondary`, counter in `--accent-primary`                                                                                                             |
| nested lists                | `padding-left: 24px` per level                                                                                                                              |
| `table`                     | full-width, `--border-default` borders, header in `--bg-elevated` + `--fg-primary`, body rows `--fg-secondary`, alternating `--bg-surface`                  |
| `hr`                        | `1px solid --border-default`, `margin: 32px 0`                                                                                                              |
| `img`                       | `border-radius: 8px`, `1px --border-default` border, max 100% width                                                                                         |
| task list `- [ ]` / `- [x]` | checkbox styled with `--accent-primary` for checked                                                                                                         |

## Markdown Processing Pipeline

Dependencies to install: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`, `rehype-slug`, `rehype-autolink-headings`.

`remark-gfm` adds tables, strikethrough, task lists, and autolinks. `rehype-slug` + `rehype-autolink-headings` add anchor links to headings.

## Sidebar Styling

- Background: `--bg-surface`
- Right border: `1px solid --border-default`
- Width: 260px fixed
- Padding: `16px 12px`
- Section headers: `0.7rem`, `font-weight: 600`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `--fg-muted`, non-clickable label with chevron button beside it
- Page links: `0.875rem`, `--fg-secondary`, `border-radius: 6px`, `padding: 6px 10px`, hover: `--bg-elevated`, `--fg-primary`
- Active page: `--fg-primary`, `--bg-elevated`, `3px solid --accent-primary` left border
- Nesting indent: `12px` per level via `padding-left`
- Chevron icon: `IconChevronRight` / `IconChevronDown`, 14px, `stroke={1.5}`, `--fg-muted`

## CI Workflow

Two workflow files on the server repo:

1. **`wiki-rebuild.yml`** - triggers on `gollum` event, dispatches a `repository_dispatch` to the landing-site repo
2. **`build.yml` change** - add `paths-ignore: ['**.md']` to prevent wiki commits from triggering server CI (wiki edits don't touch the main repo, but this makes intent explicit)

Landing-site repo gets a workflow that responds to `repository_dispatch` type `wiki-updated` and runs a standard build + deploy.

## Error Handling

- Missing `wiki-content/` directory at build time: throw with a clear message directing to run the clone script
- Missing page file: Next.js `notFound()` returning a 404
- Malformed markdown: remark is resilient; no special handling needed

## Self-Review

- No placeholders or TBDs remaining
- Architecture matches the approved layout design
- Scoped to wiki feature only, no unrelated changes
- Mobile handling explicit (overlay sidebar)
- All markdown elements covered
