# Day 3 Revision: Stack Frames, Function Calls & Dangling Pointers

**Date:** 2026-10-13
**Code:** [`day3.cpp`](day3.cpp)
**Builds on:** [Day 1: Reading Assembly](day1-reading-assembly.md), [Day 2: Stack, Heap, Pointers & References](day2-stack-heap-pointers-references.md)

---

## 1. Today's question

> What **physically happens** to memory when a function is called and when it returns, and why is it a bug to keep a pointer to a local variable after its function has returned?

Day 2 recap: locals live in the function's **stack frame**, and the frame is thrown away when the function returns. Today we look at **what "thrown away" really means**, and it turns out the answer is: *almost nothing happens to the memory*. That is exactly why dangling pointers are so sneaky.

---

## 2. What is a stack frame?

A **stack frame** is the block of stack memory one function call uses. It holds:

| Part | What it is |
|---|---|
| **Return address** | Where the CPU should jump back to when this function finishes |
| **Saved `rbp`** | The caller's frame pointer, so it can be restored on return |
| **Local variables** | `int x`, `int local`, etc. (the `rbp - 4` slots from Day 1) |
| Spare / alignment space | Padding the ABI requires (on Windows x64, 32 bytes of "shadow space" for the next call) |

Calls stack up like plates: `main` calls `depth(1)`, which calls `depth(2)`, which calls `depth(3)`.

```
 higher addresses
 ┌──────────────────────┐
 │  main's frame        │
 ├──────────────────────┤
 │  depth(1)  local = 1 │
 ├──────────────────────┤
 │  depth(2)  local = 2 │
 ├──────────────────────┤
 │  depth(3)  local = 3 │  ← top of stack (rsp points here)
 └──────────────────────┘
 lower addresses           the stack GROWS DOWNWARD
```

### 👀 Seen in my own output (Experiment 1)

```
depth 1: &local = 0xd408dff69c
depth 2: &local = 0xd408dff65c
depth 3: &local = 0xd408dff61c
```

- Each address is **smaller** than the one before → the stack grows **downward** (towards lower addresses).
- Each step is `0x40` = **64 bytes** apart. That's exactly one `depth` frame:

| Piece | Bytes |
|---|---|
| Return address (pushed by `call`) | 8 |
| Saved `rbp` (`pushq %rbp`) | 8 |
| `subq $48, %rsp` (locals + shadow space + alignment) | 48 |
| **Total** | **64** ✅ |

---

## 3. Call and return in assembly

From `g++ -S day3.cpp`, the start of `depth`:

```asm
_Z5depthi:                 ; depth(int), the name is "mangled"
    pushq  %rbp            ; save the caller's frame pointer
    movq   %rsp, %rbp      ; my frame starts here
    subq   $48, %rsp       ; reserve 48 bytes for my frame
    movl   %ecx, 16(%rbp)  ; argument n arrived in register ECX
    ...
    movl   %eax, -4(%rbp)  ; local = n   (the familiar rbp-4 slot!)
```

The three phases of every call:

| Phase | Instructions | In plain words |
|---|---|---|
| **Call** | `call depth` | Push the return address, jump to `depth` |
| **Prologue** | `push rbp` / `mov rsp, rbp` / `sub $48, rsp` | Save caller's `rbp`, set up my frame, reserve space |
| **Epilogue** | `add $48, rsp` / `pop rbp` / `ret` | Move `rsp` back up, restore caller's `rbp`, pop return address and jump back |

The end of `depth` in my `.s` file:

```asm
    addq   $48, %rsp       ; give back the 48 bytes
    popq   %rbp            ; restore the caller's frame pointer
    ret                    ; pop the return address and jump there
```

> 💡 **The key fact:** returning just **moves `rsp` back up**. It does **not** erase, zero, or protect the old frame's memory. The bytes are still sitting there, marked "free", until the next call overwrites them.

---

## 4. Finished frames get reused

### 👀 Seen in my own output (Experiment 2)

```cpp
void first()  { int a = 111; ... }
void second() { int b = 222; ... }

first();
second();
```

```
first:  &a = 0xd408dff69c
second: &b = 0xd408dff69c      ← SAME address!
```

`first` returns, its frame is popped, then `second` is called from the same place, so its frame lands **in exactly the same memory**. `b` takes over `a`'s old slot.

```
 after first() returns        during second()
 ┌──────────────┐             ┌──────────────┐
 │ main         │             │ main         │
 ├──────────────┤             ├──────────────┤
 │ (free) 111   │  ← stale    │ b = 222      │  ← same bytes, new owner
 └──────────────┘             └──────────────┘
```

(Also notice: it's the **same address** as `depth(1)`'s `local`. Any function called directly from `main` lands at that spot.)

---

## 5. Dangling pointers

