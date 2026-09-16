"""
Day 1, Phase 1: vectors, matrices, matrix multiplication from scratch.

Implement the mechanism by hand first, then verify against NumPy.
Understanding *why* NumPy's version is correct requires being able to
write this loop yourself.
"""
import numpy as np


def dot(a: list[float], b: list[float]) -> float:
    """a · b = sum(a[i] * b[i])"""
    assert len(a) == len(b), "vectors must be the same length"
    return sum(ai * bi for ai, bi in zip(a, b))


def matvec(A: list[list[float]], x: list[float]) -> list[float]:
    """y = Ax. Each y[i] is the dot product of row i of A with x."""
    n_cols = len(A[0])
    assert len(x) == n_cols, f"A has {n_cols} columns but x has length {len(x)}"
    return [dot(row, x) for row in A]


def matmul(A: list[list[float]], B: list[list[float]]) -> list[list[float]]:
    """C = AB. C[i][j] = dot product of row i of A with column j of B."""
    n = len(A[0])
    assert len(B) == n, f"A has {n} columns but B has {len(B)} rows"
    p = len(B[0])
    # columns of B, extracted so we can dot them against rows of A
    B_cols = [[B[k][j] for k in range(n)] for j in range(p)]
    return [[dot(row, col) for col in B_cols] for row in A]


def check(name: str, mine, ref) -> None:
    mine_arr = np.array(mine)
    ok = np.allclose(mine_arr, ref)
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}")
    if not ok:
        print("  mine:", mine_arr)
        print("  ref: ", ref)


if __name__ == "__main__":
    a = [1.0, 2.0, 3.0]
    b = [4.0, 5.0, 6.0]
    check("dot product", dot(a, b), np.dot(a, b))

    A = [[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]]  # 3x2
    x = [1.0, 1.0]                            # 2x1
    check("matrix-vector", matvec(A, x), np.array(A) @ np.array(x))

    B = [[1.0, 0.0, 2.0], [0.0, 1.0, 3.0]]    # 2x3
    check("matrix-matrix", matmul(A, B), np.array(A) @ np.array(B))

    # Non-commutativity: AB != BA in general
    P = [[1.0, 2.0], [3.0, 4.0]]
    Q = [[0.0, 1.0], [1.0, 0.0]]
    PQ = matmul(P, Q)
    QP = matmul(Q, P)
    print("\nPQ =", PQ)
    print("QP =", QP)
    print("PQ == QP?", PQ == QP, "(should be False — order matters)")

    # A neural-network-layer-shaped example: y = Wx + b
    W = [[0.5, -0.3], [0.8, 0.1]]
    x_input = [2.0, 5.0]
    bias = [0.1, -0.2]
    layer_out = [wx + bi for wx, bi in zip(matvec(W, x_input), bias)]
    ref_out = np.array(W) @ np.array(x_input) + np.array(bias)
    check("neural net layer (Wx + b)", layer_out, ref_out)
