# Day 2 Revision: Stack, Heap, Pointers & References

**Date:** 2026-10-09
**Code:** [`day2.cpp`](day2.cpp)
**Builds on:** [Day 1: Reading Assembly](day1-reading-assembly.md)

---

## 1. Today's question

> When my program runs, **where does its data live**, and **how does the program get to it**?

Day 1 answer, quick recap: the compiler gives each variable a slot in memory (like `rbp - 4`), and the CPU loads it into registers to work on it.
Today we learn how a program can **hold on to an address** and use it to reach data **indirectly**.

---

## 2. Value vs address

Think of memory as a street of houses. Each house has an **address** (where it is) and **contents** (what's inside).

```
   address      contents
  ┌────────┬────────────┐
  │  1000  │     25     │  ← age
  └────────┴────────────┘
```

| I write     | I get                                         |
|-------------|-----------------------------------------------|
| `age`       | the **value** → `25`                          |
| `&age`      | the **address** → something like `0x6b1c3ff6b4` |

> Addresses like `1000` in these notes are made up. Real ones look like `0x6b1c3ff6b4` and change every run.

---

## 3. Stack vs heap

### Stack: automatic, tied to function calls

```cpp
void greet() {
    int age = 25;      // created when greet() starts
    int score = 90;
}                      // age and score end here, automatically
```

- Every function call gets its own **stack frame**: a working area for its local variables.
- When the function **returns**, the frame is thrown away, and so are its locals.
- This is the `rbp - 4`, `rbp - 8` area from Day 1.

### Heap: memory you ask for and must give back

```cpp
int* p = new int(50);   // ask for an int on the heap, initialised to 50
// ... use *p ...
delete p;               // give it back
p = nullptr;            // so p doesn't hold a stale address
```

There are **two separate things** here:

```
      STACK                         HEAP
 ┌──────────────┐            ┌──────────────┐
 │ p = 0x2463…  │ ─────────→ │      50      │
 └──────────────┘            └──────────────┘
  local pointer               dynamically allocated int
  (dies at end of function)   (lives until you call delete)
```

- `p` is a normal local variable on the **stack**.
- The `50` lives on the **heap**.
- When the function ends, `p` disappears but **the 50 does not**. If you never `delete` it, that memory is lost until the program exits. This is a **memory leak**.

### Side by side

| | Stack | Heap |
|---|---|---|
| What goes there | Local variables, function-call info | Things made with `new` |
| Who cleans up | Automatic, when the function returns | **You**, with `delete` (or a smart pointer) |
| Lifetime | Tied to the function call | Until it's deleted |
| Typical bug | Stack overflow (too-deep recursion) | Leak, double delete, use after delete |

### 👀 Seen in my own output

```
h      = 0x24635f426a0     ← heap address
&score = 0x6b1c3ff6b4      ← stack address
```

The two kinds of address are in **completely different ranges**, because stack and heap are different regions of memory.

> ⚠️ "Locals are on the stack, `new` is on the heap" is a **learning model**, not a law. The compiler can keep a local entirely in a register (remember EAX/EDX from Day 1). In modern C++, `std::vector`, `std::string` and `std::unique_ptr` handle `new`/`delete` for you.

---

## 4. Pointers

> A **pointer** is a variable whose value is an **address**.

```cpp
int x = 10;
int* p = &x;    // p holds the address of x
```

```
     p                    x
 ┌────────┐          ┌────────┐
 │  1000  │ ───────→ │   10   │   (x lives at address 1000)
 └────────┘          └────────┘
```

The pointer does **not** hold a copy of 10. It holds **where to find** the 10.

### The four expressions to know

| Expression | Means | Example output |
|---|---|---|
| `x`   | value of x | `10` |
| `&x`  | address of x | `0x6b1c3ff6b4` |
| `p`   | the address stored in p | `0x6b1c3ff6b4` (same as `&x`) |
| `*p`  | **the value at** the address in p | `10` |

### Dereferencing: `*p`

**Dereferencing** means following the arrow to the object it points to.

```cpp
*p = 99;        // follow p to x, put 99 there
// x is now 99. p itself did NOT change, it still holds x's address.
```

### Re-pointing

A pointer can be changed to point somewhere else:

```cpp
int a = 1, b = 2;
int* q = &a;    // *q is 1
q = &b;         // q now points to b; *q is 2, and a is untouched
```

> ⚠️ **Never dereference** a pointer that is uninitialised, `nullptr`, or pointing at memory that has been `delete`d. That's **undefined behaviour**: it might crash, or silently give garbage.

---

## 5. The confusing symbols: `&` and `*`

The **same symbol** means different things depending on **where it appears**.

| Symbol | In a **declaration** (making a variable) | In an **expression** (using a variable) |
|---|---|---|
| `*` | `int* p`: p **is a pointer** to int | `*p`: **go to** what p points at |
| `&` | `int& r = x`: r **is a reference** (alias) to x | `&x`: **the address of** x |

The trick: if there's a **type in front** (`int*`, `int&`), it's describing what kind of variable you're declaring.

---

## 6. References: another name for the same thing

```cpp
int x = 10;
int& r = x;     // r is an ALIAS for x: two names, one integer
r = 50;         // x is now 50
```

Analogy: one person, two names (a real name and a nickname). Whatever happens to "the nickname" happens to the person.

### Rules
- Must be initialised: `int& r;` on its own is a **compile error**.
- Can **never be re-seated**, i.e. made to refer to a different object later.

```cpp
int a = 1, b = 2;
int& r = a;
r = b;          // ❗ NOT "r now refers to b"
                //    It means "a = b", so a becomes 2
```

(This is Experiment 5 in `day2.cpp`. Output: `a = 2, b = 2`.)

### Pointer vs reference

| | Pointer `int* p` | Reference `int& r` |
|---|---|---|
| What it is | A variable holding an address | Another name for an existing object |
| Can be null | Yes (`nullptr`) | No |
| Can be re-pointed | Yes (`p = &b;`) | No, never |
| Must be initialised | No (but you should) | Yes |
| How to reach the object | `*p` | Just `r` |

---

## 7. Three ways to pass to a function

```cpp
void by_value(int x)      { x = 100;  }   // gets a COPY
void by_pointer(int* p)   { *p = 300; }   // gets a copy of the ADDRESS
void by_reference(int& x) { x = 200;  }   // gets an ALIAS
```

```
by_value(score)          by_pointer(&score)        by_reference(score)

score: 10                score: 10 ◄──┐            score ┐
x:     10 → 100            p: 1000 ───┘                  ├─→ 10 → 200
(separate copy;          (*p follows the address    x ───┘
 score unchanged)         back to score)            (same object)
```

| Call | What the function receives | Does `score` change? |
|---|---|---|
| `by_value(score)` | Its own copy of the integer | ❌ No |
| `by_pointer(&score)` | A copy of score's **address** | ✅ Yes, via `*p` |
| `by_reference(score)` | An alias for score itself | ✅ Yes |

**Why doesn't pass-by-value change the original?** The parameter `x` is a **separate integer**, initialised from `score`. Changing `x` changes only `x`, and `x` is thrown away when the function returns.

> 💡 The compiler even warned me about this:
> `warning: parameter 'x' set but not used`.
> It knows `x = 100` inside `by_value` has no effect outside the function.

---

## 8. Connecting to Python

```python
a = [1, 2, 3]
b = a           # no copy! b is a second name for the SAME list
b.append(4)
print(a)        # [1, 2, 3, 4]
print(b)        # [1, 2, 3, 4]
print(a is b)   # True: same object
```

```
 a ──┐
     ├──→ [1, 2, 3, 4]
 b ──┘
```

Python variables are **names attached to objects**, not boxes holding values.

But **assigning** a new object just moves the name:

```python
b = [9, 8]      # b now names a NEW list; a is untouched
print(a)        # [1, 2, 3, 4]
print(b)        # [9, 8]
```

| Python operation | Effect |
|---|---|
| `b.append(4)` | **Changes** the shared object, so both names see it |
| `b = [9, 8]` | **Moves the name** b to a new object; a is unaffected |
| `b = a.copy()` | Makes a real copy, so they're independent |

> This is like a C++ reference when you **mutate** (`append`), but **unlike** a C++ reference when you **assign** (`=` moves the name instead of overwriting the object). Don't force the two models to match.

**Why this matters later:** passing a list, dict or NumPy array/PyTorch tensor into a function and mutating it **changes the caller's object**. This is a common source of bugs in ML code.

---

## 9. Predict the output

Cover the answers. Predict first, then run `g++ day2.cpp -o day2 && ./day2` and compare.

```cpp
int score = 10;
int* p = &score;

std::cout << score;     // 1. ?
std::cout << *p;        // 2. ?
*p = 50;
std::cout << score;     // 3. ?
by_value(score);
std::cout << score;     // 4. ?
by_reference(score);
std::cout << score;     // 5. ?
by_pointer(&score);
std::cout << score;     // 6. ?
```

<details>
<summary>Answers & reasons</summary>

| Line | Output | Why |
|---|---|---|
| 1 | `10` | score's own value |
| 2 | `10` | p points to score, so `*p` reads score |
| 3 | `50` | `*p = 50` wrote through the pointer into score |
| 4 | `50` | by_value changed only its own copy |
| 5 | `200` | by_reference's `x` *is* score |
| 6 | `300` | by_pointer followed the address back to score |

</details>

---

## 10. Self-quiz

<details>
<summary>1. If <code>p</code> contains the address of <code>x</code>, what does <code>*p = 50</code> do?</summary>

It changes the **value of the object p points to** (x) to 50. The address stored in p stays the same.
</details>

<details>
<summary>2. Why doesn't changing a pass-by-value parameter change the caller's integer?</summary>

The function gets **its own separate integer**, initialised with a copy of the caller's value. Changing it changes only the copy. This is a language rule, not something the CPU enforces.
</details>

<details>
<summary>3. In Python, why do <code>a</code> and <code>b</code> both show the appended element?</summary>

`b = a` doesn't copy. Both names refer to the **same mutable list object**, and `append` changes that one object.
</details>

<details>
<summary>4. After <code>int* p = &a;</code>, what happens when you write <code>p = &b;</code>?</summary>

p now points to **b**. Neither a nor b changes. Only the address stored in p changes.
</details>

<details>
<summary>5. After <code>int& r = a;</code>, what does <code>r = b;</code> do?</summary>

It copies **b's value into a**. A reference can't be re-seated, so r still refers to a.
</details>

<details>
<summary>6. What happens to a function's local integer when the function returns?</summary>

Its lifetime ends and the stack frame is discarded. It is **not** moved to the heap, and memory isn't "erased". The space simply becomes free for the next function call.
</details>

<details>
<summary>7. In <code>int* p = new int(50);</code>, what is on the stack and what is on the heap?</summary>

**p** (the pointer variable) is on the stack. The **integer 50** is on the heap. When the function ends, p disappears, but the 50 stays until someone calls `delete`.
</details>

<details>
<summary>8. What's the difference between <code>p</code> and <code>*p</code>?</summary>

`p` is **the address** (where). `*p` is **the value at that address** (what).
</details>

---

## 11. "Done for today" checklist

Explain each one **out loud, in your own words**, without looking:

- [ ] The difference between stack and heap at a basic level
- [ ] What a pointer stores, and what dereferencing means
- [ ] Why a reference parameter can modify the caller's integer
- [ ] Why two Python names can refer to the same list

---

## 12. One-sentence summary

> A **pointer** holds an *address* you can follow (`*p`) or change (`p = &b`); a **reference** is a permanent *second name* for an object; and **stack** memory cleans itself up when a function returns, while **heap** memory lives until you `delete` it.

---

## Next (Day 3)

How function calls build **stack frames**, what happens when a function returns, and why **dangling pointers** (pointers to memory that's gone) are dangerous. Preview:

```cpp
int* bad() {
    int x = 5;
    return &x;   // ⚠️ x dies when bad() returns, so this address points at nothing valid
}
```
