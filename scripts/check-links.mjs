// Check every furtherReading URL in the curriculum.
//
// These links are hand-curated, and a wrong one is worse than none: the reader
// follows it, lands somewhere unrelated, and cannot tell whether the article or
// the link is at fault. Run this from an environment with network access; it is
// deliberately not part of `npm run build`, which must work offline.
//
//   node scripts/check-links.mjs [--concurrency 8]
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const TOPICS = path.resolve("src", "topics");
const concurrency = Number(process.argv[process.argv.indexOf("--concurrency") + 1]) || 8;

const targets = [];
for (const block of fs.readdirSync(TOPICS)) {
  const blockDir = path.join(TOPICS, block);
  if (!fs.existsSync(path.join(blockDir, "_block.json"))) continue;
  for (const article of fs.readdirSync(blockDir)) {
    const md = path.join(blockDir, article, "index.md");
    if (!fs.existsSync(md)) continue;
    const { data } = matter(fs.readFileSync(md, "utf-8"));
    for (const item of data.furtherReading || []) {
      if (item.url) targets.push({ article, url: item.url, title: item.title });
    }
  }
}

console.log(`Checking ${targets.length} links from ${new Set(targets.map(t => t.article)).size} articles\n`);

async function check(target) {
  const attempt = (method) =>
    fetch(target.url, { method, redirect: "follow", signal: AbortSignal.timeout(20000) });
  try {
    // Some hosts reject HEAD but serve GET, so fall back before reporting.
    let response = await attempt("HEAD");
    if (response.status === 405 || response.status === 403) response = await attempt("GET");
    return { ...target, status: response.status, ok: response.ok };
  } catch (error) {
    return { ...target, status: error.name === "TimeoutError" ? "timeout" : "error", ok: false };
  }
}

const results = [];
const queue = [...targets];
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (queue.length) results.push(await check(queue.shift()));
  })
);

const failures = results.filter(r => !r.ok);
for (const failure of failures) {
  console.log(`  ${String(failure.status).padEnd(8)} ${failure.article}`);
  console.log(`           ${failure.title}`);
  console.log(`           ${failure.url}\n`);
}
console.log(`${results.length - failures.length} ok, ${failures.length} to check by hand`);
process.exit(failures.length > 0 ? 1 : 0);
