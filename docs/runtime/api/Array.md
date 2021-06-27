---
description: Class
---
`Class`

An object representing a static ordered collection, for use instead of an  [Array](./Array) constant in cases that require reference semantics.

<br/>

### Declaration


```csharp
[special, forwarded]
public class Array : mana/lang/Object
{
    ...
}
```


### Methods


```swift
[virtual]
public toString(): String;
```


### Fields

```swift
[native("!!size"), readonly]
public Length: Int64;

[native("!!rank"), readonly]
public Rank: Int64;
```


### Creating Array Objects Using Array Literals

In addition to the provided initializers, such as **ctor()**, 
you can create an  [Array](./Array) object using an array literal.

```cpp
auto array = new Object[1] { "FooBar" };
```


### Accessing Values Using Indexers


In addition to the provided instance methods, such as **object[index]**, you can access [Array](./Array) values by their indexes using subscripting.

```cpp
auto value = array[3];
```