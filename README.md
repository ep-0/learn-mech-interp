# Learn Mechanistic Interpretability

An open-source textbook on mechanistic interpretability, covering transformer internals, interpretability techniques, and frontier research.

**[Start reading &rarr;](https://learnmechinterp.com/)**

## Running the site locally

Requires Node.js 20 or newer (CI builds on 20; 22 works).

```bash
npm ci        # first time only, installs dependencies
npm start     # dev server at http://localhost:8080, rebuilds on save
```

`npm run build` writes the static site to `_site/` without serving it. That directory is gitignored and is what CI uploads to GitHub Pages.

Every build runs the validator in `eleventy.config.js` first, so a missing `description`, a broken prerequisite link, a citation key with no entry in `references.json`, or a gap in article ordering fails the build and names the problem. To work on an incomplete article without fighting it:

```bash
SKIP_VALIDATION=1 npm start
```

Do not commit with validation disabled; CI runs it.

Each build also reindexes the site for search with Pagefind, which adds a couple of seconds to every rebuild in dev mode. That is expected, not a hang.

## Contributing

This is an open-source project and contributions are welcome. Whether it's fixing a typo, improving an explanation, or writing a new article, all help is appreciated.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or modify articles, blocks, citations, and glossary terms. See [ARTICLE_GUIDELINES.md](ARTICLE_GUIDELINES.md) for article style, tone, and structure conventions.

## License

This work is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
