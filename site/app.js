/* AI Roadmap — renders site/data.js (built by site/build.py). Views: Today, Day, Calendar, DSA. */
(function () {
  "use strict";
  const R = window.ROADMAP;
  const app = document.getElementById("app");
  if (!R) {
    app.innerHTML = `<div class="card" style="margin-top:24px"><h2>No data yet</h2>
      <p class="muted">Run <code>python site/build.py --open</code> from the repo root.</p></div>`;
    return;
  }

  // ── helpers ──────────────────────────────────────────────────────────
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
  const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  const addDays = (iso, n) => { const d = toDate(iso); d.setDate(d.getDate() + n); return isoOf(d); };
  const DAY = 86400000;
  const diffDays = (a, b) => Math.round((toDate(a) - toDate(b)) / DAY);
  const fmt = (iso, opts = { month: "short", day: "numeric" }) => iso ? toDate(iso).toLocaleDateString("en-US", opts) : "—";
  const fmtW = (iso) => fmt(iso, { weekday: "short", month: "short", day: "numeric" });
  const plural = (n, w) => `${n} ${w}${Math.abs(n) === 1 ? "" : "s"}`;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  const main = R.main, dsa = R.dsa;
  const isDone = (x) => x.status !== "todo";

  // Re-project unfinished days from the viewer's own "today", so the published
  // site stays correct on days nothing was pushed.
  const today = isoOf(new Date());
  function reproject(items) {
    let c = today;
    items.forEach((i) => { if (i.status === "todo") { i.date = c; i.projected = true; c = addDays(c, 1); } });
  }
  reproject(main.days);
  reproject(dsa.items);
  main.phases.forEach((p) => {
    const mine = main.days.filter((d) => d.phase === p.id);
    if (mine.length) { p.start = mine[0].date; p.end = mine[mine.length - 1].date; }
  });

  const curMain = main.days.find((d) => d.current);
  const curDsa = dsa.items.find((i) => i.current);
  const phaseById = Object.fromEntries(main.phases.map((p) => [p.id, p]));
  const dsaById = Object.fromEntries(dsa.items.map((i) => [i.id, i]));
  const mainById = Object.fromEntries(main.days.map((d) => [d.id, d]));
  const lastDate = (arr) => arr[arr.length - 1].date;
  const calEnd = [main.end, lastDate(main.days), lastDate(dsa.items)].sort().pop();
  const DIFF = { E: "Easy", M: "Medium", H: "Hard" };

  const byDate = {};
  const slot = (iso) => (byDate[iso] = byDate[iso] || { main: [], dsa: [] });
  main.days.forEach((d) => d.date && slot(d.date).main.push(d));
  dsa.items.forEach((i) => i.date && slot(i.date).dsa.push(i));
  const dayInfo = (iso) => byDate[iso] || { main: [], dsa: [] };

  const ghLink = (path) => R.github ? `<a href="${esc(R.github + path)}" target="_blank" rel="noopener">${esc(path)}</a>` : `<code>${esc(path)}</code>`;
  const copyLine = (text) => `<div class="copyline"><code>${esc(text)}</code><button type="button" data-copy="${esc(text)}">Copy</button></div>`;
  const kindChip = (k) => ({
    lesson: `<span class="chip lesson">Lesson</span>`,
    project: `<span class="chip project">Project day</span>`,
    review: `<span class="chip review">Review</span>`,
    new: `<span class="chip new">New problem</span>`,
    timed: `<span class="chip timed">Timed · 45 min</span>`,
    redo: `<span class="chip redo">Redo from scratch</span>`,
  }[k] || "");
  const phaseChip = (id) => `<span class="chip"><span class="dot" style="background:var(--p${id})"></span>Phase ${id}</span>`;
  const statusDot = (x) => `<span class="st ${x.current ? "current" : x.status}" title="${x.current ? "today" : x.status}"></span>`;
  const evidenceText = (ev) => ev.includes("::") ? `${ev.split("::")[1]}  →  in ${ev.split("::")[0]}` : ev;
  const shortTitle = (t) => t.replace(/^Day \d+ · /, "");
  const ICON = {
    lesson: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 4.2C6.8 3.2 4.9 2.8 2 3v9.3c2.9-.2 4.8.2 6 1.2 1.2-1 3.1-1.4 6-1.2V3c-2.9-.2-4.8.2-6 1.2zM8 4.2v9.3"/></svg>`,
    project: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8 13.6 5v6L8 14.2 2.4 11V5zM2.4 5 8 8.2 13.6 5M8 8.2v6"/></svg>`,
    review: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.2 8.6A5.3 5.3 0 1 1 11.4 3.6M13.4 1.8v3.6H9.8"/></svg>`,
  };
  const minutes = (rows) => rows.reduce((s, [t]) => s + (t.endsWith("h") ? 60 * parseFloat(t) : parseFloat(t)), 0);
  const hm = (m) => m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m}m`;

  // ── day plans ───────────────────────────────────────────────────────
  function mainPlan(d) {
    if (d.steps) return d.steps.map((s) => [s[0], esc(s[1])]);
    const i = main.days.indexOf(d);
    const prev = main.days[i - 1], next = main.days[i + 1];
    const week = main.weeks[d.week];
    if (d.kind === "project") return [
      ["45m", `Review the week: ${week.days.map((id) => mainById[id]).filter((x) => x.kind === "lesson").map((x) => esc(shortTitle(x.title))).join(", ")}`],
      ["2h", `<b>Build:</b> ${esc(d.build)}`],
      ["45m", "Debug, experiment, measure — break it on purpose once"],
      ["30m", "Write the project README: problem, approach, results, what you'd change"],
      ["15m", "Commit and push"],
    ];
    if (d.kind === "review") return [
      ["20m", esc(d.learn)],
      ["30m", "Redo the one exercise from this week that felt shakiest, from a blank file"],
      ["30m", `<b>Write it up:</b> ${esc(d.build)}`],
      ["15m", "Update your 0–4 levels; note anything to carry into next week"],
      ["5m", next ? `Look ahead: <i>${esc(next.title)}</i>` : "Look back at where you started"],
    ];
    return [
      ["15m", prev ? `Recall yesterday without notes: <i>${esc(prev.title)}</i>` : "Recall what you know already"],
      ["45m", `<b>Learn:</b> ${esc(d.learn)}`],
      ["40m", `<b>Build:</b> ${esc(d.build)}`],
      ["15m", "Concept note (notes/concept-template.md) — explain it in your own words"],
      ["5m", next ? `Peek at tomorrow: <i>${esc(next.title)}</i>` : "Plan tomorrow"],
    ];
  }

  function dsaPlan(it) {
    if (it.kind === "timed") return [
      ["5m", "Revisit queue first: re-solve anything due in TRACKER.md"],
      ["45m", "Hard stop, like a real interview. Read → constraints → approach → code → test, all inside 45 minutes"],
      ["10m", "Self-review: where did the time go? Log it in TRACKER.md"],
    ];
    if (it.kind === "redo") return [
      ["5m", "Close every note and old solution. Blank file."],
      ["30m", "Solve it from scratch — explain the approach out loud first"],
      ["15m", "Compare with your original: faster? cleaner? same bug?"],
      ["10m", "Log it in TRACKER.md (solved unaided Y/N)"],
    ];
    return [
      ["5m", "Read twice. Write constraints + edge cases before any code"],
      ["10m", "Approach on paper only — brute force first, then better"],
      ["30m", "Code it"],
      ["10m", "Test edge cases: empty, single element, duplicates, negatives"],
      ["5m", "Stuck? Only now peek. Note the trick, add to revisit queue (+4 days)"],
    ];
  }

  function checklist(key, rows, locked) {
    const saved = store.get(key) || [];
    return `<ul class="plan">${rows.map(([t, what], i) => {
      const on = locked || saved[i];
      return `<li class="${on ? "checked" : ""}"><input type="checkbox" data-ck="${key}" data-i="${i}" ${on ? "checked" : ""} ${locked ? "disabled" : ""} aria-label="step ${i + 1}">
        <span class="t">${t}</span><span class="what">${what}</span></li>`;
    }).join("")}</ul>`;
  }

  function notebookCmd(it) {
    const b = dsa.blocks[it.block];
    return `python dsa/make_notebook.py --pattern-folder ${b.folder} --slug ${it.stem} --title "${it.title}" --day "${it.label}" --date ${it.date} --statement "<paste from LeetCode>" --constraints "<paste>" --examples "<in -> out|in -> out>"`;
  }

  function mainCard(d, { banner = "" } = {}) {
    const week = main.weeks[d.week];
    const rows = mainPlan(d);
    const done = isDone(d);
    return `<article class="card task-card" style="--pc:var(--p${d.phase})">
      <div class="head"><span class="eyebrow">Main track · ${hm(minutes(rows))}</span>${kindChip(d.kind)}${phaseChip(d.phase)}</div>
      <div><div class="muted" style="font-size:13.5px;margin-bottom:4px">${esc(week.title)} · day ${d.n} of ${main.days.length}</div><h2>${esc(d.title)}</h2></div>
      ${done ? `<div class="banner ok">✓ Done ${fmt(d.date, { month: "long", day: "numeric" })}${d.status === "uncommitted" ? " — not committed yet" : ""}</div>` : ""}
      ${checklist("ck-" + d.id, rows, done)}
      ${done ? `<div class="done-when">Evidence:<div class="files">${d.files.map(ghLink).join("")}</div></div>`
             : `<div class="done-when">Done when this is committed — the day ticks off on the next build:${d.evidence.map((e) => copyLine(evidenceText(e))).join("")}</div>`}
      ${banner}
    </article>`;
  }

  function dsaCard(it) {
    const b = dsa.blocks[it.block];
    const rows = dsaPlan(it);
    const done = isDone(it);
    return `<article class="card task-card">
      <div class="head"><span class="eyebrow">DSA · ${hm(minutes(rows))}</span>${kindChip(it.kind)}</div>
      <div><div class="muted" style="font-size:13.5px;margin-bottom:4px">${esc(b.name)} · ${esc(it.label)}${it.attempt > 1 ? ` · attempt ${it.attempt}` : ""}</div>
        <h2>${it.url ? `<a href="${it.url}" target="_blank" rel="noopener">${esc(it.title)}</a>` : esc(it.title)}</h2>
        <div class="meta" style="margin-top:6px">${it.diff ? `<span class="diff ${it.diff}">${DIFF[it.diff]}</span>` : ""}${it.note ? `<span>${esc(it.note)}</span>` : ""}</div></div>
      ${done ? `<div class="banner ok">✓ Done ${fmt(it.date, { month: "long", day: "numeric" })}</div>` : ""}
      ${it.url ? `<div class="actions"><a class="btn primary" href="${it.url}" target="_blank" rel="noopener">Open on LeetCode ↗</a>${it.alt ? `<a class="btn" href="${it.alt}" target="_blank" rel="noopener">Free on NeetCode ↗</a>` : ""}</div>` : ""}
      ${checklist("ck-" + it.id, rows, done)}
      ${done ? `<div class="done-when">Evidence:<div class="files">${it.files.map(ghLink).join("")}</div></div>`
             : `<div class="done-when">Done when this is committed:${copyLine(it.expected)}${it.slug ? `Scaffold it:${copyLine(notebookCmd(it))}` : ""}</div>`}
    </article>`;
  }

  // ── TODAY ───────────────────────────────────────────────────────────
  function viewToday() {
    const mDone = main.days.filter(isDone).length, dDone = dsa.items.filter(isDone).length;
    const mFinish = lastDate(main.days), dFinish = lastDate(dsa.items);
    const mLate = diffDays(mFinish, main.end), dLate = diffDays(dFinish, main.end);
    const ph = curMain ? phaseById[curMain.phase] : null;
    const phLate = ph ? diffDays(ph.end, ph.target[1]) : 0;
    const lateTxt = (n) => n <= 0 ? `<span class="s ok">${n === 0 ? "On time" : plural(-n, "day") + " to spare"}</span>` : `<span class="s ${n > 14 ? "bad" : "warn"}">${plural(n, "day")} past ${fmt(main.end)}</span>`;
    const uncommitted = [...main.days, ...dsa.items].filter((x) => x.status === "uncommitted");

    const hello = `<section class="hello">
      <div><div class="eyebrow">${fmt(today, { weekday: "long" })}</div>
        <h1>${fmt(today, { month: "long", day: "numeric", year: "numeric" })}</h1>
        <p>${curMain ? `Main track day ${curMain.n} of ${main.days.length} · ${esc(ph.name)}` : "Main track complete."}</p></div>
      <a class="btn" href="#calendar">Open calendar →</a>
    </section>`;

    const stats = `<section class="stats">
      <div class="card stat"><div class="k">Main track</div><div class="v">${mDone}<small> / ${main.days.length} days</small></div>
        <div class="bar"><span style="width:${(100 * mDone / main.days.length).toFixed(1)}%"></span></div></div>
      <div class="card stat"><div class="k">DSA track</div><div class="v">${dDone}<small> / ${dsa.items.length} days</small></div>
        <div class="bar"><span style="width:${(100 * dDone / dsa.items.length).toFixed(1)}%"></span></div></div>
      <div class="card stat"><div class="k">Main finish, 1 day per day</div><div class="v">${fmt(mFinish)}</div>${lateTxt(mLate)}</div>
      <div class="card stat"><div class="k">DSA finish, 1 problem per day</div><div class="v">${fmt(dFinish)}</div>${lateTxt(dLate)}</div>
    </section>`;

    const banner = ph && phLate > 0 ? `<div class="banner warn">${esc(ph.name)} is projected to end ${fmt(ph.end)} — ${plural(phLate, "day")} after the original ${fmt(ph.target[1])} target. Later phases have been compressed so the whole plan still lands by ${fmt(main.end)}.</div>` : "";
    const left = curMain ? mainCard(curMain, { banner }) : `<div class="card task-card"><h2>Main track complete 🎉</h2></div>`;
    const right = curDsa ? dsaCard(curDsa) : `<div class="card task-card"><h2>DSA track complete 🎉</h2></div>`;

    const revisits = dsa.revisits.length ? `<div class="section-title"><h2>Revisit queue</h2><span class="faint" style="font-size:12.5px">from dsa/TRACKER.md — do these before today's problem</span></div>
      <div class="card revisit">${dsa.revisits.map((r) => {
        const n = /^\d{4}-\d\d-\d\d$/.test(r.due) ? diffDays(r.due, today) : null;
        const tag = n === null ? "" : n < 0 ? `<span class="due over">${plural(-n, "day")} overdue</span>` : n <= 1 ? `<span class="due soon">due ${n ? "tomorrow" : "today"}</span>` : `<span class="faint" style="font-size:12.5px">due ${fmt(r.due)}</span>`;
        return `<span class="item"><b>${esc(r.problem)}</b>${tag}</span>`;
      }).join("")}</div>` : "";

    const pending = uncommitted.length ? `<div class="banner warn" style="margin-top:16px">${plural(uncommitted.length, "day")} ${uncommitted.length === 1 ? "has" : "have"} evidence on disk but not committed yet: ${uncommitted.map((x) => esc(x.title)).join(", ")}. Commit it so the repo has the record.</div>` : "";

    const upMain = main.days.filter((d) => d.status === "todo").slice(1, 8);
    const upDsa = dsa.items.filter((d) => d.status === "todo").slice(1, 8);
    const next = `<div class="section-title"><h2>Coming up</h2><span class="faint" style="font-size:12.5px">click a day for its full plan</span></div>
      <div class="next-grid">
        <div class="card"><div class="eyebrow" style="margin-bottom:6px">Main track</div><ul class="mini">${upMain.map((d) => `<li><span class="d">${fmtW(d.date)}</span><a class="ttl" href="#day/${d.date}">${esc(d.title)}</a>${kindChip(d.kind)}</li>`).join("")}</ul></div>
        <div class="card"><div class="eyebrow" style="margin-bottom:6px">DSA</div><ul class="mini">${upDsa.map((d) => `<li><span class="d">${fmtW(d.date)}</span><a class="ttl" href="#day/${d.date}">${esc(d.title)}</a>${d.diff ? `<span class="diff ${d.diff}">${d.diff}</span>` : kindChip(d.kind)}</li>`).join("")}</ul></div>
      </div>`;

    const commits = `<div class="section-title"><h2>Recent commits</h2></div>
      <div class="card"><ul class="mini commits">${R.commits.map((c) => `<li><span class="d">${fmt(c.date)}</span><span class="ttl">${esc(c.subject)}</span></li>`).join("")}</ul></div>`;

    app.innerHTML = hello + stats + pending + `<section class="today-grid">${left}${right}</section>` + revisits + next + commits;
  }

  // ── DAY ─────────────────────────────────────────────────────────────
  function viewDay(iso) {
    if (!/^\d{4}-\d\d-\d\d$/.test(iso || "")) iso = today;
    const info = dayInfo(iso);
    const state = iso === today ? ["today", "Today"] : iso < today ? ["past", "Past"] : ["proj", "Projected"];
    const total = info.main.reduce((s, d) => s + (isDone(d) ? 0 : minutes(mainPlan(d))), 0) + info.dsa.reduce((s, i) => s + (isDone(i) ? 0 : minutes(dsaPlan(i))), 0);
    const mainHtml = info.main.map((d) => mainCard(d)).join("");
    const dsaHtml = info.dsa.map((i) => dsaCard(i)).join("");
    const empty = !info.main.length && !info.dsa.length;
    const ph = info.main[0] ? phaseById[info.main[0].phase] : null;
    app.innerHTML = `
      <section class="day-hero" ${ph ? `style="--pc:var(--p${ph.id})"` : ""}>
        <div class="day-nav">
          <a class="btn ghost" href="#calendar">← Calendar</a>
          <span class="spacer"></span>
          <a class="btn ghost" href="#day/${addDays(iso, -1)}" aria-label="Previous day">‹ ${fmt(addDays(iso, -1))}</a>
          ${iso !== today ? `<a class="btn ghost" href="#day/${today}">Today</a>` : ""}
          <a class="btn ghost" href="#day/${addDays(iso, 1)}" aria-label="Next day">${fmt(addDays(iso, 1))} ›</a>
        </div>
        <div class="eyebrow">${fmt(iso, { weekday: "long" })}${ph ? ` · ${esc(ph.name)}` : ""}</div>
        <h1>${fmt(iso, { month: "long", day: "numeric", year: "numeric" })}</h1>
        <div class="day-pills"><span class="pn-state ${state[0]}">${state[1]}</span>${total ? `<span class="faint">${hm(total)} planned</span>` : ""}</div>
      </section>
      ${empty ? `<div class="card empty-day"><h2>${iso > calEnd ? "After the finish line." : iso < today ? "Nothing logged this day." : "Buffer day"}</h2>
          <p class="muted">${iso >= today && iso <= calEnd ? "Nothing scheduled. Use it to clear the revisit queue, finish a project that ran over, or rest." : ""}</p></div>`
        : `<section class="today-grid day-grid">${mainHtml || `<div class="card task-card"><p class="muted">No main-track work this day.</p></div>`}${dsaHtml || `<div class="card task-card"><p class="muted">No DSA problem this day.</p></div>`}</section>`}`;
    document.title = fmt(iso, { month: "short", day: "numeric" }) + " · AI Roadmap";
  }

  // ── CALENDAR ────────────────────────────────────────────────────────
  let selDate = today;

  function cell(iso) {
    const dt = toDate(iso);
    const info = dayInfo(iso);
    const past = iso < today, beyond = iso > calEnd;
    const m = info.main[info.main.length - 1], s = info.dsa[info.dsa.length - 1];
    const buffer = !m && !past && !beyond;
    const allDone = (info.main.length || info.dsa.length) && [...info.main, ...info.dsa].every(isDone);
    const cls = ["cell", past && "past", iso === today && "is-today", iso === selDate && "sel", dt.getDay() % 6 === 0 && "wknd",
      buffer && "buffer", beyond && "beyond", m && "k-" + m.kind, allDone && "all-done"].filter(Boolean).join(" ");
    const more = (arr) => arr.length > 1 ? `<span class="more">+${arr.length - 1}</span>` : "";
    return `<button type="button" class="${cls}" data-date="${iso}" ${m ? `style="--pc:var(--p${m.phase})"` : ""} aria-label="${fmt(iso, { weekday: "long", month: "long", day: "numeric" })}">
      <span class="c-top"><span class="num">${dt.getDate()}</span>${iso === today ? `<span class="today-pill">Today</span>` : m ? `<span class="c-icon">${ICON[m.kind] || ""}</span>` : ""}</span>
      ${m ? `<span class="ev ev-main ${isDone(m) ? "done" : ""}">${esc(shortTitle(m.title))}${more(info.main)}</span>` : buffer ? `<span class="ev ev-buffer">Buffer</span>` : ""}
      ${s ? `<span class="ev ev-dsa ${isDone(s) ? "done" : ""}"><i class="dd ${s.diff || "T"}"></i>${esc(s.title)}</span>` : ""}
      <span class="marks">${m ? `<i class="mk" style="background:var(--p${m.phase})"></i>` : ""}${s ? `<i class="mk dd ${s.diff || "T"}"></i>` : ""}</span>
    </button>`;
  }

  function month(y, mo) {
    const first = new Date(y, mo, 1), days = new Date(y, mo + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // Monday-first
    const isos = Array.from({ length: days }, (_, i) => isoOf(new Date(y, mo, i + 1)));
    const live = isos.filter((d) => d >= today && d <= calEnd);
    const mains = live.flatMap((d) => dayInfo(d).main);
    const phases = [...new Set(mains.map((d) => d.phase))];
    const count = (k) => mains.filter((d) => d.kind === k).length;
    const problems = live.filter((d) => dayInfo(d).dsa.some((i) => i.slug)).length;
    const stat = (n, label) => n ? `<span><b>${n}</b> ${label}</span>` : "";
    return `<section class="month" id="m-${y}-${mo + 1}">
      <header class="month-head">
        <div><h2>${first.toLocaleDateString("en-US", { month: "long" })} <span>${y}</span></h2>
          <div class="month-phases">${phases.map((p) => `<span class="chip"><span class="dot" style="background:var(--p${p})"></span>${esc(phaseById[p].name)}</span>`).join("")}</div></div>
        <div class="month-stats">${stat(count("lesson"), "lessons")}${stat(count("project"), "projects")}${stat(count("review"), "reviews")}${stat(problems, "problems")}</div>
      </header>
      <div class="cal-grid">
        ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => `<div class="dow ${i > 4 ? "we" : ""}">${d}</div>`).join("")}
        ${'<div class="blank"></div>'.repeat(lead)}${isos.map(cell).join("")}
      </div>
    </section>`;
  }

  function panel(iso) {
    const info = dayInfo(iso);
    const state = iso === today ? ["today", "Today"] : iso < today ? ["past", "Past"] : ["proj", "Projected"];
    const mainHtml = info.main.map((d) => `
      <div class="pn-block" style="--pc:var(--p${d.phase})">
        <div class="pn-head"><span class="eyebrow">Main track</span>${kindChip(d.kind)}${phaseChip(d.phase)}</div>
        <h3>${esc(d.title)}</h3>
        <div class="pn-sub">${esc(main.weeks[d.week].title)} · day ${d.n} of ${main.days.length}${isDone(d) ? ` · <span class="ok">✓ done</span>` : ""}</div>
        ${d.learn ? `<p><b>Learn</b>${esc(d.learn)}</p>` : ""}${d.build ? `<p><b>Build</b>${esc(d.build)}</p>` : ""}
      </div>`).join("");
    const dsaHtml = info.dsa.map((i) => `
      <div class="pn-block">
        <div class="pn-head"><span class="eyebrow">DSA</span>${kindChip(i.kind)}</div>
        <h3>${i.url ? `<a href="${i.url}" target="_blank" rel="noopener">${esc(i.title)} ↗</a>` : esc(i.title)}</h3>
        <div class="pn-sub">${esc(dsa.blocks[i.block].name)} · ${esc(i.label)}${i.diff ? ` · <span class="diff ${i.diff}">${DIFF[i.diff]}</span>` : ""}${isDone(i) ? ` · <span class="ok">✓ done</span>` : ""}</div>
        ${i.note ? `<p>${esc(i.note)}</p>` : ""}
      </div>`).join("");
    const empty = !info.main.length && !info.dsa.length;
    const emptyMsg = iso > calEnd ? "After the finish line." : iso < today ? "Nothing logged this day." : "Buffer day — nothing scheduled. Catch up, revisit, or rest.";
    return `<button type="button" class="pn-close" data-close aria-label="Close">×</button>
      <div class="pn-date"><span class="eyebrow">${fmt(iso, { weekday: "long" })}</span>
        <div class="pn-big">${fmt(iso, { month: "long", day: "numeric" })}</div>
        <span class="pn-state ${state[0]}">${state[1]}</span></div>
      ${empty ? `<p class="muted pn-empty">${emptyMsg}</p>` : mainHtml + dsaHtml}
      ${empty ? "" : `<a class="btn primary pn-open" href="#day/${iso}">Open the full day plan →</a>`}`;
  }

  function journey() {
    const j0 = main.start, span = diffDays(calEnd, j0) + 1;
    const x = (iso) => Math.max(0, Math.min(100, 100 * diffDays(iso, j0) / span));
    const segs = main.phases.filter((p) => p.start).map((p) => {
      const days = main.days.filter((d) => d.phase === p.id);
      const doneTo = days.filter(isDone).map((d) => d.date).sort().pop();
      const w = x(addDays(p.end, 1)) - x(p.start);
      const fill = doneTo ? Math.min(100, 100 * (diffDays(doneTo, p.start) + 1) / (diffDays(p.end, p.start) + 1)) : 0;
      return `<div class="j-seg" style="left:${x(p.start)}%;width:${w}%;--pc:var(--p${p.id})" title="${esc(p.name)}: ${fmt(p.start)} – ${fmt(p.end)}"><span style="width:${fill}%"></span></div>`;
    }).join("");
    const months = [];
    for (let d = toDate(j0), first = true; isoOf(d) <= calEnd; d = new Date(d.getFullYear(), d.getMonth() + 1, 1), first = false) {
      const iso = isoOf(new Date(d.getFullYear(), d.getMonth(), 1));
      const target = iso < today.slice(0, 8) + "01" ? null : `m-${d.getFullYear()}-${d.getMonth() + 1}`;
      months.push(`<button type="button" class="j-month" style="left:${x(first ? j0 : iso)}%" ${target ? `data-jump="${target}"` : "disabled"}>${d.toLocaleDateString("en-US", { month: "short" })}</button>`);
    }
    return `<div class="journey">
      <div class="j-track">${segs}<div class="j-today" style="left:${x(today)}%"><b>You are here</b></div></div>
      <div class="j-months">${months.join("")}</div>
    </div>`;
  }

  function viewCalendar() {
    const start = toDate(today), end = toDate(calEnd);
    const months = [], nav = [];
    for (let y = start.getFullYear(), mo = start.getMonth(); y < end.getFullYear() || (y === end.getFullYear() && mo <= end.getMonth()); mo === 11 ? (y++, mo = 0) : mo++) {
      months.push(month(y, mo));
      nav.push(`<button type="button" data-jump="m-${y}-${mo + 1}">${new Date(y, mo, 1).toLocaleDateString("en-US", { month: "short" })}</button>`);
    }
    const left = diffDays(calEnd, today) + 1;
    const mLeft = main.days.filter((d) => !isDone(d)).length, dLeft = dsa.items.filter((d) => !isDone(d)).length;
    const legend = main.phases.filter((p) => p.end >= today).map((p) => `<span><i style="background:var(--p${p.id})"></i>${esc(p.name)} <em>${fmt(p.start < today ? today : p.start)} – ${fmt(p.end)}</em></span>`).join("");
    app.innerHTML = `
      <section class="cal-hero">
        <div class="cal-hero-text">
          <div class="eyebrow">${fmt(today, { month: "long", day: "numeric" })} → ${fmt(calEnd, { month: "long", day: "numeric", year: "numeric" })}</div>
          <h1>${left} days to go</h1>
          <p>${mLeft} main-track days and ${dLeft} DSA days — one of each, every day. The main track wraps up ${fmt(lastDate(main.days), { month: "long", day: "numeric" })}; the rest of April is buffer.</p>
        </div>
        <div class="hero-rings">
          ${ring(main.days.filter(isDone).length, main.days.length, "Main track", "var(--accent)")}
          ${ring(dsa.items.filter(isDone).length, dsa.items.length, "DSA", "var(--med)")}
        </div>
      </section>
      ${journey()}
      <div class="cal-legend">${legend}<span><i class="lg-buffer"></i>Buffer</span>
        <span class="lg-kinds"><span class="c-icon">${ICON.lesson}</span>Lesson <span class="c-icon k-project">${ICON.project}</span>Project <span class="c-icon k-review">${ICON.review}</span>Review</span>
        <span class="lg-diff"><i class="dd E"></i>Easy <i class="dd M"></i>Medium <i class="dd H"></i>Hard</span></div>
      <nav class="month-nav" aria-label="Months">${nav.join("")}</nav>
      <div class="cal-layout">
        <div class="cal-months">${months.join("")}</div>
        <aside class="cal-panel" id="cal-panel" aria-live="polite">${panel(selDate)}</aside>
      </div>
      <div class="sheet-backdrop" data-close></div>`;
  }

  function ring(done, total, label, color) {
    const r = 30, c = 2 * Math.PI * r, f = total ? done / total : 0;
    return `<div class="ring"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="${r}" class="ring-bg"/>
      <circle cx="36" cy="36" r="${r}" class="ring-fg" style="stroke:${color};stroke-dasharray:${(c * f).toFixed(1)} ${c.toFixed(1)}"/></svg>
      <div><b>${Math.round(100 * f)}%</b><span>${label}</span><small>${done} / ${total} days</small></div></div>`;
  }

  function selectDate(iso) {
    selDate = iso;
    document.querySelectorAll(".cell.sel").forEach((c) => c.classList.remove("sel"));
    document.querySelector(`.cell[data-date="${iso}"]`)?.classList.add("sel");
    const p = document.getElementById("cal-panel");
    p.innerHTML = panel(iso);
    p.scrollTop = 0;
    document.body.classList.add("sheet-open");
  }

  // ── DSA ─────────────────────────────────────────────────────────────
  let selBlock = curDsa ? curDsa.block : 0;

  function viewDsa() {
    const items = dsa.items;
    const probs = items.filter((i) => i.slug && i.attempt === 1);
    const byDiff = (d) => probs.filter((p) => p.diff === d);
    const done = items.filter(isDone).length;
    const blockStats = dsa.blocks.map((b) => { const its = b.items.map((id) => dsaById[id]); return { done: its.filter(isDone).length, total: its.length }; });

    const top = `<section class="dsa-top">
      <div class="card"><div class="eyebrow">Progress</div>
        <div style="font-size:26px;font-weight:700;margin:4px 0 2px">${done}<small class="muted" style="font-size:14px;font-weight:550"> / ${items.length} days</small></div>
        <div class="muted" style="font-size:13.5px">${probs.filter(isDone).length} of ${probs.length} unique problems solved · ${curDsa ? `today: <b>${esc(curDsa.title)}</b>` : "complete"}</div>
        <div class="diffbars">${["E", "M", "H"].map((d) => { const a = byDiff(d), s = a.filter(isDone).length; return `<div class="row ${d}"><span class="diff ${d}">${DIFF[d]}</span><div class="bar"><span style="width:${a.length ? 100 * s / a.length : 0}%"></span></div><span class="n">${s}/${a.length}</span></div>`; }).join("")}</div>
      </div>
      <div class="card"><div class="eyebrow">How a day ticks off</div>
        <p style="margin:6px 0 8px;font-size:14px">Commit the problem's notebook to <code>dsa/&lt;pattern&gt;/&lt;slug&gt;.ipynb</code>. Repeat attempts (timed / redo) use <code>&lt;slug&gt;--2.ipynb</code>, <code>--3</code>… Free-text days use the day id, e.g. <code>w12-sun.md</code>.</p>
        <p class="muted" style="margin:0;font-size:13.5px">Order follows your <code>dsa/SCHEDULE.md</code> — the NeetCode pattern progression with a timed problem every Saturday and a from-scratch redo every Sunday.</p>
      </div>
    </section>`;

    const maxRow = Math.max(...dsa.blocks.map((b) => b.pos[1]));
    const narrow = window.innerWidth < 640;
    const ROW = narrow ? 104 : 84, NODE_H = narrow ? 80 : 54;
    const height = (maxRow + 1) * ROW - (ROW - NODE_H);
    const cx = (b) => (b.pos[0] + 0.5) / 3 * 100;
    const nameIdx = Object.fromEntries(dsa.blocks.map((b, i) => [b.name, i]));
    const edges = dsa.blocks.flatMap((b) => b.after.map((a) => {
      const p = dsa.blocks[nameIdx[a]]; if (!p) return "";
      const x1 = cx(p), y1 = p.pos[1] * ROW + NODE_H, x2 = cx(b), y2 = b.pos[1] * ROW, my = (y1 + y2) / 2;
      const lit = blockStats[nameIdx[a]].done === blockStats[nameIdx[a]].total;
      return `<path class="${lit ? "lit" : ""}" d="M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}" />`;
    })).join("");
    const nodes = dsa.blocks.map((b, i) => {
      const s = blockStats[i];
      const cls = [s.done === s.total ? "complete" : "", curDsa && curDsa.block === i ? "active" : "", selBlock === i ? "sel" : ""].join(" ");
      return `<button type="button" class="node ${cls}" data-block="${i}" style="left:${cx(b)}%;top:${b.pos[1] * ROW}px;height:${NODE_H}px">
        <span class="ct">${s.done}/${s.total}</span><span class="nm">${esc(b.name)}</span><div class="bar"><span style="width:${100 * s.done / s.total}%"></span></div></button>`;
    }).join("");
    const graph = `<div class="section-title"><h2>Pattern roadmap</h2><span class="faint" style="font-size:12.5px">click a pattern to see its problems</span></div>
      <section class="card"><div class="graph" style="height:${height}px"><svg viewBox="0 0 100 ${height}" preserveAspectRatio="none" aria-hidden="true">${edges}</svg>${nodes}</div></section>`;

    const b = dsa.blocks[selBlock];
    const its = b.items.map((id) => dsaById[id]);
    let list = "";
    its.forEach((it, k) => {
      if (k % 7 === 0) {
        const wk = its.slice(k, k + 7), ds = wk.map((z) => z.date).sort();
        list += `<li class="wk">Week ${it.label.split("W")[1]} · ${fmt(ds[0])} – ${fmt(ds[ds.length - 1])}${wk.every((z) => z.projected) ? " (projected)" : ""}</li>`;
      }
      list += `<li class="${it.current ? "current" : ""}">${statusDot(it)}<a class="lbl" href="#day/${it.date}">${esc(it.label)}</a>
        <span class="ttl">${it.url ? `<a href="${it.url}" target="_blank" rel="noopener">${esc(it.title)}</a>` : esc(it.title)}${it.note ? ` <small>· ${esc(it.note)}</small>` : ""}${it.alt ? ` <small>· <a href="${it.alt}" target="_blank" rel="noopener">NeetCode</a></small>` : ""}${it.files.length ? ` <small>· ${it.files.map(ghLink).join(" ")}</small>` : ""}</span>
        ${kindChip(it.kind)}${it.diff ? `<span class="diff ${it.diff}">${it.diff}</span>` : "<span></span>"}</li>`;
    });
    const detail = `<div class="section-title" id="block-detail"><h2>${esc(b.name)}</h2><span class="faint" style="font-size:12.5px"><code>dsa/${esc(b.folder)}/</code></span></div>
      <section class="card"><ul class="plist">${list}</ul></section>`;

    app.innerHTML = `<section class="hello"><div><div class="eyebrow">1 hour a day · ${dsa.blocks.length} patterns</div><h1>DSA roadmap</h1>
      <p>Pattern by pattern, NeetCode-style. Today's problem is always the first one you haven't committed.</p></div></section>
      <div style="margin-top:20px">${top}</div>${graph}${detail}`;
  }

  // ── router & events ─────────────────────────────────────────────────
  const TITLES = { today: "Today", calendar: "Calendar", dsa: "DSA" };
  function route() {
    const [v, arg] = (location.hash.slice(1) || "today").split("/");
    document.body.classList.remove("sheet-open");
    const tab = v === "day" ? "calendar" : TITLES[v] ? v : "today";
    document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.view === tab));
    if (v === "day") return viewDay(arg);
    ({ today: viewToday, calendar: viewCalendar, dsa: viewDsa })[tab]();
    document.title = TITLES[tab] + " · AI Roadmap";
  }
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });

  document.addEventListener("click", (e) => {
    const copy = e.target.closest("[data-copy]");
    if (copy) {
      const done = () => { copy.textContent = "Copied"; setTimeout(() => (copy.textContent = "Copy"), 1200); };
      const text = copy.dataset.copy;
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
      else fallbackCopy(text, done);
      return;
    }
    const jump = e.target.closest("[data-jump]");
    if (jump) { document.getElementById(jump.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const day = e.target.closest("button[data-date]");
    if (day) {
      if (day.classList.contains("sel") && window.innerWidth > 1000) { location.hash = "day/" + day.dataset.date; return; }
      selectDate(day.dataset.date);
      return;
    }
    if (e.target.closest("[data-close]")) { document.body.classList.remove("sheet-open"); return; }
    const node = e.target.closest("[data-block]");
    if (node) {
      selBlock = Number(node.dataset.block);
      viewDsa();
      document.getElementById("block-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch { /* ignore */ }
    ta.remove();
  }
  document.addEventListener("change", (e) => {
    const ck = e.target.closest("[data-ck]");
    if (!ck) return;
    const key = ck.dataset.ck, saved = store.get(key) || [];
    saved[Number(ck.dataset.i)] = ck.checked;
    store.set(key, saved);
    ck.closest("li").classList.toggle("checked", ck.checked);
  });

  // theme toggle (remembers choice per browser)
  const rootEl = document.documentElement;
  const savedTheme = store.get("theme");
  if (savedTheme) rootEl.dataset.theme = savedTheme;
  document.querySelector(".theme-toggle").addEventListener("click", () => {
    const dark = rootEl.dataset.theme ? rootEl.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    rootEl.dataset.theme = dark ? "light" : "dark";
    store.set("theme", rootEl.dataset.theme);
  });

  document.getElementById("foot").innerHTML = `Built ${esc(R.generated.replace("T", " "))} from <code>plan/roadmap.yml</code>, <code>plan/dsa.yml</code> and git history${R.github ? ` · <a href="${esc(R.github.replace(/\/blob\/.*$/, ""))}" target="_blank" rel="noopener">GitHub repo</a>` : ""}.`;
  route();
})();
