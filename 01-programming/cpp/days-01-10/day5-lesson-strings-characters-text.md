# Day 5 — Strings, Characters & Text in Memory

Phase 1 · Programming & CS · 90–120 minutes

**Builds on:** [Day 4 lesson](day4-lesson-arrays-vectors-memory.md)

Today's central question: **How does a computer store and process text when it fundamentally works with numbers and bits?**

Yesterday, you learned how arrays store multiple values in consecutive memory locations. Today, we'll apply that idea to text.

Think about the sentence:

`Hello, Thomas!`

To you, it is a word and a name. To a computer, it is data represented using numbers.

## 1. What is a character?

A character is a single unit of text, such as `A`, `b`, `7`, or `?`.

In C++, we can store a single character using `char`.

```cpp
#include <iostream>
using namespace std;

int main() {
    char letter = 'A';
    char digit = '7';

    cout << letter << '\n';
    cout << digit << '\n';

    return 0;
}
```

Notice the single quotation marks: `'A'`.

A `char` typically occupies one byte in C++. It can represent a byte-sized value, but not every character in every language fits into one byte under Unicode encodings.

### Characters are represented by numbers

For example, in ASCII, the character `A` has the numeric value `65`, and `B` has the numeric value `66`.

Try this:

```cpp
#include <iostream>
using namespace std;

int main() {
    char letter = 'A';

    cout << letter << '\n';
    cout << static_cast<int>(letter) << '\n';

    return 0;
}
```

Output:

```
A
65
```

Why two different outputs? The same stored character value is displayed in two different ways: as a character and as an integer.

> This is an important idea: **the computer stores a representation; the program determines how to interpret and display it.**

## 2. How does a computer store a word?

Consider the word `CAT`.

Simplified ASCII representation:

```
 ┌──────┬──────┬──────┐
 │  C   │  A   │  T   │   character
 ├──────┼──────┼──────┤
 │  67  │  65  │  84  │   character code
 └──────┴──────┴──────┘
```

Each character has a numeric representation. For these ASCII characters, each code fits in one byte.

A text string is a sequence of characters, although its actual encoding determines how many bytes each character occupies.

For example, the English word `CAT` encoded in ASCII-compatible UTF-8 takes three bytes. A Malayalam word may take more bytes because its characters generally require multiple bytes in UTF-8.

This distinction matters when working with user messages, multilingual chatbots, databases, and AI systems.

## 3. Strings: storing multiple characters

In C++, a `std::string` lets you store and manipulate text conveniently.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string name = "Thomas";

    cout << name << '\n';
    cout << name[0] << '\n';
    cout << name.length() << '\n';

    return 0;
}
```

Output:

```
Thomas
T
6
```

Let's break it down:

- `string name = "Thomas";` creates a string containing the text.
- `name[0]` accesses the first character, `T`.
- `name.length()` returns the number of `char` elements in the string.

For ordinary ASCII text, the number of characters and bytes will match. For UTF-8 text, they may differ because a single visible character can occupy multiple bytes.

### Try changing the text

Change `Thomas` to `Hello World`.

What do you think `name.length()` will print?

Remember that the space is also part of the string.

## 4. Modifying a string

Strings aren't just storage containers. You can change them.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string message = "Hello";

    message[0] = 'Y';
    message += " World";

    cout << message << '\n';

    return 0;
}
```

Output:

```
Yello World
```

Two operations happened:

1. `message[0] = 'Y'` replaced the first character.
2. `message += " World"` appended additional text.

This is similar to your Day 4 vector lesson: both strings and vectors can grow, and both provide indexing. A string is designed specifically for text.

## 5. How do we process text with a loop?

Suppose your AI application receives a user message. Before passing it to another component, you might want to count how many times the letter `a` occurs.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string message = "banana";
    int count = 0;

    for (int i = 0; i < message.length(); i++) {
        if (message[i] == 'a') {
            count++;
        }
    }

    cout << "Number of a's: " << count << '\n';

    return 0;
}
```

Output:

```
Number of a's: 3
```

Follow the algorithm:

1. Start at index `0`.
2. Inspect the character at that index.
3. If it is `'a'`, increase `count`.
4. Move to the next index.
5. Stop after checking every character.

This is a simple example of text processing. The same basic pattern (iterate, inspect, update) appears in log analysis, data cleaning, and natural language processing.

## 6. A subtle but important distinction: C++ strings vs. Python strings

You have used Python at work, so let's connect the two languages.

**C++**

```cpp
string text = "hello";
text[0] = 'H';
```

This is valid: a `std::string` can be modified in place.

**Python**

```python
text = "hello"
text = "H" + text[1:]
print(text)
```

Python strings are **immutable**. You create a new string rather than changing an existing character in place.

Python's `text[0] = "H"` would raise a `TypeError`. C++ and Python can look similar while having different rules for how data can be changed.

One more important distinction: Python strings represent Unicode text, while C++ `std::string` stores bytes. When working with non-English text in C++, you must be aware of the encoding.

## 7. Your hands-on challenge

Create a file called `day5.cpp`.

**Task:** Write a program that:

1. Stores your name in a string.
2. Prints the name and its length.
3. Prints the first character.
4. Counts the occurrences of the letter `'a'` in `"data analytics"`.
5. Appends `" - AI Engineer"` to a message and prints the result.

Try to implement it yourself before looking back at the examples.

### Quick comprehension check

**1. What does this print?**

```cpp
char letter = 'B';
cout << static_cast<int>(letter);
```

- [ ] B
- [ ] 66
- [ ] 2

**2. What is `"Hello World".length()` in C++ when stored as a `std::string`?**

- [ ] 10
- [ ] 11
- [ ] 12

**3. Why does Python reject `text[0] = "H"` when `text = "hello"`?**

- [ ] Python strings are immutable.
- [ ] Python strings cannot be indexed.
- [ ] Python cannot store uppercase letters.

## 8. Today's plan

- [ ] 20 minutes — characters and numeric representations.
- [ ] 20 minutes — strings and indexing.
- [ ] 20 minutes — loops and text processing.
- [ ] 30–40 minutes — write and test your challenge program.

**Today's main takeaway:** Text is data. A program stores a representation of it, accesses pieces of it, and applies algorithms to process it.

**Tomorrow — Day 6:** Searching and Sorting, where you'll begin learning the algorithms that make efficient use of data structures.
