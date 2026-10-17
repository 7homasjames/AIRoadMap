// Day 7: Big-O Notation & Measuring Algorithm Efficiency
// Compile & run:  g++ day7.cpp -o day7 && ./day7
// Before running, predict every count in the table. Then check.
//
// Challenge answers (each function below counts the core operation):
//   1. cout << numbers[5];         O(1)      one indexed access, whatever n is
//   2. one loop to n               O(n)      body runs n times
//   3. two nested loops to n       O(n^2)    inner body runs n * n times
//   4. while (n > 1) n = n / 2;    O(log n)  each pass halves n, ~log2(n) passes

#include <iostream>
#include <iomanip>

long long challenge1(long long /*n*/) {
    long long ops = 0;
    ops++;                              // numbers[5]: a single access
    return ops;
}

long long challenge2(long long n) {
    long long ops = 0;
    for (long long i = 0; i < n; i++) {
        ops++;
    }
    return ops;
}

long long challenge3(long long n) {
    long long ops = 0;
    for (long long i = 0; i < n; i++) {
        for (long long j = 0; j < n; j++) {
            ops++;
        }
    }
    return ops;
}

long long challenge4(long long n) {
    long long ops = 0;
    while (n > 1) {
        n = n / 2;
        ops++;
    }
    return ops;
}

// Section 4: constants are dropped. 2n is still O(n).
long long twice_n(long long n) {
    long long ops = 0;
    for (long long i = 0; i < 2 * n; i++) {
        ops++;
    }
    return ops;
}

int main() {
    // long long, not int: n^2 for n = 100,000 is 10^10, which overflows a 32-bit int
    const long long sizes[] = {10, 100, 1000, 10000, 100000};

    std::cout << std::setw(8)  << "n"
              << std::setw(8)  << "O(1)"
              << std::setw(10) << "O(log n)"
              << std::setw(10) << "O(n)"
              << std::setw(10) << "2n"
              << std::setw(14) << "O(n^2)" << '\n';

    for (long long n : sizes) {
        std::cout << std::setw(8)  << n
                  << std::setw(8)  << challenge1(n)
                  << std::setw(10) << challenge4(n)
                  << std::setw(10) << challenge2(n)
                  << std::setw(10) << twice_n(n)
                  << std::setw(14) << challenge3(n) << '\n';
    }

    // Each time n grows 10x:
    //   O(1)     stays the same
    //   O(log n) goes up by about 3 (log2(10) ~ 3.3)
    //   O(n)     grows 10x   (2n also grows 10x: same class, double the constant)
    //   O(n^2)   grows 100x
    // The last row pauses for ~10 s: that's 10 billion O(n^2) steps, felt for real.
    // (O(log n) here is floor(log2 n), e.g. 3 for n = 10; the lesson's table rounds up to ~4.)
    std::cout << "\n1024 halved to 1 takes " << challenge4(1024) << " steps\n";

    return 0;
}
