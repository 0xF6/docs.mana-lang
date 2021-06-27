---
description: Structure
sidebar_position: 2
---
`Stucture`

The root structure of most Mana structures hierarchies, from which substructures inherit a basic interface to the runtime system and the ability to behave as Mana objects.

<br/>

### Declaration


```csharp
[special, forwarded]
public class ValueType
{
    ...
}
```


### Methods


```csharp
[virtual]
public toString(): String;
```