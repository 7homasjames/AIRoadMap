# Day 6 — Searching & Sorting Algorithms

Phase 1 · Programming & CS · 90–120 minutes

**Builds on:** [Day 5 lesson](day5-lesson-strings-characters-text.md) · **Challenge solution:** [`day6.cpp`](day6.cpp)

Today's central question: **How can we find information quickly and arrange data efficiently?**

Over the last few days, you've learned about variables, memory, pointers, arrays, vectors, and strings. Now we'll use that foundation to understand algorithms.

Imagine your AI application stores 10,000 customer records. You need to find one customer or arrange the records by score. How should you do it?

Today, we'll learn two searching algorithms and one sorting algorithm, then compare their efficiency.

## 1. Linear search — checking one item at a time

Suppose you have these numbers. Find the number **23**:

```
 ┌──────┬──────┬──────┬──────┬──────┐
 │   8  │  14  │   5  │  23  │  17  │
 └──────┴──────┴──────┴──────┴──────┘
    0      1      2      3      4
    ✗      ✗      ✗      ✓
                         Found 23 at index 3. Stop searching.
```

This is called **linear search**. You examine each element until you find the target or run out of elements.

Let's implement it in C++:

```cpp
#include <iostream>
using namespace std;

int main() {
    int numbers[] = {8, 14, 5, 23, 17};
    int target = 23;
    int size = 5;
    int foundIndex = -1;

    for (int i = 0; i < size; i++) {
        if (numbers[i] == target) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex != -1) {
        cout << "Found at index " << foundIndex << '\n';
    } else {
        cout << "Not found\n";
    }

    return 0;
}
```

Output:

```
Found at index 3
```

Understand these two details:

- `break` stops the loop once the target is found.
- `-1` is a marker we use to mean "not found." It is not a valid index in this array.

Try changing `target` to `100`. The program should report that the value was not found.

## 2. Binary search — eliminate half the possibilities

Now imagine the numbers are already sorted:

`[5, 8, 14, 17, 23, 31, 42]`

Instead of checking every element, we can inspect the middle.

- If the middle value is the target, we're done.
- If the target is smaller, discard the right half.
- If the target is larger, discard the left half.

This is **binary search**. It works on sorted data.

Example: find **31**

```
 index:    0    1    2    3    4    5    6
 value:    5    8   14   17   23   31   42

 Step 1:   L              M              R     mid = 3 → 17 < 31, discard left half
 Step 2:                       L    M    R     mid = 5 → 31 == 31, found!
```

The target is found at index 5.

Here is the algorithm:

```cpp
int numbers[] = {5, 8, 14, 17, 23, 31, 42};
int target = 31;

int left = 0;
int right = 6;
int foundIndex = -1;

while (left <= right) {
    int mid = left + (right - left) / 2;

    if (numbers[mid] == target) {
        foundIndex = mid;
        break;
    } else if (numbers[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}
```

When the middle value is smaller than the target, `left = mid + 1` removes the middle and everything before it from consideration. When it's larger, `right = mid - 1` removes the middle and everything after it.

> **Important:** Binary search is only valid when the data is **sorted** according to the ordering you're searching.

## 3. How do we compare algorithms?

Suppose there are 1,000 items.

- Linear search: may inspect all 1,000 items.
- Binary search: needs roughly 10 comparisons in the worst case for 1,000 items, because each comparison halves the remaining search space.

This leads to a foundational computer science concept: **time complexity**.

| Algorithm     | Best case | Worst case  |
| ------------- | --------- | ----------- |
| Linear search | O(1)      | O(n)        |
| Binary search | O(1)      | O(log n)    |

Here, *n* is the number of items.

- **O(1)**: the work stays roughly constant as the input grows.
- **O(n)**: doubling the input can roughly double the work.
- **O(log n)**: doubling the input adds roughly one more halving step.

These are growth-rate descriptions, not exact execution times.

## 4. Sorting — putting data in order

Searching is easier when data is sorted. Let's learn a simple sorting algorithm called **bubble sort**.

It repeatedly compares neighboring elements and swaps them if they are in the wrong order.

For example:

`[5, 2, 4]`

1. Compare 5 and 2. Swap: `[2, 5, 4]`
2. Compare 5 and 4. Swap: `[2, 4, 5]`
3. The largest value has moved to the end.

C++ implementation:

```cpp
#include <iostream>
using namespace std;

int main() {
    int numbers[] = {5, 2, 4, 1, 3};
    int n = 5;

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (numbers[j] > numbers[j + 1]) {
                int temp = numbers[j];
                numbers[j] = numbers[j + 1];
                numbers[j + 1] = temp;
            }
        }
    }

    for (int i = 0; i < n; i++) {
        cout << numbers[i] << ' ';
    }

    return 0;
}
```

Output:

```
1 2 3 4 5
```

### What does `temp` do?

To swap two values, we need somewhere to temporarily hold one of them.

Imagine two cups, one containing tea and one containing coffee. To swap their contents without mixing them, you need a third empty cup.

`temp` is that third cup.

Bubble sort is useful for learning nested loops and swapping, but its worst-case time complexity is **O(n²)**. For large datasets, more efficient algorithms such as merge sort are generally preferable.

## 5. Your hands-on challenge

Create `day6.cpp` and complete these tasks:

1. Use linear search to find `18` in `{12, 7, 18, 25, 9}`.
2. Implement binary search to find `25` in `{3, 7, 12, 18, 25, 31}`.
3. Sort `{9, 2, 7, 1, 5}` using bubble sort.
4. Change the binary-search target to `100`. Confirm that your program handles a missing value correctly.

Try writing the code yourself before looking back at the examples. Test each algorithm separately if that makes debugging easier.

## 6. Quick comprehension check

**1. When can you safely use binary search?**

- [ ] Whenever the array contains integers.
- [ ] When the data is sorted in the appropriate order.
- [ ] Only when the array has an even number of elements.

**2. What does `break` do in our search loop?**

- [ ] Stops the loop.
- [ ] Sorts the array.
- [ ] Moves to the next element.

**3. What is bubble sort's worst-case time complexity?**

- [ ] O(1)
- [ ] O(log n)
- [ ] O(n²)

## 7. Today's schedule

- [ ] 20 minutes — implement linear search.
- [ ] 25 minutes — trace and implement binary search.
- [ ] 25 minutes — understand and implement bubble sort.
- [ ] 20–40 minutes — complete the challenge and answer the quiz.

**Today's key lesson:** Choosing the right algorithm matters. Two programs can produce the same answer but require very different amounts of work as the data grows.

**Tomorrow — Day 7:** Big-O Notation and Measuring Algorithm Efficiency, so you can reason about performance instead of relying on guesswork.
