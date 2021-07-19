# The Basics

Mana is a new programming language for Windows, OSX, Linux app development.


Mana provides its own versions of all fundamental types, including Int32, UInt32 and other variants for integers, Double, Half and Float for floating-point values, Bool for Boolean values, and String for textual data. 
Mana also provides powerful versions of the three primary collection types, Array, List, and Dictionary, as described in  [Collection Types](./CollectionTypes).



# Constants and Variables

Constants and variables associate a name (such as fooBar or clientMessage) with a value of a particular type (such as the number 10 or the string "Hello"). 
The value of a constant can’t be changed once it’s set, whereas a variable can be set to a different value in the future.


# Declaring Constants and Variables

Constants and variables must be declared before they’re used. 
You declare constants with the `auto` or `let` keyword and variables with the `auto` or `let` keyword. 
Here’s an example of how constants and variables can be used to track the number of login attempts a user has made:


```cpp
auto str = "fooBar";
```
```swift
let number: Int32 = 12;
```