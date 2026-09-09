// Spaced retrieval over the site's exit criteria.
//
// The deck is not a separate body of questions: it is the same exitCriteria the
// articles render, emitted at build time as /review/items.json (tasks, light)
// and /review/answers.json (worked answers, five times larger and not needed
// until the reader reveals one).
//
// Scheduling state lives in localStorage and nowhere else. The page is inert
// without this script, and says so.
(function () {
  "use strict";

  var STORAGE_KEY = "lmi:review:v1";
  var PLAN_KEY = "lmi:plan:v1";

  // Expanding intervals, in days. Each success moves one step right. The growth
  // is deliberate: an item recalled with no effort was asked too early, and the
  // spacing effect wants the gap stretched until retrieval is just difficult.
  var INTERVALS = [1, 3, 7, 16, 35, 90];
  var DAY = 86400000;

  // A missed item is re-queued this many positions later, so the session gives
  // a second attempt rather than deferring every failure to tomorrow.
  var REQUEUE_GAP = 5;

  var page = document.querySelector("[data-review-page]");
  if (!page) return;

  var el = {
    loading: page.querySelector("[data-review-loading]"),
    stats: page.querySelector("[data-review-stats]"),
    due: page.querySelector("[data-review-due]"),
    learning: page.querySelector("[data-review-learning]"),
    known: page.querySelector("[data-review-known]"),
    pool: page.querySelector("[data-review-pool]"),
    empty: page.querySelector("[data-review-empty]"),
    session: page.querySelector("[data-review-session]"),
    position: page.querySelector("[data-review-position]"),
    sourceLink: page.querySelector("[data-review-source-link]"),
    lesson: page.querySelector("[data-review-lesson]"),
    task: page.querySelector("[data-review-task]"),
    revealRow: page.querySelector("[data-review-reveal-row]"),
    reveal: page.querySelector("[data-review-reveal]"),
    skip: page.querySelector("[data-review-skip]"),
    answer: page.querySelector("[data-review-answer]"),
    grade: page.querySelector("[data-review-grade]"),
    next: page.querySelector("[data-review-next]"),
    done: page.querySelector("[data-review-done]"),
    settings: page.querySelector("[data-review-settings]"),
    reset: page.querySelector("[data-review-reset]"),
  };

  /* ------------------------------------------------------------------ paths */

  // The site may be served from a subdirectory. EleventyHtmlBasePlugin rewrites
  // href and src attributes at build time but never JavaScript strings, so the
  // fetches and the article links built here resolve against this instead.
  function baseUrl() {
    var base = document.body && document.body.getAttribute("data-base-url");
    if (!base) return "/";
    return base.slice(-1) === "/" ? base : base + "/";
  }

  function withBase(path) {
    return baseUrl() + String(path).replace(/^\/+/, "");
  }

  /* ---------------------------------------------------------------- storage */

  function loadState() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (!parsed || typeof parsed !== "object") return { version: 1, items: {}, scope: null };
      return {
        version: 1,
        items: parsed.items && typeof parsed.items === "object" ? parsed.items : {},
        scope: parsed.scope === "plan" || parsed.scope === "all" ? parsed.scope : null,
      };
    } catch (err) {
      return { version: 1, items: {}, scope: null };
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* private mode or storage disabled: the session still works, it is just not remembered */
    }
  }

  var state = loadState();

  // Which articles the reader has ticked off in the plan. The plan stores one
  // checkbox id per read item, shaped "l<lesson>-read-<slug>".
  function slugsReadInPlan() {
    var slugs = {};
    try {
      var parsed = JSON.parse(window.localStorage.getItem(PLAN_KEY) || "null");
      var done = parsed && parsed.done;
      if (!done) return slugs;
      Object.keys(done).forEach(function (key) {
        if (done[key] !== true) return;
        var match = /^l\d+-read-(.+)$/.exec(key);
        if (match) slugs[match[1]] = true;
      });
    } catch (err) {
      /* no plan progress: the scope falls back to every article */
    }
    return slugs;
  }

  /* -------------------------------------------------------------- scheduling */

  function record(id) {
    var r = state.items[id];
    if (r && typeof r === "object") return r;
    return { box: 0, due: 0, seen: 0, missed: 0 };
  }

  function isDue(id, now) {
    return record(id).due <= now;
  }

  function grade(id, verdict, now) {
    var r = record(id);
    if (verdict === "missed") {
      r.box = 0;
      r.missed = (r.missed || 0) + 1;
    } else if (verdict === "got") {
      r.box = Math.min((r.box || 0) + 1, INTERVALS.length - 1);
    } /* "hard" leaves the box where it is, repeating the current interval */
    r.seen = (r.seen || 0) + 1;
    r.last = now;
    r.due = now + INTERVALS[r.box] * DAY;
    state.items[id] = r;
    saveState();
    return INTERVALS[r.box];
  }

  function describeDays(days) {
    if (days <= 1) return "tomorrow";
    if (days < 7) return "in " + days + " days";
    if (days < 14) return "in a week";
    if (days < 30) return "in " + Math.round(days / 7) + " weeks";
    if (days < 46) return "in about a month";
    return "in about " + Math.round(days / 30) + " months";
  }

  /* ------------------------------------------------------------ interleaving */

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  // Shuffle, then push apart any two neighbours from the same article. Blocked
  // practice reads better in the moment and retains worse, so the queue works
  // against grouping even though grouping is what a sorted list would give.
  function interleave(list) {
    var out = shuffle(list.slice());
    for (var i = 1; i < out.length; i++) {
      if (out[i].slug !== out[i - 1].slug) continue;
      for (var j = i + 1; j < out.length; j++) {
        if (out[j].slug !== out[i - 1].slug) {
          var tmp = out[i];
          out[i] = out[j];
          out[j] = tmp;
          break;
        }
      }
    }
    return out;
  }

  /* --------------------------------------------------------------- the deck */

  var items = [];
  var answers = null;
  var answersPromise = null;
  var queue = [];
  var current = null;
  var completed = 0;

  function scope() {
    if (state.scope) return state.scope;
    // No explicit choice yet: prefer the plan when it has anything in it, so a
    // reader who has been ticking lessons off is not handed the whole deck.
    return Object.keys(slugsReadInPlan()).length ? "plan" : "all";
  }

  function pool() {
    if (scope() === "all") return items;
    var read = slugsReadInPlan();
    return items.filter(function (item) {
      return read[item.slug] === true;
    });
  }

  function refreshStats() {
    var now = Date.now();
    var inScope = pool();
    var due = 0;
    var learning = 0;
    var known = 0;
    inScope.forEach(function (item) {
      var r = record(item.id);
      if (r.due <= now) due++;
      if (r.seen > 0 && r.box < 3) learning++;
      if (r.box >= 3) known++;
    });
    el.due.textContent = String(due);
    el.learning.textContent = String(learning);
    el.known.textContent = String(known);
    el.pool.textContent = String(inScope.length);
    el.stats.hidden = false;
    return { due: due, inScope: inScope };
  }

  function nextDueDescription(inScope) {
    var now = Date.now();
    var soonest = null;
    inScope.forEach(function (item) {
      var d = record(item.id).due;
      if (d > now && (soonest === null || d < soonest)) soonest = d;
    });
    if (soonest === null) return "";
    var days = Math.max(1, Math.round((soonest - now) / DAY));
    return " The next item is due " + describeDays(days) + ".";
  }

  function message(node, html) {
    node.innerHTML = html;
    node.hidden = false;
  }

  function startSession() {
    var stats = refreshStats();
    el.loading.hidden = true;
    el.settings.hidden = false;
    el.empty.hidden = true;
    el.done.hidden = true;

    if (!stats.inScope.length) {
      el.session.hidden = true;
      if (scope() === "plan") {
        message(el.empty,
          "Nothing in scope yet. Tick an article off under <strong>Read</strong> in the " +
          '<a href="' + withBase("plan/") + '">learning plan</a> and its questions join the deck, ' +
          "or switch the deck to every article in the settings below.");
      } else {
        message(el.empty, "The deck is empty, which should not happen. Try reloading.");
      }
      return;
    }

    var now = Date.now();
    queue = interleave(stats.inScope.filter(function (item) { return isDue(item.id, now); }));
    completed = 0;

    if (!queue.length) {
      el.session.hidden = true;
      message(el.done,
        "Nothing due right now — everything in scope is on a longer interval." +
        nextDueDescription(stats.inScope) +
        " Coming back before then would make the retrieval easier and teach you less.");
      return;
    }

    el.session.hidden = false;
    el.next.textContent = "";
    showNext();
  }

  function showNext() {
    if (!queue.length) {
      current = null;
      el.session.hidden = true;
      var stats = refreshStats();
      message(el.done,
        "Session finished — " + completed + (completed === 1 ? " item" : " items") +
        " reviewed." + nextDueDescription(stats.inScope));
      return;
    }

    current = queue.shift();
    el.position.textContent = (completed + 1) + " of " + (completed + 1 + queue.length);
    el.sourceLink.textContent = current.title;
    el.sourceLink.setAttribute("href", withBase("topics/" + current.slug + "/"));
    el.lesson.textContent = current.lesson ? " · Lesson " + current.lesson : "";
    el.task.innerHTML = current.task;

    el.answer.hidden = true;
    el.answer.innerHTML = "";
    el.grade.hidden = true;
    el.revealRow.hidden = false;
    el.reveal.disabled = false;
    el.reveal.textContent = "Show answer";
    el.reveal.focus();
  }

  function loadAnswers() {
    if (answersPromise) return answersPromise;
    answersPromise = fetch(withBase("review/answers.json"))
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        answers = data;
        return data;
      });
    return answersPromise;
  }

  function reveal() {
    if (!current) return;
    var id = current.id;
    el.reveal.disabled = true;

    var render = function (data) {
      if (!current || current.id !== id) return;
      el.answer.innerHTML = (data && data[id]) ||
        '<p>The answer did not load. It is on the article: ' +
        '<a href="' + withBase("topics/" + current.slug + "/") + '#exit-criteria-heading">' +
        current.title + "</a>.</p>";
      el.answer.hidden = false;
      el.revealRow.hidden = true;
      el.grade.hidden = false;
      var first = el.grade.querySelector("[data-grade]");
      if (first) first.focus();
    };

    if (answers) return render(answers);
    el.reveal.textContent = "Loading answer…";
    loadAnswers().then(render).catch(function () { render(null); });
  }

  function applyGrade(verdict) {
    if (!current) return;
    var days = grade(current.id, verdict, Date.now());
    completed++;

    if (verdict === "missed") {
      // Give it another attempt in this session as well as scheduling it for
      // tomorrow: a single failed retrieval is the least useful kind.
      var at = Math.min(REQUEUE_GAP, queue.length);
      queue.splice(at, 0, current);
    }

    refreshStats();
    showNext();
    el.next.textContent = "Last item: back " + describeDays(days) + ".";
  }

  /* ------------------------------------------------------------------ events */

  el.reveal.addEventListener("click", reveal);

  el.skip.addEventListener("click", function () {
    if (!current) return;
    queue.push(current);
    showNext();
  });

  el.grade.addEventListener("click", function (event) {
    var button = event.target.closest("[data-grade]");
    if (button) applyGrade(button.getAttribute("data-grade"));
  });

  Array.prototype.forEach.call(page.querySelectorAll("[data-review-scope]"), function (radio) {
    radio.checked = radio.value === scope();
    radio.addEventListener("change", function () {
      if (!radio.checked) return;
      state.scope = radio.value;
      saveState();
      startSession();
    });
  });

  el.reset.addEventListener("click", function () {
    if (!window.confirm("Reset review history for all items? Your learning-plan progress and notes are not affected.")) return;
    state.items = {};
    saveState();
    startSession();
  });

  // Keyboard: space or enter reveals, 1/2/3 grade. A drill is faster with hands
  // on the keyboard, and the buttons stay for everyone else.
  document.addEventListener("keydown", function (event) {
    if (!current || event.metaKey || event.ctrlKey || event.altKey) return;
    var tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || event.target.isContentEditable) return;

    if (!el.grade.hidden) {
      var map = { "1": "missed", "2": "hard", "3": "got" };
      if (map[event.key]) {
        event.preventDefault();
        applyGrade(map[event.key]);
      }
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      if (tag === "button") return; // let the button handle its own activation
      event.preventDefault();
      reveal();
    }
  });

  /* ------------------------------------------------------------------- start */

  fetch(withBase("review/items.json"))
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      items = Array.isArray(data) ? data : [];
      startSession();
      // Warm the answer file while the reader works the first task. It is large,
      // and they are about to spend minutes on a question.
      loadAnswers().catch(function () { /* retried on reveal */ });
    })
    .catch(function () {
      el.loading.hidden = true;
      message(el.empty,
        "The review deck did not load. The exit criteria are still on the articles themselves — " +
        'start from the <a href="' + withBase("topics/") + '">topics page</a>.');
    });
})();
