// Reading-notes drawer.
//
// Progressive enhancement: the toggle button ships hidden and the panel inert,
// both are activated here. Everything the panel writes goes through
// window.LMINotes, which is also what /notes/ reads - one store, two views.
(function () {
  "use strict";

  var store = window.LMINotes;
  var panel = document.getElementById("notes-panel");
  var toggle = document.querySelector(".notes-toggle");
  if (!store || !panel || !toggle) return;

  var OPEN_KEY = "lmi:notes:panel-open";
  var page = store.currentPage();

  var form = panel.querySelector(".notes-composer");
  var input = panel.querySelector(".notes-composer-input");
  var hint = panel.querySelector(".notes-composer-hint");
  var listEl = panel.querySelector(".notes-panel-list");
  var quoteEl = panel.querySelector(".notes-quote");
  var quoteText = panel.querySelector(".notes-quote-text");
  var quoteClear = panel.querySelector(".notes-quote-clear");
  var closeBtn = panel.querySelector(".notes-panel-close");
  var exportBtn = panel.querySelector(".notes-panel-export");
  var statusEl = panel.querySelector(".notes-panel-status");
  var countEl = toggle.querySelector(".notes-toggle-count");

  var pendingQuote = null;
  var statusTimer = null;

  toggle.hidden = false;

  /* ------------------------------------------------------------ open/close */

  function isOpen() {
    return !panel.hidden;
  }

  function setOpen(open, options) {
    panel.hidden = !open;
    document.body.classList.toggle("notes-panel-is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    try {
      window.localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch (e) {
      // Storage off: the panel simply won't remember its state.
    }
    if (open) updateHint();
    if (open && options && options.focus && input) input.focus();
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) {
      setOpen(false);
      return;
    }
    captureSelection();
    setOpen(true, { focus: true });
  });

  closeBtn.addEventListener("click", function () {
    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
      return;
    }

    // Alt+N toggles the panel; plain typing in a field must never trigger it.
    if (event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "n" || event.key === "N")) {
      event.preventDefault();
      if (isOpen()) {
        setOpen(false);
      } else {
        captureSelection();
        setOpen(true, { focus: true });
      }
    }
  });

  /* -------------------------------------------------------------- context  */

  var articleBody = document.querySelector(".article-body");

  // Remember the last selection made inside the article: clicking the toggle
  // or focusing the textarea clears the live selection, so we cannot read it
  // at save time.
  var lastSelection = null;

  // KaTeX renders every formula twice - visible HTML plus a hidden MathML copy -
  // and each citation carries a hidden tooltip, so a raw selection.toString()
  // quotes text the reader never saw. Read from a cleaned copy of the range.
  var QUOTE_NOISE = ".katex-mathml, .citation-tooltip, .sidenote, .marginnote, .sidenote-toggle";

  function selectionText(selection) {
    var container = document.createElement("div");
    for (var i = 0; i < selection.rangeCount; i++) {
      container.appendChild(selection.getRangeAt(i).cloneContents());
    }
    var noise = container.querySelectorAll(QUOTE_NOISE);
    for (var j = 0; j < noise.length; j++) {
      noise[j].parentNode.removeChild(noise[j]);
    }
    return container.textContent.replace(/\s+/g, " ").trim();
  }

  document.addEventListener("selectionchange", function () {
    var selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    if (articleBody && !articleBody.contains(selection.anchorNode)) return;

    var text = selectionText(selection);
    if (!text) return;

    lastSelection = text.slice(0, store.MAX_QUOTE_LENGTH);

    // With the panel already open, selecting a passage attaches it straight
    // away - the composer shows what is quoted, and the x drops it again.
    if (isOpen()) captureSelection();
  });

  function captureSelection() {
    if (!lastSelection) return;
    pendingQuote = lastSelection;
    lastSelection = null;
    renderQuote();
  }

  function renderQuote() {
    if (!pendingQuote) {
      quoteEl.hidden = true;
      quoteText.textContent = "";
      return;
    }
    quoteText.textContent = pendingQuote;
    quoteEl.hidden = false;
  }

  quoteClear.addEventListener("click", function () {
    pendingQuote = null;
    renderQuote();
  });

  // The heading the reader is looking at when the note is written - the last
  // one whose top has passed the reading line near the top of the viewport.
  function currentHeading() {
    if (!articleBody) return null;
    var headings = articleBody.querySelectorAll("h2[id], h3[id]");
    var current = null;

    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 140) current = headings[i];
      else break;
    }
    if (!current) current = headings[0] || null;
    if (!current) return null;

    return { id: current.id || null, text: current.textContent.trim() };
  }

  function updateHint() {
    var heading = currentHeading();
    hint.textContent = heading ? "Filing under “" + heading.text + "”" : "";
  }

  /* --------------------------------------------------------------- render  */

  function setStatus(message) {
    statusEl.textContent = message;
    if (statusTimer) window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      statusEl.textContent = "";
    }, 4000);
  }

  function noteCard(note) {
    var card = document.createElement("article");
    card.className = "notes-card";
    card.setAttribute("role", "listitem");
    card.dataset.id = note.id;

    var meta = document.createElement("div");
    meta.className = "notes-card-meta";
    meta.textContent = store.formatDate(note.updated || note.created);
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

    var edit = document.createElement("button");
    edit.type = "button";
    edit.className = "notes-btn notes-btn-quiet";
    edit.textContent = "Edit";
    edit.addEventListener("click", function () {
      startEdit(card, note);
    });

    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "notes-btn notes-btn-quiet notes-btn-danger";
    remove.textContent = "Delete";
    remove.addEventListener("click", function () {
      if (!window.confirm("Delete this note?")) return;
      store.remove(note.id);
      setStatus("Note deleted.");
    });

    actions.appendChild(edit);
    actions.appendChild(remove);
    card.appendChild(actions);

    return card;
  }

  function startEdit(card, note) {
    card.innerHTML = "";
    card.classList.add("notes-card-editing");

    var area = document.createElement("textarea");
    area.className = "notes-composer-input";
    area.rows = 4;
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
      setStatus("Note updated.");
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

  function render() {
    var notes = store.forPage(page.url).sort(function (a, b) {
      return a.created < b.created ? 1 : -1;
    });

    countEl.textContent = notes.length ? String(notes.length) : "";
    countEl.hidden = notes.length === 0;
    toggle.setAttribute(
      "aria-label",
      notes.length === 1 ? "Reading notes (1 note on this page)" : "Reading notes (" + notes.length + " notes on this page)"
    );

    listEl.innerHTML = "";
    if (!notes.length) {
      var empty = document.createElement("p");
      empty.className = "notes-empty";
      empty.textContent = "No notes on this page yet.";
      listEl.appendChild(empty);
      return;
    }

    notes.forEach(function (note) {
      listEl.appendChild(noteCard(note));
    });
  }

  /* ----------------------------------------------------------------- save  */

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }

    store.add({
      text: text,
      pageUrl: page.url,
      pageTitle: page.title,
      heading: currentHeading(),
      quote: pendingQuote,
    });

    input.value = "";
    pendingQuote = null;
    renderQuote();
    setStatus("Saved. It is on /notes/ too.");
  });

  // Cmd/Ctrl+Enter saves without leaving the textarea.
  input.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });

  input.addEventListener("focus", updateHint);

  /* --------------------------------------------------------------- export  */

  exportBtn.addEventListener("click", function () {
    var notes = store.forPage(page.url);
    if (!notes.length) {
      setStatus("Nothing to export yet.");
      return;
    }

    exportBtn.disabled = true;
    store
      .loadContexts()
      .then(function (contexts) {
        return store.copy(store.toMarkdown(notes, contexts));
      })
      .then(function (ok) {
        setStatus(ok ? "Copied - paste it into a chat with Claude." : "Copy failed; use the notes page.");
      })
      .catch(function () {
        setStatus("Copy failed; use the notes page.");
      })
      .then(function () {
        exportBtn.disabled = false;
      });
  });

  /* ------------------------------------------------------------------ init */

  store.subscribe(render);
  render();
  updateHint();

  var wasOpen = null;
  try {
    wasOpen = window.localStorage.getItem(OPEN_KEY);
  } catch (e) {
    wasOpen = null;
  }
  if (wasOpen === "1") setOpen(true);
})();
