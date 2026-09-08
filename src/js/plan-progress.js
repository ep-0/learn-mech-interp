// Progress tracking for the learning plan.
//
// Every checkbox on /plan/ carries a stable data-plan-item id; the set of
// checked ids lives in localStorage and nowhere else. The page reads fine
// without this script, so nothing here is allowed to be load-bearing.
(function () {
  "use strict";

  var STORAGE_KEY = "lmi:plan:v1";
  var page = document.querySelector(".plan-page");
  if (!page) return;

  var boxes = Array.prototype.slice.call(page.querySelectorAll("[data-plan-item]"));
  if (!boxes.length) return;

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" && parsed.done ? parsed.done : {};
    } catch (err) {
      return {};
    }
  }

  function save(done) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, done: done }));
    } catch (err) {
      /* private mode, or storage disabled: progress simply is not remembered */
    }
  }

  var done = load();

  var lessons = Array.prototype.slice.call(page.querySelectorAll("[data-plan-lesson]"));
  var progress = page.querySelector("[data-plan-progress]");
  var fill = page.querySelector("[data-plan-progress-fill]");
  var text = page.querySelector("[data-plan-progress-text]");

  function refresh() {
    var complete = 0;
    lessons.forEach(function (lesson) {
      var items = lesson.querySelectorAll("[data-plan-item]");
      var checked = lesson.querySelectorAll("[data-plan-item]:checked").length;
      var counter = lesson.querySelector("[data-plan-count]");
      if (counter) counter.textContent = checked + "/" + items.length;
      lesson.classList.toggle("is-complete", items.length > 0 && checked === items.length);
      if (items.length > 0 && checked === items.length) complete++;
    });
    if (fill) fill.style.width = (lessons.length ? (complete / lessons.length) * 100 : 0) + "%";
    if (text) {
      text.textContent = complete + " of " + lessons.length + " lessons complete";
    }
  }

  boxes.forEach(function (box) {
    box.checked = done[box.getAttribute("data-plan-item")] === true;
    box.addEventListener("change", function () {
      var id = box.getAttribute("data-plan-item");
      if (box.checked) done[id] = true;
      else delete done[id];
      save(done);
      refresh();
    });
  });

  if (progress) progress.hidden = false;
  refresh();

  var reset = page.querySelector("[data-plan-reset]");
  if (reset) {
    reset.addEventListener("click", function () {
      if (!window.confirm("Clear every checkbox on the learning plan? This cannot be undone.")) return;
      done = {};
      save(done);
      boxes.forEach(function (box) { box.checked = false; });
      refresh();
    });
  }

  // Open the first lesson that still has unchecked items, unless the reader
  // arrived at a specific lesson by link.
  if (!window.location.hash) {
    for (var i = 0; i < lessons.length; i++) {
      if (!lessons[i].classList.contains("is-complete")) {
        lessons[i].open = true;
        break;
      }
    }
  } else {
    var target = document.querySelector(window.location.hash);
    if (target && target.hasAttribute("data-plan-lesson")) target.open = true;
  }

  // A link to another lesson should open it rather than scroll to a closed box.
  page.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#lesson-"]');
    if (!link) return;
    var dest = document.querySelector(link.getAttribute("href"));
    if (dest) dest.open = true;
  });
})();
