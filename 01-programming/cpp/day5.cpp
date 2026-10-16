// Day 5: Strings, Characters & Text in Memory
// Compile & run:  g++ day5.cpp -o day5 && ./day5
// Before running, predict every line of output. Then check.

#include <iostream>
#include <string>

int main() {
    // 1. Store my name in a string
    std::string name = "Thomas";

    // 2. Name and its length
    std::cout << "Name:   " << name << '\n';
    std::cout << "Length: " << name.length() << '\n';

    // 3. First character, shown as a char and as its numeric code
    std::cout << "First character: " << name[0]
              << " (code " << static_cast<int>(name[0]) << ")\n";

    // 4. Count the 'a's in "data analytics"
    std::string text = "data analytics";
    int count = 0;
    for (std::size_t i = 0; i < text.length(); i++) {
        if (text[i] == 'a') {
            count++;
        }
    }
    std::cout << "Number of a's in \"" << text << "\": " << count << '\n';

    // 5. Append to a message
    std::string message = name;
    message += " - AI Engineer";
    std::cout << message << '\n';

    // Bonus: length() counts bytes, not visible characters.
    // "é" is 1 character but 2 bytes in UTF-8 (written as escapes so the
    // result doesn't depend on how this file is saved).
    std::string cafe = "caf\xC3\xA9";
    std::cout << "\n\"cafe\" with an accent: length() = " << cafe.length()
              << " (4 visible characters, 5 bytes)\n";

    return 0;
}
