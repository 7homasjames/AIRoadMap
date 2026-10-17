"""
Build the roadmap website from the repo.

Reads plan/roadmap.yml (main track) and plan/dsa.yml (DSA track), checks which
days' evidence files exist in the repo, takes completion dates from git history,
projects dates for everything still ahead, and writes site/data.js. Open
site/index.html in a browser afterwards — no server needed.

Usage:
    python site/build.py            # rebuild data
    python site/build.py --open     # rebuild + open the site
    python site/build.py --today    # rebuild + print today's plan in the terminal
"""
import argparse
import datetime as dt
import fnmatch
import json
import re
import subprocess
import sys
import webbrowser
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


def git(*args):
    return subprocess.run(
        ["git", "-c", "core.quotepath=off", *args],
        cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout


def repo_state():
    """Tracked + untracked (non-ignored) files, and the date each file was first committed."""
    tracked = set(git("ls-files").splitlines())
    untracked = set(git("ls-files", "--others", "--exclude-standard").splitlines())
    added = {}
    date = None
    # newest first, so later lines overwrite with older dates → first-added date wins
    for line in git("log", "--diff-filter=A", "--name-only", "--format=@@%ad", "--date=short").splitlines():
        if line.startswith("@@"):
            date = line[2:]
        elif line:
            added[line] = date
    return tracked, untracked, added


def text_added_date(path, text):
    """Date of the oldest commit that introduced `text` into `path` (git pickaxe)."""
    out = git("log", "-S", text, "--format=%ad", "--date=short", "--", path).split()
    return out[-1] if out else None


class Evidence:
    def __init__(self):
        self.tracked, self.untracked, self.added = repo_state()
        self.files = sorted(f for f in self.tracked | self.untracked if not f.endswith(".gitkeep"))
        self.today = dt.date.today().isoformat()

    def check(self, patterns):
        """-> (status, date, matched_paths). status: done | uncommitted | todo"""
        if isinstance(patterns, str):
            patterns = [patterns]
        for pat in patterns:
            if "::" in pat:
                path, text = pat.split("::", 1)
                p = ROOT / path
                if p.is_file() and text in p.read_text(encoding="utf-8", errors="ignore"):
                    committed = path in self.tracked and text_added_date(path, text)
                    if committed:
                        return "done", committed, [path]
                    return "uncommitted", self.today, [path]
                continue
            hits = [f for f in self.files if fnmatch.fnmatchcase(f, pat)]
            if hits:
                dates = [self.added[f] for f in hits if f in self.added]
                if dates:
                    return "done", min(dates), hits
                return "uncommitted", self.today, hits
        return "todo", None, []


def project_dates(items, today):
    """Give every unfinished item a projected date: one item per day, starting today."""
    cursor = today
    for i in items:
        if i["status"] == "todo":
            i["date"] = cursor.isoformat()
            i["projected"] = True
            cursor += dt.timedelta(days=1)
        else:
            i["projected"] = False
    current = next((i for i in items if i["status"] == "todo"), None)
    if current:
        current["current"] = True
    return current


def build_main(ev, today):
    plan = yaml.safe_load((ROOT / "plan" / "roadmap.yml").read_text(encoding="utf-8"))
    days, weeks = [], []
    for wi, week in enumerate(plan["weeks"]):
        ids = []
        for d in week["days"]:
            status, date, hits = ev.check(d["evidence"])
            day = {
                "id": f"m{len(days) + 1:03d}",
                "n": len(days) + 1,
                "week": wi,
                "phase": week["phase"],
                "title": d["title"],
                "kind": d.get("kind", "lesson"),
                "learn": d.get("learn", ""),
                "build": d.get("build", ""),
                "evidence": d["evidence"] if isinstance(d["evidence"], list) else [d["evidence"]],
                "status": status,
                "date": date,
                "files": hits[:6],
                "steps": d.get("steps"),
            }
            days.append(day)
            ids.append(day["id"])
        weeks.append({"title": week["title"], "phase": week["phase"], "days": ids})
    project_dates(days, today)

    phases = []
    for ph in plan["phases"]:
        mine = [d for d in days if d["phase"] == ph["id"]]
        phases.append({
            "id": ph["id"],
            "name": ph["name"],
            "target": [str(t) for t in ph["target"]],
            "start": mine[0]["date"] if mine else None,
            "end": mine[-1]["date"] if mine else None,
            "done": sum(d["status"] != "todo" for d in mine),
            "total": len(mine),
        })
    return {"start": str(plan["start"]), "end": str(plan["end"]), "phases": phases, "weeks": weeks, "days": days}


def build_dsa(ev, today):
    plan = yaml.safe_load((ROOT / "plan" / "dsa.yml").read_text(encoding="utf-8"))
    seen, items, blocks = {}, [], []
    week_no = 0
    for bi, block in enumerate(plan["blocks"]):
        ids = []
        for week in block["weeks"]:
            week_no += 1
            for di, e in enumerate(week):
                day_label = f"{WEEKDAYS[di].title()} W{week_no}"
                day_id = f"w{week_no}-{WEEKDAYS[di]}"
                item = {
                    "id": day_id,
                    "label": day_label,
                    "block": bi,
                    "kind": e.get("kind", "new"),
                    "note": e.get("note", ""),
                }
                if "slug" in e:
                    seen[e["slug"]] = seen.get(e["slug"], 0) + 1
                    stem = e["slug"] if seen[e["slug"]] == 1 else f"{e['slug']}--{seen[e['slug']]}"
                    pattern = f"dsa/*/{stem}.*"
                    item.update({
                        "title": e["p"],
                        "slug": e["slug"],
                        "diff": e.get("d", ""),
                        "url": f"https://leetcode.com/problems/{e['slug']}/",
                        "alt": f"https://neetcode.io/problems/{e['alt']}" if e.get("alt") else None,
                        "attempt": seen[e["slug"]],
                        "stem": stem,
                        "expected": f"dsa/{block['folder']}/{stem}.ipynb",
                    })
                else:
                    pattern = f"dsa/{block['folder']}/{day_id}*"
                    item.update({"title": e["task"], "task": True, "expected": f"dsa/{block['folder']}/{day_id}.md"})
                item["status"], item["date"], hits = ev.check(pattern)
                item["files"] = hits[:3]
                items.append(item)
                ids.append(day_id)
        blocks.append({
            "name": block["name"],
            "folder": block["folder"],
            "pos": block.get("pos", [1, bi]),
            "after": block.get("after", []),
            "items": ids,
        })
    project_dates(items, today)
    return {"blocks": blocks, "items": items, "revisits": parse_revisits()}


def parse_revisits():
    """Open rows from the '## Revisit queue' table in dsa/TRACKER.md."""
    path = ROOT / "dsa" / "TRACKER.md"
    if not path.exists():
        return []
    m = re.search(r"^## Revisit queue\s*$(.*?)(?=^## |\Z)", path.read_text(encoding="utf-8"), re.M | re.S)
    if not m:
        return []
    rows = []
    for line in m.group(1).splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not line.strip().startswith("|") or len(cells) < 4 or cells[0] in ("Problem", "") or set(cells[0]) <= {"-", " "}:
            continue
        if cells[3]:  # Done? column filled in
            continue
        rows.append({"problem": cells[0], "flagged": cells[1], "due": cells[2]})
    return rows


def github_base():
    try:
        url = git("remote", "get-url", "origin").strip()
    except subprocess.CalledProcessError:
        return None
    url = re.sub(r"^git@github\.com:", "https://github.com/", url)
    url = re.sub(r"\.git$", "", url)
    branch = git("rev-parse", "--abbrev-ref", "HEAD").strip() or "main"
    return f"{url}/blob/{branch}/" if "github.com" in url else None


def recent_commits(n=8):
    out = git("log", f"-{n}", "--format=%ad%x09%s", "--date=short")
    return [dict(zip(("date", "subject"), line.split("\t", 1))) for line in out.splitlines() if "\t" in line]


def print_today(data):
    main = next((d for d in data["main"]["days"] if d.get("current")), None)
    dsa = next((i for i in data["dsa"]["items"] if i.get("current")), None)
    print(f"\n  Today — {data['today']}\n")
    if main:
        print(f"  MAIN (2h) · Day {main['n']}/{len(data['main']['days'])} · {main['title']}")
        print(f"    Learn: {main['learn']}")
        print(f"    Build: {main['build']}")
        print(f"    Done when this exists: {', '.join(main['evidence'])}")
    if dsa:
        print(f"\n  DSA (1h) · {dsa['label']} · {dsa['title']}" + (f" [{dsa['diff']}]" if dsa.get("diff") else ""))
        if dsa.get("url"):
            print(f"    {dsa['url']}")
        print(f"    Done when this exists: {dsa['expected']}")
    for r in data["dsa"]["revisits"]:
        print(f"\n  Revisit: {r['problem']} (due {r['due']})")
    print()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--open", action="store_true", help="open the site in your browser after building")
    ap.add_argument("--today", action="store_true", help="print today's plan in the terminal")
    args = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")

    today = dt.date.today()
    ev = Evidence()
    data = {
        "generated": dt.datetime.now().isoformat(timespec="minutes"),
        "today": today.isoformat(),
        "github": github_base(),
        "root": ROOT.as_posix(),
        "main": build_main(ev, today),
        "dsa": build_dsa(ev, today),
        "commits": recent_commits(),
    }
    (SITE / "data.js").write_text("window.ROADMAP = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")

    m = data["main"]["days"]
    d = data["dsa"]["items"]
    print(f"Built site/data.js — main {sum(x['status'] != 'todo' for x in m)}/{len(m)} days, "
          f"DSA {sum(x['status'] != 'todo' for x in d)}/{len(d)} days, finish projected {m[-1]['date']}")
    if args.today:
        print_today(data)
    if args.open:
        webbrowser.open((SITE / "index.html").as_uri())


if __name__ == "__main__":
    sys.exit(main())
