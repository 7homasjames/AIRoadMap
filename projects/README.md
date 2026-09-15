# Project Ladder

Projects are the spine of the roadmap, not an afterthought. Each one proves a specific layer of competence. Create a subfolder per project as you start it (e.g. `projects/02-ml-from-scratch/`).

| # | Project | Proves | Target phase |
|---|---|---|---|
| 1 | Algorithms / data structures implementations | Programming fundamentals | Phase 1 |
| 2 | ML from scratch (linear regression via matrix ops, gradient descent + visualization) | Mathematics + classical ML | Phase 1–2 |
| 3 | End-to-end ML API (raw data → deployed FastAPI endpoint) | ML engineering | Phase 2 |
| 4 | Neural network from scratch (NumPy: forward, loss, backprop, GD) | Backpropagation + optimization | Phase 3 |
| 5 | PyTorch project (custom training loop, validation, checkpointing) | Deep learning | Phase 3 |
| 6 | Tiny Transformer (decoder-only, from scratch, trained on small dataset) | Modern architecture understanding — **highest-leverage project in the roadmap** | Phase 4 |
| 7 | Fine-tuning / evaluation project (LoRA/QLoRA, baseline vs after) | LLM training adaptation | Phase 4 |
| 8 | Evaluated RAG system (retrieval eval, faithfulness, cost/latency) | Retrieval + evaluation | Phase 5 |
| 9 | Reliable agent system (state, tool schemas, retries, human-in-loop, tracing) | AI orchestration + backend | Phase 5 |
| 10 | Deployed AI system (Docker → monitoring → scaling) | Production engineering | Phase 6 |
| 11 | Advanced systems project (CUDA/perf/distributed, optional specialization) | Performance / distributed systems | Phase 6 |

Some of these can be combined into larger coherent projects rather than kept as 11 separate repos — judgment call as you go.

## Standard for each project

Not "I built X." Instead: **I had a problem, established a baseline, changed something, measured the effect, and understood the trade-offs.**

Each project folder should include a README answering:
- What problem does this solve, and why this approach?
- What's the baseline, and how did it improve?
- What are the failure modes / limitations?
- What would I change with more time?
