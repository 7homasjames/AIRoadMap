# Progress Log

Updated weekly, every Sunday. Newest entry on top.

---

## Day 9 — RAII & smart pointers — 2026-10-28

**Phase:** 1 — Programming + CS + Math

### Topics touched
- Resources and ownership, pointer lifetime vs pointee lifetime, RAII, `std::unique_ptr` (exclusive, move-only), `std::shared_ptr` (shared, destroyed when the last owner lets go), when raw pointers are still fine (non-owning access).

### Engineering
- `stack_vs_heap.cpp`: added `heapExampleUniquePtr()`, the Day 1 leak rewritten with `make_unique`. `Traced(4)` is now destroyed with no `delete` written, while the original leak (`Traced(3)`) is kept for comparison.
- `day9.cpp`: runs the lesson's experiments. With a `unique_ptr`, the object is destroyed at the end of its block, or at the end of the function once the braces are removed. A raw pointer without `delete` leaks, and with `delete` the object is destroyed exactly there. On an early return the raw pointer leaks while the `unique_ptr` still cleans up. It also shows the `shared_ptr` owner count going 1 → 2 → 1 → destroyed, and `std::move` leaving the source `unique_ptr` empty.
- Both compile cleanly with `-Wall -Wextra -pedantic`. The solutions were written by Claude at my request.

### Evidence
- `01-programming/cpp/day9-lesson-raii-smart-pointers.md`, `01-programming/cpp/day9.cpp`, `01-programming/cpp/stack_vs_heap.cpp`

### Next starting point
- Day 10: copy vs move semantics. A class owning a heap buffer, with a deep-copy and a move constructor.

---

## Day 8 — Structs, classes, constructors & destructors — 2026-10-27

**Phase:** 1 — Programming + CS + Math

### Topics touched
- `struct` vs `class` (only the default access differs), encapsulation, invariants, constructors with initializer lists and validation, destructors and object lifetime.

### Engineering
- `01-programming/cpp/day8.cpp`: a `BankAccount` with private balance, a validating constructor, `deposit`/`withdraw` that enforce the rules, a `const` getter and a tracing destructor. It shows destruction at the end of a block, reverse destruction order for two objects, a heap object destroyed at `delete`, and a failed construction where no destructor runs. Compiles cleanly with `-Wall -Wextra -pedantic`. The solution was written by Claude at my request.

### Evidence
- `01-programming/cpp/day8-lesson-structs-classes.md`, `01-programming/cpp/day8.cpp`

### Next starting point
- Day 9: RAII and smart pointers. Rewrite the `stack_vs_heap.cpp` leak with `unique_ptr`.

---

## Review 01 — C++ foundations — 2026-10-27

**Phase:** 1 — Programming + CS + Math (plan restarted 2026-10-26, see `plan/roadmap.yml`)

> Note: I told Claude I'd done today's review and DSA work, but none of it had been saved to the repo. At my request, Claude wrote the section 10 explanations, this entry and the Two Sum notebook. Treat it as reference material, not as proof of recall. Redo the recall properly at the next review day.

### Recall targets (Days 1–7)
- **Stack vs heap:** the stack is automatic and tied to scope. Heap memory from `new` lasts until `delete`, so a missing `delete` leaks and a double `delete` or use-after-free is undefined behaviour.
- **Dangling pointers:** returning the address of a local gives you a pointer into a stack frame that's already been popped.
- **Vector growth:** when capacity runs out, the vector reallocates (typically doubling) and copies. Total copies stay at O(n), so `push_back` is amortised O(1).
- **Big-O:** linear search O(n), binary search O(log n) but needs sorted input, bubble sort O(n²).

### Concept notes completed (section 10)
- `01-programming/cpp/01-compilation-and-memory.md`
- `03-mathematics/linear-algebra/01-vectors-matrices.md`
- `03-mathematics/linear-algebra/02-linear-transformations.md`

### DSA
- Contains Duplicate revisit, self-reported done.
- Two Sum (Wed W1): notebook written by Claude at my request. It's in the revisit queue to redo unaided by 2026-10-31.

### Levels
- Unchanged until I can do the recall unaided. C++ memory model: 2. Linear algebra (matmul, transformations): 2.

### Next starting point
- Day 8: structs, classes, constructors & destructors (BankAccount class).

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

## Phase 1 sequencing decision — 2026-09-22

Reviewed the Programming/CS priority 1 list (Python, C++, OOP, DSA, Git, Linux/Bash, debugging, testing, memory management, processes/threads, concurrency, networking, databases, SQL, MongoDB modeling) against progress so far — only linear algebra (math) had been touched; programming/CS hadn't started. Decision: **pause linear algebra after linear transformations (eigenvectors/SVD/Project 2 deferred) and switch to Programming/CS priority 1 for the rest of Phase 1**, rather than finishing math first.

