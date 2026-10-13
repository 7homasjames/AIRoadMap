// Day 3: Stack Frames, Function Calls & Dangling Pointers
// Compile & run:  g++ day3.cpp -o day3 && ./day3
// Look at the assembly:  g++ -S day3.cpp -o day3.s
// Before running, predict every line of output. Then check.

#include <iostream>
#include <memory>

// ---- Experiment 1: each call gets its own frame ----
void depth(int n) {
    int local = n;              // a fresh 'local' lives in every frame
    std::cout << "depth " << n << ": &local = " << &local << '\n';
    if (n < 3) {
        depth(n + 1);           // the new frame is pushed on top of this one
    }
}                               // this frame is popped when we return

// ---- Experiment 2: a finished frame's space gets reused ----
void first()  { int a = 111; std::cout << "first:  &a = " << &a << '\n'; }
void second() { int b = 222; std::cout << "second: &b = " << &b << '\n'; }

// ---- Experiment 3: a dangling pointer ----
// The address is passed out through a parameter so the compiler can't
// "help" by turning it into nullptr (it does that for a plain 'return &x;').
void make_dangling(int** out) {
    int x = 5;
    *out = &x;                  // ⚠️ x dies when this function returns
}

void stomp() {
    int junk = 999;             // likely lands in the same slot x used
    (void)junk;
}

// ---- Experiment 4: the safe versions ----
int give_value() {
    int x = 5;
    return x;                   // returns a COPY of 5, x can die safely
}

std::unique_ptr<int> give_heap() {
    return std::make_unique<int>(5);   // heap int, freed automatically by unique_ptr
}

int main() {
    std::cout << "== Experiment 1: one frame per call ==\n";
    depth(1);

    std::cout << "\n== Experiment 2: frames get reused ==\n";
    first();
    second();

    std::cout << "\n== Experiment 3: dangling pointer (undefined behaviour!) ==\n";
    int* p = nullptr;
    make_dangling(&p);
    int right_after = *p;       // read before ANY other call can reuse the slot
    stomp();                    // a new frame lands on the same memory
    int after_stomp = *p;
    std::cout << "p  = " << p << '\n';
    std::cout << "*p right after return = " << right_after << '\n';
    std::cout << "*p after stomp()      = " << after_stomp << '\n';
    std::cout << "*p after printing     = " << *p << '\n';   // cout's own calls reused it too

    std::cout << "\n== Experiment 4: safe alternatives ==\n";
    int v = give_value();
    std::cout << "give_value() = " << v << '\n';
    std::unique_ptr<int> h = give_heap();
    std::cout << "*give_heap() = " << *h << '\n';
    // no delete needed: h frees the heap int when main ends

    return 0;
}
