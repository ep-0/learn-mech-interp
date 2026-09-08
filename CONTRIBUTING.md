# Contributing

Thank you for your interest in contributing to the mechanistic interpretability curriculum. This guide covers the project structure, how to run the site locally, and how to add or modify articles.

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Local development

```bash
git clone <repo-url>
cd learn-mech-interp
npm install
npm start        # serve locally with hot reload
npm run build    # one-off production build
```

The site will be available at `http://localhost:8080/learn-mech-interp/`.

## Project structure

```
src/
  topics/
    _textbooks.json                # Textbook metadata: slug, title, order, sidebar hue
    <block-slug>/
      _block.json                  # Block metadata: { "title": "...", "textbook": "...", "order": N }
      <article-slug>/
        index.md                   # Article content with frontmatter
        images/                    # Article-specific images (optional)
    topics.11tydata.js             # Computed data for all articles
  _data/
    learningPath.js                # Computed from filesystem (do not edit)
    glossary.js                    # Computed from article frontmatter (do not edit)
    references.json                # Centralized bibliography
  _includes/
    layouts/                       # Nunjucks layouts
    partials/                      # Reusable template fragments
  glossary/
    index.njk                      # Glossary page
  index.njk                        # Home page
lib/
  scanBlocks.js                    # Filesystem scanner (shared by data files and config)
eleventy.config.js                 # Eleventy configuration and build-time validation
ARTICLE_GUIDELINES.md              # Tone, structure, and content rules for articles
```

Key points:
- **`learningPath.js` and `glossary.js` are computed from the filesystem.** You never edit them directly. The sidebar, topics page, prev/next navigation, and glossary all update automatically when you add or modify articles.
- **`references.json`** and **`_textbooks.json`** are the only data files you edit by hand (to add new citations and new textbooks).
- **Articles nest three deep: textbook -> block -> article.** A textbook is a self-contained course; blocks are its chapters. The sidebar renders that hierarchy as nested collapsible sections, each textbook tinted with its own colour.
- **Prerequisites form a graph, not just a reading order.** Every article lists what to read first, those articles list their own prerequisites, and following the chain far enough always terminates in the assumed background described in [What This Book Assumes](src/topics/transformer-foundations/mi-prerequisites/index.md). The build enforces that the graph has no cycles.
- **URLs are flat.** An article at `src/topics/probing/probing-classifiers/index.md` is served at `/topics/probing-classifiers/`, not `/topics/probing/probing-classifiers/`.

## Adding a new article

### 1. Choose the right block

First identify the reusable technique or concept being taught. A paper is a source, not an organizing unit: split its contributions among the existing concept articles that own them, and create a new article only when a concept deserves to be learned independently.

Articles are grouped into thematic blocks, and blocks are grouped into textbooks. Each block is a directory under `src/topics/` with a `_block.json` file that names its textbook. Pick the block that fits your article's topic.

