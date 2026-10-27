// Day 8: Structs, Classes, Constructors & Destructors
// Compile & run:  g++ -std=c++17 -Wall -Wextra -pedantic day8.cpp -o day8 && ./day8
// Before running, predict the order of every "created" / "destroyed" line. Then check.
//
// Invariants this BankAccount protects:
//   1. balance is never negative       (constructor rejects a negative start, withdraw checks funds)
//   2. deposits must be > 0
//   3. withdrawals must be > 0 and <= balance
// balance is private, so the only way to change it is through methods that check these rules.

#include <iostream>
#include <stdexcept>
#include <string>

// struct: members are public by default. Just a bundle of values, no rules to protect.
struct Person {
    std::string name;
    int age;

    void introduce() const {
        std::cout << "I am " << name << ", " << age << '\n';
    }
};

// class: members are private by default. The object controls how its state changes.
class BankAccount {
private:
    std::string owner;
    double balance;

public:
    // Constructor: the initializer list sets members before the body runs.
    // If it throws, the object never finishes construction, so its destructor never runs.
    BankAccount(const std::string& ownerName, double initialBalance)
        : owner(ownerName), balance(initialBalance) {
        if (initialBalance < 0.0) {
            throw std::invalid_argument("Initial balance cannot be negative");
        }
        std::cout << "[ctor] " << owner << "'s account created with " << balance << '\n';
    }

    bool deposit(double amount) {
        if (amount <= 0.0) {
            std::cout << "Deposit of " << amount << " rejected\n";
            return false;
        }
        balance += amount;
        return true;
    }

    bool withdraw(double amount) {
        if (amount <= 0.0 || amount > balance) {
            std::cout << "Withdrawal of " << amount << " rejected\n";
            return false;
        }
        balance -= amount;
        return true;
    }

    // const: reading the balance cannot change the object.
    double getBalance() const {
        return balance;
    }

    // Destructor: runs automatically when the object's lifetime ends.
    ~BankAccount() {
        std::cout << "[dtor] " << owner << "'s account destroyed (final balance " << balance << ")\n";
    }
};

int main() {
    // --- struct vs class ---
    Person p;
    p.name = "Alex";       // fine: struct members are public
    p.age = 25;
    p.introduce();
    // account.balance = -100000.0;   // would not compile: balance is private

    // --- local object: destructor runs when the block ends ---
    std::cout << "\nBefore block\n";
    {
        BankAccount account("Thomas", 1000.0);

        account.deposit(500.0);     // ok      -> 1500
        account.withdraw(200.0);    // ok      -> 1300
        account.deposit(-50.0);     // rejected: not positive
        account.withdraw(5000.0);   // rejected: more than the balance
        account.withdraw(0.0);      // rejected: not positive

        std::cout << "Balance: " << account.getBalance() << '\n';   // 1300
        std::cout << "Leaving block...\n";
    }                               // <- [dtor] prints here, before "After block"
    std::cout << "After block\n";

    // --- two objects: destroyed in reverse order of construction ---
    std::cout << "\nTwo accounts in one block\n";
    {
        BankAccount first("First", 10.0);
        BankAccount second("Second", 20.0);
    }                               // Second is destroyed before First

    // --- heap object: destructor runs at delete, not at the end of a scope ---
    std::cout << "\nHeap account\n";
    BankAccount* heapAccount = new BankAccount("Heap", 50.0);
    heapAccount->deposit(25.0);
    std::cout << "Heap balance: " << heapAccount->getBalance() << '\n';
    delete heapAccount;             // [dtor] prints here. Forget this line and it leaks (Day 9: unique_ptr).
    heapAccount = nullptr;

    // --- failed construction: no object, so no destructor ---
    std::cout << "\nInvalid account\n";
    try {
        BankAccount bad("Bad", -500.0);
        std::cout << "never printed\n";
    } catch (const std::invalid_argument& e) {
        std::cout << "Construction failed: " << e.what() << '\n';
    }

    std::cout << "\nProgram continues\n";
    return 0;
}
