// Shared note store for the reading-notes panel and the /notes/ hub.
//
// Both surfaces read and write the same localStorage record, keyed by note id,
// so a note edited in the panel is the same object the hub renders and vice
// versa. A note carries the page it was taken on; notes created on the hub
// have `pageUrl: null` and belong to no article.
//
// Exposed as window.LMINotes because the site ships plain scripts, no bundler.
(function () {
  "use strict";

  var STORAGE_KEY = "lmi:notes:v1";
  var CONTEXT_URL = "/notes-context.json";
  var MAX_QUOTE_LENGTH = 800;

  var cache = null;
  var contextsPromise = null;
  var listeners = [];

  // The site may be served from a subdirectory (GitHub Pages project sites set
  // pathPrefix). EleventyHtmlBasePlugin rewrites href and src attributes at
  // build time but never JavaScript strings, so paths built here - the context
  // fetch, and links the hub creates at runtime - resolve against this instead.
  function baseUrl() {
    var base = document.body && document.body.getAttribute("data-base-url");
    if (!base) return "/";
    return base.slice(-1) === "/" ? base : base + "/";
  }

  function withBase(path) {
    if (!path) return baseUrl();
    if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;
    return baseUrl() + String(path).replace(/^\/+/, "");
  }

  /* ---------------------------------------------------------------- storage */

  function emptyStore() {
    return { version: 1, notes: [] };
  }

  function newId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "n-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  // Notes are keyed by the path a reader sees, so /topics/x/ matches whether it
  // arrived from a link, a bookmark with a hash, or the address bar.
  function normalizeUrl(value) {
    if (!value) return null;
    var url = String(value).trim();
    if (!url) return null;

    try {
      url = new URL(url, window.location.origin).pathname;
    } catch (e) {
      url = url.split("#")[0].split("?")[0];
    }

    if (url.charAt(0) !== "/") url = "/" + url;
    if (url.slice(-1) !== "/" && !/\.[a-z0-9]+$/i.test(url)) url += "/";
    return url;
  }

  function normalizeNote(raw) {
    if (!raw || typeof raw !== "object") return null;
    var text = typeof raw.text === "string" ? raw.text : "";
    var created = raw.created || nowIso();

    return {
      id: raw.id || newId(),
      text: text,
      pageUrl: normalizeUrl(raw.pageUrl),
      pageTitle: raw.pageTitle ? String(raw.pageTitle) : null,
      heading: raw.heading && raw.heading.text
        ? { id: raw.heading.id || null, text: String(raw.heading.text) }
        : null,
      quote: raw.quote ? String(raw.quote).slice(0, MAX_QUOTE_LENGTH) : null,
      created: created,
      updated: raw.updated || created,
    };
  }

  function normalizeStore(raw) {
    if (!raw || typeof raw !== "object" || !Array.isArray(raw.notes)) return emptyStore();
    var notes = [];
    for (var i = 0; i < raw.notes.length; i++) {
      var note = normalizeNote(raw.notes[i]);
      if (note) notes.push(note);
    }
    return { version: 1, notes: notes };
  }

  function read() {
    if (cache) return cache;
    var raw = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      raw = null; // private mode, or storage disabled
    }

    var parsed = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        parsed = null; // corrupt value: start clean rather than throw
      }
    }

    cache = normalizeStore(parsed);
    return cache;
  }

  function persist(store) {
    cache = store;
    var ok = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      ok = false;
    }
    notify();
    return ok;
  }

  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](list());
      } catch (e) {
        // A broken listener must not stop the others from updating.
      }
    }
  }

  // Another tab writing the same key invalidates our copy.
  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    notify();
  });

  /* -------------------------------------------------------------- note CRUD */

  function list() {
    return read().notes.slice();
  }

  function get(id) {
    var notes = read().notes;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === id) return notes[i];
    }
    return null;
  }

  function forPage(url) {
    var target = normalizeUrl(url);
    return list().filter(function (note) {
      return note.pageUrl === target;
    });
  }

  function add(fields) {
    var note = normalizeNote({
      id: newId(),
      text: (fields && fields.text) || "",
      pageUrl: fields && fields.pageUrl,
      pageTitle: fields && fields.pageTitle,
      heading: fields && fields.heading,
      quote: fields && fields.quote,
      created: nowIso(),
    });

    var store = read();
    persist({ version: 1, notes: store.notes.concat([note]) });
    return note;
  }

  function update(id, patch) {
    var store = read();
    var updated = null;

    var notes = store.notes.map(function (note) {
      if (note.id !== id) return note;
      updated = normalizeNote(
        Object.assign({}, note, patch, { id: note.id, created: note.created, updated: nowIso() })
      );
      return updated;
    });

    if (updated) persist({ version: 1, notes: notes });
    return updated;
  }

  function remove(id) {
    var store = read();
    var notes = store.notes.filter(function (note) {
      return note.id !== id;
    });
    if (notes.length === store.notes.length) return false;
    persist({ version: 1, notes: notes });
    return true;
  }

  function clear() {
    persist(emptyStore());
  }

  // Import merges by id: an incoming note the store already has wins only if it
  // was updated more recently, so re-importing an older backup is harmless.
  function merge(incoming) {
    if (!Array.isArray(incoming)) return { added: 0, updated: 0, skipped: 0 };

    var store = read();
    var byId = {};
    store.notes.forEach(function (note) {
      byId[note.id] = note;
    });

    var result = { added: 0, updated: 0, skipped: 0 };

    incoming.forEach(function (raw) {
      var note = normalizeNote(raw);
      if (!note || !note.text.trim()) {
        result.skipped++;
        return;
      }
      var existing = byId[note.id];
      if (!existing) {
        byId[note.id] = note;
        result.added++;
      } else if (note.updated > existing.updated) {
        byId[note.id] = note;
        result.updated++;
      } else {
        result.skipped++;
      }
    });

    var notes = Object.keys(byId).map(function (id) {
      return byId[id];
    });
    notes.sort(function (a, b) {
      return a.created < b.created ? -1 : a.created > b.created ? 1 : 0;
    });

    persist({ version: 1, notes: notes });
    return result;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners = listeners.filter(function (entry) {
        return entry !== listener;
      });
    };
  }

  /* ---------------------------------------------------------------- context */

  function currentPage() {
    var body = document.body;
    return {
      url: normalizeUrl((body && body.getAttribute("data-page-url")) || window.location.pathname),
      title: (body && body.getAttribute("data-page-title")) || document.title,
    };
  }

  // Contexts are built at build time and fetched once, on demand - the first
  // export pays for it, nothing else does.
  function loadContexts() {
    if (!contextsPromise) {
      contextsPromise = fetch(withBase(CONTEXT_URL), { credentials: "same-origin" })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .catch(function () {
          return null; // export still works, just without the article context
        });
    }
    return contextsPromise;
  }

  function contextFor(contexts, url) {
    if (!contexts || !contexts.pages || !url) return null;
    return contexts.pages[url] || null;
  }

  /* ----------------------------------------------------------------- export */

  function formatDate(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  function blockquote(text) {
    return String(text)
      .split("\n")
      .map(function (line) {
        return "> " + line;
      })
      .join("\n");
  }

  function bulletList(items) {
    return items
      .map(function (item) {
        return "  - " + item;
      })
      .join("\n");
  }

  function groupNotes(notes, contexts) {
    var groups = {};

    notes.forEach(function (note) {
      var key = note.pageUrl || "__general__";
      if (!groups[key]) {
        groups[key] = {
          url: note.pageUrl,
          context: contextFor(contexts, note.pageUrl),
          title: null,
          notes: [],
        };
      }
      groups[key].notes.push(note);
      if (!groups[key].title && note.pageTitle) groups[key].title = note.pageTitle;
    });

    var list = Object.keys(groups).map(function (key) {
      return groups[key];
    });

    // Curriculum order for articles, then anything else, then general notes.
    list.sort(function (a, b) {
      if (!a.url) return 1;
      if (!b.url) return -1;
      var pa = a.context && a.context.position;
      var pb = b.context && b.context.position;
      if (pa && pb) {
        return (
          (pa.textbookNumber || 0) - (pb.textbookNumber || 0) ||
          pa.blockNumber - pb.blockNumber ||
          pa.articleNumber - pb.articleNumber
        );
      }
      if (pa) return -1;
      if (pb) return 1;
      return a.url < b.url ? -1 : 1;
    });

    list.forEach(function (group) {
      group.notes.sort(function (a, b) {
        return a.created < b.created ? -1 : a.created > b.created ? 1 : 0;
      });
      if (group.context && group.context.title) group.title = group.context.title;
      if (!group.title) group.title = group.url || "General notes";
    });

    return list;
  }

  function contextBlock(group, siteUrl) {
    var context = group.context;
    var lines = [];

    if (group.url) {
      lines.push("- **URL:** " + (siteUrl || "") + group.url);
    }

    if (!context) {
      lines.push("- **Context:** none recorded for this page.");
      return lines.join("\n");
    }

    var position = context.position;
    if (position) {
      lines.push(
        "- **Where it sits:** " +
          (position.textbookTitle ? position.textbookTitle + ", " : "") +
          "block " +
          position.blockNumber +
          " of " +
          position.blockCount +
          " (“" +
          position.blockTitle +
          "”) — article " +
          position.articleNumber +
          " of " +
          position.articleCount
      );
    }
    if (context.status && context.status !== "published") {
      lines.push(
        "- **Status:** this article is a " +
          context.status +
          " - a writing brief rather than finished prose, so it may outline what is coming rather than argue it."
      );
    }
    if (context.summary) lines.push("- **What it covers:** " + context.summary);

    if (context.keyIdeas && context.keyIdeas.length) {
      lines.push("- **Key ideas:**\n" + bulletList(context.keyIdeas));
    }
    if (context.sections && context.sections.length) {
      lines.push(
        "- **Sections:** " +
          context.sections
            .map(function (section) {
              return section.text;
            })
            .join(" · ")
      );
    }
    if (context.prerequisites && context.prerequisites.length) {
      lines.push(
        "- **Assumes you have read:** " +
          context.prerequisites
            .map(function (prereq) {
              return prereq.title;
            })
            .join(", ")
      );
    }
    if (context.glossary && context.glossary.length) {
      lines.push(
        "- **Terms it introduces:**\n" +
          bulletList(
            context.glossary.map(function (entry) {
              return "**" + entry.term + "** — " + entry.definition;
            })
          )
      );
    }
    if (context.references && context.references.length) {
      lines.push(
        "- **Work it cites:**\n" +
          bulletList(
            context.references.map(function (ref) {
              var parts = [ref.title];
              if (ref.authors) parts.push(ref.authors);
              if (ref.year) parts.push(String(ref.year));
              return parts.join(" — ");
            })
          )
      );
    }
    if (context.openQuestions && context.openQuestions.length) {
      lines.push("- **Open questions the article leaves:**\n" + bulletList(context.openQuestions));
    }
    if (context.related && context.related.length) {
      lines.push(
        "- **Related reading:** " +
          context.related
            .map(function (item) {
              return typeof item === "string" ? item : item.title || item.url;
            })
            .join(", ")
      );
    }
    if (context.guidance) lines.push("- **Note from the author of these notes:** " + context.guidance);

    return lines.join("\n");
  }

  function noteBlock(note, index, siteUrl, groupUrl) {
    var parts = [];
    var heading = "### Note " + index + " — " + formatDate(note.created);

    if (note.heading && note.heading.text) {
      heading += ", section “" + note.heading.text + "”";
      if (note.heading.id && groupUrl) {
        heading += " (" + (siteUrl || "") + groupUrl + "#" + note.heading.id + ")";
      }
    }
    parts.push(heading);

    if (note.quote) parts.push(blockquote(note.quote));
    parts.push(note.text.trim() || "_(empty note)_");

    return parts.join("\n\n");
  }

  /**
   * Build the Claude-ready export: notes grouped by article, each group led by
   * the context the article was read in.
   */
  function toMarkdown(notes, contexts, options) {
    options = options || {};
    var withContext = options.withContext !== false;
    var site = (contexts && contexts.site) || {};
    var siteName = site.name || "Learn Mechanistic Interpretability";
    var siteUrl = site.url || "";
    var groups = groupNotes(notes, withContext ? contexts : null);

    var articleCount = groups.filter(function (group) {
      return group.url;
    }).length;

    var out = [];
    out.push("# Reading notes — " + siteName);
    out.push(
      "Exported " +
        formatDate(nowIso()) +
        " · " +
        notes.length +
        (notes.length === 1 ? " note" : " notes") +
        " · " +
        articleCount +
        (articleCount === 1 ? " page" : " pages")
    );

    if (withContext) {
      out.push(
        "These are my own notes from reading " +
          siteName +
          (siteUrl ? " (" + siteUrl + ")" : "") +
          ". Each section below is one page: first the context the note was taken in — what the " +
          "article covers, where it sits in the curriculum, the sections and terms it introduces — " +
          "then my notes on it. Blockquotes are passages from the article; the prose under them is mine."
      );
      out.push(
        "Please treat these as a starting point for discussion rather than finished writing: correct " +
          "what I have misunderstood, sharpen what is vague, answer the questions I left open, and push " +
          "back where the reasoning does not hold."
      );
    }

    groups.forEach(function (group) {
      out.push("---");

      if (!group.url) {
        out.push("## General notes");
        out.push("_Not tied to any page._");
      } else {
        out.push("## " + group.title);
        if (withContext) out.push(contextBlock(group, siteUrl));
        else out.push("- **URL:** " + siteUrl + group.url);
      }

      out.push(
        "**Notes (" + group.notes.length + "):**"
      );
      group.notes.forEach(function (note, index) {
        out.push(noteBlock(note, index + 1, siteUrl, group.url));
      });
    });

    return out.join("\n\n") + "\n";
  }

  function toJson(notes) {
    return JSON.stringify({ version: 1, exported: nowIso(), notes: notes }, null, 2);
  }

  /* ------------------------------------------------------------- clipboard  */

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(text);
        }
      );
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    document.body.appendChild(area);
    area.select();

    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function download(filename, text, mime) {
    var blob = new Blob([text], { type: (mime || "text/plain") + ";charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 0);
  }

  function exportFilename(extension) {
    return "learn-mi-notes-" + formatDate(nowIso()) + "." + extension;
  }

  window.LMINotes = {
    STORAGE_KEY: STORAGE_KEY,
    MAX_QUOTE_LENGTH: MAX_QUOTE_LENGTH,
    list: list,
    get: get,
    forPage: forPage,
    add: add,
    update: update,
    remove: remove,
    clear: clear,
    merge: merge,
    subscribe: subscribe,
    currentPage: currentPage,
    normalizeUrl: normalizeUrl,
    withBase: withBase,
    loadContexts: loadContexts,
    contextFor: contextFor,
    groupNotes: groupNotes,
    toMarkdown: toMarkdown,
    toJson: toJson,
    formatDate: formatDate,
    copy: copy,
    download: download,
    exportFilename: exportFilename,
  };
})();