If no existing block fits, see [Adding a new block](#adding-a-new-block) below. If the article belongs to a whole new course of study (a prerequisite curriculum, say, rather than another mechanistic interpretability chapter), see [Adding a new textbook](#adding-a-new-textbook).

### 2. Create the article directory

```bash
mkdir src/topics/<block-slug>/<article-slug>
```

The article slug becomes part of the URL (`/topics/<article-slug>/`), so choose something short, lowercase, and hyphenated.

### 3. Write `index.md`

Create `src/topics/<block-slug>/<article-slug>/index.md` with this frontmatter:

```yaml
---
title: "Your Article Title"
description: "A one-sentence summary for the article header and metadata."
order: N
prerequisites:
  - title: "Prerequisite Article Title"
    url: "/topics/prerequisite-slug/"
glossary:
  - term: "Key Term"
    definition: "Concise definition of the term."
---

Article content here...
```

**Required fields:**
- `title` -- the article's display title
- `description` -- shown below the title on the article page
- `order` -- integer position within the block (1-indexed, contiguous, no gaps)

**Optional fields:**
- `prerequisites` -- list of articles the reader should complete first
- `glossary` -- terms this article defines (appear on the glossary page)

### 4. Set the correct order

The `order` field determines where the article appears within its block. Orders must be contiguous starting from 1. If you are adding an article to a block that already has 3 articles (orders 1, 2, 3), your new article should be order 4 (appending) or you need to renumber existing articles to insert it elsewhere.

### 5. Add citations

If your article cites papers, add entries to `src/_data/references.json`:

```json
"bibtex_key": {
  "title": "Paper Title",
  "authors": "Last, F., Last, F., et al.",
  "year": 2024,
  "venue": "Conference or Publisher",
  "url": "https://..."
}
```

Then reference them inline with `{% cite "bibtex_key" %}`.

### 6. Add images (optional)

Place images in `src/topics/<block-slug>/<article-slug>/images/`. Reference them with absolute paths:

```markdown
![Alt text](/topics/<article-slug>/images/filename.png)
```

The build remaps nested image directories to flat output paths, so the URL does not include the block slug.

### 7. Read the article guidelines

**Before writing content, read `ARTICLE_GUIDELINES.md`.** It covers tone, structure, formatting, and the pedagogical approach. The short version:

- The textbook is organized by **techniques, concepts, or method families**, never by individual papers. Papers provide evidence inside those articles.
- Start with motivation, then concrete examples, then abstractions
- Use `{% sidenote "..." %}` for tangents and `{% marginnote "..." %}` for unnumbered margin notes
- Use `<details class="pause-and-think">` for engagement prompts (aim for 1--3 per article)
- Use blockquote format for key definitions: `> **Term:** Definition here.`
- Cite at the point of the claim with `{% cite "key" %}`
- Keep articles to roughly 15--25 minutes reading time

### 8. Verify

Run `npm run build`. The build-time validator checks:

- Required frontmatter fields (`title`, `description`, `order`)
- Contiguous ordering within blocks, and of blocks within a textbook (no gaps or duplicates)
- Every block names a textbook declared in `_textbooks.json`, and every textbook has at least one block
- `status` is `placeholder` or absent
- The prerequisite graph is acyclic, no article lists itself, and no prerequisite is reachable through another one on the same list
- All `{% cite "key" %}` keys exist in `references.json`
- All prerequisite URLs point to existing articles
- No duplicate glossary terms across articles

If the build fails, the error message will tell you exactly what to fix.

## Modifying an existing article

- **Content edits** (fixing errors, improving explanations, adding sections): edit `index.md` directly. Read `ARTICLE_GUIDELINES.md` if you are making substantive changes.
- **Reordering**: change the `order` field in the affected articles. Keep orders contiguous within the block.
- **Moving to a different block**: `git mv` the article directory, then update the `order` fields in both the source and destination blocks so they remain contiguous.
- **Moving a block to a different textbook**: change `textbook` in its `_block.json`, then renumber the `order` fields in both the old and new textbooks so each stays contiguous.
- **Adding glossary terms**: add entries to the `glossary:` list in the article's frontmatter. Each term must be unique across all articles.
- **Adding citations**: add the reference to `src/_data/references.json`, then use `{% cite "key" %}` in the article.
- **Filling in a placeholder**: write the article as usual, then delete `status: placeholder` from its frontmatter and remove the "Why this article exists" and "What this article will cover" scaffolding. Keep its prerequisites unless the finished article genuinely needs different ones.

## Prerequisites

The `prerequisites` list in an article's frontmatter is what the reader should have read first, and it is the site's main navigation aid after the sidebar.

- **List the nearest prerequisite, not the whole chain.** If an article needs projections, link [Orthogonality and Projections](/topics/orthogonality-and-projections/), not the vectors article that projections themselves build on. The reader reaches the rest by following links from there.
- **Aim for at most four.** A longer list usually means the article is doing too much, or that some entries are already reachable through the others.
- **Cross-textbook links are normal.** A mechanistic interpretability article that needs the chain rule should link straight to it in Mathematical Foundations. Clicking it collapses the current textbook in the sidebar and opens the target's.
- **If the prerequisite has no article anywhere on the site, create a placeholder for it** (below) rather than leaving the dependency unstated.
- **The graph must stay acyclic**, and the build fails on a cycle, naming the loop.
- **The build also rejects a prerequisite that another listed prerequisite already reaches.** If an article lists both `attention-mechanism` and `embeddings`, and attention already depends on embeddings, drop the second: the reader gets there by following the first. This is what keeps "nearest" enforceable rather than aspirational.

## Placeholder articles

A placeholder fixes a topic's place in the prerequisite chain before anyone writes it. Give it the frontmatter every article has, plus `status: placeholder`:

```yaml
---
title: "Rank and Low-Rank Factorization"
description: "One-sentence summary, same as any article."
order: 6
status: placeholder
prerequisites:
  - title: "Matrices as Linear Maps"
    url: "/topics/matrices-as-linear-maps/"
---
```

`status` is either `placeholder` or absent; any other value fails validation. The layout renders a "Planned article" notice, the sidebar dims the entry and marks it, and the topics page tags it. The body carries the intended scope in three sections: why the article exists, what it will cover, and which articles depend on it.

Placeholders count as real articles everywhere else: they take an `order` within their block, they appear in prev/next navigation, and they can be linked as prerequisites.

## Adding a new block

1. Create `src/topics/<block-slug>/_block.json`:

```json
{
  "title": "Block Display Title",
  "textbook": "mechanistic-interpretability",
  "order": N
}
```

2. `textbook` must match a `slug` in `src/topics/_textbooks.json`.

3. Block `order` is scoped to the textbook and must be contiguous within it. If the textbook currently has 12 blocks (orders 1--12), a new block should be order 13 (appending) or you need to renumber that textbook's blocks to insert it. Blocks in different textbooks number independently.

4. Add at least one article inside the block directory.

## Adding a new textbook

A textbook is a standalone course. Reach for one when the material is not another chapter of an existing book: a prerequisites curriculum, for instance, that a reader might work through before or alongside the main sequence.

1. Add an entry to `src/topics/_textbooks.json`:

```json
{
  "slug": "textbook-slug",
  "title": "Textbook Display Title",
  "description": "One sentence shown under the title on the topics page.",
  "order": N,
  "hue": 152
}
```

2. `order` must be contiguous across textbooks, and it sets reading order: every block of textbook 1 comes before every block of textbook 2 in the sidebar, on the topics page, and in prev/next article navigation.

3. Currently in use: 275 (violet, Mathematical Foundations), 152 (green, Machine Learning Foundations), 232 (indigo, Mechanistic Interpretability).

4. `hue` is a CSS hue angle (0--360) that colour-codes the textbook in the sidebar and on the topics page, so a reader with several books open can tell at a glance which articles belong to which. Everything else about the colour (saturation, lightness, the light and dark theme variants) is derived from tokens in `src/css/variables.css`. Pick a hue well separated from the ones already in use, and prefer deep, saturated hues over pale yellows and limes, which wash out against the page. Good next choices: 28 (amber), 340 (rose), 190 (teal), 20 (terracotta).

5. Move or create at least one block that points at the new textbook. A textbook with no blocks fails validation.

## Build-time validation

Every build (including `npm start` in dev mode) runs validation. To temporarily skip it while working on incomplete articles:

```bash
SKIP_VALIDATION=1 npm start
```

Do not merge to `main` with validation disabled. CI will catch it.

## Shortcode reference

| Shortcode | Usage | Purpose |
|-----------|-------|---------|
| `{% cite "key" %}` | Inline | Numbered citation with hover tooltip |
| `{% sidenote "text" %}` | Inline | Numbered Tufte-style sidenote |
| `{% marginnote "text" %}` | Inline | Unnumbered margin note |

## Deployment

The site deploys automatically to GitHub Pages on push to `main`. The CI pipeline runs `npm ci`, builds with Eleventy, and uploads the `_site` directory. Pagefind search indexing happens as part of the build.
