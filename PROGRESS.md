# Progress Log

Updated weekly, every Sunday. Newest entry on top.

---

## Baseline — 2026-09-15 / 2026-09-16

**Phase:** 0 — Setup & Baseline

### Topics touched
- Repo structure, README, concept template, environment audit, baseline self-assessment — see `notes/day1-setup-checklist.md` for full table

### Understanding
- Confirmed strongest existing area is Python (Level 3). Professional-exposure areas (RAG, agents, backend/FastAPI, MongoDB) sit at Level 2 — practical fluency without verified foundational depth.
- Biggest gaps relative to AI researcher/engineer target: math (linear algebra/probability/calculus — Level 1, rusty), deep learning/transformer internals (Level 0–1), MLOps/cloud/distributed systems/CUDA (Level 0–1).

### Engineering
- Scaffolded full repo structure (14 phase folders + subfolders, projects/, notes/, experiments/) and pushed to GitHub.
- Probed dev environment directly (not self-reported): Python 3.11.9 global install, g++ present, no MSVC, Git/VS Code/Docker present, WSL2 present but no real distro, PyTorch/pandas/Jupyter missing, NVIDIA RTX 5060 (8GB) confirmed CUDA-capable.

### Integration
- Environment gaps (no venv, no PyTorch) block Phase 3 (PyTorch) but not Phase 1 (programming/CS/math) — sequencing still works if these are fixed by Day 2 as planned.

### Evidence
- GitHub repo: `7homasjames/AIRoadMap`, initial commit + Phase 0 scaffold commit pushed to `main`.

### Career relevance
- N/A yet — Phase 0 is setup only.

### Next week's starting point
- Day 2: venv setup, install pandas/jupyter/PyTorch (CUDA build), verify GPU training end-to-end, then begin Phase 1 Day 1 topic.

---

## Day 2 — 2026-09-16/17

**Phase:** 0 — Setup & Baseline

### Topics touched
- Environment verification: venv, pandas, Jupyter, PyTorch (CUDA)

### Engineering
- Created project-local `.venv`, added `.gitignore` and `requirements.txt`
- Installed pandas 3.0.5, Jupyter (ipykernel/ipywidgets), and PyTorch 2.11.0+cu128 (CUDA 12.8 build, required for RTX 5060 Blackwell GPU support)
- Verified `torch.cuda.is_available()` → `True`, device: NVIDIA GeForce RTX 5060 Laptop GPU
- Ran end-to-end GPU training loop (`notes/day2-gpu-check.py`) — 200 SGD steps on a linear model, converged (loss 0.01), 0.155s on GPU
- Pinned VS Code Python interpreter to `.venv` via `.vscode/settings.json`

### Evidence
- `notes/day2-gpu-check.py`, updated `notes/day1-setup-checklist.md` with completed Day 2 checklist

### Next starting point
- Phase 0 exit criteria fully met. Pick Phase 1 Day 1 topic (see `notes/full-plan.md` — Python/C++/DSA/Git/Linux track or a math block) and begin.

---

## Week of {{YYYY-MM-DD}}

**Phase:** {{phase name}}

### Topics touched
- {{topic}} — mastery: {{0-4}}

### Understanding
-

### Engineering
-

### Integration
-

### Evidence (commits / experiments / demos)
-

### Career relevance
-

### Next week's starting point
-

---
