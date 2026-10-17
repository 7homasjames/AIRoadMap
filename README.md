# AI Engineering Roadmap

A first-principles learning journey covering computer science, mathematics, machine learning, deep learning, transformers, LLMs, AI systems, and software engineering.

## Objective

Build the ability to understand, implement, evaluate, and deploy AI systems — not merely use frameworks or memorize concepts.

## Timeline

September 2026 → March 2027 (28 weeks)

## Learning Philosophy

For each important concept:

1. Understand why it exists.
2. Identify the problem it solves.
3. Learn how it works.
4. Understand its assumptions and trade-offs.
5. Implement a minimal version where practical.
6. Apply it to a real problem.
7. Explain it clearly without relying on memorization.

Not "finish 379 topics." Target: become someone who understands the foundations of computing and AI deeply enough to build, evaluate, debug, and explain serious AI systems.

## Roadmap website

**Live:** https://7homasjames.github.io/AIRoadMap/ — rebuilt automatically on every push to `main` (`.github/workflows/pages.yml`).

```bash
python site/build.py --open     # rebuild from the repo and open the site
python site/build.py --today    # or just print today's plan in the terminal
```

Three views: **Today** (the main-track day, the DSA problem with its LeetCode link, and the revisit queue), **Calendar** (every day from today to Apr 30, 2027 — click a day, then open its full time-boxed plan) and **DSA** (a NeetCode-style pattern roadmap).

- The plan lives in [`plan/roadmap.yml`](plan/roadmap.yml) (main track) and [`plan/dsa.yml`](plan/dsa.yml) (DSA). Edit those to change the plan.
- **A day ticks off when its evidence file is in the repo.** Each day lists its evidence, e.g. `01-programming/cpp/day8-*` or `dsa/01-arrays-hashing/two-sum.ipynb`. Review days look for a heading such as `Review 02` in `PROGRESS.md`.
- The schedule follows the order of the days, not fixed dates. Today is always the first unfinished day, so a missed day pushes the projected dates back without breaking the plan.

## Daily structure

Two parallel tracks, every day:

- **2 hours — main roadmap track.** Follows the phases below, sequenced through `notes/full-plan.md`.
- **1 hour — DSA track.** A fixed, problem-by-problem interview-prep schedule running independently Sep 16, 2026 → Mar 31, 2027, regardless of which phase the main track is in. See [`dsa/README.md`](dsa/README.md) and [`dsa/SCHEDULE.md`](dsa/SCHEDULE.md).

## Progress Levels

- [ ] Level 0 — Unfamiliar
- [ ] Level 1 — Can define and describe
- [ ] Level 2 — Can use in practice
- [ ] Level 3 — Can implement, explain, and debug
- [ ] Level 4 — Can optimize, critique, or extend

Target profile by March 2027: **Level 3** on core programming/math/ML/DL/transformers/backend/RAG/agents; **Level 2–3** on distributed systems/MLOps/cloud; **Level 1–2** on advanced CUDA/distributed training.

## Phases

| Phase | Dates | Objective | Folder(s) |
|---|---|---|---|
| 0. Setup & baseline | Sep 15–20 | Environment, repo, baseline assessment | — |
| 1. Programming + CS + Math | Sep 21–Oct 25 | Foundations beneath existing AI work | `01-programming`, `02-computer-science`, `03-mathematics` |
| 2. Classical ML + Scientific Python | Oct 26–Nov 22 | How learning algorithms work | `04-machine-learning` |
| 3. Deep Learning + PyTorch | Nov 23–Dec 20 | Implement and train neural networks | `05-deep-learning`, `06-computer-vision` |
| 4. Transformers + LLMs | Dec 21–Jan 31 | Understand modern LLMs from the inside | `07-transformers`, `08-llms` |
| 5. RAG + Agents + AI Backend | Feb 1–Feb 28 | Reliable, evaluated AI applications | `09-rag`, `10-agents`, `11-backend` |
| 6. Systems + Deployment + Specialization | Mar 1–Mar 31 | Engineering depth + portfolio | `12-distributed-systems`, `13-mlops`, `14-system-design` |

Full phase-by-phase topic breakdown lives in [`notes/full-plan.md`](notes/full-plan.md).

## Core Areas

- Programming and Computer Science
- Mathematics for AI/ML
- Classical Machine Learning
- Deep Learning
- Computer Vision
- Transformers and LLMs
- RAG and AI Agents
- Backend Engineering
- Distributed Systems
- MLOps and Cloud
- System Design
- Advanced AI Engineering

## Repository Structure

```text
ai-engineering-roadmap/
│
├── 01-programming/        (python, cpp, linux, git — DSA moved to top-level dsa/, see below)
├── 02-computer-science/   (operating-systems, networking, computer-architecture, distributed-systems)
├── 03-mathematics/        (linear-algebra, probability-statistics, calculus, optimization)
├── 04-machine-learning/
├── 05-deep-learning/
├── 06-computer-vision/
├── 07-transformers/
├── 08-llms/
├── 09-rag/
├── 10-agents/
├── 11-backend/
├── 12-distributed-systems/
├── 13-mlops/
├── 14-system-design/
│
├── dsa/          — the 1-hour daily LeetCode track, see dsa/README.md (independent schedule, own folder because it runs on its own cadence across the whole roadmap, not tied to a phase)
├── projects/     — the project ladder, see projects/README.md
├── notes/        — concept notes, full plan, setup checklists
└── experiments/  — small throwaway experiments that don't belong in a project or topic folder
```

Every important concept should eventually produce evidence: code, an experiment, a derivation, a diagram, a written explanation, or a project. This repository is a record of progression, not just a folder of notes.

## How to use this repo

- **Daily work** goes into the numbered/named topic folder it belongs to (code, small experiments, worked problems).
- **Concept notes** use the template in [`notes/concept-template.md`](notes/concept-template.md) — one file per concept, first-principles style.
- **Projects** are the spine of the roadmap — see [`projects/README.md`](projects/README.md) for the ladder of 11 projects mapped to phases.
- **Progress** is tracked weekly in [`PROGRESS.md`](PROGRESS.md), plus the running log below.

## Weekly review (every Sunday)

1. **Understanding** — What did I learn? Can I explain it without notes? Can I derive/implement the core idea?
2. **Engineering** — Did I write code? Test it? Debug something? Measure anything?
3. **Integration** — Where does this appear in a real AI system? How does it connect to what I already know?
4. **Evidence** — What did I commit? What experiment did I run? What can I demonstrate?
5. **Career relevance** — Can I discuss this in an interview? Use it in a project?

Log the detailed answers in `PROGRESS.md`.

## Progress Log

| Date | Topic | What I learned | Evidence |
|---|---|---|---|
| 2026-09-15 | Roadmap setup | Created learning system | Repository initialized |
