// Day 4: Arrays, Vectors & How Data Is Stored in Memory
// Compile & run:  g++ day4.cpp -o day4 && ./day4
// Before running, predict every line of output. Then check.

#include <iostream>
#include <vector>

int main() {
    // 1. Store the values in an array
    int values[5] = {12, 18, 25, 15, 30};
    const int count = 5;

    // 2. First and last values (valid indices are 0 to count - 1)
    std::cout << "First: " << values[0] << '\n';
    std::cout << "Last:  " << values[count - 1] << '\n';

    // 3. Sum with a loop
    int sum = 0;
    for (int i = 0; i < count; i++) {
        sum = sum + values[i];
    }
    std::cout << "Sum:     " << sum << '\n';

    // 4. Average (divide by 5.0, not 5, to avoid integer division)
    std::cout << "Average: " << sum / static_cast<double>(count) << '\n';

    // Bonus: contiguous memory, consecutive addresses differ by sizeof(int)
    std::cout << "\nsizeof(int) = " << sizeof(int) << " bytes\n";
    for (int i = 0; i < count; i++) {
        std::cout << "&values[" << i << "] = " << &values[i] << '\n';
    }

    // 5. Vector with the same values, then append 40
    std::vector<int> v = {12, 18, 25, 15, 30};
    std::cout << "\nVector data before push_back: " << v.data() << '\n';
    v.push_back(40);
    std::cout << "Vector data after push_back:  " << v.data() << "   <- may have moved\n";

    // 6. Final size
    std::cout << "Vector size: " << v.size() << '\n';

    return 0;
}
