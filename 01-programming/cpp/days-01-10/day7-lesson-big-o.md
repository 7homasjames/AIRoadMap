# Day 7 — Big-O Notation & Measuring Algorithm Efficiency

Phase 1 · Programming & CS · 90–120 minutes

**Builds on:** [Day 6 lesson](day6-lesson-searching-sorting.md) · **Challenge solution:** [`day7.cpp`](day7.cpp)

Today's central question: **How do we know whether an algorithm will remain efficient when the amount of data grows from 100 items to 1 million?**

Over the last few days, you've learned arrays, vectors, strings, linear search, binary search, and bubble sort.

Today, we'll learn how to reason about the efficiency of those algorithms. This is one of the most important foundations for software engineering and AI engineering.

## 1. The problem with measuring execution time

Imagine two developers write programs to find a number in a list of 1,000 items.

- Developer A's program takes 1 millisecond.
- Developer B's program takes 2 milliseconds.

Is A's algorithm better?

Not necessarily. Maybe A tested on a fast computer and B on a slow one. Or perhaps A's program works well for 1,000 items but becomes extremely slow for a million.

**Big-O notation** helps us describe how an algorithm's work grows as its input grows, without depending on a specific computer.

## 2. Four common complexity classes

| Class | Name | Meaning | Example |
|---|---|---|---|
| **O(1)** | Constant time | The number of operations stays roughly constant as the input grows. | Accessing `numbers[3]` in an array. |
| **O(n)** | Linear time | The work grows proportionally to the number of elements. | Checking every element in a linear search. |
| **O(log n)** | Logarithmic time | Each step reduces the remaining problem substantially, such as by half. | Binary search on sorted data. |
| **O(n²)** | Quadratic time | The work can grow with the square of the input size. | The standard nested-loop bubble sort. |

Let's compare their growth.

| Input size *n* | O(1) | O(log₂ n) | O(n)      | O(n²)             |
| -------------- | ---- | --------- | --------- | ----------------- |
| 10             | 1    | ~4        | 10        | 100               |
| 100            | 1    | ~7        | 100       | 10,000            |
| 1,000          | 1    | ~10       | 1,000     | 1,000,000         |
| 1,000,000      | 1    | ~20       | 1,000,000 | 1,000,000,000,000 |

These are illustrative growth measures, not actual execution times. Real algorithms have constants and implementation details that affect runtime.

> Notice the key insight: **logarithmic growth is very slow, while quadratic growth can become enormous.**

## 3. Learn to recognize Big-O from code

### Example A: One operation

```cpp
int first = numbers[0];
```

The array may contain 10 elements or 10 million elements. This single indexed access takes constant time under the usual array model.

Complexity: **O(1)**.

### Example B: One loop

```cpp
for (int i = 0; i < n; i++) {
    cout << numbers[i] << '\n';
}
```

If `n` doubles, the loop performs approximately twice as many iterations.

Complexity: **O(n)**.

### Example C: Two nested loops

```cpp
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        cout << i << ", " << j << '\n';
    }
}
```

For every outer-loop iteration, the inner loop runs `n` times.

Total iterations: **n × n = n²**

Complexity: **O(n²)**.

If `n = 100`, the statement executes 10,000 times. If `n = 1,000`, it executes 1,000,000 times.

### Example D: Halving the problem

```cpp
int value = 1024;

while (value > 1) {
    value = value / 2;
}
```

The values are:

`1024 → 512 → 256 → 128 → ... → 2 → 1`

It takes 10 divisions to reach 1. More generally, halving a quantity repeatedly takes approximately **log₂ n** steps.

Complexity: **O(log n)**.

This is the intuition behind binary search.

## 4. Why do we ignore constants?

Consider these two algorithms:

```cpp
// Algorithm A
for (int i = 0; i < n; i++) {
    cout << i;
}
```

```cpp
// Algorithm B
for (int i = 0; i < 2 * n; i++) {
    cout << i;
}
```

Algorithm B performs roughly twice as many iterations. But both are classified as **O(n)** because they grow linearly with the input.

Similarly:

**O(3n² + 5n + 10) = O(n²)**

For large *n*, the squared term dominates the growth. Big-O abstracts away constant factors and lower-order terms.

This doesn't mean constants are irrelevant in real engineering. They can matter a lot for small inputs and production performance. Big-O gives us the high-level growth pattern.

## 5. Best case, average case, and worst case

Consider linear search on an array:

`[8, 14, 5, 23, 17]`

- **Best case:** the target is the first element. One comparison.
- **Worst case:** the target is last, or absent. Up to five comparisons.
- **Average case:** depends on the distribution of targets and assumptions about where they occur.

The worst-case time complexity is **O(n)**.

Binary search has a worst-case complexity of **O(log n)** because it eliminates about half the remaining candidates per comparison, provided the data is sorted.

For many algorithm analyses, worst-case complexity is a useful starting point because it tells us how expensive the algorithm can become.

## 6. A practical experiment: count operations

You don't need a stopwatch to understand growth. Count the number of times the core operation executes.

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 100;
    int operations = 0;

    for (int i = 0; i < n; i++) {
        operations++;
    }

    cout << "Operations: " << operations << '\n';
    return 0;
}
```

Output:

```
Operations: 100
```

Change `n` to 1,000 and then 10,000. Observe what happens.

Next, try a nested loop:

```cpp
int operations = 0;

for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        operations++;
    }
}

cout << operations << '\n';
```

With `n = 100`, the count is 10,000. With `n = 1,000`, it's 1,000,000.

This experiment demonstrates why nested loops deserve attention when working with large datasets.

## 7. Your hands-on challenge

For each code snippet, identify the time complexity and explain why.

**Challenge 1**

```cpp
cout << numbers[5];
```

**Challenge 2**

```cpp
for (int i = 0; i < n; i++) {
    cout << i;
}
```

**Challenge 3**

```cpp
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        cout << i + j;
    }
}
```

**Challenge 4**

```cpp
while (n > 1) {
    n = n / 2;
}
```

For Challenge 4, assume `n` starts as a positive integer and the loop variable is repeatedly halved until it reaches 1 or below.

## 8. Quick comprehension check

**1. A loop visits all `n` elements once. What is its time complexity?**

- [ ] O(1)
- [ ] O(n)
- [ ] O(n²)

**2. Two nested loops each run `n` times. What is the total number of inner operations?**

- [ ] n
- [ ] 2n
- [ ] n²

**3. Why is binary search O(log n) in the worst case?**

- [ ] It examines every element.
- [ ] It repeatedly halves the remaining search space.
- [ ] It sorts the array after every comparison.

## 9. Today's schedule

- [ ] 20 minutes — understand the four complexity classes.
- [ ] 25 minutes — analyze the code examples.
- [ ] 20 minutes — run the operation-counting experiments.
- [ ] 25–40 minutes — complete the challenges and explain your reasoning aloud.

**Today's main takeaway:** Don't just ask whether code works. Ask how its workload changes as the input grows.

Since you're building toward AI engineering, this way of thinking will help you assess data pipelines, retrieval systems, database operations, and model-serving code.

**Tomorrow — Day 8:** Functions, Recursion & the Call Stack, connecting algorithm design to the function and memory concepts you learned earlier.
