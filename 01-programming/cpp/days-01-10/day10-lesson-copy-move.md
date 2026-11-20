# Day 10 — Copy vs Move Semantics

Phase 1 · C++ Foundations · Day 10 of 177 · 90–120 minutes

**Builds on:** [Day 9 lesson](day9-lesson-raii-smart-pointers.md) · **Challenge solution:** [`day10.cpp`](day10.cpp)

Today's central question:

> When we copy an object, do we duplicate its resources? And when we move an object, can we transfer them instead?

Day 9 introduced `std::unique_ptr` and RAII. Today explains why C++ needs special rules for copying and transferring ownership, and how those rules make programs both safer and faster.

## 1. Copying a variable

```cpp
int a = 10;
int b = a;
b = 20;
```

`a` is still 10 and `b` is 20. `b = a` copied the value, and each variable has its own. That's simple for an `int`, because an `int` doesn't own anything else.

But should copying an object that owns a large block of memory duplicate the whole block, or hand the existing block over? Those are different operations with different consequences.

## 2. Copying a resource-owning object

Picture a `Buffer` that owns an array of 1,000 integers.

| | Copy A into B |
|---|---|
| A | owns its own block of 1,000 integers |
| B | owns a **separate** block with the same 1,000 integers |

Changing one doesn't affect the other. That's a **deep copy**: the owned data is duplicated, not just the pointer to it.

Copying only the address gives a **shallow copy**: both objects point at the same memory. That's dangerous when both think they own it.

## 3. The danger of copying a raw pointer

```cpp
int* a = new int(42);
int* b = a;      // both hold the same address X
```

```
a ──┐
    ├──> heap at X: 42
b ──┘
```

If both are treated as owners:

```cpp
delete a;
delete b;  // undefined behaviour: the same object deleted twice
```

After `delete a`, the integer is gone and `b` is dangling. Copying a raw pointer is allowed. The bug is treating a copied *address* as if it were independently owned *memory*.

## 4. The copy constructor

A copy constructor creates a new object from an existing one of the same type:

```cpp
ClassName(const ClassName& other);
```

```cpp
#include <iostream>
using namespace std;

class Number {
public:
    int value;

    Number(int v) : value(v) { cout << "Normal constructor\n"; }
    Number(const Number& other) : value(other.value) { cout << "Copy constructor\n"; }
};

int main() {
    Number a(10);
    Number b = a;
}
```

```
Normal constructor
Copy constructor
```

`Number b = a;` *creates* `b` from `a`. That's different from assignment:

```cpp
Number b(0);  // constructs b
b = a;        // assigns to an existing b: the copy-assignment operator
```

## 5. The move constructor

Suppose you want a new buffer from an existing one, and you don't need the original's data any more. Copying every element is wasted work. The new object can take over the existing allocation instead.

| Before the move | After the move |
|---|---|
| A owns memory at X | B owns the same memory at X |
| | A is left valid but empty |

```cpp
ClassName(ClassName&& other);
```

`&&` is an **rvalue reference** (next section). The source must stay valid, but its value may change. For our buffer, we'll leave it empty.

| | Copy | Move |
|---|---|---|
| Main idea | Create an independent copy | Transfer resources where possible |
| Large buffer | Allocate new memory and copy elements | Take over the existing allocation |
| Source object | Unchanged | Valid, but may be changed |
| Typical cost | Proportional to the data copied | Often constant time for a simple owning buffer |

Moving isn't always faster. It depends on the type and how it's implemented.

## 6. Lvalues vs rvalues: what `&&` means

Two categories for today:

- An **lvalue** identifies a persistent object, such as a named variable.
- An **rvalue** is, roughly, a temporary that isn't a named object. (C++'s full rules are more detailed, but this is the right starting intuition.)

```cpp
int a = 10;   // a is a named object
int b = a;    // a is an lvalue expression
int c = 10;   // 10 is an rvalue expression

int& left = a;     // lvalue reference binds to an lvalue
int&& right = 10;  // rvalue reference binds to an rvalue
```