Noted: "data structures & algorithms" in this list overlaps with the DSA track (1hr/day, LeetCode-based, restarting 2026-10-05) — not duplicated in the main track. Remaining genuine gaps to prioritize: C++, OOP, Linux/Bash, SQL (Level 1-2, rusty); Python/Git skipped (Level 3, already strong); networking/databases/concurrency/testing/debugging/memory management get first-principles depth even though there's practical exposure via FastAPI/MongoDB (Level 2).

Starting with **C++** first — biggest genuine gap, and foundational for later CUDA/systems work.

## Phase 1, Day 3 — 2026-09-22: C++ compilation model, stack vs heap

**Phase:** 1 — Programming + CS + Math (switched track: Programming/CS priority 1)

### Topics touched
- C++: compilation pipeline (preprocess/compile/link), stack vs heap memory, manual memory management (`new`/`delete`), memory leaks — mastery: 2, targeting 3

### Understanding
- Compilation trades a one-time build cost for fast runtime execution — the core reason C++ (not Python) is used for performance-critical ML infra, and directly relevant to CUDA later.
- Stack: automatic, scope-tied lifetime, zero manual cleanup, but limited size/lifetime. Heap: explicit `new`/`delete`, flexible lifetime, but every allocation is the programmer's responsibility — this is the structural reason C++ has a whole class of bugs (leaks, double-free, use-after-free) that Python's GC makes impossible (at a runtime cost).
- This directly sets up `cudaMalloc`/`cudaFree` in Phase 6 — same pattern, different device.

### Engineering
- Implemented and compiled `stack_vs_heap.cpp` (g++ 16.1.0, MinGW-W64) with a traced struct showing constructor/destructor calls: stack variable destroyed automatically, heap variable destroyed correctly after `delete`, and a deliberate leak where the destructor message never fires — makes the leak directly observable in program output.
- Attempted AddressSanitizer (`-fsanitize=address`) to catch the leak programmatically — not available in this MinGW-w64 toolchain (missing `libasan`), noted as a known limitation in the file; the printed trace serves the same demonstration purpose without it.

### Evidence
- `01-programming/cpp/01-compilation-and-memory.md`, `01-programming/cpp/stack_vs_heap.cpp`

### Next starting point
- Fill in section 10 (own-words explanation) for this note plus the two outstanding linear algebra notes.
- Continue C++: pointers vs references, then RAII/smart pointers (the modern fix for the manual `new`/`delete` danger just demonstrated) — then move through the rest of Programming/CS priority 1 (OOP, Linux/Bash, networking, SQL/MongoDB depth, concurrency, etc.)

---

## Phase 1, Day 2 — 2026-09-22 (resumed after 5-day gap)

**Phase:** 1 — Programming + CS + Math

### Topics touched
- Linear algebra: linear transformations (geometric meaning of matrices, determinant, invertibility, composition) — mastery: 2, targeting 3

### Context
- Returned after a 5-day gap. Offered a no-notes recall check on Day 1 material (matrix multiplication) before continuing; user chose to skip it and move straight to the next topic per the plan instead. DSA track separately reset to restart clean 2026-10-05 (see `dsa/TRACKER.md`).

### Understanding
- A matrix's columns directly show where the basis vectors land — this is the single fact that makes "what does this matrix do geometrically" readable without computation.
- Determinant = area/volume scaling factor; det = 0 means the transformation is non-invertible (information is permanently lost, e.g. projection).
- Matrix multiplication = composition of transformations — this is *why* AB != BA (order of operations matters, not just an algebraic quirk).
- Connected to neural nets: linear transformations always fix the origin, which is exactly why layers need `Wx + b` (the `+b` enables translation) rather than just `Wx`.

### Engineering
- Implemented scale/rotation/projection matrix builders, verified the "columns = basis vector images" claim directly against NumPy, verified determinant behavior (rotation det=1, scale(2,3) det=6, projection det=0 and non-invertible), verified rotate-then-scale != scale-then-rotate. All 9 checks pass.

### Evidence
- `03-mathematics/linear-algebra/02-linear-transformations.md`, `03-mathematics/linear-algebra/linear_transformations.py`

### Next starting point
- Fill in section 10 of both linear algebra concept notes (own-words explanation) — still outstanding from Day 1 too.
- Continue linear algebra block: eigenvalues/eigenvectors, then SVD, then Project 2 (linear regression via matrix ops).

---

## DSA Track added — 2026-09-16

Set up `dsa/` as an independent daily track (1 hour/day, Sep 16 2026 – Mar 31 2027), running in parallel to the main 2-hour roadmap track regardless of phase. Full plan in `dsa/SCHEDULE.md`, hour-by-hour structure and rules in `dsa/README.md`, per-attempt logging in `dsa/TRACKER.md`. Removed the now-redundant `01-programming/dsa/` folder — DSA lives at the top level since it isn't phase-bound.

From here on, daily log entries should note progress on **both** tracks where applicable.

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
