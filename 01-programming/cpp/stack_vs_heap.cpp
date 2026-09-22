// Day 1, C++: stack vs heap, and why manual memory management is dangerous.
//
// Compile:  g++ -Wall -Wextra -g stack_vs_heap.cpp -o stack_vs_heap
// Run:      ./stack_vs_heap
//
// Note: -fsanitize=address (which would make leaks/use-after-free crash
// loudly with a report) is not available in this MinGW-w64 toolchain
// (missing libasan). Instead, the constructed/destroyed trace below makes
// the leak visible directly: id 3 never prints "destroyed".

#include <iostream>

struct Traced {
    int id;
    Traced(int id) : id(id) {
        std::cout << "  Traced(" << id << ") constructed\n";
    }
    ~Traced() {
        std::cout << "  Traced(" << id << ") destroyed\n";
    }
};

void stackExample() {
    std::cout << "stackExample: entering scope\n";
    Traced a(1);  // lives on the stack
    std::cout << "stackExample: about to leave scope\n";
    // no cleanup code needed -- 'a' is destroyed automatically right here,
    // the instant this function returns.
}

void heapExampleCorrect() {
    std::cout << "heapExampleCorrect: allocating on heap\n";
    Traced* p = new Traced(2);  // lives on the heap until explicitly deleted
    std::cout << "heapExampleCorrect: about to delete\n";
    delete p;  // WE must do this -- nothing does it automatically
    std::cout << "heapExampleCorrect: deleted\n";
}

void heapExampleLeak() {
    std::cout << "heapExampleLeak: allocating on heap, deliberately not freeing\n";
    Traced* p = new Traced(3);
    (void)p;  // suppress unused-variable warning
    // no delete here -- this memory is now leaked. Notice: no destructor
    // message will print for id 3, unlike ids 1 and 2. That absence IS the bug.
}

int main() {
    std::cout << "=== stack example ===\n";
    stackExample();

    std::cout << "\n=== heap example (correct: alloc + free) ===\n";
    heapExampleCorrect();

    std::cout << "\n=== heap example (deliberate leak) ===\n";
    heapExampleLeak();

    std::cout << "\nDone. Compare the constructed/destroyed messages above:\n";
    std::cout << "id 1 (stack)  -> constructed AND destroyed, automatically.\n";
    std::cout << "id 2 (heap)   -> constructed AND destroyed, because we called delete.\n";
    std::cout << "id 3 (heap)   -> constructed but NEVER destroyed. That's the leak.\n";

    return 0;
}
