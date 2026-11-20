# Day 8 — Structs, Classes, Constructors & Destructors

Phase 1 · C++ Foundations · Day 8 of 177 · 90–120 minutes

**Builds on:** [Day 7 lesson](day7-lesson-big-o.md) · **Challenge solution:** [`day8.cpp`](day8.cpp)

Today's goal: understand how C++ lets us create objects that contain data, control how that data changes, and automatically perform setup and cleanup at the right times.

We'll build a small `BankAccount` class from scratch. By the end, you should be able to explain not just what a class, constructor, and destructor are, but why they exist and what happens when an object is created and destroyed.

## 1. Start with the problem: data alone isn't enough

An account has a balance. You might begin with an ordinary variable:

```cpp
double balance = 1000.0;
```

That stores a number. But what happens when you need to deposit, withdraw, stop someone withdrawing more than they have, or stop the balance being set to a negative value?

If every part of the program can modify `balance` freely, nothing guarantees the account stays valid:

```cpp
double balance = 1000.0;
balance = -5000.0;  // Technically allowed
```

`double` isn't broken. A raw variable just knows nothing about the rules of a bank account. That's the problem classes help solve.

## 2. What is a `struct`?

A `struct` is a user-defined type that groups related data under one name:

```cpp
struct Person {
    string name;
    int age;
    double height;
};

Person p;
p.name = "Alex";
p.age = 25;
p.height = 1.75;
```

- `Person` is the **type**: the blueprint for what a person record contains.
- `p` is an **object**: one particular instance with actual values.
- `p.age` accesses one **member** of that object.

A struct can also contain functions, called **member functions** or **methods**:

```cpp
struct Person {
    string name;
    int age;

    void introduce() {
        cout << "I am " << name << endl;
    }
};

Person p;
p.name = "Alex";
p.introduce();   // I am Alex
```

So a struct groups data *and* the operations that work on that data.

## 3. Then what is a `class`?

In C++, `struct` and `class` are nearly identical. Both can have data members, methods, constructors, destructors and access controls. The one language difference is the **default access level**:

| Feature | `struct` | `class` |
|---|---|---|
| Default member access | `public` | `private` |
| Can contain methods? | Yes | Yes |
| Can have constructors/destructors? | Yes | Yes |
| Can protect internal state? | Yes | Yes |

```cpp
struct Example  { int value; };  // public by default
class  Example2 { int value; };  // private by default
```

`public` means code outside the type can access the member. `private` means only the class itself (and its friends) can.

We use a class for something like a bank account because we want the account to control how its state changes. This is **encapsulation**: keeping data and the operations that manage it together, and restricting direct access where necessary.

By convention, a struct is usually a bundle of related values, and a class is an object with rules and controlled behaviour. That's a convention, not a language rule.

## 4. What is an invariant, and why does a class protect it?

An **invariant** is a condition that must stay true for an object to be valid. For our bank account:

1. The balance must never be negative.
2. A deposit must be greater than zero.
3. A withdrawal must be greater than zero.
4. A withdrawal must not exceed the balance.

An unsafe design:

```cpp
class BankAccount {
public:
    double balance;
};

BankAccount account;
account.balance = -100000.0;   // nothing stops this
```

Make the balance private and that line becomes a compile error:

```cpp
class BankAccount {
private:
    double balance = 0.0;
};

BankAccount account;
account.balance = -100000.0;  // error: 'balance' is private
```

We still need to deposit and withdraw, so we expose public methods that check the rules before changing the private state.

> Don't just store data. Design the operations so that invalid states are hard to create.

Making a member private doesn't by itself make the object valid. The constructors and public methods also have to preserve the rules.

## 5. What is a constructor?

A **constructor** runs automatically when an object is initialized. Its job is to establish the object's starting state.

```cpp
class BankAccount {
private:
    double balance;

public:
    BankAccount(double initialBalance) {
        balance = initialBalance;
    }
};

BankAccount account(1000.0);
```

A constructor:

- has the same name as the class,
- has no return type, not even `void`,
- runs as part of creating an object. You don't call it like an ordinary method.