C++ uses this to pick a constructor: one taking `const Buffer&` copies from an existing buffer, and one taking `Buffer&&` moves from a suitable source.

**A subtle point:** a *named* variable is an lvalue expression even if its type is an rvalue reference. Inside a function, `Buffer&& other` used as `other` is an lvalue, because it has a name. That's one reason `std::move` exists.

## 7. What `std::move` actually does

`std::move` does **not** move memory. It's a cast that lets an expression be treated as an rvalue, so a move constructor or move assignment can be chosen.

```cpp
Buffer a(1000);
Buffer b = std::move(a);   // lets the move constructor be selected
```

The move constructor is what actually transfers the allocation and leaves `a` valid.

1. `std::move` doesn't move anything by itself.
2. It doesn't guarantee a move happens. The type's available overloads decide.
3. After moving from an object, only use it in ways its new state allows. For our buffer we define that state as empty.

The `unique_ptr` case from Day 9:

```cpp
auto first = std::make_unique<int>(42);
auto second = std::move(first);   // second owns the int, first is empty, nothing copied
```

## 8. The Rule of 0, 3 and 5

Guidelines for when a class needs its own special member functions.

### Rule of 0: usually the best option

Build classes from types that already manage their resources, and write none of the special members yourself:

```cpp
#include <string>
#include <vector>

class Student {
public:
    std::string name;
    std::vector<int> marks;
};
```

`std::string` and `std::vector` manage their own memory, so the compiler-generated copy and move do the right thing.

### Rule of 3: you manage a resource yourself

If a class owns something directly (say, memory from `new[]`) and needs a custom destructor, it almost certainly also needs:

1. a destructor
2. a copy constructor
3. a copy-assignment operator

The compiler-generated copies copy members one by one. For a raw owning pointer, that copies the address, not the data.

### Rule of 5: add the move operations

Modern C++ adds two more:

4. a move constructor
5. a move-assignment operator

You can also explicitly `= delete` operations you don't want to support.

| Rule | Meaning |
|---|---|
| **0** | Let standard library types manage resources for you |
| **3** | Destructor + copy constructor + copy assignment |
| **5** | The Rule of 3 + move constructor + move assignment |

The Rule of 3/5 doesn't mean every class implements every function. It's a warning to think through copying, moving and destruction whenever a class owns a resource directly.

## 9. Build: a `Buffer` with copy and move constructors

`Buffer` owns a dynamically allocated `int` array. It:

- allocates when constructed with a size,
- deep-copies in its copy constructor,
- transfers the allocation in its move constructor,
- counts array allocations, so copy and move can be compared,
- prints when its destructor runs.

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <utility>

class Buffer {
private:
    int* data;
    std::size_t size;

    static int allocations;

public:
    explicit Buffer(std::size_t n)
        : data(n > 0 ? new int[n]{} : nullptr), size(n) {
        if (n > 0) {
            ++allocations;
        }
        std::cout << "Normal constructor\n";
    }

    // Deep copy: allocate separate memory and copy the elements.
    Buffer(const Buffer& other)
        : data(other.size > 0 ? new int[other.size] : nullptr), size(other.size) {
        if (size > 0) {
            ++allocations;
            std::copy(other.data, other.data + size, data);
        }
        std::cout << "Copy constructor\n";
    }

    // Move: take over the existing allocation.
    Buffer(Buffer&& other) noexcept
        : data(other.data), size(other.size) {
        other.data = nullptr;
        other.size = 0;
        std::cout << "Move constructor\n";
    }

    ~Buffer() {
        delete[] data;
        std::cout << "Destructor\n";
    }

    int& at(std::size_t index) { return data[index]; }
    std::size_t getSize() const { return size; }
    static int getAllocations() { return allocations; }
};

int Buffer::allocations = 0;

