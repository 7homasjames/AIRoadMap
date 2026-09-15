# AI Engineering Roadmap

**Timeline:** Sept 15, 2026 → Mar 31, 2027 (28 weeks)
**Goal:** Build strong first-principles foundations, become genuinely competent in ML/DL/LLM engineering, and complete a portfolio of progressively difficult systems.

Not "finish 379 topics." Target: become someone who understands the foundations of computing and AI deeply enough to build, evaluate, debug, and explain serious AI systems.

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

## How to use this repo

- **Daily work** goes into the numbered topic folder it belongs to (code, small experiments, worked problems).
- **Concept notes** use the template in [`notes/concept-template.md`](notes/concept-template.md) — one file per concept, first-principles style (why it exists, how it works, trade-offs, minimal implementation).
- **Projects** are the spine of the roadmap — see [`projects/README.md`](projects/README.md) for the ladder of 11 projects mapped to phases.
- **Progress** is tracked weekly in [`PROGRESS.md`](PROGRESS.md) using a 0–4 mastery scale per topic, updated every Sunday.

## Mastery scale

| Level | Meaning |
|---|---|
| 0 — Unfamiliar | Not studied yet |
| 1 — Familiar | Can define it |
| 2 — Working knowledge | Can use it |
| 3 — Deep understanding | Can explain, implement, and debug it |
| 4 — Advanced | Can optimize, critique, or extend it |

Target profile by March 2027: **Level 3** on core programming/math/ML/DL/transformers/backend/RAG/agents; **Level 2–3** on distributed systems/MLOps/cloud; **Level 1–2** on advanced CUDA/distributed training.

## Weekly review (every Sunday)

1. **Understanding** — What did I learn? Can I explain it without notes? Can I derive/implement the core idea?
2. **Engineering** — Did I write code? Test it? Debug something? Measure anything?
3. **Integration** — Where does this appear in a real AI system? How does it connect to what I already know?
4. **Evidence** — What did I commit? What experiment did I run? What can I demonstrate?
5. **Career relevance** — Can I discuss this in an interview? Use it in a project?

Log the answers in `PROGRESS.md`.