### The initializer list

```cpp
BankAccount(double initialBalance)
    : balance(initialBalance) {
}
```

The part after `:` is the **initializer list**. It initializes `balance` directly, instead of creating it and assigning to it later in the body. This is the preferred way to initialize members.

### Validate during construction

The constructor above accepts `BankAccount account(-500.0);`, which creates an invalid account. Reject it:

```cpp
#include <stdexcept>

BankAccount(double initialBalance)
    : balance(initialBalance) {
    if (initialBalance < 0.0) {
        throw std::invalid_argument("Initial balance cannot be negative");
    }
}
```

If a constructor throws, the object is never successfully created. A constructor should establish a valid starting state, not just copy values into fields.

## 6. What is a destructor?

When an object is finished with, it may own something that needs releasing: a file, a network connection, memory. The **destructor** runs when the object's lifetime ends.

```cpp
#include <iostream>
using namespace std;

class Example {
public:
    Example()  { cout << "Object created\n"; }
    ~Example() { cout << "Object destroyed\n"; }
};

int main() {
    cout << "Before block\n";
    {
        Example obj;
        cout << "Inside block\n";
    }
    cout << "After block\n";
}
```

Output:

```
Before block
Object created
Inside block
Object destroyed
After block
```

The destructor is the class name with a `~` in front. It has no return type and no parameters. It runs before `"After block"` because `obj` is local to the inner block, and its lifetime ends when execution leaves that block.

### When do constructors and destructors run?

| Situation | What happens? |
|---|---|
| A local object is successfully created | Its constructor runs |
| A local object goes out of scope | Its destructor runs |
| An object is created with `new` | Its constructor runs |
| That object is deleted with `delete` | Its destructor runs |
| A constructor throws before the object is fully built | The object's destructor does **not** run. Members already constructed are cleaned up |

Scope and lifetime are related but not the same. Local objects usually live until the end of their scope. Objects created with `new` can outlive the pointer that refers to them.

## 7. Build: a `BankAccount` class

The design:

- a private balance,
- a constructor that validates the initial balance,
- `deposit()` that rejects non-positive amounts,
- `withdraw()` that rejects invalid or unaffordable withdrawals,
- a `const` `getBalance()`,
- a destructor that prints when the account is destroyed.

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

class BankAccount {
private:
    double balance;

public:
    BankAccount(double initialBalance)
        : balance(initialBalance) {
        if (initialBalance < 0.0) {
            throw invalid_argument("Initial balance cannot be negative");
        }
        cout << "Account created\n";
    }

    bool deposit(double amount) {
        if (amount <= 0.0) {
            cout << "Deposit rejected\n";
            return false;
        }
        balance += amount;
        return true;
    }

    bool withdraw(double amount) {
        if (amount <= 0.0 || amount > balance) {
            cout << "Withdrawal rejected\n";
            return false;
        }
        balance -= amount;
        return true;
    }

    double getBalance() const {
        return balance;
    }

    ~BankAccount() {
        cout << "Account destroyed\n";
    }
};

