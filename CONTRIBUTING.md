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
    noteContexts.js                # Computed: article context for the notes export (do not edit)
    references.json                # Centralized bibliography
    pageContexts.json              # Hand-written context overrides for the notes export
  _includes/
    layouts/                       # Nunjucks layouts
    partials/                      # Reusable template fragments
  glossary/
    index.njk                      # Glossary page
  notes/
    index.njk                      # Reading-notes hub (client-side, localStorage)
  notes-context.njk                # Emits /notes-context.json for the notes export
  index.njk                        # Home page
lib/
  scanBlocks.js                    # Filesystem scanner (shared by data files and config)
eleventy.config.js                 # Eleventy configuration and build-time validation
ARTICLE_GUIDELINES.md              # Tone, structure, and content rules for articles
```

Key points:
- **`learningPath.js` and `glossary.js` are computed from the filesystem.** You never edit them directly. The sidebar, topics page, prev/next navigation, and glossary all update automatically when you add or modify articles.
- **`references.json`, `_textbooks.json`, `pageContexts.json` and `lessonPlan.json` are the data files you edit by hand** -- the first to add citations, the second to add textbooks, the third to sharpen the context that ships with exported reading notes, the fourth to schedule the learning plan. Everything else under `_data/` is computed.
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
- The learning plan schedules every article exactly once, and its article and lesson references resolve
- No TeX reaches the built pages unrendered
- Every published article has `furtherReading`, and every entry has a title, a note, and an absolute URL if it has one at all
- All prerequisite URLs point to existing articles
- No duplicate glossary terms across articles
- Every `/topics/<slug>/` key in `pageContexts.json` matches a live article

If the build fails, the error message will tell you exactly what to fix.

## Modifying an existing article

- **Content edits** (fixing errors, improving explanations, adding sections): edit `index.md` directly. Read `ARTICLE_GUIDELINES.md` if you are making substantive changes.
- **Reordering**: change the `order` field in the affected articles. Keep orders contiguous within the block.
- **Moving to a different block**: `git mv` the article directory, then update the `order` fields in both the source and destination blocks so they remain contiguous.
- **Moving a block to a different textbook**: change `textbook` in its `_block.json`, then renumber the `order` fields in both the old and new textbooks so each stays contiguous.
- **Adding glossary terms**: add entries to the `glossary:` list in the article's frontmatter. Each term must be unique across all articles.
- **Adding citations**: add the reference to `src/_data/references.json`, then use `{% cite "key" %}` in the article.
- **Filling in a placeholder**: follow the brief on the page. The steps are under [Placeholder articles](#placeholder-articles) below.

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

`status` is either `placeholder` or absent; any other value fails validation. The layout renders a "Planned article" notice, the sidebar dims the entry and marks it, and the topics page tags it.

Placeholders count as real articles everywhere else: they take an `order` within their block, they appear in prev/next navigation, and they can be linked as prerequisites.

### The brief

A placeholder's body is a writing brief, in five sections:

| Section | What it holds |
|---|---|
| Why this article exists | One paragraph tying the topic to the curriculum that needs it. |
| Required sections | The numbered outline the finished article must cover, in order, each with two or three bullets. Headings can be reworded when writing; the content cannot be dropped. |
| What you should be able to do afterward | Three or so concrete competencies. These are the exit criteria: if one is out of reach, the article is not finished. |
| Deliberately out of scope | Optional, and used where a standard course would cover much more than this curriculum needs. Lists what the article omits, so it does not grow into a general textbook chapter. |
| Sources to learn from | Three or four specific readings, each with a line on what to take from it. Chapters and sections where they are known. |
| Where the curriculum uses it | Generated from the prerequisite graph: the articles that list this one. |

The brief is written before the article, and it is what makes the article writable by someone who has just learned the material rather than only by someone who already knew it.

Foundational articles are scoped by what the curriculum uses, not by what a subject contains. The precalculus block is the clearest case: it covers the unit circle because cosine similarity and rotary embeddings need it, and skips solving triangles; it covers binomial coefficients because probability starts with counting, and skips generating functions. When adding a foundational article, justify each required section by a downstream use, and put the rest under "Deliberately out of scope" rather than leaving the boundary implicit.

### Writing a placeholder up

1. Learn the material from the sources listed on the page.
2. Write the article against the required sections, following `ARTICLE_GUIDELINES.md`. The outline is a contract about coverage, not about wording or section count: split or merge headings where the prose reads better, as long as nothing in the bullets goes missing.
3. Check yourself against the exit criteria. They are the reason the brief lists them.
4. Move any source you cite in the finished prose into `src/_data/references.json` and cite it with `{% cite "key" %}`. Sources that were only study material do not need to survive.
5. Delete the four scaffolding sections and remove `status: placeholder` from the frontmatter.
6. Revisit the prerequisites. Writing the article usually reveals that one is wrong or missing.

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

## Reading notes

Readers can take notes as they read: a drawer on every page (the notes button in the header, or `Alt+N`)
and a hub at `/notes/` that lists every note. Both read and write one `localStorage` record, so a note
edited in either place is the same note -- notes written on the hub with **Attach to: no page** belong to
no article and stay off the drawers.

The point of the feature is the export. Each note is wrapped in the context of the page it was taken on --
what the article covers, where it sits in the curriculum, its sections, prerequisites, glossary terms and
cited work -- so the result can be pasted into a conversation and discussed without re-reading the textbook.

That context is assembled at build time, never in the browser:

```
src/_data/pageContexts.json   hand-written overrides, keyed by page URL
        +
article frontmatter, headings, prerequisites, glossary, citations
        |
