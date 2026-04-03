# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development requires two processes running in parallel (separate terminals):

```bash
npm run dev:css   # Tailwind watcher: src/styles/input.css → src/styles/output.css
npm run dev:site  # Eleventy dev server with live reload
```

Production build:

```bash
npm run build     # build:css (minified → dist/styles.css) then build:site (→ dist/)
```

There are no tests or linting commands.

## Architecture

This is an [Eleventy (11ty)](https://www.11ty.dev/) static site called **Eidolon Aeon**, styled with Tailwind CSS v4.

**Directory layout:**
- `src/pages/` — Eleventy input root. Contains HTML content pages organized into `blog/`, `fiction/`, and `nonfiction/` subdirectories.
- `src/_includes/` — Nunjucks templates: `layouts/post.njk` (for content posts), `layouts/page.njk` (for other pages), and `partials/` (nav, tags).
- `src/styles/input.css` — Tailwind entry point (imports `tailwindcss`, `@tailwindcss/typography`, `@tailwindcss/forms`).
- `src/assets/` — Images and music files; passed through to `dist/assets/` unchanged.
- `dist/` — Build output (gitignored).

**Collections** (defined in `.eleventy.js`, sorted newest-first):
- `blog` — `src/pages/blog/**/*.{md,html}`
- `fiction` — `src/pages/fiction/**/*.{md,html}`
- `nonfiction` — `src/pages/nonfiction/**/*.{md,html}`

**Content post front matter** (required fields):
```yaml
---
layout: layouts/post.njk
title: Post Title
date: 2025-01-01T12:00:00-04:00
collectionName: blog   # or fiction / nonfiction
category: Blog         # display label
tags: [tag1, tag2]     # optional
---
```

**Custom filters** (available in Nunjucks templates):
- `date(fmt, zone)` — Formats dates via Luxon (default format: `LLL d, yyyy`)
- `wordCount` — Strips HTML and counts words
- `readingTime(wpm)` — Returns human-readable estimate (default 220 wpm)
- `filterTagList` — Removes reserved tags (`all`, `nav`, `post`)

**Custom shortcode:** `{% PrevNext collectionName, page %}` — renders previous/next navigation within a collection.

**CSS pipeline:** Tailwind v4 via `@tailwindcss/postcss`. In dev, the compiled `src/styles/output.css` is passed through to `dist/styles.css`. In production, Tailwind builds directly to `dist/styles.css` (minified). The stylesheet is referenced as `/styles.css` in all templates.
