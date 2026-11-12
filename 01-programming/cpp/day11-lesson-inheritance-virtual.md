# Day 11 — Inheritance, Virtual Functions & Vtables

Phase 1 · C++ Foundations · Day 11 of 177

**Builds on:** [Day 10 lesson](day10-lesson-copy-move.md) · **Code:** [`day11.cpp`](day11.cpp) · **Assembly:** [`day11-dispatch.cpp`](day11-dispatch.cpp) → [`_O0.s`](day11-dispatch_O0.s) / [`_O2.s`](day11-dispatch_O2.s)

> **The one idea:** a call through a base pointer normally runs the *pointer's* version of a function. `virtual` makes it run the *object's* version instead. Compilers do this by giving every object a hidden pointer (the vptr) to a per-class table of function addresses (the vtable), and making the call through that table.

---

## Revise in 10 minutes: rebuild it from scratch

Cover the answers. Each question follows from the one before it, so if you can answer them in order you can rebuild the whole topic.

<details>
<summary><b>1.</b> You have Circle, Rectangle and Triangle, each with its own <code>area()</code>. What do you want to be able to write?</summary>

One loop over a mixed collection that calls `shape->area()` and gets the right formula for each, without an `if (it's a circle) … else if …` chain that grows with every new shape.
</details>

<details>
<summary><b>2.</b> To put them in one collection, they need a common type. How?</summary>

**Inheritance.** Make a base class `Shape`, and derive the others from it (`class Circle : public Shape`). A `Circle` *is a* `Shape`, so a `Shape*` can point at a `Circle`.
</details>

<details>
<summary><b>3.</b> Without <code>virtual</code>, <code>Shape* p = &amp;circle; p-&gt;area();</code> runs <code>Shape::area</code>. Why?</summary>

**Static dispatch.** For a non-virtual function, the compiler picks the function at compile time from the type it can see at the call site, which is `Shape*`. It never looks at what the pointer really points to.
</details>

<details>
<summary><b>4.</b> So what has to change, and what does <code>virtual</code> do?</summary>

The decision has to move to **run time** and be based on the **actual object** (its dynamic type). `virtual` on the base function says "decide at run time." This is **dynamic dispatch**. `override` on the derived version makes the compiler check that it really does override something.
</details>

<details>
<summary><b>5.</b> At run time, the call site sees only an address. How can the program find out which <code>area()</code> belongs to the object?</summary>

The object has to carry that information itself. Each polymorphic object holds a hidden **vptr**, pointing to its class's **vtable**: a table of function addresses, one slot per virtual function. A `Circle`'s vptr points to the Circle table, whose `area` slot holds `Circle::area`.
</details>

<details>
<summary><b>6.</b> Walk through <code>p-&gt;area()</code> as the machine does it.</summary>

1. Load the vptr from the start of the object `p` points to.
2. Load the `area` slot from that vtable.
3. Call that address, passing `p` as `this`.

Two memory loads and an indirect call. You can see exactly this in [`day11-dispatch_O0.s`](day11-dispatch_O0.s).
</details>

<details>
<summary><b>7.</b> What does it cost?</summary>

- **Space:** one vptr per object (8 bytes on 64-bit, plus padding). Measured here: `int` alone = 4 bytes, `int` + virtual = 16 bytes. There's one vtable per *class*, not per object, so adding more virtual functions doesn't grow the object.
- **Time:** an indirect call that's harder to predict and usually can't be inlined.

It's often worth it. And when the compiler can prove the type, it removes the cost entirely ("devirtualization").
</details>

<details>
<summary><b>8.</b> <code>delete p;</code> where <code>p</code> is a <code>Shape*</code> pointing to a Circle. What can go wrong?</summary>

If `~Shape` isn't virtual, the destructor call is statically dispatched too, so only `~Shape` runs. Officially that's undefined behaviour. **A polymorphic base class needs a virtual destructor.** Then `~Circle` runs first, followed by `~Shape`.
</details>

<details>
<summary><b>9.</b> What should <code>Shape::area()</code> return? A generic shape has no area.</summary>

Nothing. Make it **pure virtual**: `virtual double area() const = 0;`. That makes `Shape` an **abstract class**: you can't create a `Shape`, only point to one, and every concrete shape must implement `area()`. The base class becomes a contract.
</details>

---

## 1. What is it?

- **Inheritance:** a *derived* class gets the members of a *base* class. `class Circle : public Shape` means Circle is a Shape.
- **Polymorphism** ("many forms"): one interface (`area()`), different behaviour depending on the object.
- **Virtual function:** a member function whose call through a base pointer or reference is decided at run time by the object's real type.
- **vtable / vptr:** the usual implementation. One table of function addresses per class, and one hidden pointer to it in each object.

## 2. Why does it exist?

Without it, code that handles "any shape" needs to know every shape:

```cpp
if (type == CIRCLE)         area = 3.14159 * r * r;
else if (type == RECTANGLE) area = w * h;
else if (type == TRIANGLE)  area = 0.5 * b * h;
// every new shape means editing every one of these chains
```

Virtual functions let you write that code once against the base class (`shape->area()`), and new shapes plug in without changing it.

## 3. What problem does it solve?

Calling the right implementation when the exact type is only known at run time. Example: a `std::vector<std::unique_ptr<Shape>>` filled from user input.

## 4. How does it work?

### Static dispatch: the default

```cpp
struct StaticBase    { void who() const { cout << "StaticBase::who\n"; } };
struct StaticDerived : StaticBase { void who() const { cout << "StaticDerived::who\n"; } };

StaticDerived sd;
StaticBase* sp = &sd;
sd.who();    // StaticDerived::who
sp->who();   // StaticBase::who   <- chosen from the pointer type at compile time
```