src/_data/noteContexts.js     merges the two (your text wins field by field)
        |
/notes-context.json           fetched once, on the first export
```

**Adding an article needs no work here.** Its context is derived from what the article already declares,
so it is covered as soon as it exists.

**To sharpen a page's context by hand**, add an entry to `src/_data/pageContexts.json` keyed by the page
URL, with the trailing slash:

```json
"/topics/induction-heads/": {
  "summary": "Two heads composing into a pattern-copying circuit, and how far the ICL claim actually goes.",
  "keyIdeas": ["The prefix-matching and copying steps are separable."],
  "openQuestions": ["How much of in-context learning do induction heads really account for?"],
  "related": ["/topics/ioi-circuit/"],
  "guidance": "Be skeptical of the phase-change-implies-causation reading."
}
```

Every field is optional and merges on top of the derived context, so writing `summary` alone leaves the
sections, prerequisites and citations in place. Keys starting with `_` are documentation and are ignored;
the file's own `_about` entry describes each field. Non-article pages (`/`, `/glossary/`, `/about/`, ...)
have no frontmatter to derive from, so their context comes entirely from this file.

The build fails if a `/topics/<slug>/` key here does not match a live article, which is what keeps the file
honest when an article is renamed or retired.

## The learning plan

`src/_data/lessonPlan.json` drives the ordered lessons at `/plan/`. It coexists with the topics page: topics shows what exists, the plan gives one route through it, built on retrieval practice, spaced revisiting, and interleaving.

Each lesson carries `orientation` (what the material is eventually for, read before the articles), `articles` (what to read), `revisit` (earlier lessons to retrieve from memory before reopening anything), `practice` (applied work that is deliberately not on this site), and one `synthesis` question. Consolidation lessons have no articles at all. Each part also has an entry in `partIntros`.

`usedIn` is computed rather than written: it names later lessons whose reading directly depends on something read in this one, taken from the site's prerequisite graph. Regenerate it rather than editing it by hand.

Revisits use expanding intervals: a study lesson points back two, five, and twelve study lessons, and a consolidation lesson sweeps everything since the previous one plus two older lessons.

The build keeps the plan and the curriculum in sync:

- every article is scheduled in exactly one lesson
- every scheduled slug is a real article
- every revisited lesson exists and comes earlier in the order
- every lesson has an orientation, every part has an intro, and every forward link points later

So **adding an article means adding it to a lesson**, or the build fails and names the article. That is deliberate: a plan that silently omits new material is worse than no plan.

## Further reading

Every published article carries a `furtherReading` list in its frontmatter, rendered as a section after the body:

```yaml
furtherReading:
  - title: "Elhage et al., *Toy Models of Superposition*"
    url: "https://transformer-circuits.pub/2022/toy_model/index.html"
    note: "The whole paper, including the phase diagrams and the geometry sections."
```

`url` is optional; `title` and `note` are not. The note says **what the source adds that the article does not** — a fuller derivation, a topic left out, a critique, a replication. A bare citation with no note is what this field exists to avoid, so the build rejects one.

Three kinds of entry earn their place, and most articles want all three:

- **The primary source**, when the article summarizes a paper that repays reading in full.
- **A gap**, where the article does not cover something a researcher needs. Say so in the note: attention sinks are missing from the attention article, anisotropy from the embeddings article, calibration from the production-probes article.
- **A critique**, where the strongest published objection to the article's claim lives. An article that reports a result without pointing at its best challenge is not preparing a researcher.

Placeholders do not use this field; their brief already carries a "Sources to learn from" section.

Links are hand-curated and can rot or be mistyped. Check them from a machine with network access:

```bash
npm run check-links
```

It reads every `furtherReading` URL, follows redirects, falls back to GET where HEAD is refused, and exits non-zero listing anything that failed. It is deliberately not part of `npm run build`, which must work offline.

## Build-time validation

Every build (including `npm start` in dev mode) runs validation. To temporarily skip it while working on incomplete articles:

```bash
SKIP_VALIDATION=1 npm start
```

Do not merge to `main` with validation disabled. CI will catch it.

## Math

Math is written as `$inline$` and `$$display$$` and rendered to HTML at build time by KaTeX. The stylesheet and fonts are served from this site rather than a CDN, because without those rules the MathML copy KaTeX emits for screen readers becomes visible and every formula appears twice.

**Math renders only where Markdown runs.** Three places it silently does not, all of which the build now catches:

- **Inside a raw HTML block.** A hand-written `<figure>` with a `<figcaption>` bypasses Markdown entirely. Write the caption's notation as HTML, or as prose.
- **In a data file rendered through Nunjucks**, such as `lessonPlan.json`. Pipe the string through the `mdInline` filter, which runs one line of Markdown including math.
- **When the closing `$` is followed by a digit**, which the parser rejects so that prices are not read as formulas. Bring the digits inside the math or reword.

After every build, the output HTML is scanned for TeX that reached the page as source, and the build fails naming the file and the formula. The check ignores KaTeX's `annotation` element, where the original TeX is stored deliberately, and only flags spans containing a command or a sub- or superscript, so prose about `$X` is not a false positive.

## Shortcode reference

| Shortcode | Usage | Purpose |
|-----------|-------|---------|
| `{% cite "key" %}` | Inline | Numbered citation with hover tooltip |
| `{% sidenote "text" %}` | Inline | Numbered Tufte-style sidenote |
| `{% marginnote "text" %}` | Inline | Unnumbered margin note |

## Deployment

The site deploys automatically to GitHub Pages on push to `main`. The CI pipeline runs `npm ci`, builds with Eleventy, and uploads the `_site` directory. Pagefind search indexing happens as part of the build.
