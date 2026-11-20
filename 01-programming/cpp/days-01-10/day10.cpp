// Day 10: Copy vs Move Semantics
// Compile & run:  g++ -std=c++17 -Wall -Wextra -pedantic day10.cpp -o day10 && ./day10
// Before running, predict the allocation count after every step. Then check.
//
// Expected allocation counts (part 2):
//   Buffer original(5)                 1   new array
//   Buffer copied = original           2   deep copy: second array
//   Buffer moved = std::move(original) 2   move: takes original's array, no new one
//   copied = moved          (copy =)   3   copy assignment allocates a fresh array
//   copied = std::move(moved) (move =) 3   move assignment just steals the pointer

#include <algorithm>
#include <cstddef>
#include <iostream>
#include <string>
#include <utility>
#include <vector>

// Rule of 5: Buffer owns a raw new[] array, so it needs all five special members.
class Buffer {
private:
    int* data;
    std::size_t size;
    std::string name;

    static int allocations;

public:
    Buffer(std::string bufferName, std::size_t n)
        : data(n > 0 ? new int[n]{} : nullptr), size(n), name(std::move(bufferName)) {
        if (n > 0) {
            ++allocations;
        }
        std::cout << "  [ctor]      " << name << '\n';
    }

    // 1. Copy constructor: deep copy, a separate array with the same values.
    Buffer(const Buffer& other)
        : data(other.size > 0 ? new int[other.size] : nullptr), size(other.size), name(other.name + "-copy") {
        if (size > 0) {
            ++allocations;
            std::copy(other.data, other.data + size, data);
        }
        std::cout << "  [copy ctor] " << name << '\n';
    }

    // 2. Move constructor: take the pointer, leave the source empty but valid.
    Buffer(Buffer&& other) noexcept
        : data(other.data), size(other.size), name(other.name + "-moved") {
        other.data = nullptr;       // without this, both destructors would delete[] the same array
        other.size = 0;
        std::cout << "  [move ctor] " << name << '\n';
    }

    // 3. Copy assignment: allocate the new copy first, then free the old array.
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {       // self-assignment: a = a must not free its own data
            int* fresh = other.size > 0 ? new int[other.size] : nullptr;
            if (other.size > 0) {
                ++allocations;
                std::copy(other.data, other.data + other.size, fresh);
            }
            delete[] data;
            data = fresh;
            size = other.size;
        }
        std::cout << "  [copy =]    into " << name << '\n';
        return *this;
    }

    // 4. Move assignment: free what we had, steal the other's array.
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
        }
        std::cout << "  [move =]    into " << name << '\n';
        return *this;
    }

    // 5. Destructor: delete[] on nullptr is safe, so moved-from buffers are fine.
    ~Buffer() {
        delete[] data;
        std::cout << "  [dtor]      " << name << " (size " << size << ")\n";
    }

    int& at(std::size_t index) { return data[index]; }
    std::size_t getSize() const { return size; }
    static int getAllocations() { return allocations; }
};

int Buffer::allocations = 0;

// Rule of 0: string and vector manage their own memory, so the compiler-generated
// copy/move/destructor already do the right thing. Nothing to write.
struct Student {
    std::string name;
    std::vector<int> marks;
};

// Overloads chosen by value category: lvalue -> &, rvalue -> &&.
void whichRef(const std::string&) { std::cout << "  lvalue overload\n"; }
void whichRef(std::string&&)      { std::cout << "  rvalue overload\n"; }

int main() {
    // --- 1. lvalues, rvalues, and std::move as a cast ---
    std::cout << "1. lvalue vs rvalue\n";
    std::string s = "hello";
    whichRef(s);                    // named variable -> lvalue
    whichRef(std::string("temp"));  // temporary -> rvalue
    whichRef(std::move(s));         // std::move only casts s to an rvalue...
    std::cout << "  s is still \"" << s << "\": nothing was moved, because whichRef didn't take it\n";

    // --- 2. copy vs move, counting allocations ---
    std::cout << "\n2. Buffer copy vs move\n";
    {
        Buffer original("original", 5);
        original.at(0) = 42;
        std::cout << "  allocations: " << Buffer::getAllocations() << '\n';            // 1

        Buffer copied = original;
        std::cout << "  allocations after copy: " << Buffer::getAllocations() << '\n'; // 2

        Buffer moved = std::move(original);
        std::cout << "  allocations after move: " << Buffer::getAllocations() << '\n'; // 2

        copied.at(0) = 7;           // deep copy: changing copied doesn't touch moved
        std::cout << "  copied[0] = " << copied.at(0) << ", moved[0] = " << moved.at(0)
                  << ", original size after move = " << original.getSize() << '\n';

        // --- 3. the assignment operators (Rule of 5, beyond the lesson's example) ---
        std::cout << "\n3. assignment\n";
        copied = moved;
        std::cout << "  allocations after copy =: " << Buffer::getAllocations() << '\n'; // 3
        copied = std::move(moved);
        std::cout << "  allocations after move =: " << Buffer::getAllocations() << '\n'; // 3
        std::cout << "  copied[0] = " << copied.at(0) << ", moved size = " << moved.getSize() << '\n';

        std::cout << "\n  leaving scope: destroyed in reverse order, each array freed exactly once\n";
    }

    // --- 4. Rule of 0 ---
    std::cout << "\n4. Rule of 0\n";
    Student a{"Asha", {90, 85}};
    Student b = a;                  // vector deep-copies itself
    b.marks[0] = 10;
    Student c = std::move(a);       // vector hands over its array (a is left valid; empty in practice)
    std::cout << "  a.marks size after move: " << a.marks.size()
              << ", b.marks[0] = " << b.marks[0] << ", c.marks[0] = " << c.marks[0] << '\n';

    return 0;
}
