// Day 11: Inheritance, Virtual Functions & Vtables
// Compile & run:  g++ -std=c++17 -Wall -Wextra -pedantic day11.cpp -o day11 && ./day11
// Before running, predict: which area() does each call pick, and what does each sizeof print?
//
// What this file shows, one section each:
//   1. static dispatch   - non-virtual call through Shape* picks Shape's version (pointer type decides)
//   2. dynamic dispatch  - virtual call through Shape* picks the object's version (object type decides)
//   3. polymorphism      - one loop, one call, three formulas; Shape is abstract (= 0)
//   4. virtual dtor      - delete through a base pointer runs the derived destructor first
//   5. the vptr's cost   - sizeof with and without virtual
// The assembly of a virtual call is in day11-dispatch.cpp / day11-dispatch_O0.s / _O2.s.

#include <iostream>
#include <memory>
#include <vector>

// ---------- 1. static dispatch: no virtual ----------
struct StaticBase {
    void who() const { std::cout << "  StaticBase::who\n"; }
};
struct StaticDerived : StaticBase {
    void who() const { std::cout << "  StaticDerived::who\n"; }   // hides, does NOT override
};

// ---------- 2-4. dynamic dispatch: an abstract Shape hierarchy ----------
class Shape {
public:
    virtual double area() const = 0;               // pure virtual: Shape is abstract
    virtual const char* name() const = 0;
    virtual ~Shape() { std::cout << "    ~Shape\n"; }   // virtual: so delete-through-base is safe
};

class Circle : public Shape {
    double radius;
public:
    explicit Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
    const char* name() const override { return "Circle"; }
    ~Circle() override { std::cout << "    ~Circle\n"; }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
    const char* name() const override { return "Rectangle"; }
    ~Rectangle() override { std::cout << "    ~Rectangle\n"; }
};

class Triangle : public Shape {
    double base, height;
public:
    Triangle(double b, double h) : base(b), height(h) {}
    double area() const override { return 0.5 * base * height; }
    const char* name() const override { return "Triangle"; }
    ~Triangle() override { std::cout << "    ~Triangle\n"; }
};

// ---------- 5. measuring the vptr ----------
struct PlainShape   { int id; };
struct VirtualShape { int id; virtual void draw() {} virtual ~VirtualShape() = default; };
struct VCircle : VirtualShape { double radius; void draw() override {} };
struct TwoVirtuals  { int id; virtual void a() {} virtual void b() {} virtual ~TwoVirtuals() = default; };

int main() {
    std::cout << "1. static dispatch (no virtual)\n";
    StaticDerived sd;
    StaticBase* sp = &sd;
    sd.who();       // object's own type known: StaticDerived::who
    sp->who();      // pointer is StaticBase*, no virtual: StaticBase::who  <- the surprise

    std::cout << "\n2. dynamic dispatch (virtual)\n";
    Circle c(5);
    Shape* p = &c;
    std::cout << "  through Shape*: " << p->name() << " area " << p->area() << '\n';
    // Shape s;     // compile error: cannot create an object of abstract type Shape

    std::cout << "\n3. polymorphism: one call, three formulas\n";
    {
        std::vector<std::unique_ptr<Shape>> shapes;
        shapes.push_back(std::make_unique<Circle>(5));
        shapes.push_back(std::make_unique<Rectangle>(4, 6));
        shapes.push_back(std::make_unique<Triangle>(3, 8));
        for (const auto& shape : shapes) {
            std::cout << "  " << shape->name() << ": " << shape->area() << '\n';
        }
        std::cout << "\n4. virtual destructor: vector destroyed through Shape pointers\n";
    }   // each unique_ptr<Shape> deletes through a Shape*: derived dtor runs, then ~Shape

    std::cout << "\n5. sizeof (this compiler, 64-bit)\n";
    std::cout << "  PlainShape   (int)                  " << sizeof(PlainShape) << " bytes\n";
    std::cout << "  VirtualShape (int + vptr)           " << sizeof(VirtualShape) << " bytes\n";
    std::cout << "  VCircle      (VirtualShape + double) " << sizeof(VCircle) << " bytes\n";
    std::cout << "  TwoVirtuals  (int + vptr, 3 virtuals) " << sizeof(TwoVirtuals) << " bytes\n";
    std::cout << "  -> one vptr per object, however many virtual functions: the table is per class\n";

    std::cout << "\n(end of main: c's destructors)\n";
    return 0;
}