Without `virtual`, `StaticDerived::who` only *hides* the base version. It doesn't override it.

### Dynamic dispatch: add `virtual`

```cpp
class Shape {
public:
    virtual double area() const = 0;   // pure virtual -> Shape is abstract
    virtual ~Shape() = default;        // needed for delete through Shape*
};

class Circle : public Shape {
    double radius;
public:
    explicit Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
};
```

- The signature has to match exactly, including `const`. `override` makes a mismatch a compile error, instead of quietly creating a new, unrelated function.
- Calls go through the object's vtable, so `Shape* p = &circle; p->area()` runs `Circle::area`.

### The machinery

```
 Circle object                        Circle's vtable (one per class)
┌────────────────┐                   ┌──────────────────────────┐
│ vptr ──────────┼─────────────────> │ area      → Circle::area │
│ radius = 5.0   │                   │ ~dtor     → ~Circle      │
└────────────────┘                   └──────────────────────────┘
```

`p->area()` = load the vptr → load the `area` slot → call it.

The C++ standard specifies the *behaviour* of virtual functions, not vtables. Vtables are how GCC, Clang and MSVC all implement it.

### Virtual destructor

```cpp
Shape* s = new Circle(5);
delete s;   // virtual ~Shape: runs ~Circle, then ~Shape
```

Destruction always goes from the most derived class to the base, the reverse of construction.

## 5. Mathematical foundation

N/A. The relevant arithmetic is memory layout:

| Class | Members | Size measured here (MinGW-w64 GCC, x86-64) |
|---|---|---|
| `PlainShape` | `int` | **4** |
| `VirtualShape` | `int` + vptr | **16** = 8 (vptr) + 4 (int) + 4 (padding to an 8-byte boundary) |
| `VCircle` | `VirtualShape` + `double` | **24** = 16 + 8 |
| `TwoVirtuals` | `int` + vptr, 3 virtual functions | **16**: still one vptr |

`sizeof` measures the object, not the vtable. The vtable lives once, in the program's read-only data.

## 6. Minimal implementation

- [`day11.cpp`](day11.cpp): static vs dynamic dispatch, an abstract `Shape` hierarchy driven by one loop, the virtual-destructor order, and the `sizeof` table above.
- [`day11-dispatch.cpp`](day11-dispatch.cpp): two tiny functions to read in assembly.

## 7. Example: reading a virtual call in assembly

Windows x64 passes the first argument in `rcx`. Linux and macOS use `rdi`.

**`callFunction(Base* ptr)` at `-O0`:** the textbook dispatch.

```asm
mov  rax, QWORD PTR 16[rbp]   ; rax = ptr
mov  rax, QWORD PTR [rax]     ; rax = ptr->vptr           (load 1)
mov  rdx, QWORD PTR [rax]     ; rdx = vtable[0] = calculate (load 2)
mov  rcx, ...ptr...           ; this = ptr
call rdx                      ; indirect call
```

**The same function at `-O2`:** GCC guesses.

```asm
lea  rdx, Derived::calculate
mov  rax, [rcx]               ; vptr
mov  rax, [rax]               ; vtable slot
cmp  rax, rdx                 ; is it Derived::calculate?
je   .L6                      ;   yes -> return 20 (inlined, no call)
...  same check for Base::calculate -> return 10
rex.W jmp rax                 ; anything else: the real indirect jump
```

This is **speculative devirtualization**. GCC can see the only two implementations in this file, so it checks for them and inlines them. It still does the real vtable call for any other class.

**`callKnown()` at `-O2`:** the type is provable, so the whole call disappears.

```asm
mov  eax, 20
ret
```

## 8. Trade-offs and limitations

| | Cost / limit |
|---|---|
| Object size | +1 pointer per object (plus padding). Matters for millions of tiny objects. |
| Call speed | Indirect call: an extra load, harder to predict, blocks inlining. Matters in hot inner loops. |
| Design | Deep hierarchies get rigid. Prefer shallow ones, or composition. |
| Pitfalls | Missing virtual destructor → UB on `delete`. Signature mismatch without `override` → silent new function. A virtual call inside a constructor or destructor uses the *current* class, not the derived one. |

The alternative is **templates** (Day 12): pick the implementation at compile time, with no vptr and no indirect call, but the type must be known when compiling.

## 9. Where is it used?

- **PyTorch:** `nn.Module` subclasses override `forward()`. The C++ core uses the same idea for operator dispatch.
- **GUI toolkits and game engines:** `Widget::draw()`, `Entity::update()`.
- **Plugin systems and device drivers:** one interface, many implementations loaded at run time.
- **`std::exception::what()`:** catch by base reference, get the derived message.

## 10. My explanation

*(Write this yourself, without looking. Use the revision ladder above as prompts: problem → inheritance → static dispatch → virtual → vptr/vtable → cost → virtual destructor → abstract class.)*

**What confused me:**

**My own example:** *(a small hierarchy, and how a base-pointer call reaches the derived function)*

## 11. Progress level

- [ ] 0 — Unfamiliar
- [ ] 1 — Familiar
- [ ] 2 — Working knowledge
- [ ] 3 — Deep understanding
- [ ] 4 — Advanced

---

## Completion checklist

- [ ] Recall Day 10 without notes (copy vs move, `std::move` is a cast, Rule of 0/3/5)
- [x] Shape hierarchy with an abstract base and `override`
- [x] `sizeof` with and without virtual, measured
- [x] Read the assembly of a virtual call at `-O0` and `-O2`
- [ ] Section 10 in your own words
- [x] `PROGRESS.md` updated and committed

## Tomorrow: Day 12 — Templates & STL containers

Today's runtime choice (virtual dispatch) has a compile-time counterpart: templates generate type-specific code while compiling. `std::vector`, `std::pair` and `std::map` are all templates.
