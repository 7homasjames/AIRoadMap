# Day 1 Setup Checklist (Sep 15–20)

Goal for this window: environment ready, repo structure in place, baseline assessed. Not "start topic 1."

## Environment audit (2026-09-15)

Probed directly on-machine rather than self-reported.

| Item | Status |
|---|---|
| OS | Windows 11 Pro, Git Bash/MSYS2 + WSL2 present |
| Python | 3.11.9 — **global install, no venv** |
| C++ compiler | g++ 16.1.0 (MinGW-W64) — no MSVC `cl.exe` |
| Git | 2.53.0, configured |
| VS Code | Installed |
| GitHub repo | `7homasjames/AIRoadMap`, pushed |
| WSL/Linux | WSL2 present, no real distro (only Docker Desktop's internal one) — **skipping for now per decision below** |
| Docker | 29.1.3, running |
| PyTorch | **Not installed** |
| NumPy / Matplotlib | Installed (2.4.6 / 3.11.0) |
| Pandas | **Not installed** |
| Jupyter | **Not installed** |
| GPU | NVIDIA RTX 5060 Laptop, 8GB VRAM, driver 595.95 — CUDA-capable |
| CUDA toolkit (nvcc) | Not on PATH — not needed yet, PyTorch ships its own CUDA runtime |

**Decision (2026-09-15):** WSL Ubuntu install deferred until the Linux-fundamentals topic comes up in Phase 1 — Git Bash/MSYS2 is sufficient for now.

## Day 2 action items (environment verification) — completed 2026-09-16/17

- [x] Create a project-local virtualenv (`.venv/`, gitignored)
- [x] Install `pandas` (3.0.5), `jupyter` into the venv
- [x] Install PyTorch with CUDA 12.8 build (`torch 2.11.0+cu128`, matches RTX 5060 + driver 595.95)
- [x] Verify: `torch.cuda.is_available()` returns `True` — confirmed, device: NVIDIA GeForce RTX 5060 Laptop GPU
- [x] Run a toy training loop end-to-end to confirm GPU training works — see `notes/day2-gpu-check.py` (200 SGD steps, converged, 0.155s on GPU)
- [x] VS Code interpreter pinned to `.venv` via `.vscode/settings.json`

Environment is fully verified and ready for Phase 1.

## Repo
- [x] `ai-engineering-roadmap` folder structure created
- [x] `README.md`, `PROGRESS.md`, `projects/README.md`, `notes/concept-template.md`, `notes/full-plan.md`
- [ ] Push to GitHub (remote repo created + pushed)

## Baseline assessment (recorded 2026-09-16)

| Area | Level (0–4) | Notes |
|---|---|---|
| Python fundamentals | **3 — Deep understanding** | Comfortable with async/concurrency, testing, profiling; can explain trade-offs |
| C++ fundamentals | 1–2 | Some background, rusty, not a cold start |
| Data structures & algorithms | 1–2 | Some background, rusty |
| Linux / shell | 1–2 | Some background |
| SQL | 1–2 | Some background |
| MongoDB (data modeling/indexing/txns) | 2 | Practical experience, depth on internals not assessed |
| Linear algebra | 1 | Familiar but rusty |
| Probability & statistics | 1 | Familiar but rusty |
| Calculus / optimization | 1 | Familiar but rusty |
| Classical ML | 1–2 | Project experience, math depth not yet assessed |
| Deep learning / PyTorch | 0–1 | Some exposure, backprop/PyTorch internals not assessed |
| Transformers internals | 0–1 | Strong application exposure to LLMs, but internals/math not assessed |
| LLM fine-tuning (LoRA/QLoRA) | 0–1 | Needs assessment |
| RAG systems | 2 | Practical experience; retrieval theory/evaluation/failure analysis not assessed |
| Agent orchestration (LangGraph) | 2 | Practical experience; reliability/eval depth not assessed |
| Backend (FastAPI/Docker) | 2 | Practical experience; HTTP/async/API-design foundations not assessed |
| Distributed systems | 0–1 | Needs assessment |
| MLOps | 0–1 | Needs assessment |
| Cloud / Kubernetes | 0–1 | Needs assessment |
| CUDA / GPU programming | 0 | Needs assessment; GPU hardware available (RTX 5060, 8GB) |

**Read:** existing professional exposure (Python, RAG, agents, backend, MongoDB) sits at working-knowledge level (2) — used in practice but foundational depth (why it works, internals, failure modes) is unverified and is exactly what Phase 1 and later phases should close. Math and DL/transformer internals are the biggest gaps relative to the "AI researcher" target and deserve full attention rather than review-speed treatment.

Recorded in `PROGRESS.md` under the Baseline week entry.

## Exit criteria for Phase 0

- [x] Environment fully working (can run a PyTorch training loop end-to-end on a toy example)
- [x] Repo pushed to GitHub
- [x] Baseline ratings recorded
- [ ] Phase 1 Day 1 topic picked (see `notes/full-plan.md`)
