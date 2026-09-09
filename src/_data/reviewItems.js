import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { scanBlocks } from "../../lib/scanBlocks.js";
import lessonPlan from "./lessonPlan.json" with { type: "json" };

const TOPICS_DIR = path.resolve("src", "topics");

/**
 * Every exit criterion on the site, flattened into one reviewable list.
 *
 * The review page schedules these; the articles render them. Both read the
 * same frontmatter, so an article cannot drift out of the review deck.
 *
 * Item ids are a hash of the task text rather than a position, so reordering
 * an article's criteria preserves a reader's history. Editing a task's wording
 * does mint a new id, which is the behaviour we want: a reworded question is a
 * different question, and its old scheduling state should not carry over.
 */

// FNV-1a, 32-bit. Any stable hash would do; this one is short and dependency-free.
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, "0").slice(0, 7);
}

export default function () {
  const { textbooks, blocks } = scanBlocks();

  const textbookTitle = new Map(textbooks.map(t => [t.slug, t.title]));

  // slug -> lesson number, so a reviewer can see where an item sits in the plan.
  const lessonOf = new Map();
  for (const lesson of lessonPlan.lessons) {
    for (const article of lesson.articles || []) lessonOf.set(article.slug, lesson.n);
  }

  const items = [];

  for (const block of blocks) {
    for (const topic of block.topics) {
      const mdPath = path.join(TOPICS_DIR, block.slug, topic.slug, "index.md");
      if (!fs.existsSync(mdPath)) continue;

      const { data } = matter(fs.readFileSync(mdPath, "utf-8"));
      if (data.status === "placeholder") continue;
      if (!Array.isArray(data.exitCriteria)) continue;

      for (const criterion of data.exitCriteria) {
        items.push({
          id: `${topic.slug}-${hash(criterion.task)}`,
          slug: topic.slug,
          title: data.title,
          block: block.slug,
          blockTitle: block.title,
          textbook: block.textbook,
          textbookTitle: textbookTitle.get(block.textbook) || block.textbook,
          lesson: lessonOf.get(topic.slug) ?? null,
          task: criterion.task,
          answer: criterion.answer,
        });
      }
    }
  }

  return items;
}
