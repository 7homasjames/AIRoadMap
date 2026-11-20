// Day 2: Stack, Heap, Pointers & References
// Compile & run:  g++ day2.cpp -o day2 && ./day2
// Before running, predict every line of output. Then check.

#include <iostream>

void by_value(int x) {
    x = 100;            // changes only the function's own copy
}

void by_pointer(int* p) {
    *p = 300;           // changes the object p points to (the caller's integer)
}

void by_reference(int& x) {
    x = 200;            // x is another name for the caller's integer
}

int main() {
    // ---- Experiment 1: stack vs heap ----
    std::cout << "== Experiment 1: stack vs heap ==\n";
    int x = 10;                 // automatic local integer
    int* h = new int(50);       // h: local pointer;  the 50: dynamically allocated (heap)

    std::cout << "x  = " << x  << '\n';     // the value of x
    std::cout << "h  = " << h  << '\n';     // the address stored in h
    std::cout << "*h = " << *h << '\n';     // the value at that address

    delete h;                   // release the heap integer
    h = nullptr;                // h no longer holds a now-invalid address

    // ---- Experiment 2: pointers ----
    std::cout << "\n== Experiment 2: pointers ==\n";
    int score = 10;
    int* p = &score;            // p stores the address of score

    std::cout << "&score = " << &score << '\n';
    std::cout << "p      = " << p      << '\n';   // same address as &score
    std::cout << "1. " << score << '\n';
    std::cout << "2. " << *p    << '\n';

    *p = 50;                    // change the object p points to
    std::cout << "3. " << score << '\n';

    // ---- Experiment 3: passing to functions ----
    std::cout << "\n== Experiment 3: value vs pointer vs reference ==\n";
    by_value(score);
    std::cout << "4. " << score << '\n';

    by_reference(score);
    std::cout << "5. " << score << '\n';

    by_pointer(&score);
    std::cout << "6. " << score << '\n';

    // ---- Experiment 4: re-pointing a pointer ----
    std::cout << "\n== Experiment 4: pointers can be re-pointed ==\n";
    int a = 1;
    int b = 2;
    int* q = &a;
    std::cout << "*q = " << *q << '\n';
    q = &b;                     // q now points to b; a is untouched
    std::cout << "*q = " << *q << ", a = " << a << '\n';

    // ---- Experiment 5: a reference cannot be re-seated ----
    std::cout << "\n== Experiment 5: references cannot be re-seated ==\n";
    int& r = a;                 // r is another name for a
    r = b;                      // NOT "r now refers to b": this copies b's value INTO a
    std::cout << "a = " << a << ", b = " << b << '\n';

    return 0;
}