> A **dangling pointer** is a pointer that holds the address of an object whose **lifetime has ended**.

The classic mistake (the Day 2 preview):

```cpp
int* bad() {
    int x = 5;
    return &x;     // ⚠️ x dies when bad() returns
}
```

The pointer still holds a perfectly normal-looking address. But the thing that used to live there is **gone**, and the memory will be handed to the next function call.

### 👀 Seen in my own output (Experiment 3)

```cpp
int* p = nullptr;
make_dangling(&p);          // stores &x into p, then x dies
int right_after = *p;       // read immediately
stomp();                    // a new frame with junk = 999 lands on the same slot
int after_stomp = *p;
```

```
p  = 0xd408dff69c                  ← the shared "called from main" slot again
*p right after return = 5          ← looks fine! (the bytes weren't erased)
*p after stomp()      = 999        ← stomp()'s local overwrote it
*p after printing     = 32758      ← std::cout's own calls overwrote it again
```

This is **why dangling pointers are dangerous**:

1. **It seems to work at first.** The old value is still there, so tests can pass.
2. **Any later function call silently changes it.** Even `std::cout <<` is a function call.
3. **Writing through it** (`*p = 42`) would corrupt *another function's* local variable, or worse, a saved `rbp` / return address. That's how many security exploits start.

> ⚠️ All of this is **undefined behaviour**. The output above is what *my* compiler at `-O0` happened to do. With optimisation on, a different compiler, or a different day, it could crash, print something else, or "work". You can never rely on it.

### The compiler tries to warn you

```
warning: storing the address of local variable 'x' in '*out' [-Wdangling-pointer=]
```

