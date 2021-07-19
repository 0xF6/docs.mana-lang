---
description: Class
---
`Class`


A Unicode string value that is a collection of characters.

<br/>

### Declaration


```csharp
[special, forwarded]
public class String : mana/lang/Object
{
    ...
}
```

### Overview

A string is a series of characters. 
Strings in Mana are Unicode correct and locale insensitive, and are designed to be efficient. 
The String type bridges with the CLR class String and offers interoperability with C# functions that works with strings.

You can create new strings using string literals or string interpolations. A string literal is a series of characters enclosed in quotes.

```cpp
auto greeting = "Hello!";
```

String interpolations are string literals that evaluate any included expressions and convert the results to string form. 
String interpolations give you an easy way to build a string from multiple pieces. Wrap each expression in a string interpolation in parentheses.

:::info
Currently not support
:::


```cpp
auto world = "World";
auto greeting = $"Hello {world}!";


// greeting == "Hello World!"
```

Combine strings using the concatenation operator (+).

:::info
Currently not support
:::

```cpp
auto world = "World!";
auto greeting = "Hello " + world;


// greeting == "Hello World!"
```


### Modifying and Comparing Strings


Strings always have value semantics. 
Modifying a copy of a string leaves the original unaffected.

:::info
Currently not support
:::

```cpp
auto new_string = greeting;

new_string += " 🗿";


// new_string == "Hello World! 🗿";

```


Comparing strings for equality using the equal-to operator (==).

:::info
Currently not support
:::

```cpp

Out.println("Foo 🗿" == "Foo 🗿");
// Prints "true"

```


### Accessing String Elements

:::caution
**TODO**
:::

