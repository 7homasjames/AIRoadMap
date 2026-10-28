// Day 9: RAII & Smart Pointers
// Compile & run:  g++ -std=c++17 -Wall -Wextra -pedantic day9.cpp -o day9 && ./day9
// Before running, predict where every "destroyed" line appears. Then check.
//
// The lesson's investigations, one function each:
//   1. unique_ptr in a block        -> destroyed at the closing brace
//   2. unique_ptr without the block -> destroyed when the function ends instead
//   3. raw pointer, no delete       -> never destroyed (leak)
//   4. raw pointer + delete         -> destroyed exactly at delete
//   5. multiple exit paths          -> unique_ptr cleans up on every path, raw pointer leaks on early return
// Plus shared_ptr (shared ownership, use_count) and moving a unique_ptr.

#include <iostream>
#include <memory>
#include <string>
#include <utility>

class Box {
public:
    explicit Box(std::string name) : name(std::move(name)) {
        std::cout << "  Box(" << this->name << ") created\n";
    }
    ~Box() {
        std::cout << "  Box(" << name << ") destroyed\n";
    }
    const std::string& getName() const { return name; }

private:
    std::string name;
};

// 1. RAII: the unique_ptr's lifetime decides when the Box dies.
void uniqueInBlock() {
    std::cout << "\n1. unique_ptr inside a block\n";
    {
        auto ptr = std::make_unique<Box>("block");
        std::cout << "  Box is being used\n";
    }                                           // ptr destroyed -> Box destroyed
    std::cout << "  after the block\n";
}

// 2. Same thing without the inner braces: ptr now lives until the function returns.
void uniqueWithoutBlock() {
    std::cout << "\n2. unique_ptr without the inner block\n";
    auto ptr = std::make_unique<Box>("function");
    std::cout << "  Box is being used\n";
    std::cout << "  end of function body\n";
}                                               // destroyed here, after the last line

// 3. Raw pointer, no delete: the pointer variable dies, the Box does not.
void rawNoDelete() {
    std::cout << "\n3. raw pointer, no delete\n";
    Box* ptr = new Box("leaked");
    std::cout << "  using " << ptr->getName() << '\n';
}                                               // ptr gone, Box still on the heap: leak

// 4. Raw pointer with delete: the destructor runs exactly at the delete.
void rawWithDelete() {
    std::cout << "\n4. raw pointer + delete\n";
    Box* ptr = new Box("deleted");
    std::cout << "  before delete\n";
    delete ptr;
    std::cout << "  after delete\n";
}

// 5. Multiple exit paths. The early return skips the raw delete; the unique_ptr doesn't care.
bool rawEarlyReturn(bool fail) {
    Box* ptr = new Box("raw-early");
    if (fail) {
        return false;                           // forgot delete on this path -> leak
    }
    delete ptr;
    return true;
}

bool uniqueEarlyReturn(bool fail) {
    auto ptr = std::make_unique<Box>("unique-early");
    if (fail) {
        return false;                           // ptr destroyed on this path too
    }
    return true;                                // ...and on this one
}

// shared_ptr: the Box lives until the LAST owner lets go.
void sharedOwnership() {
    std::cout << "\n6. shared_ptr\n";
    auto first = std::make_shared<Box>("shared");
    std::cout << "  owners: " << first.use_count() << '\n';       // 1
    {
        auto second = first;                                       // copy = another owner
        std::cout << "  owners: " << first.use_count() << '\n';   // 2
    }                                                              // second gone, Box survives
    std::cout << "  owners: " << first.use_count() << '\n';       // 1
    std::cout << "  releasing the last owner\n";
    first.reset();                                                 // count 0 -> Box destroyed
    std::cout << "  after reset\n";
}

// unique_ptr can't be copied, only moved: ownership is transferred, never duplicated.
void moveUnique() {
    std::cout << "\n7. moving a unique_ptr\n";
    auto first = std::make_unique<Box>("moved");
    // auto copy = first;                       // compile error: copy constructor is deleted
    auto second = std::move(first);
    std::cout << "  first is " << (first ? "not empty" : "empty")
              << ", second owns " << second->getName() << '\n';
}                                               // only second owns it, so it's destroyed once

int main() {
    std::cout << "Program starts\n";

    uniqueInBlock();
    uniqueWithoutBlock();
    rawNoDelete();
    rawWithDelete();

    std::cout << "\n5. early return\n";
    rawEarlyReturn(true);                       // created, never destroyed
    uniqueEarlyReturn(true);                    // created and destroyed

    sharedOwnership();
    moveUnique();

    std::cout << "\nProgram continues\n";
    std::cout << "Box(leaked) and Box(raw-early) never printed \"destroyed\": those are the two leaks.\n";
    return 0;
}