int main() {
    Buffer original(5);
    original.at(0) = 42;
    std::cout << "Allocations: " << Buffer::getAllocations() << '\n';

    Buffer copied = original;
    std::cout << "Allocations after copy: " << Buffer::getAllocations() << '\n';

    Buffer moved = std::move(original);
    std::cout << "Allocations after move: " << Buffer::getAllocations() << '\n';

    std::cout << "Copied value: " << copied.at(0) << '\n';
    std::cout << "Moved value: " << moved.at(0) << '\n';
    std::cout << "Original size after move: " << original.getSize() << '\n';
}
```

### The allocation count

| Operation | Total allocations |
|---|---|
| `Buffer original(5)` | 1 |
| `Buffer copied = original` | 2 |
| `Buffer moved = std::move(original)` | 2 |

- Creating `original` allocates an array.
- Copying it allocates a second array and copies the values.
- Moving it hands the existing pointer to `moved`, so no new array is needed.

The move constructor sets `original.data` to `nullptr` and its size to 0. That's essential: otherwise both objects would `delete[]` the same memory. Deleting a null pointer is safe, so destroying the moved-from `original` is fine.

**Limitations:** this example skips copy and move *assignment*, and `at()` doesn't check the index. A production class needs more care, and in everyday code `std::vector<int>` is the safer, simpler choice. [`day10.cpp`](day10.cpp) adds the two assignment operators to complete the Rule of 5.

## 10. Recall

**Day 9, without notes:**

1. What is RAII, and how does it prevent resource leaks?
2. Why doesn't a raw pointer destroy the object it points to?
3. What's the difference between `unique_ptr` and `shared_ptr`?
4. Why can't you copy a `unique_ptr`?
5. When does a local object's destructor run?

**Today:**

<details>
<summary>1. What does a copy constructor do?</summary>

Creates a new object from an existing one. For a resource-owning class, it should duplicate the resource (a deep copy) so each object owns its own.
</details>

<details>
<summary>2. What does a move constructor do?</summary>

Creates a new object by taking over the source's resource instead of duplicating it, then leaves the source valid (here, empty).
</details>

<details>
<summary>3. Does <code>std::move</code> move memory by itself?</summary>

No. It's a cast to an rvalue, so that a move constructor or move assignment can be selected. Those do the actual transfer.
</details>

<details>
<summary>4. What is the Rule of 0?</summary>

Build classes from types that manage their own resources (`string`, `vector`, smart pointers), so you don't need to write a destructor, copy or move operations.
</details>

<details>
<summary>5. Why is a shallow copy of an owning raw pointer dangerous?</summary>

Both objects think they own the same memory. When the first frees it, the second is left dangling, and its destructor frees it again: undefined behaviour.
</details>

## 11. Concept note: explain it in your own words

- **Copy constructor:** how a new object is made from an existing one, and why a resource-owning class needs a deep copy.
- **Move constructor:** how an object can take ownership of a resource without allocating a replacement.
- **Lvalues and rvalues:** a named object expression vs an expression that can bind to an rvalue reference.
- **`std::move`:** why it's a cast, not something that physically moves memory.
- **Rule of 0, 3 and 5:** when each applies, and why owning a resource makes copying and destruction harder.
- **What I tested:** a copy makes another allocation, a move transfers the existing one, the moved-from object is safe to destroy, and when each destructor runs.
- **What confused me:** *(the concept that needs another example)*
- **My own example:** *(a small class, and what its copy and move should do)*

## 12. Completion checklist

- [ ] Recall Day 9 without notes
- [ ] Explain lvalues and rvalues
- [ ] Explain why `std::move` is a cast
- [ ] Understand the Rule of 0/3/5
- [ ] Implement and run the `Buffer` example
- [ ] Compare allocation counts for copy and move
- [ ] Update the concept note and `PROGRESS.md`
- [ ] Commit

## Tomorrow: Day 11 — Inheritance, virtual functions & vtables

- What is inheritance, and when is it useful?
- What happens when a derived class overrides a base-class method?
- Why do we need `virtual`?
- How does a base-class pointer call the right derived-class function?
- What is a vtable, and how does dynamic dispatch work?

Today's key takeaway: copying usually duplicates a resource, and moving can transfer it.