For the plain `return &x;` version, GCC goes further and **quietly returns `nullptr`** instead, so you crash immediately rather than read stale data. (That's why `day3.cpp` sneaks the address out through a parameter: to see the real behaviour.)

> 💡 Always compile with `-Wall`. Treat these warnings as errors.

### Heap version: use after delete

Same disease, different memory region:

```cpp
int* h = new int(50);
delete h;          // heap int's lifetime ends
*h = 7;            // ⚠️ dangling: use-after-free
```

This is why Day 2 set `h = nullptr;` after `delete`: dereferencing `nullptr` crashes loudly, which is far better than silently corrupting memory.

| Kind | How it dangles | Common name |
|---|---|---|
| Stack | Pointer/reference to a local after its function returns | Returning address of a local |
| Heap | Pointer used after `delete` | Use-after-free |
| Heap | `delete` called twice on the same pointer | Double free |

---

## 6. Dangling references, too

References can dangle exactly the same way:

```cpp
int& bad_ref() {
    int x = 5;
    return x;      // ⚠️ returns a reference to a dead local
}
```

Day 2 said a reference "can't be null". True, but it **can** refer to something that no longer exists, and that's arguably worse because there's no `nullptr` to check against.

---

## 7. The fixes

| Want to give back... | Do this | Why it's safe |
|---|---|---|
| A small value (`int`, `double`) | **Return by value**: `int give_value()` | The caller gets its own copy; the local can die |
| A big object (`std::vector`, `std::string`) | **Still return by value** | The compiler *moves* it or builds it in place (no expensive copy) |
| Something that must outlive the function and you need a pointer | `std::unique_ptr<int>` via `std::make_unique` | Lives on the heap; freed automatically when the owner goes away |

From Experiment 4:

```cpp
int give_value() { int x = 5; return x; }                        // copy out ✅
std::unique_ptr<int> give_heap() { return std::make_unique<int>(5); }  // owned heap ✅
```

```
give_value() = 5
*give_heap() = 5
```

No `delete` needed anywhere: `unique_ptr` deletes the heap int when `h` goes out of scope at the end of `main`. This is the modern C++ answer to Day 2's "who cleans up the heap?" problem.

> 🧭 Rule of thumb: **never return a pointer or reference to a local variable.** Return the value itself, or return something that owns heap memory.

---

## 8. Connecting to Python

Python can't have this bug:

```python
def make():
    x = [5]
    return x      # totally fine in Python

a = make()
print(a)          # [5]
```

Python objects live on a **heap managed by the interpreter**, and each object counts how many names refer to it (**reference counting**). `x` going out of scope just decrements the count; the list survives because `a` still refers to it. It's only freed when the count hits 0.

| | C++ local | Python object |
|---|---|---|
| Lives in | Function's stack frame | Interpreter-managed heap |
| Dies when | Function returns, **no matter who points at it** | Nobody refers to it any more |
| Dangling possible? | Yes | No (in pure Python) |
| Cost | Zero runtime overhead | Refcount updates on every assignment |

**Why this matters later:** PyTorch/NumPy are C/C++ underneath. Bugs like "tensor memory freed while a view of it is still in use" or crashes in custom CUDA extensions are dangling-pointer bugs in disguise. Python protects *you*, the C++ layer has to protect itself.

---

## 9. Predict the output

Cover the answers. Predict first, then run `g++ day3.cpp -o day3 && ./day3` and compare.

```cpp
void f() { int a = 1; std::cout << &a << '\n'; }
void g() { int b = 2; std::cout << &b << '\n'; }

int main() {
    f();          // prints address A
    g();          // 1. Same as A, or different?
}

void rec(int n) {
    int local = n;
    std::cout << &local << '\n';
    if (n < 2) rec(n + 1);
}
// rec(1) prints X then Y.
// 2. Is Y bigger or smaller than X?
// 3. What's Y - X roughly made of?

int* p; make_dangling(&p);   // x = 5 inside
int v1 = *p;                 // 4. ?
stomp();                     // junk = 999 inside
int v2 = *p;                 // 5. ?
```

<details>
<summary>Answers & reasons</summary>

| # | Answer | Why |
|---|---|---|
| 1 | Same as A | `f`'s frame is popped, `g` is called from the same place, so it reuses the exact same memory |
| 2 | Smaller | The stack grows **downward**; a deeper call's frame sits at lower addresses |
| 3 | One whole frame (64 bytes here) | Return address + saved `rbp` + the space reserved by `sub rsp` |
| 4 | Probably `5` | Returning doesn't erase memory, so the stale value is still there. **Not guaranteed!** |
| 5 | Probably `999` | `stomp`'s frame reused the slot and wrote 999 into it. Also UB, also not guaranteed |

</details>

---

## 10. Self-quiz

<details>
<summary>1. What is a stack frame, and what three kinds of things are in it?</summary>

The block of stack memory used by one function call. It holds the **return address**, the **saved caller's `rbp`**, and the function's **local variables** (plus padding/shadow space).
</details>

<details>
<summary>2. What actually happens to a function's local variables' memory when it returns?</summary>

Nothing is erased. `rsp` is moved back up so that memory is considered **free**. The old bytes stay there until the next function call overwrites them.
</details>

<details>
<summary>3. Which direction does the stack grow on x86-64, and how did you prove it?</summary>

**Downward**, towards lower addresses. In Experiment 1, `&local` got smaller at each deeper recursion level.
</details>

<details>
<summary>4. What is a dangling pointer?</summary>

A pointer that still holds an address, but the object at that address has reached the end of its lifetime (its function returned, or it was `delete`d).
</details>

<details>
<summary>5. Why can reading a dangling pointer "work" in a test and still be a serious bug?</summary>

The stale value often survives until the next function call reuses the memory, so an immediate read looks correct. Any later call (even `std::cout`) can silently overwrite it. And it's undefined behaviour, so the compiler is allowed to do anything.
</details>

<details>
<summary>6. What does the <code>ret</code> instruction use to know where to jump back to?</summary>

The **return address** that `call` pushed onto the stack. That's why writing through a dangling pointer into an old frame can be catastrophic: it can overwrite a return address.
</details>

<details>
<summary>7. Give two safe ways to give data back from a function instead of returning <code>&x</code>.</summary>

**Return by value** (`return x;`), or return an owning smart pointer like `std::unique_ptr` created with `std::make_unique`.
</details>

<details>
<summary>8. Why can't a Python function return a "dangling" list?</summary>

Python objects live on a managed heap with **reference counting**. The list stays alive as long as any name refers to it, so returning it keeps it alive.
</details>

---

## 11. "Done for today" checklist

Explain each one **out loud, in your own words**, without looking:

- [ ] What's inside a stack frame and what `call` / prologue / `ret` do
- [ ] Why the stack grows downward, using my own addresses as proof
- [ ] Why two sibling calls get the same local address
- [ ] What a dangling pointer is, and why "it printed the right value" proves nothing
- [ ] The two safe fixes: return by value, or return a `unique_ptr`

---

## 12. One-sentence summary

> Each function call pushes a **stack frame** (return address, saved `rbp`, locals) and returning just **moves `rsp` back** without erasing anything, so a pointer to a dead local is a **dangling pointer** that reads stale data until the next call silently overwrites it; return by value or with a `unique_ptr` instead.

---

## Next (Day 4)

**RAII and smart pointers**: how `std::unique_ptr` (which I used today without fully explaining) ties heap memory to a stack object's lifetime, so destructors clean up automatically. Then `std::shared_ptr` vs `unique_ptr`, and why modern C++ almost never writes `new`/`delete` by hand. Preview:

```cpp
{
    std::unique_ptr<int> p = std::make_unique<int>(42);
    // ... use *p ...
}   // p's destructor runs here and deletes the int, no leak possible
```
