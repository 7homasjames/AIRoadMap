# Day 1 Revision: From C++ to Assembly

**Date:** 2026-10-08
**Files:** [`day1.cpp`](day1.cpp) → [`day1.s`](day1.s)

---

## 1. What I did

I wrote a small C++ program and asked the compiler to show me the **assembly**: the CPU instructions it turns my code into.

```cpp
int main() {
    int x = 10;
    int y = 20;
    int z = x + y;
    std::cout << z << std::endl;
    return 0;
}
```

```bash
g++ -S day1.cpp -o day1.s     # -S = stop after compiling, output assembly
```

---

## 2. The key idea

> The CPU knows nothing about `x`, `y` or `z`. Those names only exist in my source code.
> The compiler turns each variable into a **memory location**, and turns each calculation into
> **load into registers → compute → store back to memory**.

---

## 3. The important lines

| C++            | Assembly                     | In plain words                                     |
|----------------|------------------------------|----------------------------------------------------|
| `int x = 10;`  | `movl $10, -4(%rbp)`         | Put the number 10 at memory address `rbp - 4`      |
| `int y = 20;`  | `movl $20, -8(%rbp)`         | Put the number 20 at memory address `rbp - 8`      |
| `x + y` (1)    | `movl -4(%rbp), %edx`        | **Read** the value at `rbp - 4` into register EDX  |
| `x + y` (2)    | `movl -8(%rbp), %eax`        | **Read** the value at `rbp - 8` into register EAX  |
| `x + y` (3)    | `addl %edx, %eax`            | EAX = EAX + EDX → 30                               |
| `int z = ...;` | `movl %eax, -12(%rbp)`       | Store EAX (30) at memory address `rbp - 12`        |

### The flow

```
   RAM (stack)                    CPU registers
 ┌──────────────┐
 │ rbp-4  = 10  │ ── load ──→   EDX = 10
 │ rbp-8  = 20  │ ── load ──→   EAX = 20
 │              │                  │
 │              │               EAX = EAX + EDX = 30
 │              │                  │
 │ rbp-12 = 30  │ ←── store ───────┘
 └──────────────┘
```

---

## 4. How to read an instruction (AT&T syntax)

```
movl   -4(%rbp),   %edx
 │        │          │
 │      SOURCE    DESTINATION
 │
 └── mov = copy,  l = "long" = 4 bytes
```

- **Order is `source, destination`.** Data flows left → right.
- `$10` → a `$` means a **plain number** (a constant).
- `%edx` → a `%` means a **register**.
- `-4(%rbp)` → **memory** at address `rbp - 4`.
  - Rule: `offset(%reg)` means "the address in `reg`, plus `offset`".

---

## 5. Vocabulary

| Term         | Meaning                                                                                  |
|--------------|------------------------------------------------------------------------------------------|
| **Register** | A tiny, extremely fast storage slot *inside the CPU*. The CPU calculates using registers.|
| **RAM**      | Main memory. Large but much slower than registers. Variables live here.                  |
| **EAX, EDX** | General-purpose registers. Temporary workspace, **not** variables.                       |
| **RBP**      | Base Pointer register. It holds an address that marks the current function's stack frame. Variables are found as offsets from it. |
| **Stack frame** | The chunk of stack memory that belongs to one function call (here, `main`).           |
| **`mov`**    | Copy data from source to destination.                                                    |
| **`add`**    | Add source to destination and store the result in the destination.                       |

---

## 6. Mistakes I made (and the corrections)

1. **"`movl -4(%rbp), %edx` moves something *to* that location."**
   ❌ Wrong direction. It **reads from** `rbp - 4` and copies the value **into** EDX.
   Memory → register.

2. **"If rbp = 1000, the CPU looks at -4 rbp."**
   ❌ Not quite. You do the arithmetic: **1000 − 4 = 996**. The CPU looks at **address 996**.

3. **Thinking of EDX as another variable.**
   ❌ EDX is a **slot inside the CPU**. It holds a value for a moment while the CPU works with it.

---

## 7. Why the offsets are 4 bytes apart

```
rbp - 4   →  x   (bytes 996–999)
rbp - 8   →  y   (bytes 992–995)
rbp - 12  →  z   (bytes 988–991)
```

An `int` is **4 bytes**, so each variable needs 4 bytes of space.
This also explains the `l` in `movl` and the `e` in `eax`/`edx`: both mean **32 bits = 4 bytes**.
(`rax`, `rbp` are the full 64-bit / 8-byte registers.)

Notice the addresses **go down** (−4, −8, −12). On x86 the stack grows towards lower addresses.

---

## 8. Things I'm skipping for now (Day 2+)

```asm
pushq  %rbp          # save the caller's rbp
movq   %rsp, %rbp    # set rbp = the current top of the stack (my "bookmark")
subq   $48, %rsp     # reserve 48 bytes of stack space for main
...
addq   $48, %rsp     # release that space
popq   %rbp          # restore the caller's rbp
ret                  # return
```

This is the **function prologue and epilogue**: setting up and tearing down the stack frame.
→ Next topic: **What is the stack?** Then stack vs heap, pointers, references, memory layout.

Other lines worth recognising:
- `call _ZNSolsEi` → this is `std::cout << int`. The weird name is **name mangling**, the way C++ encodes function names for the linker.
- `movl $0, %eax` before `ret` → `return 0;`. The return value goes in EAX.

> Side note: this is **unoptimised** output (`-O0`, the default). With `g++ -O2 -S`, the compiler would
> work out `10 + 20 = 30` at compile time and skip the stack entirely. Try it later and compare.

---

## 9. Self-quiz

Try to answer from memory, then expand to check.

<details>
<summary>1. What does <code>movl $20, -8(%rbp)</code> do?</summary>

Stores the constant 20 into memory at address `rbp - 8` (this is `y`).
</details>

<details>
<summary>2. If rbp = 2000, where is <code>z</code> stored?</summary>

`2000 − 12 = 1988`.
</details>

<details>
<summary>3. Why can't the CPU just compute <code>x + y</code> directly?</summary>

`x` and `y` are names in source code. The CPU only knows addresses and registers. It has to load the values from memory into registers, add them there, then store the result back.
</details>

<details>
<summary>4. In <code>addl %edx, %eax</code>, which register holds the result?</summary>

EAX (the destination, on the right).
</details>

<details>
<summary>5. What is the difference between RBP and EAX?</summary>

Both are registers. RBP holds an **address** (a reference point for the stack frame). EAX holds a **value** being worked on (here, 20, then 30).
</details>

<details>
<summary>6. Why are the offsets −4, −8, −12 and not −1, −2, −3?</summary>

Each `int` takes 4 bytes.
</details>

---

## 10. One-sentence summary

> The compiler gives every variable a slot on the stack (found as an offset from RBP), and every
> calculation becomes: **load from memory into registers → let the CPU compute → store back to memory.**
