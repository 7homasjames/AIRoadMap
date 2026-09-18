"""
Generate a DSA daily notebook: problem statement + scaffolded cells for
constraints/edge cases, approach, solution, and tests, following the
1-hour structure in dsa/README.md.

Usage:
    python dsa/make_notebook.py \
        --pattern-folder 01-arrays-hashing \
        --slug valid-anagram \
        --title "Valid Anagram" \
        --day "Day 1 (re-anchored)" \
        --date 2026-09-18 \
        --statement "Given two strings s and t, return true if t is an anagram of s." \
        --constraints "1 <= s.length, t.length <= 5*10^4; lowercase English letters only" \
        --examples "s='anagram', t='nagaram' -> true|s='rat', t='car' -> false"
"""
import argparse
import os

import nbformat as nbf


def build_notebook(title, day, date, statement, constraints, examples, pattern):
    nb = nbf.v4.new_notebook()
    cells = []

    cells.append(nbf.v4.new_markdown_cell(f"""# {title}

**Day:** {day}
**Date:** {date}
**Pattern:** {pattern}

## Problem

{statement}

## Constraints

{constraints}

## Examples

{examples}
"""))

    cells.append(nbf.v4.new_markdown_cell("""## Step 1 (0:00-0:05): Read twice. Write constraints + edge cases.

Type your own restatement of the constraints and the edge cases you need to handle
(empty input, single element, duplicates, negatives, etc.) in the cell below —
in your own words, before touching code."""))
    cells.append(nbf.v4.new_markdown_cell("_Your constraints & edge cases here._"))

    cells.append(nbf.v4.new_markdown_cell("""## Step 2 (0:05-0:15): Approach — no coding yet.

Describe your approach in plain English or pseudocode. What's the brute force?
Is there a better one? What's the time/space complexity of each?"""))
    cells.append(nbf.v4.new_markdown_cell("_Your approach here._"))

    cells.append(nbf.v4.new_markdown_cell("## Step 3 (0:15-0:45): Code it."))
    cells.append(nbf.v4.new_code_cell(f'''def solution(*args, **kwargs):
    """
    LeetCode: {title}
    Pattern: {pattern}
    Date: {date}
    Solved unaided:
    Time complexity: O(?)
    Space complexity: O(?)
    """
    # your code here
    pass
'''))

    cells.append(nbf.v4.new_markdown_cell("""## Step 4 (0:45-0:55): Test with edge cases.

Add test cases below: the given examples, plus empty input, single element,
duplicates, negatives (whichever apply to this problem). Fix bugs here."""))
    cells.append(nbf.v4.new_code_cell("""# test cases
# assert solution(...) == ...
"""))

    cells.append(nbf.v4.new_markdown_cell("""## Step 5 (0:55-1:00): Review.

- Solved unaided? Y/N
- Did you peek at the optimal approach? Y/N — if yes, note the trick below and
  mark this problem for a revisit in 4 days in `dsa/TRACKER.md`.
- Final time/space complexity:
- Update `dsa/TRACKER.md` with this attempt."""))
    cells.append(nbf.v4.new_markdown_cell("_Notes / trick to remember here._"))

    nb["cells"] = cells
    return nb


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--pattern-folder", required=True)
    p.add_argument("--slug", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--day", required=True)
    p.add_argument("--date", required=True)
    p.add_argument("--statement", required=True)
    p.add_argument("--constraints", required=True)
    p.add_argument("--examples", required=True)
    args = p.parse_args()

    pattern_name = args.pattern_folder.split("-", 1)[1].replace("-", " ").title()
    nb = build_notebook(
        args.title, args.day, args.date, args.statement,
        args.constraints, args.examples.replace("|", "\n\n"), pattern_name,
    )

    out_dir = os.path.join(os.path.dirname(__file__), args.pattern_folder)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{args.slug}.ipynb")
    with open(out_path, "w", encoding="utf-8") as f:
        nbf.write(nb, f)
    print(f"Created {out_path}")
