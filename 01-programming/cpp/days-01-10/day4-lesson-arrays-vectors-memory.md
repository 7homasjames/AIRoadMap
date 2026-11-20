# Day 4 — October 14, 2026

## Arrays, Vectors & How Data Is Stored in Memory

Phase 1 · Programming & CS · ~90–120 minutes

**Builds on:** [Day 3 lesson](day3-lesson-functions-stack-frames-lifetime.md) · [Day 3 revision](day3-stack-frames-dangling-pointers.md)

Yesterday, we learned what happens when a function is called, how its local variables behave, and why returning a pointer to a local variable is dangerous.

Today, we'll build on that foundation: **how do we store and work with many values instead of just one?**

## 1. The problem: storing multiple values

Imagine you want to store the marks of five students.

You could create five separate variables:

```cpp
int mark1 = 85;
int mark2 = 90;
int mark3 = 78;
int mark4 = 92;
int mark5 = 88;
```

That works, but what if you have 1,000 students?

You need a better way to organize related data. That's where arrays come in.

## 2. Arrays: a row of numbered boxes

An array named `marks`:

```
 ┌──────┬──────┬──────┬──────┬──────┐
 │  85  │  90  │  78  │  92  │  88  │
 └──────┴──────┴──────┴──────┴──────┘
  index   index  index  index  index
    0       1      2      3      4
```

The index tells you which element you want. In C++, array indexing starts at **0**, not 1.

Here's the C++ code:

```cpp
#include <iostream>
using namespace std;

int main() {
    int marks[5] = {85, 90, 78, 92, 88};

    cout << marks[0] << '\n'; // 85
    cout << marks[2] << '\n'; // 78

    marks[2] = 80;
    cout << marks[2] << '\n'; // 80

    return 0;
}
```

Understand these three operations:

- `marks[0]` — access the first element.
- `marks[2]` — access the third element.
- `marks[2] = 80` — replace the third element's value with `80`.

> **Important:** An array of five elements has valid indices `0` to `4`. Accessing `marks[5]` is out of bounds and causes **undefined behavior** in C++.

## 3. Why is array indexing useful?

Suppose you want to calculate the total marks. Instead of writing every addition manually, you can use a loop.

```cpp
#include <iostream>
using namespace std;

int main() {
    int marks[5] = {85, 90, 78, 92, 88};
    int total = 0;

    for (int i = 0; i < 5; i++) {
        total = total + marks[i];
    }

    cout << "Total: " << total << '\n';
    cout << "Average: " << total / 5.0 << '\n';

    return 0;
}
```

The loop visits each index in turn:

| `i` | `marks[i]` | Running total |
| --- | ---------- | ------------- |
| 0   | 85         | 85            |
| 1   | 90         | 175           |
| 2   | 78         | 253           |
| 3   | 92         | 345           |
| 4   | 88         | 433           |

The average is `86.6`.

This pattern (visit each element, process it, move to the next) is fundamental to algorithms and data processing.

## 4. What does an array look like in memory?

This connects directly to the pointers and addresses you learned earlier.

An array stores its elements in **contiguous** memory locations, meaning the elements are laid out next to each other.

Illustrative memory layout (addresses are examples):

```
 address:   1000   1004   1008   1012   1016
          ┌──────┬──────┬──────┬──────┬──────┐
 value:   │  85  │  90  │  78  │  92  │  88  │
          └──────┴──────┴──────┴──────┴──────┘
 index:      0      1      2      3      4
```

Assuming each `int` occupies 4 bytes, the addresses increase by 4. Actual addresses depend on the program and system.

Why does this matter?

If an integer occupies 4 bytes, the address of the next element is four bytes later. That regular layout helps a computer access array elements efficiently.

You can inspect addresses yourself:

```cpp
#include <iostream>
using namespace std;

int main() {
    int numbers[3] = {10, 20, 30};

    cout << &numbers[0] << '\n';
    cout << &numbers[1] << '\n';
    cout << &numbers[2] << '\n';

    return 0;
}
```

`&numbers[i]` means "the address of element `i`."

Run it and compare the addresses. On a typical system with four-byte integers, consecutive addresses will differ by four bytes.

## 5. Fixed-size arrays vs. vectors

A regular C++ array has a fixed size. But what if you don't know in advance how many values you'll need?

For example, imagine collecting the number of requests handled by an AI service. The number of requests may change as the program runs.

C++ provides `std::vector` for this.

| | Array | Vector |
|---|---|---|
| Size | A fixed number of elements for the array's lifetime | A dynamic sequence that can grow or shrink |
| Example | `int numbers[3] = {10, 20, 30};` | `std::vector<int> numbers = {10, 20, 30};`<br>`numbers.push_back(40);` |

```cpp
#include <vector>

std::vector<int> numbers = {10, 20, 30};
numbers.push_back(40);
```

After `push_back(40)`, the vector contains four elements.

A vector manages its storage for you. Its elements are stored contiguously, but when it needs more capacity, it may allocate a larger memory region and move its elements there. So don't assume a vector's address will remain unchanged as you add elements.

Here's a complete example:

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> scores = {85, 90, 78};

    scores.push_back(95);

    for (int i = 0; i < scores.size(); i++) {
        cout << scores[i] << '\n';
    }

    cout << "Number of scores: " << scores.size() << '\n';

    return 0;
}
```

For now, remember this distinction:

- `array` — fixed size.
- `vector` — resizable sequence.
- `scores.size()` — number of elements currently in the vector.
- `scores.push_back(value)` — append a new element.

In modern C++, vectors are often the better default when you need a collection whose size may change.

## 6. Your hands-on challenge

Now implement what you learned. Create a file called `day4.cpp`.

**Task:** Given the values `{12, 18, 25, 15, 30}`, write a program that:

1. Stores the values in an array.
2. Prints the first and last values.
3. Calculates the sum using a loop.
4. Calculates and prints the average.
5. Creates a vector containing the same values and appends `40`.
6. Prints the vector's final size.

Use the examples above as a guide, but try writing the program yourself first.

## Quick comprehension check

Answer these before moving on. You can check your answers afterward.

**1. What is the value of `numbers[1]`?**

- [ ] 10
- [ ] 20
- [ ] 30

**2. Why are array elements stored contiguously?**

- [ ] They are laid out in consecutive memory locations.
- [ ] Every element has the same value.
- [ ] They are always stored on the stack.

**3. What does `scores.push_back(40)` do to a vector containing three elements?**

- [ ] Replaces the first element.
- [ ] Adds an element, making the size four.
- [ ] Deletes the vector.

## 7. Today's schedule

- [ ] 20 minutes: Understand arrays and indexing.
- [ ] 20 minutes: Run the memory-address experiment.
- [ ] 20 minutes: Learn vectors and implement the examples.
- [ ] 30–40 minutes: Complete the challenge and explain the code in your own words.

You do not need to master every detail today. The goal is to understand how collections work, how indexing relates to memory, and why vectors are useful.

**Tomorrow's topic — Day 5:** Strings, characters, and how text is represented in memory.
