# Day 9 — RAII & Smart Pointers

Phase 1 · C++ Foundations · Day 9 of 177 · 90–120 minutes

**Builds on:** [Day 8 lesson](day8-lesson-structs-classes.md) · **Challenge solution:** [`day9.cpp`](day9.cpp) and the updated [`stack_vs_heap.cpp`](stack_vs_heap.cpp)

Yesterday: a constructor initializes an object, and a destructor runs when its lifetime ends. Today we connect that to one of the most important principles in modern C++:

> Make resource cleanup happen automatically when an object goes out of scope.

By the end you should understand why memory leaks happen, what RAII means, and when to use `std::unique_ptr`, `std::shared_ptr` and raw pointers.

## 1. What is a resource?

A **resource** is something a program acquires and must eventually release:

- dynamically allocated memory
- files opened for reading or writing
- network connections
- locks used to coordinate threads

Like a library book: borrow it, and you have to give it back. Forget, and nobody else can use it.

## 2. The problem: manual memory management

```cpp
#include <iostream>
using namespace std;

class Box {
public:
    Box()  { cout << "Box created\n"; }
    ~Box() { cout << "Box destroyed\n"; }
};

int main() {
    Box* ptr = new Box();
    cout << "Program finished\n";
    // We forgot to delete ptr!
}
```

Output:

```
Box created
Program finished
```

The destructor never runs. There are two separate things here:

| | Lives on | Lifetime |
|---|---|---|
| `ptr`, the pointer | the stack | ends when `main()` ends |
| the `Box` it points to | the heap | lasts until something calls `delete` |

When `main()` ends, `ptr` disappears, but losing the pointer doesn't destroy the object. The `Box` is still allocated and nothing can reach it. That's a **memory leak**.

- **Pointer lifetime:** how long the pointer variable exists.
- **Pointee lifetime:** how long the object it points to exists.

They are not automatically the same.

## 3. The manual fix, and its weakness

```cpp
int main() {
    Box* ptr = new Box();
    cout << "Program finished\n";
    delete ptr;
}
```

The destructor now runs at `delete ptr`. But if the function has several `return`s, or an exception is thrown before the `delete`, cleanup is skipped. Manual cleanup means remembering every possible path through the code.

## 4. What is RAII?

**RAII** stands for *Resource Acquisition Is Initialization*. The principle:

> Put resource ownership inside an object, and let that object's lifetime decide when the resource is released.

1. An object acquires the resource when it's initialized.
2. It owns the resource while it's alive.
3. When it's destroyed, its destructor releases the resource automatically.

A file stream is an example:

```cpp
#include <fstream>

int main() {
    std::ofstream file("hello.txt");
    file << "Hello, world!\n";
}   // file's destructor closes the file here
```

RAII is the general principle. Smart pointers are one application of it.

## 5. What is a smart pointer?

A raw pointer (`Box* ptr = new Box();`) stores an address but doesn't own or clean up what's there. A **smart pointer** is an object that manages a pointer, including the lifetime of the object it owns. They live in `<memory>`:

- `std::unique_ptr`: one exclusive owner.
- `std::shared_ptr`: several owners sharing responsibility.
- `std::weak_ptr`: observes an object managed by `shared_ptr` without owning it. We'll come back to it when needed.

## 6. `std::unique_ptr`: one owner

```cpp
#include <memory>

std::unique_ptr<Box> ptr = std::make_unique<Box>();
```

- `std::unique_ptr<Box>` is a smart pointer that owns a `Box`.
- `std::make_unique<Box>()` creates the `Box` and returns a pointer that owns it.
- When `ptr` is destroyed, it destroys the `Box`.

The leak fixed:

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Box {
public:
    Box()  { cout << "Box created\n"; }
    ~Box() { cout << "Box destroyed\n"; }
};

int main() {
    {
        unique_ptr<Box> ptr = make_unique<Box>();
        cout << "Inside block\n";
    }
    cout << "Outside block\n";
}
```

```
Box created
Inside block
Box destroyed
Outside block
```

No `delete` anywhere. At the closing `}`, `ptr` is destroyed, and that destroys the `Box` it owns. That's RAII: ownership is an object, and cleanup follows the object's lifetime.

### Can you copy a `unique_ptr`?

No. Exclusive ownership means no copies:

```cpp
auto first = std::make_unique<int>(42);
// auto second = first;          // compile error
auto second = std::move(first);  // ownership moves; first is now empty
```

That's a preview of tomorrow's lesson on copy vs move. Use `unique_ptr` as your default whenever an object should have one clear owner.

## 7. `std::shared_ptr`: shared ownership

When two components both need to keep an object alive, and neither should destroy it while the other still needs it:

```cpp
auto first = make_shared<int>(42);
auto second = first;               // another owner of the same int

