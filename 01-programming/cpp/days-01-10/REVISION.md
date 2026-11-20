# Days 1–10 Revision: C++ Foundations, from First Principles

One file to revise the first ten C++ days. Each day has **the one idea**, a **ladder of questions** (open the `<details>` only after you've tried to answer), the **facts you measured yourself**, and **traps**. The full lesson for each day is linked, so you can drop down a level when something is fuzzy.

> **How to use it:** don't read top to bottom. Read the "one idea" line, then try to rebuild the ladder out loud. Open an answer only to check. If you can't answer a rung, follow the link to the full lesson and redo that day's `.cpp`.

## Contents

| Day | Topic | Lesson | Code |
|---|---|---|---|
| 0 | Compilation model, stack vs heap | [01-compilation-and-memory.md](01-compilation-and-memory.md) | [stack_vs_heap.cpp](stack_vs_heap.cpp) |
| 1 | Reading assembly | [day1-reading-assembly.md](day1-reading-assembly.md) | [day1.cpp](day1.cpp), [day1.s](day1.s) |
| 2 | Stack, heap, pointers, references | [day2-stack-heap-pointers-references.md](day2-stack-heap-pointers-references.md) | [day2.cpp](day2.cpp) |
| 3 | Stack frames, lifetime, dangling pointers | [lesson](day3-lesson-functions-stack-frames-lifetime.md), [revision](day3-stack-frames-dangling-pointers.md) | [day3.cpp](day3.cpp) |
| 4 | Arrays, vectors, memory layout | [day4-lesson-arrays-vectors-memory.md](day4-lesson-arrays-vectors-memory.md) | [day4.cpp](day4.cpp) |
| 5 | Strings, characters, text | [day5-lesson-strings-characters-text.md](day5-lesson-strings-characters-text.md) | [day5.cpp](day5.cpp) |
| 6 | Searching and sorting | [day6-lesson-searching-sorting.md](day6-lesson-searching-sorting.md) | [day6.cpp](day6.cpp) |
| 7 | Big-O | [day7-lesson-big-o.md](day7-lesson-big-o.md) | [day7.cpp](day7.cpp) |
| 8 | Structs, classes, ctor/dtor | [day8-lesson-structs-classes.md](day8-lesson-structs-classes.md) | [day8.cpp](day8.cpp) |
| 9 | RAII and smart pointers | [day9-lesson-raii-smart-pointers.md](day9-lesson-raii-smart-pointers.md) | [day9.cpp](day9.cpp) |
| 10 | Copy vs move semantics | [day10-lesson-copy-move.md](day10-lesson-copy-move.md) | [day10.cpp](day10.cpp) |

Build any of them with: `g++ -std=c++17 -Wall -Wextra -pedantic dayN.cpp -o dayN`

## The thread running through all ten days

```
Day 0-1   source → machine code; variables become stack slots (rbp-4, rbp-8 ...)
Day 2     a pointer holds an address; a reference is a second name; heap needs delete
Day 3     a function call = a stack frame; it dies on return; pointers into it dangle
Day 4-5   many values = contiguous memory; text = numbers in an array of bytes
Day 6-7   what you do with that data, and how the cost grows with n
Day 8     a class = data + the rules (invariants) that protect it; ctor/dtor mark its life
Day 9     RAII: tie "give it back" to scope, so the dtor does the delete for you
Day 10    owning objects need a rule for copy (duplicate) vs move (steal)
```

**The single idea under everything: an object has a lifetime, and the bugs in this course are all lifetime bugs** (leak = lifetime too long, dangling = used after it ended, double free = ended twice).

---

## Day 0: Compilation model, stack vs heap

**The one idea:** C++ is translated to machine code *before* it runs. Local variables are cleaned up automatically (stack); anything from `new` lives until *you* say `delete` (heap).

<details>
<summary>1. Why compile ahead of time instead of interpreting like Python?</summary>

Translating once at build time means no translation cost at run time. That's why C++ is used where speed matters. The price: you handle memory yourself.
</details>

<details>
<summary>2. What are the stages from source to executable?</summary>

Preprocess (`#include`, `#define`: pure text substitution) → compile (to assembly/object code, checks types) → assemble → link (joins object files and libraries, resolves references between them).
</details>

<details>
<summary>3. Why are there two memory regions?</summary>

Different lifetime needs. A local should vanish when its function returns (stack: automatic, fast, small). Sometimes data must outlive the function or its size is only known at run time (heap: flexible, you manage it).
</details>

<details>
<summary>4. What goes wrong with the heap?</summary>

Forget `delete` → **leak**. `delete` twice → **double free**. Use after `delete` → **use-after-free**. The last two are undefined behaviour. Python's GC makes these impossible, at a runtime cost.
</details>

<details>
<summary>5. What is the fix, in modern C++?</summary>

Don't write `delete` yourself: tie it to scope with `unique_ptr` (Day 9).
</details>

**Traps:** a stack overflow comes from deep recursion or huge local arrays, because the stack is only a few MB.

---

## Day 1: Reading assembly

**The one idea:** the CPU knows nothing about `x`, `y`, `z`. Every variable becomes a memory slot, and every calculation becomes **load into registers → compute → store back**.

<details>
<summary>1. What does <code>movl $10, -4(%rbp)</code> mean?</summary>

Store the constant 10 in the 4 bytes at address `rbp - 4`. AT&T order is `source, destination`; `$` = constant, `%` = register, `off(%reg)` = memory at `reg + off`.
</details>

<details>
<summary>2. Why can't the CPU just add <code>x + y</code>?</summary>

Names don't exist at run time. It has to load both values from memory into registers, add there, then store the result.
</details>

<details>
<summary>3. Why are the offsets −4, −8, −12?</summary>

Each `int` is 4 bytes. They're negative because the x86 stack grows toward lower addresses. The `l` in `movl` and the `e` in `eax` both mean 32 bits.
</details>

<details>
<summary>4. RBP vs EAX?</summary>

RBP holds an **address** (a bookmark for the current stack frame). EAX holds a **value** being worked on. Registers are workspace, not variables.
</details>

<details>
<summary>5. What did the compiler hide from you?</summary>

The prologue/epilogue (`push rbp`, `mov rbp, rsp`, `sub rsp, N` ... `ret`), name mangling (`_ZNSolsEi` = `cout << int`), and the return value going in EAX. At `-O2` it would fold `10 + 20` to 30 at compile time and skip the stack.
</details>

**Mistakes I made:** read the direction of `mov` backwards (it reads *from* `rbp-4` *into* EDX); did not do the arithmetic (rbp 1000 → address 996); treated EDX as a variable.

---

## Day 2: Pointers, references, stack vs heap

**The one idea:** a **pointer** is a variable whose value is an address you can follow (`*p`) or change (`p = &b`). A **reference** is a permanent second name for one object.

<details>
<summary>1. Value vs address: what do <code>x</code>, <code>&x</code>, <code>p</code>, <code>*p</code> give?</summary>

`x` = the value. `&x` = its address. `p` = the address stored in the pointer (same as `&x`). `*p` = the value at that address.
</details>

<details>
<summary>2. Same symbol, two meanings: how do I tell?</summary>

In a **declaration** (a type in front) `int* p` / `int& r` describes the variable. In an **expression** `*p` follows the pointer and `&x` takes an address.
</details>

<details>
<summary>3. What does <code>int& r = a; r = b;</code> do?</summary>

It copies b's *value into a*. It does not re-seat `r`. A reference can never be re-seated, can't be null, and must be initialised. Measured: `a = 2, b = 2`.
</details>

<details>
<summary>4. What does a function receive in each of the three passing styles?</summary>

By value: its own copy (caller unchanged). By pointer: a copy of the *address* (can change the caller via `*p`). By reference: an alias of the caller's object. Measured: after value/ref/pointer calls the variable went 50 → 50 → 200 → 300.
</details>

<details>
<summary>5. In <code>int* p = new int(50);</code> what lives where?</summary>

`p` is on the stack. The `50` is on the heap. When the function ends `p` vanishes and the `50` stays: leak unless you `delete p; p = nullptr;`.
</details>

<details>
<summary>6. How does this map to Python?</summary>

Python names are *references to objects*. `b = a` copies nothing. `b.append()` mutates the shared object (like a C++ reference); `b = [...]` moves the name (unlike a C++ reference, where `=` overwrites the object). Passing a list/tensor into a function and mutating it changes the caller's object.
</details>

**Measured:** heap addresses (`0x29c6…`) and stack addresses (`0xce8a…`) are in completely different ranges.
**Trap:** "locals on the stack, `new` on the heap" is a learning model, not a law; the compiler may keep a local in a register.

---

## Day 3: Stack frames, lifetime, dangling pointers

**The one idea:** every call gets its own **stack frame**, popped on return. A pointer to something in that frame **dangles** after the return: the address is valid-looking, the object is gone.

<details>
<summary>1. Why is <code>score</code> still 90 after <code>greet()</code> returns?</summary>

`score` belongs to main's frame, `message` to greet's frame. Different invocations, different variables. greet's frame is popped; main's is untouched.
</details>

<details>
<summary>2. Scope vs lifetime?</summary>

**Scope** = where a *name* can be used in source. **Lifetime** = how long the *object* exists at run time. For a plain local, leaving the block ends both. For a `new` object the pointer's scope ending does **not** end the object's lifetime.
</details>

<details>
<summary>3. What happens to a frame after return, and why does that matter?</summary>

It is not erased, just freed for reuse. Measured: two calls from the same place put their locals at the *same address* (`&a` == `&b`).
</details>

<details>
<summary>4. Why is a dangling pointer so dangerous, not just wrong?</summary>

It *seems to work*. Measured: `*p` right after return = 5, after `stomp()` = 999, after a `cout` = 32758. Any later call overwrites it. Writing through it can corrupt another function's locals or a saved return address (the root of many exploits). All undefined behaviour.
</details>

<details>
<summary>5. Which other things dangle?</summary>

Stack: pointer or reference to a returned local. Heap: use-after-free, double free. References dangle too (`int& bad() { int x; return x; }`) and there's no `nullptr` to check.
</details>

<details>
<summary>6. What are the three fixes?</summary>

Return **by value** (small or big; big objects get moved or built in place). Return a `unique_ptr` if it must outlive the function. After `delete`, set the pointer to `nullptr` so a bad use crashes loudly.
</details>

**Tip:** always compile with `-Wall`. GCC warns (`-Wdangling-pointer`) and even quietly returns `nullptr` for a plain `return &x;`.

---

## Day 4: Arrays and vectors

**The one idea:** an array is many values in **contiguous** memory, so element *i* is at `base + i × sizeof(T)`. A `vector` is a resizable array that reallocates when it runs out of room.

<details>
<summary>1. Why do arrays exist?</summary>

A thousand separate variables is unmanageable. An index + a loop lets one piece of code visit all of them.
</details>

<details>
<summary>2. What does contiguous mean, and what did you see?</summary>

Elements are packed next to each other. Measured `sizeof(int) = 4` and addresses `…970, …974, …978, …97c, …980`: each exactly 4 bytes apart.
</details>

<details>
<summary>3. What's wrong with <code>marks[5]</code> on a 5-element array?</summary>

Valid indices are 0–4. Index 5 is out of bounds: undefined behaviour, and no automatic check.
</details>

<details>
<summary>4. Array vs vector?</summary>

Array: fixed size for life. Vector: grows with `push_back`, knows `size()`. Elements stay contiguous.
</details>

<details>
<summary>5. Why can a vector's address change?</summary>

When capacity runs out, it allocates a bigger block, copies the elements, frees the old one. Measured: `data()` went `0x22a88cb7ed0` → `…ef0` after a `push_back`. Never hold a pointer/iterator across a `push_back`.
</details>

<details>
<summary>6. Why is <code>push_back</code> still cheap on average?</summary>

Capacity grows geometrically (typically doubling), so the total copy work over n pushes is O(n): **amortised O(1)** per push.
</details>

**Trap:** `size()` = elements stored; `capacity()` = room before the next reallocation.

---

## Day 5: Strings and text

**The one idea:** the computer stores *numbers*; the program decides how to *interpret and display* them. A string is an array of `char`s (bytes), and one visible character can take several bytes.

<details>
<summary>1. Same stored value, two outputs: why?</summary>

`char c = 'A'` stores 65. `cout << c` prints it as text; `cout << static_cast<int>(c)` prints the number. Type = interpretation.
</details>

<details>
<summary>2. What is a <code>std::string</code> compared to a vector?</summary>

A growable sequence of `char` with text helpers: `[]`, `length()`, `+=`. Mutable in place (`s[0] = 'Y'`).
</details>

<details>
<summary>3. What is the loop pattern for text processing?</summary>

Iterate → inspect → update. Counting the a's in `"data analytics"` gave 4. The same shape appears in log parsing, cleaning and tokenising.
</details>

<details>
<summary>4. Why does <code>length()</code> lie about "characters"?</summary>

It counts **bytes**. Measured: `"café"` has `length() = 5` (4 visible characters, 5 bytes in UTF-8). Non-Latin scripts (e.g. Malayalam) use multiple bytes per character.
</details>

<details>
<summary>5. C++ string vs Python string?</summary>

C++ `std::string` is mutable. Python strings are immutable: `text = "H" + text[1:]` builds a *new* string and moves the name.
</details>

**Why it matters later:** tokenisers and LLM context limits count tokens/bytes, not "letters".

---

## Day 6: Searching and sorting

**The one idea:** **sorted data buys you speed.** Linear search checks one by one; binary search throws away half the candidates each step, but only works on sorted input.

<details>
<summary>1. How does linear search work, and what's the <code>-1</code> for?</summary>

Check each element until found, then `break`. `-1` is a "not found" marker because it can't be a valid index.
</details>

<details>
<summary>2. How does binary search work?</summary>

Look at the middle. Equal → done. Middle < target → `left = mid + 1`. Middle > target → `right = mid - 1`. Loop `while (left <= right)`. Use `mid = left + (right - left) / 2` to avoid overflow. Measured: found 25 in 2 middles; the missing 100 took 3 and returned not found.
</details>

<details>
<summary>3. What is the precondition?</summary>

Data must be sorted in the order you search by. On unsorted data the "discard half" step is wrong.
</details>

<details>
<summary>4. How does bubble sort work, and what is <code>temp</code>?</summary>

Compare neighbours, swap if out of order; each pass pushes the largest to the end (`j < n-1-i` skips the finished tail). `temp` is the third cup you need to swap two values. Measured: `9 2 7 1 5` → `1 2 5 7 9`.
</details>

<details>
<summary>5. Costs?</summary>

Linear: O(n). Binary: O(log n) (~10 comparisons for 1,000 items). Bubble sort: O(n²), a teaching tool; merge sort and the like are better.
</details>

**Trap:** sorting costs too. Binary search only pays off if you search many times, or the data arrives sorted.

---

## Day 7: Big-O

**The one idea:** Big-O describes how **work grows with input size**, independent of the machine. Wall-clock times on one computer tell you nothing about 1,000 → 1,000,000 items.

<details>
<summary>1. Why not just time it?</summary>

Different machines, different inputs, and a program that's fast at 1,000 items can be hopeless at a million.
</details>

<details>
<summary>2. The four classes, and how to spot each in code?</summary>

O(1): one indexed access. O(n): one loop. O(n²): nested loops over n. O(log n): the problem is halved each step (1024 → 1 takes 10 halvings).
</details>

<details>
<summary>3. What did the table of counts show?</summary>

At n = 100,000: O(log n) = 16, O(n) = 100,000, O(n²) = 10,000,000,000. Log grows very slowly; quadratic explodes.
</details>

<details>
<summary>4. Why drop constants and lower terms?</summary>

For large n the dominant term decides the growth shape: `3n² + 5n + 10` → O(n²); `2n` → O(n). (Constants still matter for small n and real performance.)
</details>

<details>
<summary>5. Best, worst, average?</summary>

Linear search: best 1 comparison, worst n. We usually quote **worst case**: it tells you how bad it can get.
</details>

**Trick:** to check a complexity claim, count the core operation instead of timing it.

---

## Day 8: Structs, classes, constructors, destructors

**The one idea:** a class is **data plus the rules (invariants) that keep it valid**. A constructor establishes the invariant; the destructor marks the end of the object's life.

<details>
<summary>1. Why isn't a plain struct enough?</summary>

Anyone can set `balance = -1000000`. Nothing protects the data's meaning.
</details>

<details>
<summary>2. <code>struct</code> vs <code>class</code>?</summary>

Only the default access differs: struct members are public, class members are private. Same thing otherwise.
</details>

<details>
<summary>3. What is an invariant, and how is it protected?</summary>

A condition that must always hold (e.g. balance ≥ 0). Make the data `private` and allow changes only through methods that check the rule (`deposit(-50)` rejected, `withdraw(5000)` rejected).
</details>

<details>
<summary>4. What does a constructor do, and what is the initializer list?</summary>

It builds a valid object. `: name_(n), balance_(b)` initialises members directly instead of assigning afterwards. Validate and `throw` inside the constructor. Measured: a failed construction means **no destructor runs**, because the object never existed.
</details>

<details>
<summary>5. When do ctors and dtors run?</summary>

Stack object: ctor at its declaration, dtor at the closing `}`. Several objects: destroyed in **reverse** order (measured: Second before First). Heap object: dtor at `delete`.
</details>

<details>
<summary>6. What does a destructor <em>not</em> do?</summary>

It doesn't free the memory of the object itself, and it doesn't clean up what a raw pointer member points to unless you write that. (That gap is why Day 9 exists.)
</details>

**Trap:** a `const` getter promises not to modify the object.

---

## Day 9: RAII and smart pointers

**The one idea:** **RAII**: acquire a resource in a constructor, release it in the destructor. Scope exit runs the destructor, so cleanup can't be forgotten, even on an early return or exception.

<details>
<summary>1. What counts as a resource?</summary>

Anything you must give back: heap memory, files, sockets, locks, GPU memory.
</details>

<details>
<summary>2. Why is manual <code>new</code>/<code>delete</code> fragile?</summary>

An early `return` or exception between them skips the `delete`. Measured: the raw pointer on an early return **leaked** (never printed "destroyed") while the `unique_ptr` beside it cleaned up.
</details>

<details>
<summary>3. What's the pointer lifetime vs the pointee lifetime?</summary>

A raw pointer's end does nothing to the object. A smart pointer is an object whose destructor *does* delete what it owns. That's the whole trick.
</details>

<details>
<summary>4. <code>unique_ptr</code>?</summary>

One owner, zero overhead, **move-only** (cannot be copied). Create with `make_unique`. After `std::move`, the source is empty. Measured: object destroyed at the end of its block, or end of function if no inner braces.
</details>

<details>
<summary>5. <code>shared_ptr</code>?</summary>

Shared ownership with a reference count. Measured owner count 1 → 2 → 1 → destroyed when the last owner lets go. Costs an extra count and atomic updates; don't default to it.
</details>

<details>
<summary>6. When is a raw pointer still fine?</summary>

For **non-owning** access: "look at this, but don't free it". Ownership is expressed by the type: `unique_ptr` = I own it, `shared_ptr` = we own it, raw = I'm only borrowing.
</details>

**Applied:** `stack_vs_heap.cpp` now has `heapExampleUniquePtr()`: `Traced(4)` is destroyed with no `delete` written, next to the original leak `Traced(3)`.

---

## Day 10: Copy vs move semantics

**The one idea:** copying an owning object must **duplicate** its resource (deep copy); moving **steals** it and leaves the source empty. Moving avoids the allocation.

<details>
<summary>1. What goes wrong if you copy an object holding a raw pointer?</summary>

The default copy copies the *pointer*, so two objects own one array. Both destructors `delete[]` it → **double free**. Need a deep copy.
</details>

<details>
<summary>2. What does the copy constructor do?</summary>

`Buffer(const Buffer&)` allocates its own array and copies the values. Costs an allocation and O(n) work.
</details>

<details>
<summary>3. What does the move constructor do, and why <code>noexcept</code> and nulling?</summary>

`Buffer(Buffer&&)` takes the other's pointer and size, then sets the other's pointer to `nullptr` and its size to 0, so only one object frees it (`delete nullptr` is safe). Mark it `noexcept` so containers like vector use it when growing.
</details>

<details>
<summary>4. Lvalue vs rvalue, and what does <code>&&</code> mean?</summary>

Lvalue: has a name/address, you can use it again. Rvalue: temporary, about to vanish. `T&&` binds to rvalues, which tells the compiler it's safe to steal from.
</details>

<details>
<summary>5. What does <code>std::move</code> actually do?</summary>

**Nothing at run time: it is just a cast to an rvalue reference.** The *move constructor* does the stealing. Measured: with no overload taking the rvalue, `std::move(s)` left `s` as `"hello"`.
</details>

<details>
<summary>6. Rule of 0 / 3 / 5?</summary>

**0:** own nothing raw (use `string`, `vector`, smart pointers) and write no special members. **3:** if you write a destructor, copy ctor or copy assignment, you need all three. **5:** add move ctor and move assignment.
</details>

**Measured allocation counts:** construct 1 → copy 2 → move *still 2* → copy-assign 3 → move-assign *still 3*. Each array freed exactly once, in reverse destruction order.
**Trap:** a moved-from object is valid but unspecified: don't use its value, only destroy or reassign it.

---

## Cheat sheet: bugs from these ten days

| Bug | What happened | Prevention |
|---|---|---|
| Memory leak | `new` with no `delete` | `unique_ptr` / RAII |
| Double free | `delete` twice, or two owners of one pointer | single owner; Rule of 3/5; null after move |
| Use-after-free | used pointer after `delete` | `nullptr` after delete; smart pointers |
| Dangling pointer or reference | points into a dead stack frame | return by value; never return `&local` |
| Out-of-bounds | `arr[n]` on size n | `0..n-1`; `.at()` when unsure |
| Stale vector pointer | held `&v[0]` across `push_back` | re-fetch after growth |
| Binary search on unsorted data | wrong answers | sort first, or use linear |
| Accidental O(n²) | nested loop on big input | count operations; pick a better algorithm |

## Final recall quiz (no scrolling up)

1. Draw main calling greet: what's on the stack at each step?
2. `int* p = new int(5);` → where is each thing, and who frees it?
3. `r = b` on a reference: what happens and why?
4. Why does `*p` read 5 right after a dangling return and 999 later?
5. Why do two vector `push_back`s sometimes move the data?
6. Why is `length()` of `"café"` 5?
7. Binary search on `[5, 8, 14, 17, 23, 31, 42]` for 31: list the mids.
8. Which of these is O(n²)? Which is O(log n)?
9. When does the destructor run for: a stack object, two objects in a block, a heap object, a failed constructor?
10. Why does `unique_ptr` clean up on an early return when a raw pointer doesn't?
11. Why are there 2 allocations after copy and still 2 after move?
12. What does `std::move` do on its own?

## My explanation (fill in without looking)

> Write the thread-through-all-ten-days summary in your own words here. Then tick the level you honestly have.

- [ ] 0 — Unfamiliar
- [ ] 1 — Familiar
- [ ] 2 — Working knowledge
- [ ] 3 — Deep understanding
- [ ] 4 — Advanced
