// Day 6: Searching & Sorting Algorithms
// Compile & run:  g++ day6.cpp -o day6 && ./day6
// Before running, predict every line of output. Then check.

#include <iostream>

// Returns the index of target, or -1 if it isn't there. O(n)
int linear_search(const int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;           // returning early does the job of 'break'
        }
    }
    return -1;
}

// arr MUST be sorted ascending. Returns the index of target, or -1. O(log n)
// 'steps' counts how many middles were checked.
int binary_search(const int arr[], int size, int target, int& steps) {
    int left = 0;
    int right = size - 1;
    steps = 0;

    while (left <= right) {
        int mid = left + (right - left) / 2;   // avoids overflow of (left + right)
        steps++;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;     // discard mid and everything to its left
        } else {
            right = mid - 1;    // discard mid and everything to its right
        }
    }
    return -1;                  // left crossed right: nothing left to check
}

// Sorts arr ascending in place. O(n^2)
void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];          // the "third cup"
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) {
            break;              // no swaps in a full pass: already sorted
        }
    }
}

void print_array(const int arr[], int n) {
    for (int i = 0; i < n; i++) {
        std::cout << arr[i] << ' ';
    }
    std::cout << '\n';
}

void report(const char* label, int index) {
    std::cout << label;
    if (index != -1) {
        std::cout << "found at index " << index << '\n';
    } else {
        std::cout << "not found\n";
    }
}

int main() {
    // 1. Linear search for 18
    std::cout << "== 1. Linear search ==\n";
    int unsorted[] = {12, 7, 18, 25, 9};
    report("18: ", linear_search(unsorted, 5, 18));

    // 2. Binary search for 25
    std::cout << "\n== 2. Binary search ==\n";
    int sorted[] = {3, 7, 12, 18, 25, 31};
    int steps = 0;
    report("25: ", binary_search(sorted, 6, 25, steps));
    std::cout << "    (" << steps << " middles checked)\n";

    // 3. Bubble sort
    std::cout << "\n== 3. Bubble sort ==\n";
    int to_sort[] = {9, 2, 7, 1, 5};
    std::cout << "Before: ";
    print_array(to_sort, 5);
    bubble_sort(to_sort, 5);
    std::cout << "After:  ";
    print_array(to_sort, 5);

    // 4. Binary search for a missing value
    std::cout << "\n== 4. Missing value ==\n";
    report("100: ", binary_search(sorted, 6, 100, steps));
    std::cout << "    (" << steps << " middles checked)\n";

    return 0;
}
