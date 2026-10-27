# Concept: Linear Transformations

## 1. What is it?

A **linear transformation** is a function `T` that maps vectors to vectors while preserving two properties:
- `T(a + b) = T(a) + T(b)` (additivity)
- `T(c·a) = c·T(a)` (scaling)

Every matrix `A` defines a linear transformation via `T(x) = Ax`, and — crucially — **every** linear transformation between finite-dimensional spaces can be written as some matrix. Matrices and linear transformations are the same object viewed two ways: the matrix is the transformation's "recipe" once you fix a coordinate system.

## 2. Why does it exist?

Because "apply this matrix" is an abstract algebraic operation until you ask *what it does geometrically*. Understanding transformations is what makes matrix multiplication stop being symbol-pushing and start being something you can picture: stretching, rotating, flattening space.

## 3. What problem does it solve?

It explains *why* certain matrices behave the way they do — why some "lose information" (project onto a lower dimension), why some preserve distances (rotations), why some blow up or shrink space (scaling). Without this, operations like PCA, SVD, or "what does this neural network layer do to its input" have no intuitive handle.

## 4. How does it work?

The key insight: **a matrix is completely determined by what it does to the basis vectors**, and everything else follows by linearity.

In 2D, the standard basis vectors are `e1 = [1, 0]` and `e2 = [0, 1]`. For a matrix:
```
A = [[a, b],
     [c, d]]
```
- `A @ e1 = [a, c]` — the first **column** of `A` is where `e1` lands.
- `A @ e2 = [b, d]` — the second **column** of `A` is where `e2` lands.

Any vector `x = x1*e1 + x2*e2` transforms to `x1*(A@e1) + x2*(A@e2)` by linearity. So **the columns of a matrix literally tell you the transformation** — no computation needed, just look at where the basis vectors go.

Common transformations and what their matrices look like:
- **Scaling**: `[[sx, 0], [0, sy]]` — stretches x-axis by `sx`, y-axis by `sy`.
- **Rotation by angle θ**: `[[cos θ, -sin θ], [sin θ, cos θ]]`.
- **Projection onto x-axis**: `[[1, 0], [0, 0]]` — collapses the y-component, loses information (not invertible).
- **Identity**: `[[1, 0], [0, 1]]` — does nothing, basis vectors stay put.

## 5. Mathematical foundation

- **Determinant** = the factor by which the transformation scales area (2D) / volume (3D+). `det(A) = 0` means the transformation squashes space into a lower dimension (information is lost, not invertible).
- **Invertibility**: `A` is invertible iff `det(A) ≠ 0` iff the transformation doesn't collapse any dimension iff there's a unique `A⁻¹` that undoes it.
- **Composition**: applying transformation `A` then `B` to a vector is `B(A(x)) = (BA)x` — matrix multiplication *is* composition of transformations. This is *why* multiplication order matters (`AB ≠ BA`): "rotate then scale" is a different transformation from "scale then rotate."

## 6. Minimal implementation

See [`linear_transformations.py`](linear_transformations.py) — build transformation matrices (scale, rotate, project), apply them to a set of points, and verify the "columns = where basis vectors land" rule directly against NumPy.

## 7. Example

Rotating a 2D point `[1, 0]` by 90°:
```
A = [[cos 90°, -sin 90°], [sin 90°, cos 90°]] = [[0, -1], [1, 0]]
A @ [1, 0] = [0, 1]
```
The point that was pointing along x now points along y — a quarter turn, exactly as expected, read directly off the matrix's first column.

## 8. Trade-offs and limitations

- Linear transformations always fix the origin (`T(0) = 0`) — they can't represent translation (shifting everything by a constant). That's why "affine" transformations (`Ax + b`) are needed for things like neural network layers — the `+ b` is what allows shifting.
- Non-invertible transformations (`det(A) = 0`) destroy information permanently — you cannot recover the original input from the output. This matters directly for neural networks: a layer that collapses too much information (e.g. via a low-rank weight matrix) creates an information bottleneck.

## 9. Where is it used?

- Every neural network layer is an affine transformation (`Wx + b`) followed by a nonlinearity — the `W` part is exactly this.
- PCA finds the transformation (rotation) that aligns axes with directions of maximum variance.
- Computer graphics: every rotation, scale, skew of an image or 3D model.
- Convolutions in CNNs are structured (sparse, weight-shared) linear transformations.

## 10. My explanation

*(Written by Claude at my request on 2026-10-27, not yet from my own recall. Rewrite this in my own words at the next review.)*

The columns are where the basis vectors end up. Column 1 is where `[1, 0]` lands and column 2 is where `[0, 1]` lands. Every other vector is a combination of those two, and the transformation is linear, so knowing where the basis vectors go tells you where everything goes. You can read off what a matrix does without computing anything. `[[0, -1], [1, 0]]` sends x to y and y to −x, so it's a 90° rotation.

The determinant is how much area gets scaled. If it's 0, the columns point along the same line, space gets flattened, and you can't undo it. Multiplying matrices means applying one transformation after another, which is why the order matters.

## 11. Progress level

- [ ] 0 — Unfamiliar
- [ ] 1 — Familiar
- [ ] 2 — Working knowledge
- [ ] 3 — Deep understanding
- [ ] 4 — Advanced

(Self-rate after completing the exercises.)
