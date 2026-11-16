/* ==========================================================================
   TSM Coaching Institute - interactions
   Sections: helpers, header/nav, scroll effects, hero typing, counters,
   course filter, batch finder, quiz, testimonials, FAQ, enquiry form.
   ========================================================================== */
(function () {
  "use strict";

  var PHONE = "917054988970";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  document.documentElement.classList.add("js");

  /* ---------- Toast + copy ---------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("Copied: " + text); } catch (e) { toast("Number: " + text); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied: " + text); }, fallback);
    } else { fallback(); }
  }
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () { copyText(b.getAttribute("data-copy")); });
  });

  /* ---------- Header, mobile menu, progress, back-to-top ---------- */
  var header = $("#header"), nav = $("#nav"), burger = $("#burger"), progress = $("#progress"), toTop = $("#toTop");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  }
  burger.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("scrolled", y > 20);
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    toTop.classList.toggle("show", y > 700);
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  onScroll();

  /* Active nav link */
  var links = $$("a.link", nav);
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (l) { var s = $(l.getAttribute("href")); if (s) secObs.observe(s); });
  }

  /* ---------- Reveal on scroll + counters + roadmap ---------- */
  function countUp(el) {
    var target = +el.getAttribute("data-count"), suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = performance.now(), dur = 1400;
    (function step(now) {
      var p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); o.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { revObs.observe(el); });

    var cntObs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); o.unobserve(en.target); } });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach(function (el) { cntObs.observe(el); });

    var road = $("#roadmap");
    if (road) {
      new IntersectionObserver(function (entries, o) {
        if (entries[0].isIntersecting) { road.classList.add("go"); o.disconnect(); }
      }, { threshold: 0.4 }).observe(road);
    }
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
    $$("[data-count]").forEach(countUp);
    var r = $("#roadmap"); if (r) r.classList.add("go");
  }

  /* ---------- Hero typing ---------- */
  var typedEl = $("#typed");
  var words = ["CBSE", "ICSE", "UP Board", "IIT JEE", "CUET", "Class 5 to 12"];
  if (typedEl && !reduceMotion) {
    var wi = 0, ci = words[0].length, deleting = true;
    setTimeout(function tick() {
      var word = words[wi];
      typedEl.textContent = word.slice(0, ci);
      var delay = deleting ? 45 : 95;
      if (!deleting && ci === word.length) { deleting = true; delay = 1400; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      ci += deleting ? -1 : 1;
      setTimeout(tick, delay);
    }, 1800);
  }

  /* ---------- Spotlight hover glow on cards ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".spot").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- Course filter ---------- */
  var tabs = $$("#courseTabs .tab"), cards = $$("#courseCards .card");
  function filterCourses(f) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t.getAttribute("data-filter") === f)); });
    cards.forEach(function (c) {
      var show = f === "all" || c.getAttribute("data-cat").split(" ").indexOf(f) > -1;
      c.hidden = !show;
      c.classList.remove("pop"); c.classList.add("in");
      if (show) { void c.offsetWidth; c.classList.add("pop"); }
    });
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { filterCourses(t.getAttribute("data-filter")); }); });

  /* ---------- Batch finder ---------- */
  var state = { cls: 9, board: "CBSE", stream: "Science (PCM)" };
  var boards = ["CBSE", "ICSE", "UP Board"];
  var streams = ["Science (PCM)", "Science (PCB)", "Commerce", "Humanities"];
  var optClass = $("#optClass"), optBoard = $("#optBoard"), optStream = $("#optStream"), streamSet = $("#streamSet"), result = $("#result");

  function subjectsFor(s) {
    if (s.cls <= 8) return ["Mathematics", "Science", "English", "Social Science", "Hindi"];
    if (s.cls <= 10) {
      if (s.board === "ICSE") return ["Mathematics", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "English"];
      return ["Mathematics", "Science", "Social Science", "English", "Hindi"];
    }
    switch (s.stream) {
      case "Science (PCM)": return ["Physics", "Chemistry", "Mathematics", "English"];
      case "Science (PCB)": return ["Physics", "Chemistry", "Biology", "English"];
      case "Commerce": return ["Accountancy", "Business Studies", "Economics", "English"];
      default: return ["History", "Political Science", "Geography", "Economics", "English"];
    }
  }
  function extrasFor(s) {
    var out = [];
    if (s.cls <= 8) out.push("Reading, writing and speaking practice in English");
    if (s.cls >= 9 && s.cls <= 10) out.push("Pre-board mock tests with detailed analysis", "Optional JEE foundation add-on");
    if (s.cls >= 11) {
      out.push("Board exam preparation with practical guidance");
      if (s.stream === "Science (PCM)") out.push("Add-on: IIT JEE (Main + Advanced) track");
      if (s.stream === "Science (PCB)") out.push("Strong Physics and Chemistry for competitive exams");
      out.push("Add-on: CUET preparation with mock tests");
    }
    return out;
  }
  function build(container, items, current, key) {
    container.innerHTML = "";
    items.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.textContent = v;
      b.setAttribute("aria-pressed", String(v === current));
      b.addEventListener("click", function () { state[key] = v; render(); });
      container.appendChild(b);
    });
  }
  function render() {
    build(optClass, [5, 6, 7, 8, 9, 10, 11, 12], state.cls, "cls");
    build(optBoard, boards, state.board, "board");
    streamSet.hidden = state.cls < 11;
    if (state.cls >= 11) build(optStream, streams, state.stream, "stream");
    var boardLabel = state.board === "ICSE" && state.cls >= 11 ? "ISC" : state.board;
    var title = "Class " + state.cls + " &middot; " + boardLabel + (state.cls >= 11 ? "<br><span style='font-size:.6em;color:#fff'>" + state.stream + "</span>" : "");
    var subs = subjectsFor(state).map(function (x, i) { return "<span style='animation-delay:" + (i * 60) + "ms'>" + x + "</span>"; }).join("");
    var base = ["English medium classes with printed notes", "Weekly tests and doubt-clearing sessions", "Regular parent updates"];
    var list = base.concat(extrasFor(state)).map(function (x) { return "<li><svg class='ic'><use href='#i-check'/></svg><span>" + x + "</span></li>"; }).join("");
    var msg = "Hello TSM Coaching, I want details for Class " + state.cls + " (" + boardLabel + ")" + (state.cls >= 11 ? ", " + state.stream : "") + ".";
    result.className = "result swap";
    result.innerHTML = "<span class='small'>Your batch</span><h3>" + title + "</h3><div class='subjects'>" + subs + "</div><ul>" + list + "</ul>" +
      "<a class='btn btn--yellow' target='_blank' rel='noopener' href='https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg) + "'>Ask about this batch <svg class='ic ic-go'><use href='#i-arrow'/></svg></a>";
    void result.offsetWidth;
  }
  render();
  var qb = $("#quickbar");
  if (qb) qb.addEventListener("submit", function (e) {
    e.preventDefault();
    state.cls = +$("#qClass").value; state.board = $("#qBoard").value;
    if (state.cls >= 11 && state.stream === "Commerce") state.stream = "Science (PCM)";
    render();
    $("#finder").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
  $$("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () { state.cls = +a.getAttribute("data-pick"); if (state.cls === 11) state.stream = "Commerce"; else if (state.cls === 12) state.stream = "Science (PCM)"; render(); });
  });

  /* ---------- Quiz ---------- */
  var QUIZ = [
    { q: "What is 15% of 200?", a: ["20", "30", "25", "35"], c: 1 },
    { q: "What is the SI unit of force?", a: ["Joule", "Watt", "Newton", "Pascal"], c: 2 },
    { q: "What is the plural of the word 'criterion'?", a: ["Criterions", "Criteria", "Criterias", "Criterium"], c: 1 },
    { q: "What is the chemical symbol of Sodium?", a: ["So", "S", "Sn", "Na"], c: 3 },
    { q: "Which river flows through Lucknow?", a: ["Yamuna", "Ganga", "Gomti", "Ghaghara"], c: 2 }
  ];
  var qBox = $("#quiz-box"), qi = 0, score = 0;
  function renderQ() {
    var item = QUIZ[qi];
    qBox.innerHTML =
      "<div class='qtop'><span>Question " + (qi + 1) + " of " + QUIZ.length + "</span><span>Score " + score + "</span></div>" +
      "<div class='qbar'><i style='width:" + (qi / QUIZ.length * 100) + "%'></i></div>" +
      "<h3>" + item.q + "</h3><div class='answers'>" +
      item.a.map(function (t, i) { return "<button class='ans' data-i='" + i + "'><b>" + "ABCD".charAt(i) + "</b>" + t + "</button>"; }).join("") +
      "</div><div class='qfoot'><span class='fb' id='fb'></span><button class='btn btn-sm' id='nextQ' hidden>" + (qi === QUIZ.length - 1 ? "See score" : "Next") + " <svg class='ic ic-go'><use href='#i-arrow'/></svg></button></div>";
    requestAnimationFrame(function () { var i = $(".qbar i", qBox); if (i) i.style.width = ((qi) / QUIZ.length * 100) + "%"; });
    $$(".ans", qBox).forEach(function (b) {
      b.addEventListener("click", function () {
        var pick = +b.getAttribute("data-i"), right = pick === item.c;
        $$(".ans", qBox).forEach(function (x) { x.disabled = true; });
        b.classList.add(right ? "ok" : "bad");
        if (!right) $$(".ans", qBox)[item.c].classList.add("ok");
        if (right) score++;
        $("#fb").textContent = right ? "Correct!" : "Not quite. Right answer: " + item.a[item.c];
        $("#nextQ").hidden = false;
        $("#nextQ").focus();
      });
    });
    $("#nextQ").addEventListener("click", function () { qi++; qi < QUIZ.length ? renderQ() : renderScore(); });
  }
  function renderScore() {
    var pct = Math.round(score / QUIZ.length * 100);
    var line = score >= 4 ? "Excellent! You are exam ready. Book a free demo class and aim even higher." :
               score >= 2 ? "Good start. A few concepts need polishing. Our teachers can help you get there." :
               "Every topper started somewhere. Join a free demo class and build strong basics.";
    qBox.innerHTML = "<div class='score-view'><div class='ring-score' style='--p:0' id='rs'><b>" + score + "/" + QUIZ.length + "</b></div><h3>" + pct + "% score</h3><p>" + line + "</p>" +
      "<div class='cta-row'><a class='btn' href='#contact'>Book free demo <svg class='ic ic-go'><use href='#i-arrow'/></svg></a><button class='btn btn--ghost' id='again'>Try again</button></div></div>";
    setTimeout(function () { $("#rs").style.setProperty("--p", pct); }, 60);
    $("#again").addEventListener("click", function () { qi = 0; score = 0; renderQ(); });
    if (score >= 4 && !reduceMotion) confetti();
  }
  renderQ();

  /* Confetti (tiny canvas burst) */
  function confetti() {
    var cv = $("#confetti"), ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    var cols = ["#ffe100", "#e8333c", "#16130a", "#ffffff", "#f5c400"];
    var ps = [];
    for (var i = 0; i < 140; i++) ps.push({ x: cv.width / 2, y: cv.height * 0.6, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 4, s: Math.random() * 8 + 4, c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 });
    var t0 = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(function (p) { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
      if (now - t0 < 2600) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
    })(t0);
  }

  /* ---------- Testimonials slider ---------- */
  var trackT = $("#trackT"), dotsT = $("#dotsT"), slides = $$(".slide", trackT), si = 0, auto;
  slides.forEach(function (_, i) {
    var d = document.createElement("button");
    d.setAttribute("aria-label", "Show review " + (i + 1));
    d.addEventListener("click", function () { go(i); restart(); });
    dotsT.appendChild(d);
  });
  function go(i) {
    si = (i + slides.length) % slides.length;
    trackT.style.transform = "translateX(" + (-si * 100) + "%)";
    $$("button", dotsT).forEach(function (d, k) { d.setAttribute("aria-current", String(k === si)); });
  }
  function restart() { clearInterval(auto); if (!reduceMotion) auto = setInterval(function () { go(si + 1); }, 5500); }
  $("#prevT").addEventListener("click", function () { go(si - 1); restart(); });
  $("#nextT").addEventListener("click", function () { go(si + 1); restart(); });
  $("#slider").addEventListener("mouseenter", function () { clearInterval(auto); });
  $("#slider").addEventListener("mouseleave", restart);
  go(0); restart();

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach(function (item) {
    $(".faq-q", item).addEventListener("click", function () {
      var open = !item.classList.contains("open");
      $$(".faq-item").forEach(function (o) { o.classList.remove("open"); $(".faq-q", o).setAttribute("aria-expanded", "false"); });
      if (open) { item.classList.add("open"); $(".faq-q", item).setAttribute("aria-expanded", "true"); }
    });
  });

  /* ---------- Enquiry form -> WhatsApp ---------- */
  var form = $("#enquiry"), wa = $("#waSend");
  function field(id) { return $("#" + id); }
  function setErr(id, msg) {
    var el = field(id), wrap = el.parentNode, err = $(".err", wrap);
    wrap.classList.toggle("invalid", !!msg);
    if (err) err.textContent = msg || "";
  }
  function message() {
    var parts = ["Hello TSM Coaching, I would like to book a free demo class.",
      "Student: " + field("f-name").value.trim(),
      "Mobile: " + field("f-phone").value.trim(),
      "Class: " + field("f-class").value + " (" + field("f-board").value + ")",
      "Interested in: " + field("f-course").value];
    var m = field("f-msg").value.trim();
    if (m) parts.push("Message: " + m);
    return parts.join("\n");
  }
  function validate() {
    var ok = true;
    if (field("f-name").value.trim().length < 2) { setErr("f-name", "Please enter the student's name."); ok = false; } else setErr("f-name");
    if (!/^[6-9]\d{9}$/.test(field("f-phone").value.trim())) { setErr("f-phone", "Enter a valid 10-digit mobile number."); ok = false; } else setErr("f-phone");
    if (!field("f-class").value) { setErr("f-class", "Please select a class."); ok = false; } else setErr("f-class");
    return ok;
  }
  field("f-phone").addEventListener("input", function (e) { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10); });
  wa.addEventListener("click", function (e) {
    if (!validate()) { e.preventDefault(); toast("Please fill the highlighted fields."); var bad = $(".invalid input, .invalid select", form); if (bad) bad.focus(); return; }
    wa.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message());
    toast("Opening WhatsApp with your details...");
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); wa.click(); });

  /* ---------- Footer year ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
