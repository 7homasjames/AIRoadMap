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

## Phase 1, Day 1 — 2026-09-21

**Phase:** 1 — Programming + CS + Math

### Topics touched
- Linear algebra: vectors, matrices, matrix multiplication (dot product, matrix-vector, matrix-matrix) — mastery: 2 (working knowledge), targeting 3 after self-explanation + more practice

### Why this topic first
- Baseline showed math (Level 1, rusty) as the biggest gap relative to Python/RAG/agents/backend (Level 2-3). Linear algebra directly underlies ML → DL → transformers, so it's the highest-leverage place to start Phase 1 rather than reviewing already-strong Python.

### Understanding
- Matrix multiplication is a compact notation for repeated weighted sums (linear combinations) — not a separate concept from dot products, but dot-products-of-rows-and-columns applied systematically.
- Non-commutativity (AB ≠ BA) verified concretely, not just stated.
- Connected directly to neural networks: a dense layer is literally `y = Wx + b`; why nonlinear activations are required (stacked linear layers collapse to one linear layer: `W2(W1x) = (W2W1)x`).

### Engineering
- Implemented `dot`, `matvec`, `matmul` from scratch in pure Python (no NumPy), verified all three against `numpy` with `np.allclose`.
- Demonstrated non-commutativity with a concrete PQ vs QP example.
- Implemented a neural-net-shaped `Wx + b` layer computation and verified against NumPy.

### Evidence
- `03-mathematics/linear-algebra/01-vectors-matrices.md` (concept note, first-principles format)
- `03-mathematics/linear-algebra/vectors_matrices.py` (implementation, all checks pass)

### Integration
- This is the direct prerequisite for Project 2 (linear regression via matrix ops), planned for later this week.

### Next starting point
- Fill in section 10 ("My explanation") of the concept note in own words.
- Continue linear algebra block: linear transformations, eigenvalues/eigenvectors, SVD — or interleave with a C++/DSA diagnostic given baseline uncertainty there.

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
