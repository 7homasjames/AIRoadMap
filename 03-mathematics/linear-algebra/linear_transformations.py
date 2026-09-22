"""
Day 2, Phase 1: linear transformations.

Key claim to verify: the columns of a matrix tell you exactly where the
basis vectors land, and that's ALL you need to know to understand what
the transformation does to any point.
"""
import numpy as np


def scale_matrix(sx: float, sy: float) -> np.ndarray:
    return np.array([[sx, 0.0], [0.0, sy]])


def rotation_matrix(theta_degrees: float) -> np.ndarray:
    theta = np.radians(theta_degrees)
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s], [s, c]])


def projection_onto_x_matrix() -> np.ndarray:
    return np.array([[1.0, 0.0], [0.0, 0.0]])


def check(name: str, cond: bool) -> None:
    print(f"[{'PASS' if cond else 'FAIL'}] {name}")


if __name__ == "__main__":
    e1 = np.array([1.0, 0.0])
    e2 = np.array([0.0, 1.0])

    # 1. Verify: columns of A = where basis vectors land
    A = rotation_matrix(90)
    check(
        "column 1 of A equals A @ e1",
        np.allclose(A[:, 0], A @ e1),
    )
    check(
        "column 2 of A equals A @ e2",
        np.allclose(A[:, 1], A @ e2),
    )

    # 2. Rotating [1, 0] by 90 degrees should land on [0, 1]
    rotated = rotation_matrix(90) @ np.array([1.0, 0.0])
    check("rotate [1,0] by 90deg -> [0,1]", np.allclose(rotated, [0.0, 1.0], atol=1e-9))

    # 3. Scaling
    scaled = scale_matrix(2.0, 3.0) @ np.array([1.0, 1.0])
    check("scale [1,1] by (2,3) -> [2,3]", np.allclose(scaled, [2.0, 3.0]))

    # 4. Projection loses information: det = 0, not invertible
    P = projection_onto_x_matrix()
    det_P = np.linalg.det(P)
    check("projection matrix has det = 0 (not invertible)", np.isclose(det_P, 0.0))
    try:
        np.linalg.inv(P)
        inv_ok = False
    except np.linalg.LinAlgError:
        inv_ok = True
    check("projection matrix inversion raises (confirms not invertible)", inv_ok)

    # 5. Rotation preserves area (det = 1); scaling by (2,3) scales area by 6
    R = rotation_matrix(37)
    check("rotation matrix has det ~= 1 (area-preserving)", np.isclose(np.linalg.det(R), 1.0))
    S = scale_matrix(2.0, 3.0)
    check("scale(2,3) matrix has det = 6 (area scaled by 6x)", np.isclose(np.linalg.det(S), 6.0))

    # 6. Composition: rotate-then-scale != scale-then-rotate (order matters)
    rotate_then_scale = S @ R
    scale_then_rotate = R @ S
    check(
        "rotate-then-scale != scale-then-rotate (AB != BA)",
        not np.allclose(rotate_then_scale, scale_then_rotate),
    )

    print("\nMatrix A (90deg rotation):\n", A)
    print("Its columns directly show: e1 ->", A[:, 0], ", e2 ->", A[:, 1])
