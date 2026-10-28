# DSA Tracker

Log every attempt here. This is what turns 200 problems seen into 200 problems you can actually solve — without it, the schedule alone doesn't work.

Fill in one row per attempt (Sunday redos and Saturday timed-redos get their own row too, linked back to the original).

**Current anchor: restarted clean 2026-10-05.** Mon W1 = Oct 5. Everything below "Attempt history (pre-restart)" is the fresh run — treat `dsa/SCHEDULE.md`'s day labels (Mon W1, Tue W1, ...) as relative to Oct 5, not the original Sep 16 date printed in that file.

## Attempts (post-restart, from 2026-10-05)

| Date | Day | Problem | Pattern | Solved Unaided (Y/N) | Time Taken | Peeked at Solution (Y/N) | Revisit Date | Notes / Trick |
|---|---|---|---|---|---|---|---|---|
| 2026-10-08 | Day 1 (Mon W1) | Contains Duplicate | Arrays & Hashing | N (user had the set idea; assistant explained approach and filled notebook at user's request) | — | Y | 2026-10-12 | Hash set for "seen before?": O(1) membership. Check before add, so you can return early. One-liner: `len(set(nums)) < len(nums)`. O(n) time / O(n) space. |
| 2026-10-27 | Revisit | Contains Duplicate | Arrays & Hashing | Self-reported Y (not saved to repo) | — | — | — | Revisit from the 2026-10-08 attempt. |
| 2026-10-27 | Wed W1 | Two Sum | Arrays & Hashing | N (notebook written by assistant at user's request) | — | Y | 2026-10-31 | Hash map value → index. For each x, check whether `target - x` is already in the map *before* storing x. That handles the same-element case. O(n) time / O(n) space. |
| 2026-10-27 | Thu W1 | Group Anagrams | Arrays & Hashing | Y (brute force, own code) | — | N | 2026-10-31 | Correct but O(n^2 * k log k): about 200 s at n = 10^4, so TLE. Redo with the sorted word as a dict key, one pass. |
| 2026-10-28 | Fri W1 | Top K Frequent Elements | Arrays & Hashing | Y (own code) | — | N | — | Frequency dict, then `sorted(freq, key=freq.get, reverse=True)[:k]`. O(n + m log m). The follow-up wants O(n): bucket sort by count. |

## Weakest patterns (update as you go)

Running list of patterns that keep needing revisits — pull from here for catch-up days and the Weeks 27–28 mock-interview pool.

- Arrays & Hashing (from pre-restart attempts): Contains Duplicate and Valid Anagram were both not solved unaided — pay extra attention to this pattern once the restart reaches Weeks 1–2 on Oct 5.

## Revisit queue

Problems flagged "revisit in 4 days" — check this before starting each day's new problem. Empty on restart; old entries below moved to history since the streak reset made their revisit dates moot.

| Problem | Flagged on | Revisit by | Done? |
|---|---|---|---|
| Contains Duplicate | 2026-10-08 | 2026-10-26 | 2026-10-27 (self-reported) |
| Two Sum | 2026-10-27 | 2026-10-31 | |
| Group Anagrams (optimal version) | 2026-10-27 | 2026-10-31 | |

## Attempt history (pre-restart, abandoned 2026-09-22)

Kept for reference — these are still useful data on what didn't stick (Arrays & Hashing frequency-counting pattern), even though the streak reset.

| Date | Day | Problem | Pattern | Solved Unaided (Y/N) | Time Taken | Peeked at Solution (Y/N) | Revisit Date | Notes / Trick |
|---|---|---|---|---|---|---|---|---|
| 2026-09-16 | Mon W1 | Contains Duplicate | Arrays & Hashing | SKIPPED | — | — | catch-up | Never attempted before streak reset |
| 2026-09-18 | Day 1 (re-anchored) | Valid Anagram | Arrays & Hashing | N (assistant-provided) | — | Y | 2026-09-22 | O(1) length-mismatch rejection; fixed 26-slot counter array gives O(1) space instead of O(n) hash map for bounded alphabets. Never redone unaided before streak reset. |
