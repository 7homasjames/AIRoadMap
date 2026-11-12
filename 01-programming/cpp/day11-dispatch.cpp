// Day 11: the assembly of a virtual call.
// Generate:  g++ -std=c++17 -O0 -S -masm=intel day11-dispatch.cpp -o day11-dispatch_O0.s
//            g++ -std=c++17 -O2 -S -masm=intel day11-dispatch.cpp -o day11-dispatch_O2.s
// Then search the .s files for callFunction and callKnown.
//
// callFunction: the compiler can't know what ptr points to, so it must go through the vtable.
// callKnown:    the object is a Derived the compiler can see, so at -O2 it can skip the vtable
//               ("devirtualize") and even compute the answer at compile time.

class Base {
public:
    virtual int calculate() { return 10; }
    virtual ~Base() = default;
};

class Derived : public Base {
public:
    int calculate() override { return 20; }
};

int callFunction(Base* ptr) {
    return ptr->calculate();
}

int callKnown() {
    Derived d;
    Base* ptr = &d;
    return ptr->calculate();
}
