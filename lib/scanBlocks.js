import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const TOPICS_DIR = path.resolve("src", "topics");
const TEXTBOOKS_PATH = path.join(TOPICS_DIR, "_textbooks.json");

/**
 * Scan src/topics/_textbooks.json, src/topics/<block>/_block.json and article
 * frontmatter to build the learning-path data structure.
 *
 * Returns:
 *   {
 *     textbooks: [{ slug, title, description, order, hue,
 *                   blocks: [{ slug, title, order, textbook, topics }] }],
 *     blocks:    [{ slug, title, order, textbook, topics: [{ slug, title, order, status }] }],
 *     startHere: { slug, title, order, status }   // first article of the primary textbook
 *   }
 *
 * `blocks` stays flat and in reading order (textbook order, then block order)
 * so consumers that only care about the linear curriculum — prev/next
 * navigation, the glossary, the search index — keep working unchanged.
 */
export function scanBlocks() {
  const textbookMeta = JSON.parse(fs.readFileSync(TEXTBOOKS_PATH, "utf-8"));

  const textbooks = textbookMeta
    .map(meta => ({ ...meta, blocks: [] }))
    .sort((a, b) => a.order - b.order);

  const textbookBySlug = new Map(textbooks.map(t => [t.slug, t]));

  const blockDirs = fs.readdirSync(TOPICS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  const blocks = [];

  for (const dir of blockDirs) {
    const metaPath = path.join(TOPICS_DIR, dir.name, "_block.json");
    if (!fs.existsSync(metaPath)) continue;               // no _block.json = not a block

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    const articleDirs = fs.readdirSync(path.join(TOPICS_DIR, dir.name), { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith("_"));

    const topics = [];
    for (const art of articleDirs) {
      const mdPath = path.join(TOPICS_DIR, dir.name, art.name, "index.md");
      if (!fs.existsSync(mdPath)) continue;

      const { data } = matter(fs.readFileSync(mdPath, "utf-8"));
      topics.push({
        slug: art.name,
        title: data.title || art.name,
        order: data.order ?? 0,
        status: data.status || "published",
      });
    }

    topics.sort((a, b) => a.order - b.order);

    blocks.push({
      slug: dir.name,
      title: meta.title,
      order: meta.order,
      textbook: meta.textbook,
      topics,
    });
  }

  // Reading order: textbook first, then block order within the textbook.
  // Blocks pointing at an unknown textbook sort last; validation reports them.
  const textbookOrder = slug => textbookBySlug.get(slug)?.order ?? Number.MAX_SAFE_INTEGER;
  blocks.sort((a, b) =>
    textbookOrder(a.textbook) - textbookOrder(b.textbook) || a.order - b.order);

  for (const block of blocks) {
    textbookBySlug.get(block.textbook)?.blocks.push(block);
  }

  // Where a new reader should start: the first article of the primary textbook,
  // which is the site's actual subject rather than the background it rests on.
  const primary = textbooks.find(t => t.primary) || textbooks[0];
  const startHere = primary?.blocks[0]?.topics[0] ?? null;

  return { textbooks, blocks, startHere };
}
