import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { scanBlocks } from "../../lib/scanBlocks.js";

const TOPICS_DIR = path.resolve("src", "topics");
const DATA_DIR = path.resolve("src", "_data");

// Caps keep the generated /notes-context.json small enough to fetch lazily
// at export time without thinking about it.
const MAX_SECTIONS = 24;
const MAX_REFERENCES = 8;

/**
 * Context that travels with an exported note.
 *
 * Every article gets a context derived from what it already declares -
 * frontmatter, headings, prerequisites, glossary entries, citations - so an
 * article added to the textbook is covered the moment it exists. Anything
 * written by hand in `pageContexts.json` is merged on top, keyed by page URL,
 * and wins field by field. Nothing here is recomputed by the browser: the
 * merged map is written once per build to /notes-context.json.
 */

function readJson(file) {
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/** Strip the markup that would read as noise in a plain-text context. */
function plainText(value) {
  return String(value ?? "")
    .replace(/\{%[^%]*%\}/g, "")              // Nunjucks shortcodes
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")  // links
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Collect `##`/`###` headings, ignoring anything inside a fenced code block. */
function extractSections(markdown) {
  const sections = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const heading = line.match(/^(#{2,3})\s+(.*\S)\s*$/);
    if (!heading) continue;

    const text = plainText(heading[2]);
    if (text) sections.push({ level: heading[1].length, text });
    if (sections.length >= MAX_SECTIONS) break;
  }

  return sections;
}

function extractReferences(markdown, refs) {
  const seen = new Set();
  const cited = [];

  for (const match of markdown.matchAll(/\{%[-\s]*cite\s+"([^"]+)"\s*[-\s]*%\}/g)) {
    const key = match[1];
    if (seen.has(key)) continue;
    seen.add(key);

    const ref = refs[key];
    if (!ref) continue;

    cited.push({
      title: ref.title,
      authors: ref.authors,
      year: ref.year,
      url: ref.url,
    });
    if (cited.length >= MAX_REFERENCES) break;
  }

  return cited;
}

function deriveArticleContexts() {
  const { blocks } = scanBlocks();
  const refs = readJson("references.json");
  const contexts = {};

  for (const [blockIndex, block] of blocks.entries()) {
    for (const [topicIndex, topic] of block.topics.entries()) {
      const mdPath = path.join(TOPICS_DIR, block.slug, topic.slug, "index.md");
      if (!fs.existsSync(mdPath)) continue;

      const { data, content } = matter(fs.readFileSync(mdPath, "utf-8"));
      const previous = block.topics[topicIndex - 1];
      const next = block.topics[topicIndex + 1];

      contexts[`/topics/${topic.slug}/`] = {
        kind: "article",
        url: `/topics/${topic.slug}/`,
        title: data.title || topic.slug,
        summary: data.description || "",
        position: {
          blockSlug: block.slug,
          blockTitle: block.title,
          blockNumber: blockIndex + 1,
          blockCount: blocks.length,
          articleNumber: topicIndex + 1,
          articleCount: block.topics.length,
        },
        sections: extractSections(content),
        prerequisites: (data.prerequisites || []).map((prereq) => ({
          title: prereq.title,
          url: prereq.url,
        })),
        glossary: (data.glossary || []).map((entry) => ({
          term: entry.term,
          definition: entry.definition,
        })),
        references: extractReferences(content, refs),
        neighbours: {
          previous: previous
            ? { title: previous.title, url: `/topics/${previous.slug}/` }
            : null,
          next: next ? { title: next.title, url: `/topics/${next.slug}/` } : null,
        },
      };
    }
  }

  return contexts;
}

export default function () {
  const site = readJson("site.json");
  const manual = readJson("pageContexts.json");
  const pages = deriveArticleContexts();

  for (const [url, override] of Object.entries(manual)) {
    // `_`-prefixed keys document the file for whoever edits it next.
    if (url.startsWith("_") || !override || typeof override !== "object") continue;

    const derived = pages[url] || { kind: "page", url, title: url };
    pages[url] = { ...derived, ...override };
  }

  return {
    site: {
      name: site.name,
      url: site.url,
      description: site.description,
    },
    pages,
  };
}