int main() {
    {
        BankAccount account(1000.0);

        account.deposit(500.0);
        account.withdraw(200.0);
        account.withdraw(5000.0);

        cout << "Balance: " << account.getBalance() << '\n';
    }

    cout << "Program continues\n";
    return 0;
}
```

### Trace the program

| Step | Action | Balance |
|---|---|---|
| 1 | Construct the account: the constructor validates and initializes | ₹1,000 |
| 2 | Deposit ₹500: positive, so accepted | ₹1,500 |
| 3 | Withdraw ₹200: positive and affordable, so accepted | ₹1,300 |
| 4 | Withdraw ₹5,000: more than the balance, so rejected | ₹1,300 |
| 5 | Leave the block: `account`'s lifetime ends, so its destructor runs | — |

Output:

```
Account created
Withdrawal rejected
Balance: 1300
Account destroyed
Program continues
```

The successful deposit and withdrawal print nothing. The destructor runs when execution leaves the inner block, not at the end of `main()`.

**Why is `getBalance()` marked `const`?** It promises not to modify the object. Use it for methods that inspect rather than change.

**Why does `deposit()` return `bool`?** So the caller knows whether it worked, and can show a confirmation or an error.

A real banking system would also need a proper money type (not `double`), overflow handling, persistence and concurrency control. Here we're focusing on object design and lifetime.

## 8. What the destructor does not mean

A destructor is not a command to free everything. It's a function that runs at the end of one object's lifetime.

```cpp
int main() {
    BankAccount account(1000.0);
}   // local: destructor runs automatically when main() exits
```

```cpp
BankAccount* account = new BankAccount(1000.0);
// ...
delete account;   // destructor runs here, and the storage is released
```

Lose the pointer or forget the `delete`, and the object stays allocated: a leak. That's why manual memory management is error-prone, and it leads straight into tomorrow: RAII and smart pointers tie cleanup to object lifetime so you rarely write `new` and `delete` yourself.

## 9. 15-minute recall

Answer without looking back.

<details>
<summary>1. What is the difference between a type and an object?</summary>

A type is the blueprint (`Person`). An object is one instance of it with actual values (`p`).
</details>

<details>
<summary>2. What is the difference between a struct and a class in C++?</summary>

Only the default access: struct members are public by default, class members are private by default.
</details>

<details>
<summary>3. What is an invariant?</summary>

A rule that must stay true for the object to be valid, e.g. "the balance is never negative".
</details>

<details>
<summary>4. When does a constructor run?</summary>

Automatically, when the object is initialized: a local declaration, or `new`.
</details>

<details>
<summary>5. When does a local object's destructor normally run?</summary>

When execution leaves the block it was declared in.
</details>

<details>
<summary>6. Why make <code>balance</code> private?</summary>

So outside code can only change it through methods that check the rules, which keeps the invariant intact.
</details>

## 10. Concept note: explain it in your own words

Rewrite these in your own words rather than copying them.

- **Struct vs class:** both define a custom type with data and functions. Struct members are public by default, class members private by default.
- **Object and invariant:** an object is an instance of a type. An invariant is a rule that must stay true for the object to be valid.
- **Encapsulation:** data plus the methods that operate on it. Private data can only be changed through public methods that validate the change.
- **Constructor:** runs as part of creating an object and should establish a valid starting state. The initializer list sets members before the body runs.
- **Destructor:** runs when the object's lifetime ends. Used for cleanup, especially of owned resources. Local objects are destroyed when their scope ends.
- **What I found confusing:** *(write the concept you still need to practise)*
- **My example:** *(write a small class of your own and explain its constructor, invariant and destructor)*

## 11. Rate your understanding (0–4)

| Level | Meaning |
|---|---|
| 0 | Haven't learned it yet |
| 1 | Have seen it, but can't explain it |
| 2 | Understand with notes or hints |
| 3 | Can explain and implement independently |
| 4 | Can apply it to unfamiliar problems and explain trade-offs |

Aim for level 3 on struct vs class, basic constructors, private state and local-object destruction. Keep the initializer list and exception behaviour at 2 if you still need notes for them.

## 12. Build challenge

Implement `BankAccount` yourself in [`day8.cpp`](day8.cpp):

- [ ] `balance` is private
- [ ] the constructor validates the initial balance
- [ ] `deposit()` and `withdraw()` enforce the rules
- [ ] a `const` getter
- [ ] the destructor prints a message
- [ ] create an account in a nested block and watch when the destructor runs
- [ ] try an invalid deposit and an unaffordable withdrawal
- [ ] update `PROGRESS.md` and commit

```
g++ -std=c++17 -Wall -Wextra -pedantic day8.cpp -o day8
./day8
```

## Tomorrow: Day 9 — RAII & smart pointers

Today's key idea is that an object's lifetime decides when its destructor runs. Tomorrow you'll use that to understand RAII (Resource Acquisition Is Initialization), `std::unique_ptr` and `std::shared_ptr`, and why modern C++ prefers smart pointers to manual `new` and `delete`.