cout << *first << '\n';            // 42
cout << *second << '\n';           // 42
cout << first.use_count() << '\n'; // 2
```

The object stays alive while any owner exists, and is destroyed when the last one lets go. `use_count()` is useful for learning, but don't build program logic on it.

`shared_ptr` has bookkeeping overhead, and two objects that own each other through `shared_ptr` form a cycle that never gets freed. Only use it when ownership genuinely is shared.

## 8. Raw pointer vs `unique_ptr` vs `shared_ptr`

| | Raw pointer | `unique_ptr` | `shared_ptr` |
|---|---|---|---|
| Holds an address | Yes | Yes | Yes |
| Cleans up the object automatically | No | Yes | Yes |
| Ownership | Not expressed by the pointer | Exclusive | Shared |
| Copyable | Yes | No (move only) | Yes |
| When the object is destroyed | Only at an explicit `delete` | When the `unique_ptr` is destroyed | When the last owner releases it |
| Typical use | Non-owning access, low-level code | Default choice for ownership | Genuinely shared ownership |

Raw pointers aren't automatically bad. A function can take a pointer to an object someone else owns. The question to ask is always whether this pointer **owns** the object or just **looks at** it. In modern C++, use `std::make_unique` and `std::make_shared` for owning pointers, and avoid writing `new` and `delete` yourself without a specific reason.

## 9. Build: fix `stack_vs_heap.cpp`

Find the example in [`stack_vs_heap.cpp`](stack_vs_heap.cpp) that allocates with `new` and never deletes. Fix the leak with `std::unique_ptr`.

A standalone version to test first:

```cpp
#include <iostream>
#include <memory>

class Box {
public:
    Box()  { std::cout << "Box created\n"; }
    ~Box() { std::cout << "Box destroyed\n"; }
};

int main() {
    std::cout << "Program starts\n";
    {
        auto ptr = std::make_unique<Box>();
        std::cout << "Box is being used\n";
    }
    std::cout << "Program continues\n";
}
```

```
g++ -std=c++17 -Wall -Wextra -pedantic stack_vs_heap.cpp -o stack_vs_heap
./stack_vs_heap
```

Expected:

```
Program starts
Box created
Box is being used
Box destroyed
Program continues
```

### What to investigate

1. Remove the inner braces and run it again. When does the destructor fire now?
2. Replace `make_unique<Box>()` with `new Box()` in a raw pointer. What happens without `delete`?
3. Add `delete ptr;` to the raw-pointer version. Does the destructor fire?
4. Why is `unique_ptr` safer in a function with several exit paths?

Run the experiments and explain what you see. [`day9.cpp`](day9.cpp) runs all four, plus `shared_ptr` and moving a `unique_ptr`.

## 10. Concept note: write it in your own words

1. **What is RAII?** How does tying ownership to object lifetime prevent leaks?
2. **Why can raw pointers leak?** The pointer variable vs the object it points to.
3. **How does `unique_ptr` work?** Exclusive ownership, automatic cleanup, why it can't be copied.
4. **How does `shared_ptr` work?** Shared ownership, and what happens when the last owner lets go.
5. **Raw vs smart pointers:** when a raw pointer is fine, and why smart pointers are better for owning.
6. **What I tested:** raw pointer with no delete, raw pointer with delete, `unique_ptr`, changing the scope.
7. **What confused me:** *(the concept you still need to practise)*
8. **My own example:** *(a small RAII program, and exactly when its resource is released)*

## 11. Completion checklist

- [ ] Recall Day 8 without notes
- [ ] Explain RAII in your own words
- [ ] Explain raw pointer vs `unique_ptr` vs `shared_ptr`
- [ ] Fix the leak in `stack_vs_heap.cpp`
- [ ] Check that the destructor now fires automatically
- [ ] Write the concept note
- [ ] Update `PROGRESS.md`
- [ ] Commit

## Tomorrow: Day 10 — Copy vs move semantics

- Why can a `unique_ptr` move but not copy?
- What's a shallow copy vs a deep copy?
- How can copying an object accidentally duplicate ownership of a resource?
- How do move constructors transfer resources cheaply?

Today's core idea: every resource should have a clear owner, and cleanup should happen automatically when that ownership ends. RAII is the principle. Smart pointers are a tool for it.
