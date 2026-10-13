# Day 3 — Functions, Stack Frames & Memory Lifetime

Phase 1 · Programming & Computer Science · October 13, 2026

**Companion notes & code:** [Day 3 revision](day3-stack-frames-dangling-pointers.md) · [`day3.cpp`](day3.cpp)

You don't need to catch up on the days you missed. We are continuing from where we left off.

On Day 1, you explored how code executes. On Day 2, you learned about stack, heap, pointers, and references.

Today's central question: **What happens to memory when a function is called and then returns?**

This is important for understanding C++, Python, debugging, memory errors, and eventually how complex AI systems execute programs.

## Today's plan

| # | Topic | Time | Goal |
|---|---|---|---|
| 1 | Function calls and stack frames | 25 minutes | Understand what happens when one function calls another. |
| 2 | How data moves between functions | 25 minutes | Explore local variables, arguments, return values, and scope. |
| 3 | Memory lifetime and dangling pointers | 30 minutes | Learn why accessing an object after its lifetime ends can be dangerous. |
| 4 | Coding exercises and self-test | 30–40 minutes | Predict outputs, run experiments, and explain your reasoning. |

Estimated total: 1 hour 50 minutes to 2 hours. You can split this into two sessions.

## Lesson 1 — What happens when a function is called?

Consider this C++ program:

```cpp
#include <iostream>
using namespace std;

void greet() {
    int message = 10;
    cout << message << '\n';
}

int main() {
    int score = 90;
    greet();
    cout << score << '\n';
    return 0;
}
```

The output is:

```
10
90
```

Let's understand why.

When a program starts executing `main()`, it needs to keep track of the function's execution. When `main()` calls `greet()`, the program must remember where to return after `greet()` finishes.

A **stack frame** is a useful way to think about the information associated with a particular function call.

Conceptually, the execution looks like this:

**Step 1: `main()` starts** (First)
Its local variable `score` has the value 90.

```
main  → score = 90
```

**Step 2: `greet()` is called** (Call)
A new function invocation begins, with its own local variable `message`.

```
greet → message = 10
main  → score = 90
```

**Step 3: `greet()` returns** (Return)
The invocation finishes. Its local variable is no longer available to the caller.

```
main  → score = 90
```

> This is a conceptual model of stack-based function calls. Actual compilers can optimize execution, and not every variable necessarily occupies a physical stack location.

### Your first exercise

Before running the program, answer this:

**Why is `score` still 90 after `greet()` returns?**

Think about whether `score` and `message` belong to the same function invocation.

## Lesson 2 — Passing information between functions

Functions need ways to receive information and return results.

Consider:

```cpp
int square(int n) {
    return n * n;
}

int main() {
    int result = square(5);
    return 0;
}
```

Here is what happens:

1. `main()` calls `square(5)`.
2. The parameter `n` receives the value 5.
3. The function calculates 5 × 5 = 25.
4. `return` sends the result back to the caller.
5. The caller stores that result in `result`.

The important distinction is that a function's parameter is not automatically the same variable as the caller's argument.

### Experiment 1: Predict the output

```cpp
#include <iostream>
using namespace std;

int addFive(int number) {
    number = number + 5;
    return number;
}

int main() {
    int x = 10;

    int result = addFive(x);

    cout << x << '\n';
    cout << result << '\n';

    return 0;
}
```

What do you expect?

Pause here and predict both lines before running the code.

The concept to understand is **pass-by-value**: `number` receives a copy of the integer value. Modifying it does not change the caller's `x`. The returned result is a separate way of communicating the calculation back.

## Lesson 3 — Scope and lifetime are different

These two terms are related, but they mean different things.

- **Scope:** where a name can be used in source code.
- **Lifetime:** how long an object exists during execution.

Example:

```cpp
int main() {
    int x = 10;

    {
        int y = 20;
    }

    // x is accessible here.
    // y is not accessible here.

    return 0;
}
```

The name `y` is out of scope after the inner block ends. Its local object's lifetime also ends there.

For a normal local variable, leaving its block typically ends its lifetime. But don't assume that every object is destroyed when its pointer goes out of scope; dynamically allocated objects have their own lifetime rules.

This distinction is essential for understanding the next lesson.

## Lesson 4 — Dangling pointers

Look at this code:

```cpp
int* createPointer() {
    int local = 42;
    return &local;
}
```

The function returns the address of a local variable.

But when the function returns, the local variable's lifetime ends. The returned pointer no longer points to a live `int` object.

Using it to access that object is **undefined behavior** in C++.

A **dangling pointer** is a pointer that refers to an object whose lifetime has ended, or otherwise no longer refers to a valid object.

### Why is this dangerous?

Imagine returning the address of a temporary note that gets discarded when a room closes. Keeping the note's old address does not bring the note back into existence.

Similarly, a pointer holding an old address does not keep the original object alive.

### A safer alternative

If you only need to return a calculated integer, return the value:

```cpp
int createValue() {
    int local = 42;
    return local;
}
```

The integer value is returned to the caller; you are not returning the address of the expired local variable.

For dynamically allocated resources, modern C++ generally favors automatic resource management and smart pointers over manually managing raw allocations.

## Lesson 5 — Connect it to Python

Python also has function calls and local names:

```python
def calculate():
    number = 42
    return number

result = calculate()
print(result)
```

Output:

```
42
```

The function's local name `number` is not accessible directly from outside the function. But the returned integer object can be used by the caller.

Python manages object memory differently from C++. You generally do not manually free objects or return raw memory addresses. Objects remain alive while they are kept alive by the language's memory-management mechanisms.

For today, focus on the shared concept: a local name and the object or value it refers to are not the same thing as the caller's variable.

## Today's coding challenge

Try these three questions before checking your answers.

**1. What is the output?**

```cpp
int change(int x) {
    x = 50;
    return x;
}

int main() {
    int a = 10;
    change(a);
    // What is a?
}
```

- [ ] 10
- [ ] 50
- [ ] Undefined behavior

**2. What is wrong with returning `&local` from a function if `local` is a normal local integer?**

- [ ] The integer cannot hold an address
- [ ] The local object's lifetime ends when the function returns
- [ ] Every pointer must point to the heap

**3. What is the difference between scope and lifetime?**

- [ ] They mean exactly the same thing
- [ ] Scope is about where a name is accessible; lifetime is about how long an object exists
- [ ] Scope applies only to Python

## Day 3 completion checklist

- [ ] I can explain what a stack frame represents.
- [ ] I understand how a function receives arguments and returns a value.
- [ ] I can distinguish scope from lifetime.
- [ ] I understand why returning a pointer to a local variable is unsafe.
- [ ] I can explain the basic similarities and differences between C++ and Python function calls.

That's enough for today. Don't try to jump ahead into processes, threads, or advanced algorithms.

Once you finish, send me your challenge answers or tell me which concept felt confusing. We'll build the next lesson around what you actually understand, not how quickly you can get through the syllabus.
