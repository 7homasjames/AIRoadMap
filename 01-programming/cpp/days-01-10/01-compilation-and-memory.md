# Concept: Compilation Model, Stack, and Heap

## 1. What is it?

**Compilation**: C++ source code is translated into native machine code *before* it runs (unlike Python, which an interpreter reads and executes line by line). The pipeline is: preprocessing → compiling → assembling → linking → an executable binary.

**Stack**: a region of memory that grows/shrinks automatically as functions are called and return. Fast, fixed-size, automatically managed.

**Heap**: a region of memory you explicitly request (`new`) and must explicitly release (`delete`). Slower, size only limited by available memory, manually managed.

## 2. Why does it exist?

Compilation exists because translating to machine code once (ahead of time) is far faster at runtime than re-interpreting source on every execution — the cost is paid once, at build time, not on every run. This is *why* C++ is used where raw performance matters (systems, games, ML infrastructure, CUDA kernels) and Python usually isn't.

The stack/heap split exists because not all data has the same lifetime requirements. A local variable inside a function should vanish automatically when the function returns (stack) — but sometimes you need data that outlives the function that created it, or whose size isn't known until runtime (heap).

## 3. What problem does it solve?

Compilation solves: "how do we get maximum runtime performance from code that's still human-readable?" — you pay the translation cost once, not on every execution.

Stack/heap separation solves: "how do we get automatic, zero-overhead memory cleanup for the common case (local variables), while still allowing explicit control when we genuinely need data to outlive its creating scope?"

Coming from Python, this is invisible — Python's garbage collector handles *all* memory the same way, at a real runtime cost, and you never think about where a value physically lives. C++ makes you choose, and that choice has real performance and correctness consequences.

## 4. How does it work?

**Compilation pipeline** (roughly):
1. **Preprocessor**: handles `#include`, `#define` — pure text substitution before real compilation starts.
2. **Compiler**: translates C++ source into assembly/object code (`.o` files), checking types and syntax.
3. **Linker**: combines object files + libraries into a single executable, resolving references between them (e.g. a function declared in one file, defined in another).

**Stack**:
- Every function call pushes a "stack frame" containing its local variables.
- When the function returns, the frame is popped — all its local variables are destroyed automatically, instantly.
- Fixed, small size (a few MB typically) — deep recursion or huge local arrays cause a **stack overflow**.

**Heap**:
- `new T` allocates memory for a `T` on the heap and returns a pointer to it. This memory persists until you explicitly call `delete` on it.
- Forgetting to `delete` = a **memory leak** (the memory is never reclaimed for the program's lifetime).
- Calling `delete` twice, or using memory after deleting it = **undefined behavior** (this is the class of bug Python's garbage collector makes structurally impossible, at the cost of GC overhead).

## 5. Mathematical foundation

N/A — this is a systems concept, not a mathematical one. The relevant "law" is closer to an engineering trade-off: stack access is O(1) push/pop with zero bookkeeping overhead; heap allocation requires the allocator to search for free space and track it, so it is slower and has bookkeeping cost per allocation.

## 6. Minimal implementation

See [`stack_vs_heap.cpp`](stack_vs_heap.cpp) — demonstrates a stack variable being destroyed automatically at scope exit, a heap variable that must be explicitly freed, a deliberate (then fixed) memory leak, and a dangling-pointer bug shown safely.

## 7. Example

```cpp
void stackExample() {
    int x = 5;       // lives on the stack
}                     // x is destroyed here, automatically, no code needed

void heapExample() {
    int* p = new int(5);  // lives on the heap; p (the pointer) lives on the stack
    delete p;              // must be explicit — nothing does this for you
}
```

## 8. Trade-offs and limitations

- Stack: fast, automatic, but limited size and lifetime tied strictly to scope — can't return a pointer to a stack-local variable (it's destroyed the moment the function returns).
- Heap: flexible lifetime and size, but every allocation must be paired with exactly one deallocation — manual bookkeeping is the source of most classic C++ bugs (leaks, double-frees, use-after-free). Modern C++ largely solves this with RAII / smart pointers (`unique_ptr`, `shared_ptr`) — a later topic, but the reason they exist only makes sense once you understand *why* manual `new`/`delete` is dangerous.

## 9. Where is it used?

- Every C++ program, implicitly, for every variable.
- GPU/CUDA programming (Phase 6): explicit memory management (`cudaMalloc`/`cudaFree`) is the *exact same pattern* as heap allocation, just on a different device — understanding this now pays off directly later.
- Performance-critical ML infrastructure (inference engines, custom kernels) is written in C++ specifically to control memory layout and avoid GC pauses.

## 10. My explanation

*(Written by Claude at my request on 2026-10-27, not yet from my own recall. Rewrite this in my own words at the next review.)*

C++ has no garbage collector, so nothing watches heap memory to see when it's no longer used. The stack cleans itself up because a function's frame is popped when it returns. Memory from `new` isn't tied to any scope, though, so the program has no way to know when you're finished with it. That's why you have to say so with `delete`.

Forget the `delete` and the memory stays reserved until the program exits. That's a leak. One leak is harmless, but a leak inside a loop or a long-running server keeps growing. Get it wrong the other way and you have a worse bug. Deleting twice, or using the pointer after deleting it (a dangling pointer), is undefined behaviour. It may work, crash, or quietly corrupt other data. Smart pointers (`unique_ptr`) fix this by tying the `delete` to a scope, so it happens automatically.

## 11. Progress level

- [ ] 0 — Unfamiliar
- [ ] 1 — Familiar
- [ ] 2 — Working knowledge
- [ ] 3 — Deep understanding
- [ ] 4 — Advanced
