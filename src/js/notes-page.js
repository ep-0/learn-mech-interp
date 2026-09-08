// Behaviour for the /notes/ hub: every note in one list, plus the export that
// carries each article's context with it.
//
// Reads and writes the same window.LMINotes store the article panel uses, so a
// note edited here is edited everywhere it appears.
(function () {
  "use strict";

  var store = window.LMINotes;
  var root = document.querySelector(".notes-page");
  if (!store || !root) return;

  var composer = root.querySelector(".notes-page-composer");
  var composerInput = root.querySelector(".notes-page-input, #notes-page-input");
  var targetSelect = root.querySelector(".notes-page-target");
  var filterInput = root.querySelector(".notes-filter");
  var sortSelect = root.querySelector(".notes-sort");
  var countEl = root.querySelector(".notes-count");
  var listEl = root.querySelector(".notes-page-list");
  var formatSelect = root.querySelector(".notes-export-format");
  var copyBtn = root.querySelector(".notes-export-copy");
  var downloadBtn = root.querySelector(".notes-export-download");
  var exportStatus = root.querySelector(".notes-export-status");
  var scopeEl = root.querySelector(".notes-export-scope");
  var preview = root.querySelector(".notes-preview");
  var previewBody = root.querySelector(".notes-preview-body code");
  var importInput = root.querySelector(".notes-import");
  var clearBtn = root.querySelector(".notes-clear");
  var dataStatus = root.querySelector(".notes-data-status");

  var contexts = null;
  var statusTimers = new WeakMap();

  /* ----------------------------------------------------------------- utils */

  function setStatus(element, message) {
    element.textContent = message;
    var timer = statusTimers.get(element);
    if (timer) window.clearTimeout(timer);
    statusTimers.set(
      element,
      window.setTimeout(function () {
        element.textContent = "";
      }, 5000)
    );
  }

  function pageTitleFor(url, fallback) {
    var context = store.contextFor(contexts, url);
    if (context && context.title) return context.title;
    return fallback || url || "General notes";
  }

  /** Notes matching the filter box, newest edits first. */
  function visibleNotes() {
    var query = (filterInput.value || "").trim().toLowerCase();
    var notes = store.list();
    if (!query) return notes;

    return notes.filter(function (note) {
      var haystack = [
        note.text,
        note.quote || "",
        note.pageUrl || "",
        pageTitleFor(note.pageUrl, note.pageTitle),
        note.heading ? note.heading.text : "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  /* ---------------------------------------------------------------- render */

  function noteCard(note) {
    var card = document.createElement("article");
    card.className = "notes-card";
    card.dataset.id = note.id;

    var meta = document.createElement("div");
    meta.className = "notes-card-meta";
    meta.textContent = store.formatDate(note.created);
    if (note.updated && note.updated !== note.created) {
      meta.textContent += " · edited " + store.formatDate(note.updated);
    }
    if (note.heading && note.heading.text) meta.textContent += " · " + note.heading.text;
    card.appendChild(meta);

    if (note.quote) {
      var quote = document.createElement("blockquote");
      quote.className = "notes-card-quote";
      quote.textContent = note.quote;
      card.appendChild(quote);
    }

    var body = document.createElement("p");
    body.className = "notes-card-text";
    body.textContent = note.text;
    card.appendChild(body);

    var actions = document.createElement("div");
    actions.className = "notes-card-actions";

    if (note.pageUrl) {
      var open = document.createElement("a");
      open.className = "notes-btn notes-btn-quiet";
      open.href = note.heading && note.heading.id ? note.pageUrl + "#" + note.heading.id : note.pageUrl;
      open.textContent = "Open in article";
      actions.appendChild(open);
    }

    var edit = document.createElement("button");
    edit.type = "button";
    edit.className = "notes-btn notes-btn-quiet";
    edit.textContent = "Edit";
    edit.addEventListener("click", function () {
      startEdit(card, note);
    });
    actions.appendChild(edit);

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "notes-btn notes-btn-quiet notes-btn-danger";
    remove.textContent = "Delete";
    remove.addEventListener("click", function () {
      if (!window.confirm("Delete this note?")) return;
      store.remove(note.id);
    });
    actions.appendChild(remove);

    card.appendChild(actions);
    return card;
  }

  function startEdit(card, note) {
    card.innerHTML = "";
    card.classList.add("notes-card-editing");

    var area = document.createElement("textarea");
    area.className = "notes-composer-input";
    area.rows = 5;
    area.value = note.text;
    card.appendChild(area);

    var actions = document.createElement("div");
    actions.className = "notes-card-actions";

    var save = document.createElement("button");
    save.type = "button";
    save.className = "notes-btn notes-btn-primary";
    save.textContent = "Save";
    save.addEventListener("click", function () {
      var text = area.value.trim();
      if (!text) {
        area.focus();
        return;
      }
      store.update(note.id, { text: text });
    });

    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "notes-btn notes-btn-quiet";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", render);

    actions.appendChild(save);
    actions.appendChild(cancel);
    card.appendChild(actions);
    area.focus();
  }

  function groupHeader(group) {
    var header = document.createElement("header");
    header.className = "notes-group-header";

    var heading = document.createElement("h3");
    heading.className = "notes-group-title";

    if (group.url) {
      var link = document.createElement("a");
      link.href = group.url;
      link.textContent = pageTitleFor(group.url, group.title);
      heading.appendChild(link);
    } else {
      heading.textContent = "General notes";
    }
    header.appendChild(heading);

    var meta = document.createElement("p");
    meta.className = "notes-group-meta";
    var context = group.context;
    var bits = [];

    if (context && context.position) {
      bits.push(
        "Block " + context.position.blockNumber + " · " + context.position.blockTitle
      );
    } else if (!group.url) {
      bits.push("Not tied to a page");
    } else {
      bits.push(group.url);
    }
    bits.push(group.notes.length === 1 ? "1 note" : group.notes.length + " notes");
    meta.textContent = bits.join(" — ");
    header.appendChild(meta);

    if (context && context.summary) {
      var summary = document.createElement("p");
      summary.className = "notes-group-summary";
      summary.textContent = context.summary;
      header.appendChild(summary);
    }

    return header;
  }

  function render() {
    var notes = visibleNotes();
    var total = store.list().length;

    countEl.textContent = total
      ? notes.length === total
        ? total === 1
          ? "1 note"
          : total + " notes"
        : notes.length + " of " + total + " notes match the filter"
      : "";

    listEl.innerHTML = "";

    if (!total) {
      var empty = document.createElement("p");
      empty.className = "notes-empty";
      empty.textContent =
        "No notes yet. Open any article and press Alt+N — or use the notes button in the header — to write your first one.";
      listEl.appendChild(empty);
      updateScope(notes);
      return;
    }

    if (!notes.length) {
      var noMatch = document.createElement("p");
      noMatch.className = "notes-empty";
      noMatch.textContent = "No notes match that filter.";
      listEl.appendChild(noMatch);
      updateScope(notes);
      return;
    }

    var groups = store.groupNotes(notes, contexts);

    if (sortSelect.value === "recent") {
      groups.sort(function (a, b) {
        return lastTouched(b) < lastTouched(a) ? -1 : 1;
      });
    }

    groups.forEach(function (group) {
      var section = document.createElement("section");
      section.className = "notes-group";
      section.appendChild(groupHeader(group));

      var ordered = group.notes.slice().sort(function (a, b) {
        return a.created < b.created ? 1 : -1;
      });
      ordered.forEach(function (note) {
        section.appendChild(noteCard(note));
      });

      listEl.appendChild(section);
    });

    updateScope(notes);
  }

  function lastTouched(group) {
    return group.notes.reduce(function (latest, note) {
      var stamp = note.updated || note.created;
      return stamp > latest ? stamp : latest;
    }, "");
  }

  function updateScope(notes) {
    var total = store.list().length;
    if (!total) {
      scopeEl.textContent = "";
      return;
    }
    var noun = notes.length === 1 ? " note" : " notes";
    scopeEl.textContent =
      notes.length === total
        ? "Exporting all " + total + noun + "."
        : "Exporting " + notes.length + noun + " matching the filter, of " + total + " in total.";
    if (preview.open) renderPreview();
  }

  /* -------------------------------------------------------------- composer */

  function fillTargets() {
    if (!contexts || !contexts.pages) return;

    var urls = Object.keys(contexts.pages);
    urls.sort(function (a, b) {
      var pa = contexts.pages[a].position;
      var pb = contexts.pages[b].position;
      if (pa && pb) return pa.blockNumber - pb.blockNumber || pa.articleNumber - pb.articleNumber;
      if (pa) return -1;
      if (pb) return 1;
      return a < b ? -1 : 1;
    });

    urls.forEach(function (url) {
      var option = document.createElement("option");
      option.value = url;
      option.textContent = contexts.pages[url].title || url;
      targetSelect.appendChild(option);
    });
  }

  composer.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = composerInput.value.trim();
    if (!text) {
      composerInput.focus();
      return;
    }

    var url = targetSelect.value || null;
    store.add({
      text: text,
      pageUrl: url,
      pageTitle: url ? pageTitleFor(url, null) : null,
    });

    composerInput.value = "";
    targetSelect.value = "";
  });

  /* ---------------------------------------------------------------- export */

  function buildExport() {
    var notes = visibleNotes();
    var format = formatSelect.value;
    if (format === "json") return { text: store.toJson(notes), extension: "json", mime: "application/json" };
    return {
      text: store.toMarkdown(notes, contexts, { withContext: format === "context" }),
      extension: "md",
      mime: "text/markdown",
    };
  }

  function renderPreview() {
    previewBody.textContent = store.list().length ? buildExport().text : "";
  }

  copyBtn.addEventListener("click", function () {
    if (!store.list().length) {
      setStatus(exportStatus, "Nothing to export yet.");
      return;
    }
    store.copy(buildExport().text).then(function (ok) {
      setStatus(
        exportStatus,
        ok ? "Copied — paste it into a chat with Claude." : "Copy blocked; use Download instead."
      );
    });
  });

  downloadBtn.addEventListener("click", function () {
    if (!store.list().length) {
      setStatus(exportStatus, "Nothing to export yet.");
      return;
    }
    var payload = buildExport();
    store.download(store.exportFilename(payload.extension), payload.text, payload.mime);
    setStatus(exportStatus, "Downloaded.");
  });

  formatSelect.addEventListener("change", function () {
    if (preview.open) renderPreview();
  });

  preview.addEventListener("toggle", function () {
    if (preview.open) renderPreview();
  });

  /* ------------------------------------------------------- backup/restore  */

  importInput.addEventListener("change", function () {
    var file = importInput.files && importInput.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function () {
      var parsed = null;
      try {
        parsed = JSON.parse(String(reader.result));
      } catch (e) {
        parsed = null;
      }

      var incoming = Array.isArray(parsed) ? parsed : parsed && parsed.notes;
      if (!Array.isArray(incoming)) {
        setStatus(dataStatus, "That file does not look like a notes backup.");
        importInput.value = "";
        return;
      }

      var result = store.merge(incoming);
      setStatus(
        dataStatus,
        "Imported: " + result.added + " added, " + result.updated + " updated, " + result.skipped + " skipped."
      );
      importInput.value = "";
    };
    reader.onerror = function () {
      setStatus(dataStatus, "Could not read that file.");
      importInput.value = "";
    };
    reader.readAsText(file);
  });

  clearBtn.addEventListener("click", function () {
    var total = store.list().length;
    if (!total) {
      setStatus(dataStatus, "There are no notes to delete.");
      return;
    }
    if (!window.confirm("Delete all " + total + " notes? This cannot be undone.")) return;
    store.clear();
    setStatus(dataStatus, "All notes deleted.");
  });

  /* ------------------------------------------------------------------ init */

  filterInput.addEventListener("input", render);
  sortSelect.addEventListener("change", render);
  store.subscribe(render);
  render();

  store.loadContexts().then(function (loaded) {
    contexts = loaded;
    fillTargets();
    render();
  });
})();
