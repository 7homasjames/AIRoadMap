# Concept: Vectors, Matrices, and Matrix Multiplication

## 1. What is it?

A **vector** is an ordered list of numbers — `[x1, x2, ..., xn]`. Geometrically, it's a point in n-dimensional space, or an arrow from the origin to that point.

A **matrix** is a 2D grid of numbers (rows × columns). You can think of it two equivalent ways:
- A **collection of vectors** (each column, or each row, is a vector)
- A **function** that transforms one vector space into another

**Matrix multiplication** `Ax` takes a vector `x` and produces a new vector by combining `x`'s components using the rows of `A` as weights.

## 2. Why does it exist?

Because most real-world data isn't a single number — it's many related numbers at once (a customer's age/income/location, an image's pixels, a word's embedding). Linear algebra is the math of manipulating many numbers *simultaneously and consistently*, rather than writing a loop over each one by hand.

Matrix multiplication specifically exists to compactly express **linear combinations** — "take a weighted sum of these inputs" — which is the single most common operation in science and engineering.

## 3. What problem does it solve?

Without it, every operation on multi-dimensional data would need explicit loops: `for i in range(n): y[i] = sum(A[i][j] * x[j] for j in range(m))`. Matrix notation lets you write `y = Ax` and reason about entire systems (rotations, projections, transformations, neural network layers) as single algebraic objects — which is also what makes them fast on hardware (GPUs are matrix-multiplication machines).

## 4. How does it work?

**Dot product** of two vectors `a` and `b` (same length n):
```
a · b = a1*b1 + a2*b2 + ... + an*bn
```
It measures how much two vectors "point the same way," scaled by their magnitudes.

**Matrix-vector multiplication** `y = Ax`, where `A` is (m × n) and `x` is (n × 1):
- Each entry `y[i]` is the **dot product of row i of A with x**.
- Result `y` is (m × 1).
- Requirement: number of columns in `A` must equal length of `x` (the "inner dimensions must match").

**Matrix-matrix multiplication** `C = AB`, where `A` is (m × n) and `B` is (n × p):
- `C[i][j]` = dot product of row `i` of `A` with column `j` of `B`.
- Result `C` is (m × p).
- This is really just doing matrix-vector multiplication once per column of `B`.

## 5. Mathematical foundation

For `A` (m×n) and `x` (n×1):

```
y[i] = Σ(j=1 to n) A[i][j] * x[j]      for i = 1..m
```

For `A` (m×n) and `B` (n×p):

```
C[i][j] = Σ(k=1 to n) A[i][k] * B[k][j]     for i = 1..m, j = 1..p
```

Key properties:
- **Not commutative**: `AB ≠ BA` in general (order matters — this trips people up coming from scalar arithmetic).
- **Associative**: `(AB)C = A(BC)` — this is why you can reorder computation for efficiency without changing the result.
- **Distributive**: `A(B + C) = AB + AC`.

## 6. Minimal implementation

See [`vectors_matrices.py`](vectors_matrices.py) — pure-Python dot product and matrix multiply, verified against NumPy.

## 7. Example

A single neural network layer is literally this:
```
output = W @ x + b
```
where `W` is a weight matrix, `x` is the input vector, `b` is a bias vector. "Training" a network means adjusting the numbers inside `W` and `b`. Stack several of these (with a nonlinearity between them) and you have a deep network. This is *why* matrix multiplication is the single most repeated operation in all of deep learning — it's not incidental, it's the entire mechanism.

## 8. Trade-offs and limitations

- Matrix multiplication is **O(n³)** for naive (m×n)·(n×p) square-ish cases — this is why fast matmul (BLAS, GPU tensor cores) is a whole engineering discipline, and why model size directly drives compute cost.
- Linear operations alone can only represent linear transformations (straight lines stay straight, origin stays fixed for pure matrices). This is *why* neural networks need nonlinear activation functions between layers — stacking only linear layers collapses to a single linear layer mathematically (`W2(W1x) = (W2W1)x`).

## 9. Where is it used?

- Every dense/linear layer in a neural network
- Attention in transformers (`Q @ K.T`, then `@ V`) — this is Phase 4 material, but it's the same operation
- Linear regression (`y = Xw`)
- PCA (matrix decomposition)
- Image transformations (rotation, scaling as matrices)
- Embeddings (a lookup is literally multiplying a one-hot vector by an embedding matrix)

## 10. My explanation

*(Fill this in yourself after working through `vectors_matrices.py` — explain matrix multiplication in your own words, without looking back at this file. This is the actual test of whether it stuck.)*

## 11. Progress level

- [ ] 0 — Unfamiliar
- [ ] 1 — Familiar
- [x] 2 — Working knowledge
- [ ] 3 — Deep understanding
- [ ] 4 — Advanced

(Self-rate after completing the exercises below.)
